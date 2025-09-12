import Sidenav from '@/layouts/components/sidenav';
import { Container, Row, Col } from 'react-bootstrap';

const MainPage = () => {
  return (
    <Container fluid className="p-0">
      <Row className="g-0">
        <Col md={3} className="sidenav-wrapper">
          <Sidenav />
        </Col>
        <Col md={9} className="p-4">
          <h2 className="mb-4">Admin Dashboard</h2>
          <div className="content-area">
            <div>Admin Panel Content with Existing Sidenav Component</div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default MainPage;