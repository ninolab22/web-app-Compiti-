import  { useEffect, useState, useMemo } from 'react';
import { Table, Spinner, Alert, ButtonGroup, Button, Card } from 'react-bootstrap';
import API from '../../API/API.mjs';

function ClassStatus() {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc'); 

  useEffect(() => {
    setLoading(true);
    API.getAllStudentsStats()
      .then(data => {
        setStats(data);
        setLoading(false);
      })
      .catch(() => {
        setError('Error loading class statistics');
        setLoading(false);
      });
  }, []);

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(field);
      
      if (field === 'name') setSortOrder('asc');
      else setSortOrder('desc');
    }
  };

  const getArrow = (field) => {
    if (sortBy !== field) return null;
    return sortOrder === 'asc' ? ' ▲' : ' ▼';
  };

  const sortedStats = useMemo(() => {
    let sorted = [...stats];
    if (sortBy === 'name') {
      sorted.sort((a, b) => {
        const cmp = a.surname.localeCompare(b.surname) || a.name.localeCompare(b.name);
        return sortOrder === 'asc' ? cmp : -cmp;
      });
    } else if (sortBy === 'total') {
      sorted.sort((a, b) => {
        const cmp = (a.openHomeworks + a.closedHomeworks) - (b.openHomeworks + b.closedHomeworks);
        return sortOrder === 'asc' ? cmp : -cmp;
      });
    } else if (sortBy === 'average') {
      sorted.sort((a, b) => {
        const cmp = (a.averageScore ?? 0) - (b.averageScore ?? 0);
        return sortOrder === 'asc' ? cmp : -cmp;
      });
    }
    return sorted;
  }, [stats, sortBy, sortOrder]);

  if (loading) return <div className="d-flex justify-content-center my-5"><Spinner animation="border" /></div>;
  if (error) return <Alert variant="danger" className="my-4">{error}</Alert>;

  return (
    <Card className="shadow-sm" style={{ maxWidth: 950, margin: '2rem auto', padding: 0, borderRadius: 16 }}>
      <Card.Body>
        <Card.Title as="h3" style={{ color: "#0d6efd" }}>
          <i className="bi bi-people-fill" style={{ marginRight: 8 }}></i>
          Class Status Overview
        </Card.Title>
        <Card.Text style={{ color: "#444", marginBottom: 18 }}>
          Here you can monitor the progress of all your students. Use the buttons below to sort the table by surname, number of homeworks, or average score.
        </Card.Text>
        <ButtonGroup className="mb-3">
          <Button
            variant={sortBy === 'name' ? 'primary' : 'outline-primary'}
            onClick={() => handleSort('name')}
          >
            Sort by surname{getArrow('name')}
          </Button>
          <Button
            variant={sortBy === 'total' ? 'primary' : 'outline-primary'}
            onClick={() => handleSort('total')}
          >
            Sort by number of homeworks{getArrow('total')}
          </Button>
          <Button
            variant={sortBy === 'average' ? 'primary' : 'outline-primary'}
            onClick={() => handleSort('average')}
          >
            Sort by average score{getArrow('average')}
          </Button>
        </ButtonGroup>
        <Table striped bordered hover responsive className="shadow-sm">
          <thead className="table-primary">
            <tr>
              <th>Name</th>
              <th>Surname</th>
              <th>Open homeworks</th>
              <th>Closed homeworks</th>
              <th>Average score</th>
              <th>Total homeworks</th>
            </tr>
          </thead>
          <tbody>
            {sortedStats.map((student, idx) => (
              <tr key={idx}>
                <td>{student.name}</td>
                <td>{student.surname}</td>
                <td>{student.openHomeworks}</td>
                <td>{student.closedHomeworks}</td>
                <td>
                  {student.averageScore !== undefined && student.averageScore !== null
                    ? student.averageScore.toFixed(1)
                    : '-'}
                </td>
                <td>{student.openHomeworks + student.closedHomeworks}</td>
              </tr>
            ))}
          </tbody>
        </Table>
        <div style={{ color: "#888", fontSize: 15, marginTop: 10 }}>
          The table summarizes each student's activity and performance in your class.
        </div>
      </Card.Body>
    </Card>
  );
}

export default ClassStatus;