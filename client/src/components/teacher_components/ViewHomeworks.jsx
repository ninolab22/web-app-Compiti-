import { useEffect, useState } from 'react';
import { Card, Spinner, Alert, Button, Form, Row, Col, Pagination, Toast, ToastContainer } from 'react-bootstrap';
import API from "../../API/API.mjs";

const PAGE_SIZE = 10;

function ViewHomeworks() {
  const [homeworks, setHomeworks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [scoreValue, setScoreValue] = useState('');
  const [page, setPage] = useState(1);
  const [showToast, setShowToast] = useState(false);
  
  useEffect(() => {
    setLoading(true);
    API.getAllHomeworks()
      .then((hws) => {
        setHomeworks(Array.isArray(hws) ? hws : []);
      })
      .catch(() => setFeedback('Error loading homeworks'))
      .finally(() => setLoading(false));
  }, []);

  const handleEdit = (id) => {
    setEditingId(id);
    setScoreValue('');
    setFeedback('');
  };

  const handleScoreSubmit = async (e, hwId) => {
    e.preventDefault();
    setLoading(true);
    setFeedback('');
    
    try {
      await API.gradeHomework(hwId, scoreValue);
      setEditingId(null);
      setScoreValue('');
      setShowToast(true);
      API.getAllHomeworks()
        .then((hws) => {
          setHomeworks(Array.isArray(hws) ? hws : []);
        });
    } catch (err) {
       setFeedback(err || 'Error inserting score'); 
    }
    setLoading(false);
  };

  // Pagination logic
  const totalPages = Math.ceil(homeworks.length / PAGE_SIZE);
  const paginatedHomeworks = homeworks.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // Icona di stato
  const getStateBadge = (state) => {
    if (state === 'open') {
      return (
        <span style={{ marginLeft: 10, display: 'inline-flex', alignItems: 'center' }}>
          <i className="bi bi-circle-fill" style={{ color: 'green', fontSize: 16, marginRight: 4 }}></i>
          <span style={{ color: 'green', fontWeight: 500 }}>(Open)</span>
        </span>
      );
    }
    return (
      <span style={{ marginLeft: 10, display: 'inline-flex', alignItems: 'center' }}>
        <i className="bi bi-circle-fill" style={{ color: 'red', fontSize: 16, marginRight: 4 }}></i>
        <span style={{ color: 'red', fontWeight: 500 }}>(Closed)</span>
      </span>
    );
  };

  return (
    <Card className="shadow-sm" style={{ maxWidth: 1100, margin: '2rem auto', borderRadius: 16, padding: 0 }}>
      <Card.Body>
        <Card.Title as="h3" style={{ color: "#0d6efd" }}>
          <i className="bi bi-journal-text" style={{ marginRight: 8 }}></i>
          All Homeworks
        </Card.Title>
        <Card.Text style={{ color: "#444", marginBottom: 18 }}>
          Here you can view, manage, and grade all homeworks assigned to your students.You can use the "Insert Score" button to grade open homeworks that have an answer.
        </Card.Text>
        {loading && (
          <div className="d-flex justify-content-center my-4">
            <Spinner animation="border" />
          </div>
        )}
        {feedback && !loading && (
          <Alert variant="info" className="my-3">{feedback}</Alert>
        )}
        <Row xs={1} md={2} lg={2} className="g-4">
          
          {paginatedHomeworks.map(hw => (
            
            <Col key={hw.id}>
              <Card className="mb-3 shadow-sm">
                <Card.Body>
                  <Card.Title style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span>
                      Homework
                      {getStateBadge(hw.state)}
                    </span>
                  </Card.Title>
                  <div className="card-text">
                    <div>
                      <strong>Question:</strong> {hw.question}
                    </div>
                    <div>
                      <strong>Answer:</strong>{' '}
                      {hw.answer === null || hw.answer === undefined || hw.answer.trim() === ''
                        ? <span style={{ color: 'gray' }}>No answer yet</span>
                        : hw.answer}
                    </div>
                    <div>
                      <strong>Status:</strong> {hw.state}
                    </div>
                    <div>
                      <strong>Score:</strong> {hw.score ?? '-'}
                    </div>
                  </div>
                  {hw.state === 'open' && hw.answer && hw.answer.trim() !== '' && (
                    editingId === hw.id ? (
                      <Form
                        style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 10 }}
                        onSubmit={e => handleScoreSubmit(e, hw.id)}
                      >
                        <Form.Control
                          type="number"
                          min={0}
                          max={30}
                          value={scoreValue}
                          onChange={e => setScoreValue(e.target.value)}
                          size="sm"
                          style={{ width: 70 }}
                          required
                        />
                        <Button type="submit" size="sm" variant="success">
                          Save
                        </Button>
                        <Button size="sm" variant="secondary" onClick={() => setEditingId(null)}>
                          Cancel
                        </Button>
                      </Form>
                    ) : (
                      <Button size="sm" onClick={() => handleEdit(hw.id)}>
                        Insert Score
                      </Button>
                    )
                  )}
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
        {totalPages > 1 && (
          <Pagination className="justify-content-center mt-4">
            <Pagination.First onClick={() => setPage(1)} disabled={page === 1} />
            <Pagination.Prev onClick={() => setPage(page - 1)} disabled={page === 1} />
            {[...Array(totalPages)].map((_, idx) => (
              <Pagination.Item
                key={idx + 1}
                active={page === idx + 1}
                onClick={() => setPage(idx + 1)}
              >
                {idx + 1}
              </Pagination.Item>
            ))}
            <Pagination.Next onClick={() => setPage(page + 1)} disabled={page === totalPages} />
            <Pagination.Last onClick={() => setPage(totalPages)} disabled={page === totalPages} />
          </Pagination>
        )}
        <ToastContainer position="top-center" className="mt-5">
          <Toast
            onClose={() => setShowToast(false)}
            show={showToast}
            delay={2000}
            autohide
            bg="success"
          >
            <Toast.Body className="text-white">Score inserted successfully!</Toast.Body>
          </Toast>
        </ToastContainer>
      </Card.Body>
    </Card>
  );
}

export default ViewHomeworks;