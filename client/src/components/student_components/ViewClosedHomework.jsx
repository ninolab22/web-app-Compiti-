import { useEffect, useState } from 'react';
import { Table, Spinner, Alert, Card } from 'react-bootstrap';
import API from '../../API/API.mjs';

function ViewClosedHomeworks({ studentId }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    API.getStudentStats(studentId)
      .then(res => {
        setData(res);
        setLoading(false);
      })
      .catch(() => {
        setError('Error loading closed homeworks');
        setLoading(false);
      });
  }, [studentId]);

  
  const getFaceIcon = (average) => {
    if (average === null || average === undefined) return null;
    if (average < 18)
      return <i className="bi bi-emoji-frown-fill" style={{ color: 'red', marginLeft: 10, fontSize: 32 }} title="Low score"></i>;
    if (average < 26)
      return <i className="bi bi-emoji-neutral-fill" style={{ color: '#ffc107', marginLeft: 10, fontSize: 32 }} title="Average score"></i>;
    return <i className="bi bi-emoji-smile-fill" style={{ color: 'green', marginLeft: 10, fontSize: 32 }} title="High score"></i>;
  };

  if (loading) {
    return <div className="d-flex justify-content-center my-5"><Spinner animation="border" /></div>;
  }

  if (error) {
    return <Alert variant="danger" className="my-4">{error}</Alert>;
  }

  return (
    <div style={{ maxWidth: 900, margin: '2rem auto', padding: '2rem 2rem 3rem 2rem', background: '#fff', borderRadius: 16, boxShadow: '0 2px 16px rgba(0,0,0,0.07)' }}>
      <Card className="mb-4 shadow-sm text-center" style={{ background: '#f8f9fa' }}>
        <Card.Body>
          <Card.Title as="h4" style={{ marginBottom: 0 }}>
            <i className="bi bi-star-fill" style={{ color: '#ffc107', marginRight: 8 }}></i>
            Average Score
          </Card.Title>
          <Card.Text style={{ fontSize: 36, fontWeight: 700, color: '#0d6efd', marginTop: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {data && data.average !== null && data.average !== undefined ? data.average.toFixed(2) : '-'}
            {getFaceIcon(data && data.average)}
          </Card.Text>
          <div style={{ color: "#444", fontSize: 17, marginTop: 10 }}>
            This is your average score for all closed homeworks. <br />
            
          </div>
        </Card.Body>
      </Card>
      <Card className="mb-4 shadow-sm" style={{ background: '#f8f9fa' }}>
        <Card.Body>
          <Card.Title as="h5" style={{ color: "#0d6efd" }}>
            <i className="bi bi-journal-check" style={{ marginRight: 8 }}></i>
            Closed Homeworks
          </Card.Title>
          <Card.Text style={{ color: "#444", marginBottom: 10 }}>
            Below you can review all your closed homeworks, your answers, and the scores assigned by your teachers.
          </Card.Text>
          <Table striped bordered hover responsive className="shadow-sm">
            <thead className="table-primary">
              <tr>
                <th>#</th>
                <th>Question</th>
                <th>Answer</th>
                <th>Score</th>
              </tr>
            </thead>
            <tbody>
              {data && data.closed_homeworks && data.closed_homeworks.length > 0 ? (
                data.closed_homeworks.map((hw, idx) => (
                  <tr key={idx}>
                    <td>{idx + 1}</td>
                    <td>{hw.question}</td>
                    <td>{hw.answer ?? <span style={{ color: 'gray' }}>No answer</span>}</td>
                    <td style={{ fontWeight: 600 }}>{hw.score}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="text-center text-muted">No closed homeworks found.</td>
                </tr>
              )}
            </tbody>
          </Table>
          
        </Card.Body>
      </Card>
    </div>
  );
}
export default ViewClosedHomeworks;