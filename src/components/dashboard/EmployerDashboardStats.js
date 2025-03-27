import React from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import { FaBriefcase, FaUsers, FaEye, FaCheckCircle } from 'react-icons/fa';

const EmployerDashboardStats = ({ stats }) => {
  // Default values if stats are not provided
  const defaultStats = {
    activeJobs: 0,
    applications: 0,
    interviews: 0,
    hires: 0
  };

  // Use provided stats or defaults
  const dashboardStats = stats || defaultStats;

  return (
    <Row className="mb-4">
      <Col md={3} sm={6} className="mb-4 mb-md-0">
        <Card className="dashboard-stat-card border-0 shadow-sm h-100 border-left-primary">
          <Card.Body className="d-flex align-items-center">
            <div className="mr-3 bg-light p-3 rounded-circle">
              <FaBriefcase className="text-primary" size={24} />
            </div>
            <div className="ml-3">
              <div className="h5 mb-0 font-weight-bold">{dashboardStats.activeJobs}</div>
              <div className="text-muted">Active Jobs</div>
            </div>
          </Card.Body>
        </Card>
      </Col>
      
      <Col md={3} sm={6} className="mb-4 mb-md-0">
        <Card className="dashboard-stat-card border-0 shadow-sm h-100 border-left-info">
          <Card.Body className="d-flex align-items-center">
            <div className="mr-3 bg-light p-3 rounded-circle">
              <FaUsers className="text-info" size={24} />
            </div>
            <div className="ml-3">
              <div className="h5 mb-0 font-weight-bold">{dashboardStats.applications}</div>
              <div className="text-muted">Applications</div>
            </div>
          </Card.Body>
        </Card>
      </Col>
      
      <Col md={3} sm={6} className="mb-4 mb-md-0">
        <Card className="dashboard-stat-card border-0 shadow-sm h-100 border-left-warning">
          <Card.Body className="d-flex align-items-center">
            <div className="mr-3 bg-light p-3 rounded-circle">
              <FaEye className="text-warning" size={24} />
            </div>
            <div className="ml-3">
              <div className="h5 mb-0 font-weight-bold">{dashboardStats.interviews}</div>
              <div className="text-muted">Interviews</div>
            </div>
          </Card.Body>
        </Card>
      </Col>
      
      <Col md={3} sm={6}>
        <Card className="dashboard-stat-card border-0 shadow-sm h-100 border-left-success">
          <Card.Body className="d-flex align-items-center">
            <div className="mr-3 bg-light p-3 rounded-circle">
              <FaCheckCircle className="text-success" size={24} />
            </div>
            <div className="ml-3">
              <div className="h5 mb-0 font-weight-bold">{dashboardStats.hires}</div>
              <div className="text-muted">Hires</div>
            </div>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default EmployerDashboardStats;