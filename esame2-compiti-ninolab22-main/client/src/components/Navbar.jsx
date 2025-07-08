import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { NavLink, useNavigate } from 'react-router-dom';
import '../App.css';
import { useState } from 'react';

function AppNavbar({ user, onLogout }) {
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogout = async () => {
    setShowLogoutModal(false);
    await onLogout();
    navigate("/login");
  };

  return (
    <>
      <Navbar
        bg="dark"
        data-bs-theme="dark"
        expand="lg"
        sticky="top"
        className="custom-navbar"
      >
        <Container fluid>
          <Nav className="ms-0">
            {user && user.role === "teacher" && (
              <>
                <Nav.Link as={NavLink} to="/teachers" end>
                  Teacher Dashboard
                </Nav.Link>
                <Nav.Link as={NavLink} to="/teachers/homework">
                  Create Homework
                </Nav.Link>
                <Nav.Link as={NavLink} to="/teachers/homeworks">
                  View All Homeworks
                </Nav.Link>
                <Nav.Link as={NavLink} to="/teachers/classStatus">
                  Class Status
                </Nav.Link>
              </>
            )}
            {user && user.role === "student" && (
              <>
                <Nav.Link as={NavLink} to={`/students`} end>
                  Student Dashboard
                </Nav.Link>
                <Nav.Link as={NavLink} to={`/students/homeworks`}>
                  Open Homeworks
                </Nav.Link>
                <Nav.Link as={NavLink} to={`/students/stats`}>
                  Closed Homeworks
                </Nav.Link>
              </>
            )}
          </Nav>
          <Nav className="ms-auto" style={{ alignItems: "center" }}>
            {user && (
              <Navbar.Text className="me-3" style={{ color: "#fff" }}>
                {user.name} ({user.role})
              </Navbar.Text>
            )}
            {!user ? (
              <Nav.Link as={NavLink} to="/login">Login</Nav.Link>
            ) : (
              <Nav.Link href="#" onClick={() => setShowLogoutModal(true)}>Logout</Nav.Link>
            )}
          </Nav>
        </Container>
      </Navbar>
      <Modal show={showLogoutModal} onHide={() => setShowLogoutModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Logout</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to logout?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowLogoutModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleLogout}>
            Logout
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default AppNavbar;