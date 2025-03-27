import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Card, Button, Badge, Spinner, Alert, Modal, Form, ListGroup } from 'react-bootstrap';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { FaBuilding, FaMapMarkerAlt, FaMoneyBillWave, FaClock, FaBriefcase, FaCalendarAlt, FaFileAlt, FaShare, FaBookmark, FaCheckCircle, FaUsers, FaGraduationCap, FaLaptopCode } from 'react-icons/fa';
import '../components/styles/CustomStyles.css';

const JobDetail = () => {
  const { id } = useParams();
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [resumes, setResumes] = useState([]);
  const [selectedResume, setSelectedResume] = useState('');
  const [coverLetter, setCoverLetter] = useState('');
  const [applying, setApplying] = useState(false);
  const [applicationSuccess, setApplicationSuccess] = useState(false);
  const [applicationError, setApplicationError] = useState('');

  useEffect(() => {
    fetchJobDetails();
    if (currentUser && currentUser.role === 'candidate') {
      fetchResumes();
    }
  }, [id, currentUser]);

  const fetchJobDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.get(`/api/jobs/${id}/`);
      setJob(response.data);
    } catch (err) {
      console.error('Error fetching job details:', err);
      setError('Failed to load job details. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const fetchResumes = async () => {
    try {
      const response = await axios.get('/api/resumes/');
      setResumes(response.data);
      if (response.data.length > 0) {
        setSelectedResume(response.data[0].id);
      }
    } catch (err) {
      console.error('Error fetching resumes:', err);
    }
  };

  const handleApply = async (e) => {
    e.preventDefault();
    
    if (!currentUser) {
      navigate('/login', { state: { from: `/jobs/${id}` } });
      return;
    }
    
    if (currentUser.role !== 'candidate') {
      setApplicationError('Only candidates can apply for jobs.');
      return;
    }
    
    try {
      setApplying(true);
      setApplicationError('');
      
      await axios.post('/api/applications/', {
        job: id,
        resume: selectedResume,
        cover_letter: coverLetter
      });
      
      setApplicationSuccess(true);
      setTimeout(() => {
        setShowApplyModal(false);
        setApplicationSuccess(false);
      }, 2000);
    } catch (err) {
      console.error('Error applying for job:', err);
      setApplicationError(err.response?.data?.error || 'Failed to submit application. Please try again.');
    } finally {
      setApplying(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  };

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Loading job details...</p>
      </Container>
    );
  }
  
  if (error) {
    return (
      <Container className="py-5">
        <Alert variant="danger" className="rounded-lg border-0 shadow-sm">{error}</Alert>
        <div className="text-center mt-3">
          <Button as={Link} to="/jobs" variant="primary" className="rounded-pill px-4 hover-lift">
            Back to Jobs
          </Button>
        </div>
      </Container>
    );
  }
  
  if (!job) {
    return (
      <Container className="py-5">
        <Alert variant="warning" className="rounded-lg border-0 shadow-sm">Job not found.</Alert>
        <div className="text-center mt-3">
          <Button as={Link} to="/jobs" variant="primary" className="rounded-pill px-4 hover-lift">
            Browse Jobs
          </Button>
        </div>
      </Container>
    );
  }
  
  return (
    <Container className="py-5">
      <Row>
        <Col lg={8}>
          {/* Job Details Card */}
          <Card className="border-0 shadow-sm mb-4">
            <Card.Body className="p-4">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                  <h1 className="h3 mb-1">{job.title}</h1>
                  <div className="d-flex align-items-center text-muted">
                    <FaBuilding className="me-2" />
                    <span className="me-3">{job.company_name}</span>
                    <FaMapMarkerAlt className="me-2" />
                    <span>{job.location}</span>
                  </div>
                </div>
                <Badge bg="primary" className="px-3 py-2 rounded-pill">
                  {job.job_type}
                </Badge>
              </div>
              
              <div className="d-flex flex-wrap mb-4">
                {job.salary_range && (
                  <div className="me-4 mb-2">
                    <div className="text-muted small mb-1">Salary Range</div>
                    <div className="d-flex align-items-center">
                      <FaMoneyBillWave className="text-success me-2" />
                      <strong>{job.salary_range}</strong>
                    </div>
                  </div>
                )}
                
                <div className="me-4 mb-2">
                  <div className="text-muted small mb-1">Job Type</div>
                  <div className="d-flex align-items-center">
                    <FaClock className="text-primary me-2" />
                    <strong>{job.job_type}</strong>
                  </div>
                </div>
                
                {job.posted_date && (
                  <div className="mb-2">
                    <div className="text-muted small mb-1">Posted On</div>
                    <div className="d-flex align-items-center">
                      <FaCalendarAlt className="text-info me-2" />
                      <strong>{formatDate(job.posted_date)}</strong>
                    </div>
                  </div>
                )}
              </div>
              
              <h5 className="mb-3">Job Description</h5>
              <div className="mb-4">
                {job.description}
              </div>
              
              {job.responsibilities && (
                <div className="mb-4">
                  <h5 className="mb-3">Responsibilities</h5>
                  <ul className="list-unstyled">
                    {job.responsibilities.split('\n').map((item, index) => (
                      <li key={index} className="d-flex mb-2">
                        <FaCheckCircle className="text-success mt-1 me-2" />
                        <span>{item.trim()}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {job.requirements && (
                <div className="mb-4">
                  <h5 className="mb-3">Requirements</h5>
                  <ul className="list-unstyled">
                    {job.requirements.split('\n').map((item, index) => (
                      <li key={index} className="d-flex mb-2">
                        <FaCheckCircle className="text-primary mt-1 me-2" />
                        <span>{item.trim()}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              <div className="d-grid gap-2 d-md-flex justify-content-md-start mt-4">
                <Button 
                  variant="primary" 
                  size="lg" 
                  className="px-4 rounded-pill hover-lift"
                  onClick={() => setShowApplyModal(true)}
                >
                  Apply Now
                </Button>
                <Button 
                  variant="outline-primary" 
                  size="lg" 
                  className="px-4 rounded-pill hover-lift"
                >
                  <FaBookmark className="me-2" />
                  Save Job
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
        
        <Col lg={4}>
          {/* Company Info Card */}
          <Card className="border-0 shadow-sm mb-4">
            <Card.Body className="p-4">
              <h5 className="mb-3">Company Information</h5>
              <div className="d-flex align-items-center mb-3">
                <div className="bg-light p-3 rounded-circle me-3">
                  <FaBuilding size={24} className="text-primary" />
                </div>
                <div>
                  <h6 className="mb-0">{job.company_name}</h6>
                  <div className="text-muted small">{job.location}</div>
                </div>
              </div>
              
              {job.company_description && (
                <p className="text-muted mb-0">{job.company_description}</p>
              )}
            </Card.Body>
          </Card>
          
          {/* Job Overview Card */}
          <Card className="border-0 shadow-sm">
            <Card.Body className="p-4">
              <h5 className="mb-3">Job Overview</h5>
              <ListGroup variant="flush">
                <ListGroup.Item className="px-0 py-2 d-flex justify-content-between border-0">
                  <div className="d-flex align-items-center">
                    <FaCalendarAlt className="text-muted me-2" />
                    <span>Posted Date</span>
                  </div>
                  <span className="text-muted">{job.posted_date ? formatDate(job.posted_date) : 'N/A'}</span>
                </ListGroup.Item>
                
                <ListGroup.Item className="px-0 py-2 d-flex justify-content-between border-0">
                  <div className="d-flex align-items-center">
                    <FaUsers className="text-muted me-2" />
                    <span>Vacancy</span>
                  </div>
                  <span className="text-muted">{job.vacancy || 'Not specified'}</span>
                </ListGroup.Item>
                
                <ListGroup.Item className="px-0 py-2 d-flex justify-content-between border-0">
                  <div className="d-flex align-items-center">
                    <FaGraduationCap className="text-muted me-2" />
                    <span>Education</span>
                  </div>
                  <span className="text-muted">{job.education_level || 'Not specified'}</span>
                </ListGroup.Item>
                
                <ListGroup.Item className="px-0 py-2 d-flex justify-content-between border-0">
                  <div className="d-flex align-items-center">
                    <FaBriefcase className="text-muted me-2" />
                    <span>Experience</span>
                  </div>
                  <span className="text-muted">{job.experience || 'Not specified'}</span>
                </ListGroup.Item>
                
                <ListGroup.Item className="px-0 py-2 d-flex justify-content-between border-0">
                  <div className="d-flex align-items-center">
                    <FaLaptopCode className="text-muted me-2" />
                    <span>Job Type</span>
                  </div>
                  <span className="text-muted">{job.job_type}</span>
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      {/* Apply Modal */}
      <Modal show={showApplyModal} onHide={() => setShowApplyModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Apply for {job.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {!currentUser ? (
            <Alert variant="info">
              Please <Link to="/login">login</Link> to apply for this job.
            </Alert>
          ) : currentUser.role !== 'candidate' ? (
            <Alert variant="warning">
              Only candidates can apply for jobs.
            </Alert>
          ) : applicationSuccess ? (
            <Alert variant="success">
              <FaCheckCircle className="me-2" />
              Your application has been submitted successfully!
            </Alert>
          ) : (
            <Form onSubmit={handleApply}>
              {applicationError && (
                <Alert variant="danger">{applicationError}</Alert>
              )}
              
              <Form.Group className="mb-3">
                <Form.Label>Select Resume</Form.Label>
                {resumes.length === 0 ? (
                  <Alert variant="info">
                    You don't have any resumes. Please upload a resume in your dashboard first.
                  </Alert>
                ) : (
                  <Form.Select 
                    value={selectedResume} 
                    onChange={(e) => setSelectedResume(e.target.value)}
                    required
                  >
                    {resumes.map(resume => (
                      <option key={resume.id} value={resume.id}>{resume.title}</option>
                    ))}
                  </Form.Select>
                )}
              </Form.Group>
              
              <Form.Group className="mb-3">
                <Form.Label>Cover Letter</Form.Label>
                <Form.Control 
                  as="textarea" 
                  rows={5} 
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  placeholder="Explain why you're a good fit for this position..."
                />
              </Form.Group>
              
              <div className="d-grid">
                <Button 
                  variant="primary" 
                  type="submit" 
                  disabled={applying || resumes.length === 0}
                  className="rounded-pill hover-lift"
                >
                  {applying ? (
                    <>
                      <Spinner animation="border" size="sm" className="me-2" />
                      Submitting...
                    </>
                  ) : 'Submit Application'}
                </Button>
              </div>
            </Form>
          )}
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default JobDetail;