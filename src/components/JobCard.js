import React from 'react';
import { Card, Badge, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaBuilding, FaMapMarkerAlt, FaMoneyBillWave, FaClock } from 'react-icons/fa';

const JobCard = ({ job, className = '' }) => {
  // Format date to readable format
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  };

  // Get badge variant based on job type
  const getJobTypeBadge = (type) => {
    const typeMap = {
      'Full-time': 'primary',
      'Part-time': 'info',
      'Contract': 'warning',
      'Freelance': 'secondary',
      'Internship': 'success'
    };
    return typeMap[type] || 'primary';
  };

  return (
    <Card className={`h-100 border-0 shadow-sm hover-lift ${className}`}>
      <Card.Body>
        <div className="d-flex justify-content-between mb-3">
          <div className="bg-light p-2 rounded-circle">
            <FaBuilding size={24} className="text-primary" />
          </div>
          <Badge 
            bg={getJobTypeBadge(job.job_type)} 
            className="px-3 py-2 rounded-pill"
          >
            {job.job_type}
          </Badge>
        </div>
        
        <Card.Title className="h5 fw-bold mb-1">{job.title}</Card.Title>
        <Card.Subtitle className="mb-2 text-muted">{job.company_name}</Card.Subtitle>
        
        <div className="d-flex align-items-center mb-2">
          <FaMapMarkerAlt className="text-muted me-2" size={14} />
          <small className="text-muted">{job.location}</small>
        </div>
        
        {job.salary_range && (
          <div className="d-flex align-items-center mb-2">
            <FaMoneyBillWave className="text-muted me-2" size={14} />
            <small className="text-muted">{job.salary_range}</small>
          </div>
        )}
        
        {job.application_deadline && (
          <div className="d-flex align-items-center mb-3">
            <FaClock className="text-muted me-2" size={14} />
            <small className="text-muted">Deadline: {formatDate(job.application_deadline)}</small>
          </div>
        )}
        
        <Card.Text className="text-truncate-3 mb-3">
          {job.description}
        </Card.Text>
      </Card.Body>
      
      <Card.Footer className="bg-white border-0 pt-0">
        <div className="d-grid">
          <Button 
            as={Link} 
            to={`/jobs/${job.id}`} 
            variant="outline-primary" 
            className="rounded-pill"
          >
            View Details
          </Button>
        </div>
      </Card.Footer>
    </Card>
  );
};

export default JobCard;