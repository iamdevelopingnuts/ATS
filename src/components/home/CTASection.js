import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaUserPlus, FaSearch } from 'react-icons/fa';

const CTASection = () => {
  return (
    <section className="py-5 bg-primary text-white">
      <Container className="text-center py-4">
        <h2 className="fw-bold mb-4">Ready to Take the Next Step in Your Career?</h2>
        <p className="lead mb-4">Join thousands of professionals who have found their dream jobs through our platform.</p>
        <div className="d-flex flex-column flex-md-row justify-content-center gap-3">
          <Button 
            variant="light" 
            size="lg" 
            as={Link} 
            to="/register" 
            className="rounded-pill px-4 hover-lift"
          >
            <FaUserPlus className="me-2" /> Sign Up Now
          </Button>
          <Button 
            variant="outline-light" 
            size="lg" 
            as={Link} 
            to="/jobs" 
            className="rounded-pill px-4 hover-lift"
          >
            <FaSearch className="me-2" /> Browse Jobs
          </Button>
        </div>
      </Container>
    </section>
  );
};

export default CTASection;