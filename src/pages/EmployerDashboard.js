import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Card, Table, Badge, Button, Tabs, Tab, Alert, Spinner, Modal, Form } from 'react-bootstrap';
import { Link, Navigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { FaPlus, FaEye, FaEdit, FaTrash, FaBuilding, FaMapMarkerAlt, FaCalendarAlt, FaUsers, FaFileAlt, FaCheckCircle, FaUser } from 'react-icons/fa';

const EmployerDashboard = () => {
  const { currentUser } = useContext(AuthContext);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [jobToDelete, setJobToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  
  useEffect(() => {
    if (currentUser && currentUser.role === 'employer') {
      fetchDashboardData();
    }
  }, [currentUser]);
  
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.get('/api/employer/dashboard/');
      setDashboardData(response.data);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load dashboard data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleDeleteJob = async () => {
    if (!jobToDelete) return;
    
    try {
      setDeleteLoading(true);
      
      await axios.delete(`/api/jobs/${jobToDelete}/`);
      
      // Refresh dashboard data
      fetchDashboardData();
      
      // Close modal
      setShowDeleteModal(false);
      setJobToDelete(null);
    } catch (err) {
      console.error('Error deleting job:', err);
      setError('Failed to delete job. Please try again later.');
    } finally {
      setDeleteLoading(false);
    }
  };
  
  // Redirect if not logged in or not an employer
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }
  
  if (currentUser.role !== 'employer') {
    return <Navigate to="/" replace />;
  }
  
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
  
  // Mock data for development (remove when API is ready)
  const mockDashboardData = {
    jobs: [
      {
        id: 1,
        title: 'Senior Software Engineer',
        location: 'San Francisco, CA',
        job_type: 'Full-time',
        status: 'active',
        created_at: '2023-06-10T00:00:00Z',
        applications_count: 12
      },
      {
        id: 2,
        title: 'Product Manager',
        location: 'Remote',
        job_type: 'Full-time',
        status: 'active',
        created_at: '2023-06-05T00:00:00Z',
        applications_count: 8
      },
      {
        id: 3,
        title: 'UX Designer',
        location: 'New York, NY',
        job_type: 'Contract',
        status: 'closed',
        created_at: '2023-05-20T00:00:00Z',
        applications_count: 15
      }
    ],
    applications: [
      {
        id: 1,
        job: {
          id: 1,
          title: 'Senior Software Engineer'
        },
        candidate: {
          id: 101,
          username: 'johndoe',
          email: 'john@example.com'
        },
        status: 'pending',
        application_date: '2023-06-15T00:00:00Z'
      },
      {
        id: 2,
        job: {
          id: 1,
          title: 'Senior Software Engineer'
        },
        candidate: {
          id: 102,
          username: 'janesmith',
          email: 'jane@example.com'
        },
        status: 'shortlisted',
        application_date: '2023-06-12T00:00:00Z'
      },
      {
        id: 3,
        job: {
          id: 2,
          title: 'Product Manager'
        },
        candidate: {
          id: 103,
          username: 'mikebrown',
          email: 'mike@example.com'
        },
        status: 'interview',
        application_date: '2023-06-08T00:00:00Z'
      }
    ],
    stats: {
      total_jobs: 3,
      active_jobs: 2,
      total_applications: 35,
      new_applications: 10
    }
  };
  
  // Use mock data for development
  const data = dashboardData || mockDashboardData;
  
  const getStatusBadge = (status) => {
    const statusMap = {
      'active': 'success',
      'draft': 'secondary',
      'closed': 'danger',
      'pending': 'warning',
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
  
  return (
    <Container className="py-5">
      <Row className="mb-4">
        <Col>
          <h1 className="mb-0">Employer Dashboard</h1>
        </Col>
        <Col xs="auto">
          <Button as={Link} to="/employer/post-job" variant="primary">
            <FaPlus className="me-2" />
            Post New Job
          </Button>
        </Col>
      </Row>
      
      {/* Stats Cards */}
      <Row className="mb-4">
        <Col md={3} className="mb-3 mb-md-0">
          <Card className="border-0 shadow-sm h-100">
            <Card.Body className="text-center">
              <div className="display-4 text-primary mb-2">{data.stats.total_jobs}</div>
              <div className="text-muted">Total Jobs</div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} className="mb-3 mb-md-0">
          <Card className="border-0 shadow-sm h-100">
            <Card.Body className="text-center">
              <div className="display-4 text-success mb-2">{data.stats.active_jobs}</div>
              <div className="text-muted">Active Jobs</div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} className="mb-3 mb-md-0">
          <Card className="border-0 shadow-sm h-100">
            <Card.Body className="text-center">
              <div className="display-4 text-info mb-2">{data.stats.total_applications}</div>
              <div className="text-muted">Total Applications</div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Body className="text-center">
              <div className="display-4 text-warning mb-2">{data.stats.new_applications}</div>
              <div className="text-muted">New Applications</div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      {/* Main Content */}
      <Card className="border-0 shadow-sm">
        <Card.Body>
          <Tabs defaultActiveKey="jobs" className="mb-4">
            <Tab eventKey="jobs" title="My Jobs">
              {data.jobs.length === 0 ? (
                <Alert variant="info">
                  You haven't posted any jobs yet. <Link to="/employer/post-job">Post a job</Link>
                </Alert>
              ) : (
                <Table responsive hover>
                  <thead>
                    <tr>
                      <th>Job Title</th>
                      <th>Location</th>
                      <th>Type</th>
                      <th>Posted Date</th>
                      <th>Status</th>
                      <th>Applications</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.jobs.map((job) => (
                      <tr key={job.id}>
                        <td>
                          <Link to={`/jobs/${job.id}`} className="text-decoration-none fw-bold">
                            {job.title}
                          </Link>
                        </td>
                        <td>
                          <FaMapMarkerAlt className="text-muted me-1" />
                          {job.location}
                        </td>
                        <td>{job.job_type}</td>
                        <td>
                          <FaCalendarAlt className="text-muted me-1" />
                          {new Date(job.created_at).toLocaleDateString()}
                        </td>
                        <td>{getStatusBadge(job.status)}</td>
                        <td>
                          <Badge bg="secondary" pill>
                            {job.applications_count}
                          </Badge>
                        </td>
                        <td>
                          <div className="d-flex gap-2">
                            <Button 
                              as={Link} 
                              to={`/jobs/${job.id}`} 
                              variant="outline-primary" 
                              size="sm"
                              title="View Job"
                            >
                              <FaEye />
                            </Button>
                            <Button 
                              as={Link} 
                              to={`/employer/edit-job/${job.id}`} 
                              variant="outline-secondary" 
                              size="sm"
                              title="Edit Job"
                            >
                              <FaEdit />
                            </Button>
                            <Button 
                              variant="outline-danger" 
                              size="sm"
                              title="Delete Job"
                              onClick={() => {
                                setJobToDelete(job.id);
                                setShowDeleteModal(true);
                              }}
                            >
                              <FaTrash />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </Tab>
            
            <Tab eventKey="applications" title="Recent Applications">
              {data.applications.length === 0 ? (
                <Alert variant="info">
                  No applications received yet.
                </Alert>
              ) : (
                <Table responsive hover>
                  <thead>
                    <tr>
                      <th>Candidate</th>
                      <th>Job Position</th>
                      <th>Applied Date</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.applications.map((application) => (
                      <tr key={application.id}>
                        <td>
                          <div className="d-flex align-items-center">
                            <div className="bg-light rounded-circle p-2 me-2">
                              <FaUser className="text-primary" />
                            </div>
                            <div>
                              <div className="fw-bold">{application.candidate.username}</div>
                              <div className="small text-muted">{application.candidate.email}</div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <Link to={`/jobs/${application.job.id}`} className="text-decoration-none">
                            {application.job.title}
                          </Link>
                        </td>
                        <td>
                          <FaCalendarAlt className="text-muted me-1" />
                          {new Date(application.application_date).toLocaleDateString()}
                        </td>
                        <td>{getStatusBadge(application.status)}</td>
                        <td>
                          <Button 
                            as={Link} 
                            to={`/employer/applications/${application.id}`} 
                            variant="outline-primary" 
                            size="sm"
                          >
                            <FaEye className="me-1" />
                            View Details
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </Tab>
          </Tabs>
        </Card.Body>
      </Card>
      
      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this job? This action cannot be undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button 
            variant="danger" 
            onClick={handleDeleteJob}
            disabled={deleteLoading}
          >
            {deleteLoading ? (
              <>
                <Spinner as="span" animation="border" size="sm" className="me-2" />
                Deleting...
              </>
            ) : (
              'Delete Job'
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default EmployerDashboard;