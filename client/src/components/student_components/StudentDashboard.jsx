
import Card from 'react-bootstrap/Card';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { useNavigate } from "react-router-dom";
import { useState } from 'react';


function StudentDashboard({ user }) {
  const navigate = useNavigate();
  const [hoverOpen, setHoverOpen] = useState(false);
  const [hoverClosed, setHoverClosed] = useState(false);
  return (
    <div style={{ maxWidth: 900, margin: '2rem auto', padding: '2rem 2rem 3rem 2rem', background: '#fff', borderRadius: 16, boxShadow: '0 2px 16px rgba(0,0,0,0.07)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <div>
          <h2 style={{ marginBottom: 0, color: "#0d6efd" }}>
            <i className="bi bi-person-circle" style={{ marginRight: 10 }}></i>
            Student Dashboard
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
            Welcome to your Student Dashboard!
          </Card.Title>
          <div style={{ fontSize: 18 }}>
            Here you can:
            <ul style={{ marginTop: 10, listStyle: "none", paddingLeft: 0 }}>
              <li
                style={{ cursor: "pointer", marginBottom: 10 }}
                onClick={() => navigate(`/students/homeworks`)}
                tabIndex={0}
               
              >
                <i className="bi bi-pencil-square" style={{ color: "#0d6efd", marginRight: 6 }}></i>
                <b
                 onMouseEnter={() => setHoverOpen(true)}
                 onMouseLeave={() => setHoverOpen(false)}
                 style={{ textDecoration: hoverOpen ? "underline" : "none" }}
                >View and answer open homeworks</b> assigned to you
              </li>
              <li
                style={{ cursor: "pointer", marginBottom: 10 }}
                onClick={() => navigate(`/students/stats`)}
                tabIndex={0}
                
              >
                <i className="bi bi-star-fill" style={{ color: "#ffc107", marginRight: 6 }}></i>
                <b
                 onMouseEnter={() => setHoverClosed(true)}
                 onMouseLeave={() => setHoverClosed(false)}
                 style={{ textDecoration: hoverClosed ? "underline" : "none" }}
                >See your closed homeworks</b> and check your average score
              </li>
            </ul>
            <span style={{ color: "#666" }}>Use the navigation bar above to access the available features at any time or click on the functionality above.</span>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
}
export default StudentDashboard;