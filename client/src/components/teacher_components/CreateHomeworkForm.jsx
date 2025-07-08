import  { useState, useEffect } from 'react';
import { Form, Button, Alert, Spinner, Card, Badge, Row, Col } from 'react-bootstrap';
import API from "../../API/API.mjs";

function CreateHomeworkForm() {
  const [question, setQuestion] = useState('');
  const [students, setStudents] = useState([]);
  const [selectedStudentIds, setSelectedStudentIds] = useState(new Set());
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    API.getAllStudents()
      .then(data => {
        setStudents(data);
        setLoading(false);
      })
      .catch(() => {
        setError('Error loading students');
        setLoading(false);
      });
  }, []);

  const handleCheckboxChange = (studentId) => {
    setSelectedStudentIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(studentId)) {
        newSet.delete(studentId);
      } else {
        newSet.add(studentId);
      }
      return newSet;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

   if (question.trim() === '') {
      setError('Question is required');
      return;
    }

    if (selectedStudentIds.size < 2 || selectedStudentIds.size > 6) {
      setError('Select between 2 and 6 students');
      return;
    }

    const payload = {
      question,
      studentIds: Array.from(selectedStudentIds).map(id => Number(id))
    };

    try {
      await API.createHomework(payload.question, payload.studentIds);
      setSuccess(true);
      setQuestion('');
      setSelectedStudentIds(new Set());
    } catch (err) {
      
      setError(err || 'Error creating homework');
      setSuccess(false);
    }
  };

  if (loading) return (
    <div className="d-flex justify-content-center my-5">
      <Spinner animation="border" />
    </div>
  );

  
  let badgeColor = "success";
  if (selectedStudentIds.size < 2 || selectedStudentIds.size > 6) {
    badgeColor = "danger";
  }

  return (
    <Card className="shadow-sm p-4" style={{ maxWidth: 600, margin: "2rem auto", borderRadius: 16 }}>
      <Card.Body>
        <Card.Title as="h3" style={{ color: "#0d6efd" }}>
          <i className="bi bi-plus-circle" style={{ marginRight: 8 }}></i>
          Create New Homework
        </Card.Title>
        <Card.Text style={{ color: "#444", marginBottom: 18 }}>
          Fill in the question and select a group of students (between 2 and 6) to assign the homework. 
          After creation, students will see the new homework in their dashboard.
        </Card.Text>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formQuestion" className="mb-4">
            <Form.Label style={{ fontSize: "1.1rem", fontWeight: 500 }}>Question</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Enter the question here"
              required
              style={{ resize: "vertical" }}
            />
          </Form.Group>

          <Form.Group className="mb-4">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <Form.Label as="legend" className="mb-0">
                Select students <span style={{ fontWeight: 400, color: "#888" }}>(2-6)</span>
              </Form.Label>
              <Badge bg={badgeColor}>
                {selectedStudentIds.size} selected
              </Badge>
            </div>
            <Row className="mt-2">
              {students.map((student) => (
                <Col xs={12} sm={6} key={student.id}>
                  <Form.Check
                    type="checkbox"
                    id={`student-${student.id}`}
                    label={`${student.name} ${student.surname}`}
                    checked={selectedStudentIds.has(student.id)}
                    onChange={() => handleCheckboxChange(student.id)}
                    className="mb-2"
                  />
                </Col>
              ))}
            </Row>
          </Form.Group>

          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">Homework created successfully!</Alert>}

          <div className="d-flex justify-content-end">
            <Button
              variant="primary"
              type="submit"
            >
              <i className="bi bi-send" style={{ marginRight: 6 }}></i>
              Create new homework
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
}

export default  CreateHomeworkForm;