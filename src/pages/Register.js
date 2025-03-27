import React, { useState, useContext } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { FaUser, FaLock, FaEnvelope, FaUserTag, FaUserPlus } from 'react-icons/fa';
import '../components/styles/CustomStyles.css';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'candidate' // Default role
  });
  const [validated, setValidated] = useState(false);
  const [registerError, setRegisterError] = useState('');
  
  const { register, loading } = useContext(AuthContext);
  const navigate = useNavigate();
  
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
    
    if (formData.password !== formData.confirmPassword) {
      setRegisterError('Passwords do not match');
      return;
    }
    
    setRegisterError('');
    
    // Prepare data for API
    const userData = {
      username: formData.username,
      email: formData.email,
      password: formData.password,
      role: formData.role
    };
    
    const result = await register(userData);
    
    if (result.success) {
      navigate('/login', { state: { message: 'Registration successful! Please login.' } });
    } else {
      setRegisterError(result.error);
    }
  };
  
  return (
    <Container className="py-5 my-5">
      <Row className="justify-content-center">
        <Col md={8} lg={6} xl={5}>
          <Card className="border-0 shadow-sm rounded-lg overflow-hidden hover-lift">
            <div className="bg-primary text-white p-4 text-center">
              <FaUserPlus size={40} className="mb-3" />
              <h2 className="fw-bold mb-1">Create an Account</h2>
              <p className="mb-0">Join our platform to find your dream job</p>
            </div>
            <Card.Body className="p-5">
              {registerError && (
                <Alert variant="danger" className="rounded-pill border-0 shadow-sm mb-4">{registerError}</Alert>
              )}
              
              <Form noValidate validated={validated} onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">Username</Form.Label>
                  <div className="input-group shadow-sm rounded-pill overflow-hidden">
                    <span className="input-group-text bg-light border-0">
                      <FaUser className="text-primary" />
                    </span>
                    <Form.Control
                      type="text"
                      name="username"
                      placeholder="Choose a username"
                      value={formData.username}
                      onChange={handleChange}
                      required
                      className="border-0 py-2"
                    />
                    <Form.Control.Feedback type="invalid">
                      Please choose a username.
                    </Form.Control.Feedback>
                  </div>
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">Email</Form.Label>
                  <div className="input-group shadow-sm rounded-pill overflow-hidden">
                    <span className="input-group-text bg-light border-0">
                      <FaEnvelope className="text-primary" />
                    </span>
                    <Form.Control
                      type="email"
                      name="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="border-0 py-2"
                    />
                    <Form.Control.Feedback type="invalid">
                      Please enter a valid email address.
                    </Form.Control.Feedback>
                  </div>
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">Password</Form.Label>
                  <div className="input-group shadow-sm rounded-pill overflow-hidden">
                    <span className="input-group-text bg-light border-0">
                      <FaLock className="text-primary" />
                    </span>
                    <Form.Control
                      type="password"
                      name="password"
                      placeholder="Create a password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      minLength={6}
                      className="border-0 py-2"
                    />
                    <Form.Control.Feedback type="invalid">
                      Password must be at least 6 characters long.
                    </Form.Control.Feedback>
                  </div>
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">Confirm Password</Form.Label>
                  <div className="input-group shadow-sm rounded-pill overflow-hidden">
                    <span className="input-group-text bg-light border-0">
                      <FaLock className="text-primary" />
                    </span>
                    <Form.Control
                      type="password"
                      name="confirmPassword"
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                      className="border-0 py-2"
                    />
                    <Form.Control.Feedback type="invalid">
                      Please confirm your password.
                    </Form.Control.Feedback>
                  </div>
                </Form.Group>
                
                <Form.Group className="mb-4">
                  <Form.Label className="fw-bold">I am a</Form.Label>
                  <div className="input-group shadow-sm rounded-pill overflow-hidden">
                    <span className="input-group-text bg-light border-0">
                      <FaUserTag className="text-primary" />
                    </span>
                    <Form.Select
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                      required
                      className="border-0 py-2"
                    >
                      <option value="candidate">Job Seeker</option>
                      <option value="employer">Employer</option>
                    </Form.Select>
                  </div>
                </Form.Group>
                
                <div className="d-grid">
                  <Button 
                    variant="primary" 
                    type="submit" 
                    size="lg" 
                    disabled={loading}
                    className="rounded-pill py-3"
                  >
                    {loading ? (
                      <>
                        <Spinner as="span" animation="border" size="sm" className="me-2" />
                        Creating account...
                      </>
                    ) : (
                      'Create Account'
                    )}
                  </Button>
                </div>
              </Form>
              
              <div className="text-center mt-4">
                <p className="mb-0">
                  Already have an account? <Link to="/login" className="text-primary">Sign in</Link>
                </p>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Register;