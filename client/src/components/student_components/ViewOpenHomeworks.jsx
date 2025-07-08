import { useEffect, useState } from 'react';
import { Table, Spinner, Alert, Button, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import API from '../../API/API.mjs';

function ViewOpenHomeworks({ studentId }) {
  const [homeworks, setHomeworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchHomeworks();
  }, [studentId]);

  const fetchHomeworks = () => {
    setLoading(true);
    API.getStudentOpenHomeworks(studentId)
      .then(res => {
        setHomeworks(res);
        setLoading(false);
      })
      .catch(() => {
        setError('Error loading open homeworks');
        setLoading(false);
      });
  };

  const handleEdit = (homeworkId) => {
    navigate(`/students/homeworks/${homeworkId}`);
  };

  if (loading) {
    return <div className="d-flex justify-content-center my-5"><Spinner animation="border" /></div>;
  }

  return (
    <div style={{ maxWidth: 900, margin: '2rem auto', padding: '2rem 2rem 3rem 2rem', background: '#fff', borderRadius: 16, boxShadow: '0 2px 16px rgba(0,0,0,0.07)' }}>
      <Card className="mb-4 shadow-sm" style={{ background: '#f8f9fa' }}>
        <Card.Body>
          <Card.Title as="h4" style={{ marginBottom: 0, color: "#0d6efd" }}>
            <i className="bi bi-pencil-square" style={{ marginRight: 8 }}></i>
            Open Homeworks
          </Card.Title>
          <Card.Text style={{ color: "#444", marginTop: 10 }}>
            Below you will find all your currently assigned open homeworks. <br />
            <span style={{ color: "#198754" }}>
              You can answer or edit your answer for each homework by clicking the <b>Edit</b> button.
            </span>
            <br />
            <span style={{ color: "#888" }}>
              Once your teacher grades your answer, the homework will move to the closed section.
            </span>
          </Card.Text>
        </Card.Body>
      </Card>
      
      {error && <Alert variant="danger" className="my-4">{error}</Alert>}
      
      <Table striped bordered hover responsive className="shadow-sm">
        <thead className="table-primary">
          <tr>
            <th>Question</th>
            <th>Answer</th>
            <th>Assigned By</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {homeworks && homeworks.length > 0 ? (
            homeworks.map((hw) => (
              <tr key={hw.id}>
                <td>{hw.question}</td>
                <td>
                  {hw.answer && hw.answer.trim() !== ''
                    ? hw.answer
                    : <span style={{ color: 'gray' }}>No answer yet</span>}
                </td>
                <td>{hw.nameTeacher} {hw.surnameTeacher}</td>
                <td>
                  <Button 
                    size="sm" 
                    variant="outline-primary" 
                    onClick={() => handleEdit(hw.id)}
                  >
                    <i className="bi bi-pencil" style={{ marginRight: 4 }}></i>
                    Edit
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4} className="text-center text-muted">
                You have no open homeworks assigned at the moment.
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  );
}

export default ViewOpenHomeworks;