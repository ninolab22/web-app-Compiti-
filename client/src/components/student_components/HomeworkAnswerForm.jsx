import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Form, Button, Alert, Spinner, Badge } from 'react-bootstrap';
import API from '../../API/API.mjs';

function HomeworkAnswerForm({ studentId }) {
  const { id: homeworkId } = useParams();
  const navigate = useNavigate();
  
  const [homework, setHomework] = useState(null);
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchHomeworkDetails();
  }, [homeworkId, studentId]);

  const fetchHomeworkDetails = async () => {
    setLoading(true);
    try {
      
      const homeworks = await API.getStudentOpenHomeworks(studentId);
      const currentHomework = homeworks.find(hw => hw.id === parseInt(homeworkId));
      
      if (!currentHomework) {
        setError('Homework not found or already closed');
        return;
      }
      
      setHomework(currentHomework);
      setAnswer(currentHomework.answer || '');
    } catch (err) {
      setError('Error loading homework details');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
   
    if (!answer.trim()) {
      setError('Answer cannot be empty or only spaces');
      return;
    }
    
    setSaving(true);
    setError(null);
    setSuccess(false);
    
    try {
      await API.updateHomeworkAnswer(homeworkId, answer.trim());
      setSuccess(true);
      
     
    } catch (err) {
       setError(err || 'Error updating answer'); 
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigate('/students/homeworks');
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center my-5">
        <Spinner animation="border" />
      </div>
    );
  }

  if (error && !homework) {
    return (
      <div style={{ maxWidth: 600, margin: '2rem auto' }}>
        <Alert variant="danger">{error}</Alert>
        <Button variant="secondary" onClick={handleCancel}>
          Back to Homeworks
        </Button>
      </div>
    );
  }

  return (
    <Card className="shadow-sm" style={{ maxWidth: 700, margin: '2rem auto', borderRadius: 16 }}>
      <Card.Body className="p-4">
        <div className="d-flex align-items-center justify-content-between mb-3">
          <Card.Title as="h3" style={{ color: "#0d6efd", marginBottom: 0 }}>
            <i className="bi bi-pencil-square" style={{ marginRight: 8 }}></i>
            Edit Answer
          </Card.Title>
          <Badge bg="success" className="fs-6">
            <i className="bi bi-circle-fill" style={{ marginRight: 4 }}></i>
            Open
          </Badge>
        </div>

        {homework && (
          <Card className="mb-4" style={{ background: '#f8f9fa', border: 'none' }}>
            <Card.Body>
              <h5 style={{ color: "#0d6efd", marginBottom: 10 }}>
                <i className="bi bi-question-circle" style={{ marginRight: 6 }}></i>
                Question
              </h5>
              <p style={{ fontSize: '1.1rem', marginBottom: 10 }}>{homework.question}</p>
              <small style={{ color: '#666' }}>
                <i className="bi bi-person" style={{ marginRight: 4 }}></i>
                Assigned by: {homework.nameTeacher} {homework.surnameTeacher}
              </small>
            </Card.Body>
          </Card>
        )}

        {error && <Alert variant="danger">{error}</Alert>}
        {success && (
          <Alert variant="success">
            <i className="bi bi-check-circle" style={{ marginRight: 6 }}></i>
            Answer updated successfully!
          </Alert>
        )}

        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="answer" className="mb-4">
            <Form.Label style={{ fontSize: '1.1rem', fontWeight: 500, color: '#333' }}>
              <i className="bi bi-chat-text" style={{ marginRight: 6 }}></i>
              Your Answer
            </Form.Label>
            <Form.Control
              as="textarea"
              rows={6}
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Write your answer here..."
              disabled={saving}
              required
              style={{ 
                resize: 'vertical',
                minHeight: '120px',
                fontSize: '1rem'
              }}
            />
            <Form.Text className="text-muted">
              Provide a clear and complete answer to the question above.
            </Form.Text>
          </Form.Group>

          <div className="d-flex gap-3 justify-content-end">
            <Button 
              variant="secondary" 
              onClick={handleCancel}
              disabled={saving}
            >
              <i className="bi bi-arrow-left" style={{ marginRight: 6 }}></i>
              Back to Homeworks
            </Button>
            <Button 
              type="submit" 
              variant="primary"
              disabled={saving || !answer.trim()}
            >
              {saving ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" />
                  Saving...
                </>
              ) : (
                <>
                  <i className="bi bi-check-lg" style={{ marginRight: 6 }}></i>
                  Save Answer
                </>
              )}
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
}

export default HomeworkAnswerForm;