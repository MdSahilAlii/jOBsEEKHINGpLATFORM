import { useState, useEffect } from 'react';
import { Col, Container, Row, Nav, NavItem, NavLink, TabContainer, TabContent, TabPane, Button } from 'react-bootstrap';
import PageMeta from '@/components/PageMeta';
import ComponentCard from '@/components/ComponentCard';
import { TbHome, TbUserCircle, TbSettings, TbInfoCircle, TbEdit, TbTrash, TbChevronLeft, TbChevronRight, TbChevronsLeft, TbChevronsRight } from 'react-icons/tb';
import DT from 'datatables.net-bs5';
import DataTable from 'datatables.net-react';
import 'datatables.net-responsive';
import ReactDOMServer from 'react-dom/server';

const CategoryPage = () => {
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({ name: '', image: null, status: 'active' });
  const [currentImage, setCurrentImage] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [editingRowId, setEditingRowId] = useState(null);
  const [editingName, setEditingName] = useState('');
  const [activeTab, setActiveTab] = useState('Profile');

  DataTable.use(DT);

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

  const handleStatusToggle = async (id, currentStatus) => {
    try {
      const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
      await fetch(`http://localhost:5000/api/categories/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      fetchCategories();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const handleEdit = (category) => {
    setEditingId(category.id);
    setFormData({ name: category.name, image: null, status: category.status });
    setCurrentImage(category.image);
    setActiveTab('Profile');
  };

  const handleInlineEdit = (id, name) => {
    setEditingRowId(id);
    setEditingName(name);
  };

  const handleSaveInlineEdit = async (id) => {
    try {
      const formDataObj = new FormData();
      formDataObj.append('name', editingName);
      
      const response = await fetch(`http://localhost:5000/api/categories/${id}`, {
        method: 'PUT',
        body: formDataObj
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      setEditingRowId(null);
      setEditingName('');
      fetchCategories();
    } catch (error) {
      console.error('Error updating category:', error);
      alert('Error updating category.');
    }
  };

  const handleCancelInlineEdit = () => {
    setEditingRowId(null);
    setEditingName('');
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

  // Global functions for DataTable buttons
  window.toggleStatus = handleStatusToggle;
  window.startEdit = (id, name) => {
    const category = categories.find(cat => cat.id === id);
    if (category) {
      handleEdit(category);
    }
  };
  window.saveEdit = handleSaveInlineEdit;
  window.cancelEdit = handleCancelInlineEdit;
  window.deleteCategory = handleDelete;

  const getTableData = () => {
    return categories.map(cat => {
      const isEditing = editingRowId === cat.id;
      return [
        cat.id,
        isEditing ? 
          `<input type="text" class="form-control form-control-sm" value="${editingName}" onchange="window.editingName = this.value" />` :
          cat.name,
        cat.image ? 
          `<img src="http://localhost:5000/uploads/${cat.image}" alt="Category" class="img-thumbnail" style="width: 20px; height: 20px; object-fit: cover;">` : 
          'No image',
        `<span class="badge badge-label badge-soft-${cat.status === 'active' ? 'success' : 'danger'}" onclick="toggleStatus(${cat.id}, '${cat.status}')" style="cursor: pointer;">${cat.status === 'active' ? 'Active' : 'Inactive'}</span>`,
        isEditing ?
          `<button class="btn btn-sm btn-success me-1" onclick="saveEdit(${cat.id})">✓</button><button class="btn btn-sm btn-secondary" onclick="cancelEdit()">✕</button>` :
          `<button class="btn btn-sm btn-primary me-1" onclick="startEdit(${cat.id}, '${cat.name}')">Edit</button><button class="btn btn-sm btn-danger" onclick="deleteCategory(${cat.id})">Delete</button>`
      ];
    });
  };

  const columns = [
    { data: 0, title: 'ID' },
    { data: 1, title: 'Name', orderable: false },
    { data: 2, title: 'Image', orderable: false },
    { data: 3, title: 'Status', orderable: false },
    { data: 4, title: 'Actions', orderable: false }
  ];

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
   <div className='mt-4'>
  <ComponentCard title="Category List"  isCollapsible>
     <TabContainer activeKey={activeTab} onSelect={(k) => setActiveTab(k)}>
                <Nav className="nav-tabs nav-justified nav-bordered nav-bordered-danger mb-3">
                    <NavItem>
                        <NavLink eventKey="Home" href="#home-b1">
                            <TbHome className="fs-lg me-md-1 align-middle" />
                            Category
                        </NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink eventKey="Profile" href="#profile-b1">
                            <TbUserCircle className="fs-lg me-md-1 align-middle" />
                            Add Category
                        </NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink eventKey="Settings" href="#settings-b1">
                            <TbSettings className="fs-lg me-md-1 align-middle" />
                            Sub Category
                        </NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink eventKey="About" href="#about-b1">
                            <TbInfoCircle className="fs-lg me-md-1 align-middle" />
                            About
                        </NavLink>
                    </NavItem>
                </Nav>
                <TabContent>
                    <TabPane eventKey="Home" id="home-b1">
                        <DataTable    
                            data={getTableData()} 
                            columns={columns} 
                            options={{
                                responsive: true,
                                language: {
                                    paginate: {
                                        first: ReactDOMServer.renderToStaticMarkup(<TbChevronsLeft className="fs-lg" />),
                                        previous: ReactDOMServer.renderToStaticMarkup(<TbChevronLeft className="fs-lg" />),
                                        next: ReactDOMServer.renderToStaticMarkup(<TbChevronRight className="fs-lg" />),
                                        last: ReactDOMServer.renderToStaticMarkup(<TbChevronsRight className="fs-lg" />)
                                    }
                                }
                            }} 
                            className="table table-striped dt-responsive align-middle mb-0"
                        >
                            <thead className="thead-sm text-uppercase fs-xxs">
                                <tr>
                                    <th>ID</th>
                                    <th>Name</th>
                                    <th>Image</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                        </DataTable>
                    </TabPane>
                    <TabPane eventKey="Profile" id="profile-b1">
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
                                {editingId && currentImage && !formData.image && (
                                    <div className="mt-2">
                                        <p className="text-muted">Current Image:</p>
                                        <img 
                                            src={`http://localhost:5000/uploads/${currentImage}`} 
                                            alt="Current" 
                                            className="img-thumbnail" 
                                            style={{maxWidth: '200px', maxHeight: '200px', objectFit: 'cover'}}
                                        />
                                    </div>
                                )}
                                {formData.image && (
                                    <div className="mt-2">
                                        <p className="text-muted">New Image Preview:</p>
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
                                        setCurrentImage(null);
                                        const fileInput = document.querySelector('input[type="file"]');
                                        if (fileInput) fileInput.value = '';
                                    }}
                                >
                                    Cancel
                                </button>
                            )}
                        </form>
                    </TabPane>
                    <TabPane eventKey="Settings">
                       
                    </TabPane>
                    <TabPane eventKey="About" id="about-b1">
                       
                    </TabPane>
                </TabContent>
            </TabContainer>


                    </ComponentCard>
                    </div>
  );
};

export default CategoryPage;