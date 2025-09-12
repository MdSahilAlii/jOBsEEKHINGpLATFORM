import { Card, CardBody, Col, Container, Row, Nav, NavItem, NavLink, TabContainer, TabContent, TabPane } from 'react-bootstrap';
import PageMeta from '@/components/PageMeta';
import ComponentCard from '@/components/ComponentCard';
import DT from 'datatables.net-bs5';
import DataTable from 'datatables.net-react';
import 'datatables.net-buttons-bs5';
import 'datatables.net-buttons/js/buttons.html5';
import jszip from 'jszip';
import pdfmake from 'pdfmake';
import { TbHome, TbUserCircle, TbSettings, TbInfoCircle } from 'react-icons/tb';

const CategoryPage = () => {
  DataTable.use(DT);
  DT.Buttons.jszip(jszip);
  DT.Buttons.pdfMake(pdfmake);

  const categoryData = [
    [1, 'Electronics', 'Electronic devices and gadgets', '<button class="btn btn-sm btn-outline-primary me-1">Edit</button><button class="btn btn-sm btn-outline-danger">Delete</button>'],
    [2, 'Clothing', 'Fashion and apparel items', '<button class="btn btn-sm btn-outline-primary me-1">Edit</button><button class="btn btn-sm btn-outline-danger">Delete</button>'],
    [3, 'Books', 'Educational and entertainment books', '<button class="btn btn-sm btn-outline-primary me-1">Edit</button><button class="btn btn-sm btn-outline-danger">Delete</button>']
  ];

  const categoryColumns = [
    { data: 0, title: 'ID' },
    { data: 1, title: 'Name' },
    { data: 2, title: 'Description' },
    { data: 3, title: 'Actions', orderable: false }
  ];

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
                  <ComponentCard title="Add Category" isCollapsible>
                    <form>
                      <div className="mb-3">
                        <label className="form-label">Category Name</label>
                        <input type="text" className="form-control" placeholder="Enter category name" />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Description</label>
                        <textarea className="form-control" rows="3" placeholder="Enter description"></textarea>
                      </div>
                      <button type="submit" className="btn btn-primary">Add Category</button>
                    </form>
                  </ComponentCard>
                </TabPane>
                
                <TabPane eventKey="List">
                  <ComponentCard title="Category List" isCollapsible>
                    <DataTable 
                      data={categoryData} 
                      columns={categoryColumns} 
                      options={{
                        responsive: true,
                        layout: {
                          topStart: 'buttons'
                        },
                        buttons: [{
                          extend: 'copy',
                          className: 'btn btn-sm btn-secondary'
                        }, {
                          extend: 'csv',
                          className: 'btn btn-sm btn-secondary'
                        }, {
                          extend: 'excel',
                          className: 'btn btn-sm btn-secondary'
                        }, {
                          extend: 'pdf',
                          className: 'btn btn-sm btn-secondary'
                        }]
                      }} 
                      className="table table-striped dt-responsive align-middle mb-0"
                    >
                      <thead className="thead-sm text-uppercase fs-xxs">
                        <tr>
                          <th>ID</th>
                          <th>Name</th>
                          <th>Description</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                    </DataTable>
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