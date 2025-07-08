
import Card from 'react-bootstrap/Card';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

function TeacherDashboard({ user }) {
  const navigate = useNavigate();
  const [hoverHomework, setHoverHomework] = useState(false);
  const [hoverHomeworks, setHoverHomeworks] = useState(false);
  const [hoverStatus, setHoverStatus] = useState(false);

  return (
    <div style={{ maxWidth: 950, margin: '2rem auto', padding: '2rem 2rem 3rem 2rem', background: '#fff', borderRadius: 16, boxShadow: '0 2px 16px rgba(0,0,0,0.07)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <div>
          <h2 style={{ marginBottom: 0, color: "#0d6efd" }}>
            <i className="bi bi-mortarboard" style={{ marginRight: 10 }}></i>
            Teacher Dashboard
          </h2>
          <div style={{ color: "#444", fontSize: 18 }}>
            Welcome, <span style={{ fontWeight: 600 }}>{user.name}</span>!
          </div>
        </div>
      </div>
      <hr />
      <Card className="shadow-sm my-4" style={{ border: 'none', background: '#f8f9fa' }}>
        <Card.Body>
          <Card.Title as="h4" className="mb-3" style={{ color: "#0d6efd" }}>
            <i className="bi bi-info-circle" style={{ marginRight: 8 }}></i>
            Welcome to your Teacher Dashboard!
          </Card.Title>
          <div style={{ fontSize: 18 }}>
            Here you can:
            <ul style={{ marginTop: 10, listStyle: "none", paddingLeft: 0 }}>
              <li
                style={{ cursor: "pointer", marginBottom: 10 }}
                onClick={() => navigate("/teachers/homework")}
                tabIndex={0}
                
              >                <i className="bi bi-plus-circle" style={{ color: "#0d6efd", marginRight: 6 }}></i>
                <b
                 onMouseEnter={() => setHoverHomework(true)}
                 onMouseLeave={() => setHoverHomework(false)}
                 style={{ textDecoration: hoverHomework ? "underline" : "none" }}
                >Create new homeworks</b> for your students
              </li>
              <li
                style={{ cursor: "pointer", marginBottom: 10 }}
                onClick={() => navigate("/teachers/homeworks")}
                tabIndex={0}
                
              >
                <i className="bi bi-journal-text" style={{ color: "#198754", marginRight: 6 }}></i>
                <b
                 onMouseEnter={() => setHoverHomeworks(true)}
                 onMouseLeave={() => setHoverHomeworks(false)}
                 style={{ textDecoration: hoverHomeworks ? "underline" : "none" }}
                >View and manage all homeworks</b> you have assigned
              </li>
              <li
                style={{ cursor: "pointer" }}
                onClick={() => navigate("/teachers/classStatus")}
                tabIndex={0}
                
              >
                <i className="bi bi-people-fill" style={{ color: "#ffc107", marginRight: 6 }}></i>
                <b
                 onMouseEnter={() => setHoverStatus(true)}
                 onMouseLeave={() => setHoverStatus(false)}
                 style={{ textDecoration: hoverStatus ? "underline" : "none" }}
                >Monitor class status</b> and student progress
              </li>
            </ul>
            <span style={{ color: "#666" }}>Use the navigation bar above to access the available features.</span>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
}

export default  TeacherDashboard;