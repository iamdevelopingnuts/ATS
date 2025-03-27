import React from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import { FaBriefcase, FaCheckCircle, FaBookmark, FaFileAlt } from 'react-icons/fa';

const CandidateDashboardStats = ({ stats }) => {
  // Default values if stats are not provided
  const defaultStats = {
    applications: 0,
    interviews: 0,
    savedJobs: 0,
    resumes: 0
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
              <div className="h5 mb-0 font-weight-bold">{dashboardStats.applications}</div>
              <div className="text-muted">Applications</div>
            </div>
          </Card.Body>
        </Card>
      </Col>
      
      <Col md={3} sm={6} className="mb-4 mb-md-0">
        <Card className="dashboard-stat-card border-0 shadow-sm h-100 border-left-success">
          <Card.Body className="d-flex align-items-center">
            <div className="mr-3 bg-light p-3 rounded-circle">
              <FaCheckCircle className="text-success" size={24} />
            </div>
            <div className="ml-3">
              <div className="h5 mb-0 font-weight-bold">{dashboardStats.interviews}</div>
              <div className="text-muted">Interviews</div>
            </div>
          </Card.Body>
        </Card>
      </Col>
      
      <Col md={3} sm={6} className="mb-4 mb-md-0">
        <Card className="dashboard-stat-card border-0 shadow-sm h-100 border-left-info">
          <Card.Body className="d-flex align-items-center">
            <div className="mr-3 bg-light p-3 rounded-circle">
              <FaBookmark className="text-info" size={24} />
            </div>
            <div className="ml-3">
              <div className="h5 mb-0 font-weight-bold">{dashboardStats.savedJobs}</div>
              <div className="text-muted">Saved Jobs</div>
            </div>
          </Card.Body>
        </Card>
      </Col>
      
      <Col md={3} sm={6}>
        <Card className="dashboard-stat-card border-0 shadow-sm h-100 border-left-warning">
          <Card.Body className="d-flex align-items-center">
            <div className="mr-3 bg-light p-3 rounded-circle">
              <FaFileAlt className="text-warning" size={24} />
            </div>
            <div className="ml-3">
              <div className="h5 mb-0 font-weight-bold">{dashboardStats.resumes}</div>
              <div className="text-muted">Resumes</div>
            </div>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default CandidateDashboardStats;