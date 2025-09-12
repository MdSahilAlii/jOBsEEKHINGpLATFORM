import { useState, useEffect } from 'react';
import { Card, CardBody, Col, Container, Row, Nav, NavItem, NavLink, TabContainer, TabContent, TabPane } from 'react-bootstrap';
import PageMeta from '@/components/PageMeta';
import ComponentCard from '@/components/ComponentCard';
import { TbHome, TbUserCircle, TbSettings, TbInfoCircle } from 'react-icons/tb';

const CategoryPage = () => {
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchCategories = async () => {
    try {
      console.log('Fetching categories...');
      const response = await fetch('http://localhost:5000/api/categories');
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Categories data:', data);
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
      // Set some dummy data for testing
      setCategories([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const url = editingId ? `http://localhost:5000/api/categories/${editingId}` : 'http://localhost:5000/api/categories';
      const method = editingId ? 'PUT' : 'POST';
      
      console.log('Submitting:', { url, method, formData });
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      console.log('Submit response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      console.log('Submit result:', result);
      
      setFormData({ name: '', description: '' });
      setEditingId(null);
      fetchCategories();
    } catch (error) {
      console.error('Error saving category:', error);
      alert('Error saving category. Please check if the server is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this category?')) {
      try {
        await fetch(`/api/categories/${id}`, { method: 'DELETE' });
        fetchCategories();
      } catch (error) {
        console.error('Error deleting category:', error);
      }
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <>
      <PageMeta title="Category Management" />
      <Container fluid>
        <Row>
          <Col xs={12}>
            <div className="page-title-box">
              <h4 className="page-title">Category Management</h4>
            </div>
          </Col>
        </Row>

        <Row>
          <Col xs={12}>
            <TabContainer defaultActiveKey="Add">
              <Nav className="nav-tabs nav-justified nav-bordered nav-bordered-danger mb-3">
                <NavItem>
                  <NavLink eventKey="Add">
                    <TbHome className="fs-lg me-md-1 align-middle" />
                    Add Category
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink eventKey="List">
                    <TbUserCircle className="fs-lg me-md-1 align-middle" />
                    Category List
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink eventKey="Settings">
                    <TbSettings className="fs-lg me-md-1 align-middle" />
                    Settings
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink eventKey="About">
                    <TbInfoCircle className="fs-lg me-md-1 align-middle" />
                    About
                  </NavLink>
                </NavItem>
              </Nav>
              
              <TabContent>
                <TabPane eventKey="Add">
                  <ComponentCard title={editingId ? "Edit Category" : "Add Category"} isCollapsible>
                    <form onSubmit={handleSubmit}>
                      <div className="mb-3">
                        <label className="form-label">Category Name</label>
                        <input 
                          type="text" 
                          className="form-control" 
                          placeholder="Enter category name"
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          required
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Description</label>
                        <textarea 
                          className="form-control" 
                          rows="3" 
                          placeholder="Enter description"
                          value={formData.description}
                          onChange={(e) => setFormData({...formData, description: e.target.value})}
                        ></textarea>
                      </div>
                      <button type="submit" className="btn btn-primary" disabled={loading}>
                        {loading ? 'Saving...' : (editingId ? 'Update Category' : 'Add Category')}
                      </button>
                      {editingId && (
                        <button 
                          type="button" 
                          className="btn btn-secondary ms-2"
                          onClick={() => {
                            setEditingId(null);
                            setFormData({ name: '', description: '' });
                          }}
                        >
                          Cancel
                        </button>
                      )}
                    </form>
                  </ComponentCard>
                </TabPane>
                
                <TabPane eventKey="List">
                  <ComponentCard title="Category List" isCollapsible>
                    <div className="table-responsive">
                      <table className="table table-striped">
                        <thead>
                          <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Description</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {categories.map(cat => (
                            <tr key={cat.id}>
                              <td>{cat.id}</td>
                              <td>{cat.name}</td>
                              <td>{cat.description || 'No description'}</td>
                              <td>
                                <button 
                                  className="btn btn-sm btn-outline-primary me-1"
                                  onClick={() => {
                                    setFormData({ name: cat.name, description: cat.description || '' });
                                    setEditingId(cat.id);
                                  }}
                                >
                                  Edit
                                </button>
                                <button 
                                  className="btn btn-sm btn-outline-danger"
                                  onClick={() => handleDelete(cat.id)}
                                >
                                  Delete
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </ComponentCard>
                </TabPane>
                
                <TabPane eventKey="Settings">
                  <ComponentCard title="Category Settings">
                    <p>Configure category settings and preferences here.</p>
                  </ComponentCard>
                </TabPane>
                
                <TabPane eventKey="About">
                  <ComponentCard title="About Categories">
                    <p>Information about category management system.</p>
                  </ComponentCard>
                </TabPane>
              </TabContent>
            </TabContainer>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default CategoryPage;