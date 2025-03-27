import React, { useState, useContext } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { FaUser, FaLock, FaSignInAlt } from 'react-icons/fa';
import '../components/styles/CustomStyles.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [validated, setValidated] = useState(false);
  const [loginError, setLoginError] = useState('');
  
  const { login, loading } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Check if we were redirected from another page
  const from = location.state?.from || '/';
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    
    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }
    
    setLoginError('');
    const result = await login(username, password);
    
    if (result.success) {
      navigate(from, { replace: true });
    } else {
      setLoginError(result.error);
    }
  };
  
  return (
    <Container className="py-5 my-5">
      <Row className="justify-content-center">
        <Col md={8} lg={6} xl={5}>
          <Card className="border-0 shadow-sm rounded-lg overflow-hidden hover-lift">
            <div className="bg-primary text-white p-4 text-center">
              <FaSignInAlt size={40} className="mb-3" />
              <h2 className="fw-bold mb-1">Welcome Back</h2>
              <p className="mb-0">Sign in to your account</p>
            </div>
            <Card.Body className="p-5">
              {loginError && (
                <Alert variant="danger" className="rounded-pill border-0 shadow-sm mb-4">{loginError}</Alert>
              )}
              
              <Form noValidate validated={validated} onSubmit={handleSubmit}>
                <Form.Group className="mb-4">
                  <Form.Label className="fw-bold">Username</Form.Label>
                  <div className="input-group shadow-sm rounded-pill overflow-hidden">
                    <span className="input-group-text bg-light border-0">
                      <FaUser className="text-primary" />
                    </span>
                    <Form.Control
                      type="text"
                      placeholder="Enter your username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                      className="border-0 py-2"
                    />
                    <Form.Control.Feedback type="invalid">
                      Please enter your username.
                    </Form.Control.Feedback>
                  </div>
                </Form.Group>
                
                <Form.Group className="mb-4">
                  <Form.Label className="fw-bold">Password</Form.Label>
                  <div className="input-group shadow-sm rounded-pill overflow-hidden">
                    <span className="input-group-text bg-light border-0">
                      <FaLock className="text-primary" />
                    </span>
                    <Form.Control
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="border-0 py-2"
                    />
                    <Form.Control.Feedback type="invalid">
                      Please enter your password.
                    </Form.Control.Feedback>
                  </div>
                </Form.Group>
                
                <div className="d-grid mt-5">
                  <Button 
                    variant="primary" 
                    type="submit" 
                    size="lg" 
                    disabled={loading}
                    className="rounded-pill hover-lift"
                  >
                    {loading ? (
                      <>
                        <Spinner
                          as="span"
                          animation="border"
                          size="sm"
                          role="status"
                          aria-hidden="true"
                          className="me-2"
                        />
                        Signing in...
                      </>
                    ) : (
                      'Sign In'
                    )}
                  </Button>
                </div>
              </Form>
              
              <div className="text-center mt-4">
                <p className="mb-0">
                  Don't have an account? <Link to="/register" className="text-primary fw-bold">Sign up</Link>
                </p>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;