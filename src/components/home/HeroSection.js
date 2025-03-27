import React from 'react';
import { Container, Row, Col, Form, InputGroup, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaSearch, FaMapMarkerAlt, FaArrowRight } from 'react-icons/fa';

const HeroSection = () => {
  return (
    <section className="animated-bg text-white py-5">
      <Container>
        <Row className="align-items-center py-5">
          <Col lg={6} className="mb-5 mb-lg-0">
            <h1 className="display-4 fw-bold mb-4">Find Your Dream Job Today</h1>
            <p className="lead mb-4">
              Connect with top employers and discover opportunities that match your skills and career goals.
            </p>
            <Form className="mt-4">
              <Row>
                <Col md={5} className="mb-3 mb-md-0">
                  <InputGroup className="shadow-sm rounded-pill overflow-hidden">
                    <InputGroup.Text className="bg-white border-0">
                      <FaSearch className="text-primary" />
                    </InputGroup.Text>
                    <Form.Control
                      className="border-0 py-2"
                      placeholder="Job title or keywords"
                      aria-label="Job title"
                    />
                  </InputGroup>
                </Col>
                <Col md={5} className="mb-3 mb-md-0">
                  <InputGroup className="shadow-sm rounded-pill overflow-hidden">
                    <InputGroup.Text className="bg-white border-0">
                      <FaMapMarkerAlt className="text-primary" />
                    </InputGroup.Text>
                    <Form.Control
                      className="border-0 py-2"
                      placeholder="Location"
                      aria-label="Location"
                    />
                  </InputGroup>
                </Col>
                <Col md={2}>
                  <Button 
                    variant="light" 
                    className="w-100 rounded-pill hover-lift" 
                    as={Link} 
                    to="/jobs"
                  >
                    <FaSearch />
                  </Button>
                </Col>
              </Row>
            </Form>
            <div className="mt-4 d-flex align-items-center">
              <span className="me-3">Popular Searches:</span>
              <div className="d-flex flex-wrap gap-2">
                <Link to="/jobs?search=developer" className="badge bg-light text-dark text-decoration-none rounded-pill px-3 py-2 hover-lift">
                  Developer
                </Link>
                <Link to="/jobs?search=designer" className="badge bg-light text-dark text-decoration-none rounded-pill px-3 py-2 hover-lift">
                  Designer
                </Link>
                <Link to="/jobs?search=marketing" className="badge bg-light text-dark text-decoration-none rounded-pill px-3 py-2 hover-lift">
                  Marketing
                </Link>
              </div>
            </div>
          </Col>
          <Col lg={6} className="d-none d-lg-block text-center">
            <img 
              src="https://via.placeholder.com/600x400?text=Job+Search+Illustration" 
              alt="Job Search" 
              className="img-fluid rounded-lg shadow-lg hover-lift" 
            />
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default HeroSection;