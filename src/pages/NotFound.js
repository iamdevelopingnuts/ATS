import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaExclamationTriangle, FaHome, FaSearch } from 'react-icons/fa';
import '../components/styles/CustomStyles.css';

const NotFound = () => {
  return (
    <Container className="py-5 my-5">
      <Row className="justify-content-center text-center">
        <Col md={8} lg={6}>
          <div className="mb-4">
            <FaExclamationTriangle size={80} className="text-warning mb-4" />
            <h1 className="display-4 fw-bold mb-3">404</h1>
            <h2 className="mb-4">Page Not Found</h2>
            <p className="lead text-muted mb-5">
              The page you are looking for might have been removed, had its name changed, 
              or is temporarily unavailable.
            </p>
          </div>
          
          <div className="d-flex flex-column flex-md-row justify-content-center gap-3">
            <Button 
              as={Link} 
              to="/" 
              variant="primary" 
              size="lg" 
              className="rounded-pill px-4 hover-lift"
            >
              <FaHome className="me-2" /> Back to Home
            </Button>
            <Button 
              as={Link} 
              to="/jobs" 
              variant="outline-primary" 
              size="lg" 
              className="rounded-pill px-4 hover-lift"
            >
              <FaSearch className="me-2" /> Browse Jobs
            </Button>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default NotFound;