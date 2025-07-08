import { Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Layout from "./components/Layout";
import LoginForm from "./components/LoginForm";
import { Outlet } from "react-router-dom";
import StudentDashboard from "./components/student_components/StudentDashboard";
import TeacherDashboard from "./components/teacher_components/TeacherDashboard";
import ViewOpenHomeworks from "./components/student_components/ViewOpenHomeworks";
import ViewClosedHomeworks from "./components/student_components/ViewClosedHomework";
import HomeworkAnswerForm from "./components/student_components/HomeworkAnswerForm";
import CreateHomeworkForm from "./components/teacher_components/CreateHomeworkForm";
import ClassStatus from "./components/teacher_components/ClassStatus";
import ViewHomeworks from "./components/teacher_components/ViewHomeworks";
import API from "./API/API.mjs";

function ProtectedRoute({ user, allowedRoles, children }) {
  if (!user) return <Navigate to="/" replace />;
  if (!allowedRoles.includes(user.role)) return <Navigate to="/" replace />;
  return children;
}

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.getSession()
      .then(u => setUser(u))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = async () => {
    await API.logout();
    setUser(null);
  };

  if (loading) return null; 

  return (
    <Routes>
      {/* Login */}
      <Route
        path="/login"
        element={
          !user ? (
            <LoginForm onLogin={setUser} />
          ) : (
            <Navigate to={user.role === "teacher" ? "/teachers" : `/students`} replace />
          )
        }
      />

      {/* DASHBOARD TEACHER */}
      <Route
        path="/teachers"
        element={
          <ProtectedRoute user={user} allowedRoles={["teacher"]}>
            <Layout user={user} onLogout={handleLogout}>
              <Outlet />
            </Layout>
          </ProtectedRoute>
        }
      >
        <Route index element={<TeacherDashboard user={user} />} />
        <Route path="homework" element={<CreateHomeworkForm user={user} />} />
        <Route path="homeworks" element={<ViewHomeworks user={user} />} />
        <Route path="classStatus" element={<ClassStatus user={user} />} />
      </Route>

      {/* DASHBOARD STUDENTE */}
      <Route
        path="/students"
        element={
          <ProtectedRoute user={user} allowedRoles={["student"]}>
            <Layout user={user} onLogout={handleLogout}>
              <Outlet />
            </Layout>
          </ProtectedRoute>
        }
      >
        <Route index element={<StudentDashboard user={user} />} />
        <Route path="homeworks" element={<ViewOpenHomeworks studentId={user?.id} />} />
        <Route path="homeworks/:id" element={<HomeworkAnswerForm studentId={user?.id} />} /> 
        <Route path="stats" element={<ViewClosedHomeworks studentId={user?.id} />} />
      </Route>

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;