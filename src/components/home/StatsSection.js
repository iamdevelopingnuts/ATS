import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { FaBriefcase, FaBuilding, FaUsers } from 'react-icons/fa';

const StatsSection = ({ stats }) => {
  // Default stats if none provided
  const defaultStats = {
    jobs: 1000,
    companies: 500,
    candidates: 10000
  };

  // Use provided stats or defaults
  const displayStats = stats || defaultStats;

  return (
    <section className="py-5 bg-white">
      <Container>
        <Row className="text-center">
          <Col md={4} className="mb-4 mb-md-0">
            <div className="d-inline-block p-4 bg-primary bg-opacity-10 rounded-circle shadow-sm mb-3">
              <FaBriefcase size={30} className="text-primary" />
            </div>
            <h3 className="h2 fw-bold">{displayStats.jobs.toLocaleString()}+</h3>
            <p className="text-muted">Job Opportunities</p>
          </Col>
          <Col md={4} className="mb-4 mb-md-0">
            <div className="d-inline-block p-4 bg-primary bg-opacity-10 rounded-circle shadow-sm mb-3">
              <FaBuilding size={30} className="text-primary" />
            </div>
            <h3 className="h2 fw-bold">{displayStats.companies.toLocaleString()}+</h3>
            <p className="text-muted">Companies</p>
          </Col>
          <Col md={4}>
            <div className="d-inline-block p-4 bg-primary bg-opacity-10 rounded-circle shadow-sm mb-3">
              <FaUsers size={30} className="text-primary" />
            </div>
            <h3 className="h2 fw-bold">{displayStats.candidates.toLocaleString()}+</h3>
            <p className="text-muted">Candidates</p>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default StatsSection;