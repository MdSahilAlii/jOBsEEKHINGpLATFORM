import { useState, useEffect } from 'react';
import { Card, CardBody, Table, Alert, Button } from 'react-bootstrap';
import PageMeta from '@/components/PageMeta';
import PageTitle from '@/components/PageTitle';
import axios from 'axios';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUsers();
    getCurrentUser();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/users/all', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(response.data);
    } catch (err) {
      setError('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const getCurrentUser = () => {
    const user = localStorage.getItem('user');
    if (user) {
      setCurrentUser(JSON.parse(user));
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/auth/sign-in';
  };

  if (loading) return <div>Loading...</div>;

  return (
    <>
      <PageMeta title="Users" />
      <PageTitle title="User Management" />
      
      {error && <Alert variant="danger">{error}</Alert>}
      
      {currentUser && (
        <Card className="mb-4">
          <CardBody>
            <h5>Currently Logged In</h5>
            <p><strong>Name:</strong> {currentUser.name}</p>
            <p><strong>Email:</strong> {currentUser.email}</p>
            <Button variant="danger" onClick={handleLogout}>Logout</Button>
          </CardBody>
        </Card>
      )}

      <Card>
        <CardBody>
          <h5>All Registered Users</h5>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </CardBody>
      </Card>
    </>
  );
};

export default Users;