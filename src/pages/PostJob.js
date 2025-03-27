import React, { useState, useContext } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { Navigate, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { FaBriefcase, FaMapMarkerAlt, FaMoneyBillWave, FaCalendarAlt, FaList, FaCheckCircle } from 'react-icons/fa';

const PostJob = () => {
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    title: '',
    company_name: '',
    location: '',
    job_type: 'Full-time',
    salary_range: '',
    description: '',
    requirements: '',
    benefits: '',
    application_deadline: ''
  });
  
  const [validated, setValidated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  // Redirect if not logged in or not an employer
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }
  
  if (currentUser.role !== 'employer') {
    return <Navigate to="/" replace />;
  }
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    
    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      
      await axios.post('/api/jobs/', formData);
      
      setSuccess(true);
      
      // Reset form
      setFormData({
        title: '',
        company_name: '',
        location: '',
        job_type: 'Full-time',
        salary_range: '',
        description: '',
        requirements: '',
        benefits: '',
        application_deadline: ''
      });
      
      setValidated(false);
      
      // Redirect to employer dashboard after 2 seconds
      setTimeout(() => {
        navigate('/employer/dashboard');
      }, 2000);
      
    } catch (err) {
      console.error('Error posting job:', err);
      setError(err.response?.data?.error || 'Failed to post job. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col lg={8}>
          <Card className="border-0 shadow-sm">
            <Card.Body className="p-4 p-md-5">
              <div className="text-center mb-4">
                <h2 className="fw-bold">Post a New Job</h2>
                <p className="text-muted">Fill in the details to create a new job listing</p>
              </div>
              
              {error && (
                <Alert variant="danger" className="mb-4">{error}</Alert>
              )}
              
              {success && (
                <Alert variant="success" className="mb-4">
                  <FaCheckCircle className="me-2" />
                  Job posted successfully! Redirecting to dashboard...
                </Alert>
              )}
              
              <Form noValidate validated={validated} onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Job Title</Form.Label>
                  <div className="input-group">
                    <span className="input-group-text bg-light">
                      <FaBriefcase />
                    </span>
                    <Form.Control
                      type="text"
                      name="title"
                      placeholder="e.g. Senior Software Engineer"
                      value={formData.title}
                      onChange={handleChange}
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                      Please provide a job title.
                    </Form.Control.Feedback>
                  </div>
                </Form.Group>
                
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Company Name</Form.Label>
                      <Form.Control
                        type="text"
                        name="company_name"
                        placeholder="e.g. Tech Company Inc."
                        value={formData.company_name}
                        onChange={handleChange}
                        required
                      />
                      <Form.Control.Feedback type="invalid">
                        Please provide a company name.
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Location</Form.Label>
                      <div className="input-group">
                        <span className="input-group-text bg-light">
                          <FaMapMarkerAlt />
                        </span>
                        <Form.Control
                          type="text"
                          name="location"
                          placeholder="e.g. San Francisco, CA or Remote"
                          value={formData.location}
                          onChange={handleChange}
                          required
                        />
                        <Form.Control.Feedback type="invalid">
                          Please provide a location.
                        </Form.Control.Feedback>
                      </div>
                    </Form.Group>
                  </Col>
                </Row>
                
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Job Type</Form.Label>
                      <Form.Select
                        name="job_type"
                        value={formData.job_type}
                        onChange={handleChange}
                        required
                      >
                        <option value="Full-time">Full-time</option>
                        <option value="Part-time">Part-time</option>
                        <option value="Contract">Contract</option>
                        <option value="Freelance">Freelance</option>
                        <option value="Internship">Internship</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Salary Range</Form.Label>
                      <div className="input-group">
                        <span className="input-group-text bg-light">
                          <FaMoneyBillWave />
                        </span>
                        <Form.Control
                          type="text"
                          name="salary_range"
                          placeholder="e.g. $80,000 - $100,000 or Competitive"
                          value={formData.salary_range}
                          onChange={handleChange}
                        />
                      </div>
                    </Form.Group>
                  </Col>
                </Row>
                
                <Form.Group className="mb-3">
                  <Form.Label>Job Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    name="description"
                    placeholder="Provide a detailed description of the job..."
                    value={formData.description}
                    onChange={handleChange}
                    rows={5}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    Please provide a job description.
                  </Form.Control.Feedback>
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>Requirements</Form.Label>
                  <div className="input-group">
                    <span className="input-group-text bg-light">
                      <FaList />
                    </span>
                    <Form.Control
                      as="textarea"
                      name="requirements"
                      placeholder="List the requirements and qualifications..."
                      value={formData.requirements}
                      onChange={handleChange}
                      rows={4}
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                      Please provide job requirements.
                    </Form.Control.Feedback>
                  </div>
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>Benefits (Optional)</Form.Label>
                  <Form.Control
                    as="textarea"
                    name="benefits"
                    placeholder="List the benefits and perks..."
                    value={formData.benefits}
                    onChange={handleChange}
                    rows={3}
                  />
                </Form.Group>
                
                <Form.Group className="mb-4">
                  <Form.Label>Application Deadline</Form.Label>
                  <div className="input-group">
                    <span className="input-group-text bg-light">
                      <FaCalendarAlt />
                    </span>
                    <Form.Control
                      type="date"
                      name="application_deadline"
                      value={formData.application_deadline}
                      onChange={handleChange}
                    />
                  </div>
                </Form.Group>
                
                <div className="d-grid gap-2">
                  <Button 
                    variant="primary" 
                    type="submit" 
                    size="lg" 
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Spinner as="span" animation="border" size="sm" className="me-2" />
                        Posting Job...
                      </>
                    ) : (
                      'Post Job'
                    )}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default PostJob;