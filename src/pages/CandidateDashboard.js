import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Card, Table, Badge, Button, Tabs, Tab, Alert, Spinner, Modal, Form } from 'react-bootstrap';
import { Link, Navigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { FaFileUpload, FaEye, FaTrash, FaFileAlt, FaBuilding, FaMapMarkerAlt, FaCalendarAlt, FaCheckCircle } from 'react-icons/fa';

const CandidateDashboard = () => {
  const { currentUser } = useContext(AuthContext);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showResumeModal, setShowResumeModal] = useState(false);
  const [resumeTitle, setResumeTitle] = useState('');
  const [resumeFile, setResumeFile] = useState(null);
  const [uploadingResume, setUploadingResume] = useState(false);
  const [uploadError, setUploadError] = useState('');
  
  useEffect(() => {
    if (currentUser && currentUser.role === 'candidate') {
      fetchDashboardData();
    }
  }, [currentUser]);
  
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.get('/api/candidate/dashboard/');
      setDashboardData(response.data);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load dashboard data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleResumeUpload = async (e) => {
    e.preventDefault();
    
    if (!resumeFile) {
      setUploadError('Please select a file to upload');
      return;
    }
    
    try {
      setUploadingResume(true);
      setUploadError('');
      
      const formData = new FormData();
      formData.append('title', resumeTitle);
      formData.append('file', resumeFile);
      
      await axios.post('/api/resumes/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      // Refresh dashboard data
      fetchDashboardData();
      
      // Reset form and close modal
      setResumeTitle('');
      setResumeFile(null);
      setShowResumeModal(false);
    } catch (err) {
      console.error('Error uploading resume:', err);
      setUploadError(err.response?.data?.error || 'Failed to upload resume. Please try again.');
    } finally {
      setUploadingResume(false);
    }
  };
  
  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setResumeFile(e.target.files[0]);
    }
  };
  
  // Redirect if not logged in or not a candidate
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }
  
  if (currentUser.role !== 'candidate') {
    return <Navigate to="/" replace />;
  }
  
  const getStatusBadge = (status) => {
    const statusMap = {
      'pending': 'warning',
      'reviewed': 'primary',
      'shortlisted': 'info',
      'rejected': 'danger',
      'interview': 'primary',
      'offered': 'success',
      'hired': 'success'
    };
    
    return (
      <Badge bg={statusMap[status] || 'secondary'}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };
  
  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Loading dashboard data...</p>
      </Container>
    );
  }
  
  if (error) {
    return (
      <Container className="py-5">
        <Alert variant="danger">{error}</Alert>
        <div className="text-center mt-3">
          <Button variant="primary" onClick={fetchDashboardData}>
            Try Again
          </Button>
        </div>
      </Container>
    );
  }
  
  // Use the data from the API
  const data = dashboardData || {
    applications: [],
    resumes: [],
    stats: {
      total_applications: 0,
      pending_applications: 0,
      reviewed_applications: 0,
      interview_applications: 0
    }
  };
  
  return (
    <Container className="py-5">
      <Row className="mb-4">
        <Col>
          <h1 className="mb-0">Candidate Dashboard</h1>
        </Col>
      </Row>
      
      {/* Stats Cards */}
      <Row className="mb-4">
        <Col md={3} className="mb-3 mb-md-0">
          <Card className="border-0 shadow-sm h-100">
            <Card.Body className="text-center">
              <div className="display-4 text-primary mb-2">{data.stats.total_applications}</div>
              <div className="text-muted">Total Applications</div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} className="mb-3 mb-md-0">
          <Card className="border-0 shadow-sm h-100">
            <Card.Body className="text-center">
              <div className="display-4 text-warning mb-2">{data.stats.pending_applications}</div>
              <div className="text-muted">Pending</div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} className="mb-3 mb-md-0">
          <Card className="border-0 shadow-sm h-100">
            <Card.Body className="text-center">
              <div className="display-4 text-info mb-2">{data.stats.reviewed_applications}</div>
              <div className="text-muted">Reviewed</div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} className="mb-3 mb-md-0">
          <Card className="border-0 shadow-sm h-100">
            <Card.Body className="text-center">
              <div className="display-4 text-primary mb-2">{data.stats.interview_applications}</div>
              <div className="text-muted">Interview</div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Body className="text-center">
              <div className="display-4 text-success mb-2">{data.resumes.filter(r => r.is_active).length}</div>
              <div className="text-muted">Active Resumes</div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      {/* Main Content */}
      <Card className="border-0 shadow-sm">
        <Card.Body>
          <Tabs defaultActiveKey="applications" className="mb-4">
            <Tab eventKey="applications" title="My Applications">
              {data.applications.length === 0 ? (
                <Alert variant="info">
                  You haven't applied to any jobs yet. <Link to="/jobs">Browse jobs</Link>
                </Alert>
              ) : (
                <Table responsive hover>
                  <thead>
                    <tr>
                      <th>Job Title</th>
                      <th>Company</th>
                      <th>Location</th>
                      <th>Applied Date</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.applications.map(application => (
                      <tr key={application.id}>
                        <td>
                          <Link to={`/jobs/${application.job.id}`} className="text-decoration-none fw-bold">
                            {application.job.title}
                          </Link>
                        </td>
                        <td>{application.job.employer.username}</td>
                        <td>{application.job.location}</td>
                        <td>{formatDate(application.application_date)}</td>
                        <td>{getStatusBadge(application.status)}</td>
                        <td>
                          <Button 
                            as={Link} 
                            to={`/jobs/${application.job.id}`}
                            variant="outline-primary" 
                            size="sm" 
                            className="rounded-pill me-2"
                          >
                            <FaEye size={14} />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </Tab>
            
            <Tab eventKey="resumes" title="My Resumes">
              <div className="d-flex justify-content-end mb-3">
                <Button 
                  variant="primary" 
                  className="rounded-pill hover-lift"
                  onClick={() => setShowResumeModal(true)}
                >
                  <FaFileUpload className="me-2" />
                  Upload Resume
                </Button>
              </div>
              
              {data.resumes.length === 0 ? (
                <Alert variant="info">
                  You haven't uploaded any resumes yet. Upload a resume to apply for jobs.
                </Alert>
              ) : (
                <Row>
                  {data.resumes.map(resume => (
                    <Col md={6} lg={4} key={resume.id} className="mb-4">
                      <Card className="h-100 border-0 shadow-sm hover-lift">
                        <Card.Body>
                          <div className="d-flex justify-content-between mb-3">
                            <div className="bg-light p-3 rounded-circle">
                              <FaFileAlt className="text-primary" size={24} />
                            </div>
                            <Badge 
                              bg={resume.is_active ? 'success' : 'secondary'} 
                              className="px-3 py-2 rounded-pill"
                            >
                              {resume.is_active ? 'Active' : 'Inactive'}
                            </Badge>
                          </div>
                          
                          <Card.Title className="h5 mb-1">{resume.title}</Card.Title>
                          <Card.Subtitle className="mb-3 text-muted small">
                            <FaCalendarAlt className="me-1" size={12} />
                            {formatDate(resume.upload_date)}
                          </Card.Subtitle>
                          
                          <div className="d-flex mt-3">
                            <Button 
                              variant="outline-primary" 
                              size="sm" 
                              className="me-2 rounded-pill"
                              as="a" 
                              href={resume.file} 
                              target="_blank"
                            >
                              <FaEye className="me-1" size={12} />
                              View
                            </Button>
                            <Button 
                              variant="outline-danger" 
                              size="sm" 
                              className="rounded-pill"
                            >
                              <FaTrash className="me-1" size={12} />
                              Delete
                            </Button>
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>
                  ))}
                </Row>
              )}
            </Tab>
          </Tabs>
        </Card.Body>
      </Card>
      
      {/* Resume Upload Modal */}
      <Modal show={showResumeModal} onHide={() => setShowResumeModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Upload Resume</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {uploadError && (
            <Alert variant="danger">{uploadError}</Alert>
          )}
          
          <Form onSubmit={handleResumeUpload}>
            <Form.Group className="mb-3">
              <Form.Label>Resume Title</Form.Label>
              <Form.Control 
                type="text" 
                value={resumeTitle}
                onChange={(e) => setResumeTitle(e.target.value)}
                placeholder="e.g. Software Developer Resume"
                required
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Resume File</Form.Label>
              <Form.Control 
                type="file" 
                onChange={handleFileChange}
                accept=".pdf,.doc,.docx"
                required
              />
              <Form.Text className="text-muted">
                Accepted formats: PDF, DOC, DOCX
              </Form.Text>
            </Form.Group>
            
            <div className="d-grid">
              <Button 
                variant="primary" 
                type="submit" 
                disabled={uploadingResume}
                className="rounded-pill hover-lift"
              >
                {uploadingResume ? (
                  <>
                    <Spinner animation="border" size="sm" className="me-2" />
                    Uploading...
                  </>
                ) : 'Upload Resume'}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
};

export default CandidateDashboard;