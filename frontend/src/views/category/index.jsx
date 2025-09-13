import { useState, useEffect } from 'react';
import { Card, CardBody, Col, Container, Row, Nav, NavItem, NavLink, TabContainer, TabContent, TabPane } from 'react-bootstrap';
import PageMeta from '@/components/PageMeta';
import ComponentCard from '@/components/ComponentCard';
import { TbHome, TbUserCircle, TbSettings, TbInfoCircle } from 'react-icons/tb';

const CategoryPage = () => {
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({ name: '', image: null });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchCategories = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/categories');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setCategories([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const url = editingId ? `http://localhost:5000/api/categories/${editingId}` : 'http://localhost:5000/api/categories';
      const method = editingId ? 'PUT' : 'POST';
      
      const formDataObj = new FormData();
      formDataObj.append('name', formData.name);
      if (formData.image) {
        formDataObj.append('image', formData.image);
      }
      
      const response = await fetch(url, {
        method,
        body: formDataObj
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      setFormData({ name: '', image: null });
      setEditingId(null);
      // Reset file input
      const fileInput = document.querySelector('input[type="file"]');
      if (fileInput) fileInput.value = '';
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
        await fetch(`http://localhost:5000/api/categories/${id}`, { method: 'DELETE' });
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
                        <label className="form-label">Image</label>
                        <input 
                          type="file" 
                          className="form-control"
                          accept="image/*"
                          onChange={(e) => setFormData({...formData, image: e.target.files[0]})}
                        />
                        {formData.image && (
                          <div className="mt-2">
                            <img 
                              src={URL.createObjectURL(formData.image)} 
                              alt="Preview" 
                              className="img-thumbnail" 
                              style={{maxWidth: '200px', maxHeight: '200px', objectFit: 'cover'}}
                            />
                          </div>
                        )}
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
                            setFormData({ name: '', image: null });
                            // Reset file input
                            const fileInput = document.querySelector('input[type="file"]');
                            if (fileInput) fileInput.value = '';
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
                            <th>Image</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {categories.map(cat => (
                            <tr key={cat.id}>
                              <td>{cat.id}</td>
                              <td>
                                {editingId === cat.id ? (
                                  <input 
                                    type="text" 
                                    className="form-control form-control-sm"
                                    value={formData.name}
                                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                                  />
                                ) : (
                                  cat.name
                                )}
                              </td>
                              <td>
                                {editingId === cat.id ? (
                                  <input 
                                    type="file" 
                                    className="form-control form-control-sm"
                                    accept="image/*"
                                    onChange={(e) => setFormData({...formData, image: e.target.files[0]})}
                                  />
                                ) : (
                                  cat.image ? (
                                    <img 
                                      src={`http://localhost:5000/uploads/${cat.image}`} 
                                      alt="Category" 
                                      className="img-thumbnail" 
                                      style={{width: '50px', height: '50px', objectFit: 'cover'}}
                                    />
                                  ) : (
                                    'No image'
                                  )
                                )}
                              </td>
                              <td>
                                {editingId === cat.id ? (
                                  <>
                                    <button 
                                      className="btn btn-sm btn-success me-1"
                                      onClick={handleSubmit}
                                    >
                                      Save
                                    </button>
                                    <button 
                                      className="btn btn-sm btn-secondary"
                                      onClick={() => {
                                        setEditingId(null);
                                        setFormData({ name: '', image: null });
                                      }}
                                    >
                                      Cancel
                                    </button>
                                  </>
                                ) : (
                                  <>
                                    <button 
                                      className="btn btn-sm btn-outline-primary me-1"
                                      onClick={() => {
                                        setFormData({ name: cat.name, image: null });
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
                                  </>
                                )}
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