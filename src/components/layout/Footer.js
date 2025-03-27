import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaLinkedin, FaTwitter, FaFacebook, FaInstagram } from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-dark text-white py-4 mt-5">
      <Container>
        <Row className="mb-4">
          <Col md={4} className="mb-4 mb-md-0">
            <h5 className="mb-3">ATS System</h5>
            <p className="text-muted">
              A modern applicant tracking system designed to streamline your hiring process.
            </p>
            <div className="d-flex gap-3">
              <a href="#" className="text-white">
                <FaLinkedin size={20} />
              </a>
              <a href="#" className="text-white">
                <FaTwitter size={20} />
              </a>
              <a href="#" className="text-white">
                <FaFacebook size={20} />
              </a>
              <a href="#" className="text-white">
                <FaInstagram size={20} />
              </a>
            </div>
          </Col>
          <Col md={2} className="mb-4 mb-md-0">
            <h6 className="mb-3">For Employers</h6>
            <ul className="list-unstyled">
              <li className="mb-2">
                <Link to="/employer/post-job" className="text-muted text-decoration-none">
                  Post a Job
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/employer/dashboard" className="text-muted text-decoration-none">
                  Dashboard
                </Link>
              </li>
            </ul>
          </Col>
          <Col md={2} className="mb-4 mb-md-0">
            <h6 className="mb-3">For Candidates</h6>
            <ul className="list-unstyled">
              <li className="mb-2">
                <Link to="/jobs" className="text-muted text-decoration-none">
                  Browse Jobs
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/candidate/dashboard" className="text-muted text-decoration-none">
                  Dashboard
                </Link>
              </li>
            </ul>
          </Col>
          <Col md={4}>
            <h6 className="mb-3">Contact Us</h6>
            <p className="text-muted mb-1">Email: info@atssystem.com</p>
            <p className="text-muted mb-1">Phone: +1 (555) 123-4567</p>
            <p className="text-muted">Address: 123 Recruitment St, HR City</p>
          </Col>
        </Row>
        <hr className="my-4" />
        <Row>
          <Col className="text-center text-muted">
            <small>&copy; {currentYear} ATS System. All rights reserved.</small>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;