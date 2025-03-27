import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner, Tabs, Tab } from 'react-bootstrap';
import { Navigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { FaUser, FaEnvelope, FaLock, FaBuilding, FaMapMarkerAlt, FaPhone, FaGlobe, FaFileUpload, FaCheckCircle } from 'react-icons/fa';

const Profile = () => {
  const { currentUser } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  
  // Profile data state
  const [profileData, setProfileData] = useState({
    username: '',
    email: '',
    first_name: '',
    last_name: '',
    phone: '',
    location: '',
    bio: ''
  });
  
  // Password change state
  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: ''
  });
  
  // Additional fields for candidates
  const [candidateData, setcandidateData] = useState({
    resume: null,
    skills: '',
    experience: '',
    education: ''
  });
  
  // Additional fields for employers
  const [employerData, setEmployerData] = useState({
    company_name: '',
    company_website: '',
    company_description: '',
    industry: ''
  });
  
  useEffect(() => {
    if (currentUser) {
      fetchProfileData();
    }
  }, [currentUser]);
  
  const fetchProfileData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.get('/api/profile/');
      
      // Update profile data
      setProfileData({
        username: response.data.username || '',
        email: response.data.email || '',
        first_name: response.data.first_name || '',
        last_name: response.data.last_name || '',
        phone: response.data.phone || '',
        location: response.data.location || '',
        bio: response.data.bio || ''
      });
      
      // Update role-specific data
      if (currentUser.role === 'candidate' && response.data.candidate_profile) {
        setcandidateData({
          skills: response.data.candidate_profile.skills || '',
          experience: response.data.candidate_profile.experience || '',
          education: response.data.candidate_profile.education || ''
        });
      } else if (currentUser.role === 'employer' && response.data.employer_profile) {
        setEmployerData({
          company_name: response.data.employer_profile.company_name || '',
          company_website: response.data.employer_profile.company_website || '',
          company_description: response.data.employer_profile.company_description || '',
          industry: response.data.employer_profile.industry || ''
        });
      }
    } catch (err) {
      console.error('Error fetching profile data:', err);
      setError('Failed to load profile data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
  
  // For development, use mock data
  useEffect(() => {
    if (!currentUser) return;
    
    // Mock data for development
    setProfileData({
      username: currentUser.username || 'username',
      email: currentUser.email || 'user@example.com',
      first_name: 'John',
      last_name: 'Doe',
      phone: '(123) 456-7890',
      location: 'San Francisco, CA',
      bio: 'Experienced professional with a passion for technology.'
    });
    
    if (currentUser.role === 'candidate') {
      setcandidateData({
        skills: 'JavaScript, React, Node.js, Python',
        experience: '5+ years of software development experience',
        education: 'Bachelor of Science in Computer Science'
      });
    } else if (currentUser.role === 'employer') {
      setEmployerData({
        company_name: 'Tech Innovations Inc.',
        company_website: 'www.techinnovations.com',
        company_description: 'A leading technology company focused on innovative solutions.',
        industry: 'Technology'
      });
    }
    
    setLoading(false);
  }, [currentUser]);
  
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData({
      ...profileData,
      [name]: value
    });
  };
  
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({
      ...passwordData,
      [name]: value
    });
  };
  
  const handleCandidateChange = (e) => {
    const { name, value } = e.target;
    setcandidateData({
      ...candidateData,
      [name]: value
    });
  };
  
  const handleEmployerChange = (e) => {
    const { name, value } = e.target;
    setEmployerData({
      ...employerData,
      [name]: value
    });
  };
  
  const handleResumeChange = (e) => {
    setcandidateData({
      ...candidateData,
      resume: e.target.files[0]
    });
  };
  
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setSaving(true);
      setError(null);
      setSuccess(false);
      
      // Prepare data based on user role
      let data = { ...profileData };
      
      if (currentUser.role === 'candidate') {
        data.candidate_profile = candidateData;
      } else if (currentUser.role === 'employer') {
        data.employer_profile = employerData;
      }
      
      await axios.put('/api/profile/', data);
      
      setSuccess(true);
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
      
    } catch (err) {
      console.error('Error updating profile:', err);
      setError(err.response?.data?.error || 'Failed to update profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };
  
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    if (passwordData.new_password !== passwordData.confirm_password) {
      setError('New passwords do not match');
      return;
    }
    
    try {
      setSaving(true);
      setError(null);
      setSuccess(false);
      
      await axios.post('/api/change-password/', {
        current_password: passwordData.current_password,
        new_password: passwordData.new_password
      });
      
      setSuccess(true);
      
      // Reset password fields
      setPasswordData({
        current_password: '',
        new_password: '',
        confirm_password: ''
      });
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
      
    } catch (err) {
      console.error('Error changing password:', err);
      setError(err.response?.data?.error || 'Failed to change password. Please try again.');
    } finally {
      setSaving(false);
    }
  };
  
  // Redirect if not logged in
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }
  
  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Loading profile data...</p>
      </Container>
    );
  }
  
  return (
    <Container className="py-5">
      <Row className="mb-4">
        <Col>
          <h1 className="mb-0">My Profile</h1>
          <p className="text-muted">Manage your account information</p>
        </Col>
      </Row>
      
      {error && (
        <Alert variant="danger" className="mb-4">{error}</Alert>
      )}
      
      {success && (
        <Alert variant="success" className="mb-4">
          <FaCheckCircle className="me-2" />
          Your changes have been saved successfully!
        </Alert>
      )}
      
      <Card className="border-0 shadow-sm mb-4">
        <Card.Body>
          <Tabs defaultActiveKey="profile" className="mb-4">
            <Tab eventKey="profile" title="Profile Information">
              <Form onSubmit={handleProfileSubmit}>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Username</Form.Label>
                      <div className="input-group">
                        <span className="input-group-text bg-light">
                          <FaUser />
                        </span>
                        <Form.Control
                          type="text"
                          name="username"
                          value={profileData.username}
                          onChange={handleProfileChange}
                          disabled
                        />
                      </div>
                      <Form.Text className="text-muted">
                        Username cannot be changed
                      </Form.Text>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Email</Form.Label>
                      <div className="input-group">
                        <span className="input-group-text bg-light">
                          <FaEnvelope />
                        </span>
                        <Form.Control
                          type="email"
                          name="email"
                          value={profileData.email}
                          onChange={handleProfileChange}
                          disabled
                        />
                      </div>
                      <Form.Text className="text-muted">
                        Email cannot be changed
                      </Form.Text>
                    </Form.Group>
                  </Col>
                </Row>
                
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>First Name</Form.Label>
                      <Form.Control
                        type="text"
                        name="first_name"
                        value={profileData.first_name}
                        onChange={handleProfileChange}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Last Name</Form.Label>
                      <Form.Control
                        type="text"
                        name="last_name"
                        value={profileData.last_name}
                        onChange={handleProfileChange}
                      />
                    </Form.Group>
                  </Col>
                </Row>
                
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Phone Number</Form.Label>
                      <div className="input-group">
                        <span className="input-group-text bg-light">
                          <FaPhone />
                        </span>
                        <Form.Control
                          type="text"
                          name="phone"
                          value={profileData.phone}
                          onChange={handleProfileChange}
                        />
                      </div>
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
                          value={profileData.location}
                          onChange={handleProfileChange}
                        />
                      </div>
                    </Form.Group>
                  </Col>
                </Row>
                
                <Form.Group className="mb-4">
                  <Form.Label>Bio</Form.Label>
                  <Form.Control
                    as="textarea"
                    name="bio"
                    value={profileData.bio}
                    onChange={handleProfileChange}
                    rows={3}
                  />
                </Form.Group>
                
                {/* Candidate-specific fields */}
                {currentUser.role === 'candidate' && (
                  <>
                    <h5 className="mb-3">Candidate Information</h5>
                    
                    <Form.Group className="mb-3">
                      <Form.Label>Resume/CV</Form.Label>
                      <div className="input-group">
                        <span className="input-group-text bg-light">
                          <FaFileUpload />
                        </span>
                        <Form.Control
                          type="file"
                          onChange={handleResumeChange}
                        />
                      </div>
                      <Form.Text className="text-muted">
                        Upload your resume in PDF format (max 5MB)
                      </Form.Text>
                    </Form.Group>
                    
                    <Form.Group className="mb-3">
                      <Form.Label>Skills</Form.Label>
                      <Form.Control
                        as="textarea"
                        name="skills"
                        value={candidateData.skills}
                        onChange={handleCandidateChange}
                        placeholder="List your key skills, separated by commas"
                        rows={2}
                      />
                    </Form.Group>
                    
                    <Form.Group className="mb-3">
                      <Form.Label>Experience</Form.Label>
                      <Form.Control
                        as="textarea"
                        name="experience"
                        value={candidateData.experience}
                        onChange={handleCandidateChange}
                        placeholder="Briefly describe your work experience"
                        rows={3}
                      />
                    </Form.Group>
                    
                    <Form.Group className="mb-4">
                      <Form.Label>Education</Form.Label>
                      <Form.Control
                        as="textarea"
                        name="education"
                        value={candidateData.education}
                        onChange={handleCandidateChange}
                        placeholder="Briefly describe your educational background"
                        rows={3}
                      />
                    </Form.Group>
                  </>
                )}
                
                {/* Employer-specific fields */}
                {currentUser.role === 'employer' && (
                  <>
                    <h5 className="mb-3">Company Information</h5>
                    
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Company Name</Form.Label>
                          <div className="input-group">
                            <span className="input-group-text bg-light">
                              <FaBuilding />
                            </span>
                            <Form.Control
                              type="text"
                              name="company_name"
                              value={employerData.company_name}
                              onChange={handleEmployerChange}
                            />
                          </div>
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Company Website</Form.Label>
                          <div className="input-group">
                            <span className="input-group-text bg-light">
                              <FaGlobe />
                            </span>
                            <Form.Control
                              type="text"
                              name="company_website"
                              value={employerData.company_website}
                              onChange={handleEmployerChange}
                            />
                          </div>
                        </Form.Group>
                      </Col>
                    </Row>
                    
                    <Form.Group className="mb-3">
                      <Form.Label>Industry</Form.Label>
                      <Form.Control
                        type="text"
                        name="industry"
                        value={employerData.industry}
                        onChange={handleEmployerChange}
                      />
                    </Form.Group>
                    
                    <Form.Group className="mb-4">
                      <Form.Label>Company Description</Form.Label>
                      <Form.Control
                        as="textarea"
                        name="company_description"
                        value={employerData.company_description}
                        onChange={handleEmployerChange}
                        rows={3}
                      />
                    </Form.Group>
                  </>
                )}
                
                <div className="d-grid gap-2">
                  <Button 
                    variant="primary" 
                    type="submit" 
                    disabled={saving}
                  >
                    {saving ? (
                      <>
                        <Spinner as="span" animation="border" size="sm" className="me-2" />
                        Saving Changes...
                      </>
                    ) : (
                      'Save Changes'
                    )}
                  </Button>
                </div>
              </Form>
            </Tab>
            
            <Tab eventKey="password" title="Change Password">
              <Form onSubmit={handlePasswordSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Current Password</Form.Label>
                  <div className="input-group">
                    <span className="input-group-text bg-light">
                      <FaLock />
                    </span>
                    <Form.Control
                      type="password"
                      name="current_password"
                      value={passwordData.current_password}
                      onChange={handlePasswordChange}
                      required
                    />
                  </div>
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>New Password</Form.Label>
                  <div className="input-group">
                    <span className="input-group-text bg-light">
                      <FaLock />
                    </span>
                    <Form.Control
                      type="password"
                      name="new_password"
                      value={passwordData.new_password}
                      onChange={handlePasswordChange}
                      required
                      minLength="6"
                    />
                  </div>
                  <Form.Text className="text-muted">
                    Password must be at least 6 characters long
                  </Form.Text>
                </Form.Group>
                
                <Form.Group className="mb-4">
                  <Form.Label>Confirm New Password</Form.Label>
                  <div className="input-group">
                    <span className="input-group-text bg-light">
                      <FaLock />
                    </span>
                    <Form.Control
                      type="password"
                      name="confirm_password"
                      value={passwordData.confirm_password}
                      onChange={handlePasswordChange}
                      required
                    />
                  </div>
                </Form.Group>
                
                <div className="d-grid gap-2">
                  <Button 
                    variant="primary" 
                    type="submit" 
                    disabled={saving}
                  >
                    {saving ? (
                      <>
                        <Spinner as="span" animation="border" size="sm" className="me-2" />
                        Updating Password...
                      </>
                    ) : (
                      'Update Password'
                    )}
                  </Button>
                </div>
              </Form>
            </Tab>
          </Tabs>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Profile;