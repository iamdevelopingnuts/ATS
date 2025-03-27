import React, { useContext } from 'react';
import { Navbar, Nav, Container, Button, NavDropdown } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { FaUserCircle, FaBriefcase, FaSignOutAlt } from 'react-icons/fa';

const Header = () => {
  const { currentUser, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <Navbar bg="white" expand="lg" className="shadow-sm py-3 mb-4">
      <Container>
        <Navbar.Brand as={Link} to="/" className="fw-bold text-primary">
          <FaBriefcase className="me-2" />
          ATS System
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">Home</Nav.Link>
            <Nav.Link as={Link} to="/jobs">Browse Jobs</Nav.Link>
          </Nav>
          <Nav>
            {currentUser ? (
              <>
                {currentUser.role === 'employer' && (
                  <NavDropdown title="Employer" id="employer-dropdown">
                    <NavDropdown.Item as={Link} to="/employer/dashboard">
                      Dashboard
                    </NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/employer/post-job">
                      Post a Job
                    </NavDropdown.Item>
                  </NavDropdown>
                )}
                {currentUser.role === 'candidate' && (
                  <NavDropdown title="Candidate" id="candidate-dropdown">
                    <NavDropdown.Item as={Link} to="/candidate/dashboard">
                      Dashboard
                    </NavDropdown.Item>
                  </NavDropdown>
                )}
                <NavDropdown 
                  title={
                    <span>
                      <FaUserCircle className="me-1" />
                      {currentUser.username}
                    </span>
                  } 
                  id="user-dropdown"
                >
                  <NavDropdown.Item as={Link} to="/profile">
                    Profile
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item onClick={handleLogout}>
                    <FaSignOutAlt className="me-2" />
                    Logout
                  </NavDropdown.Item>
                </NavDropdown>
              </>
            ) : (
              <>
                <Button as={Link} to="/login" variant="outline-primary" className="me-2">
                  Login
                </Button>
                <Button as={Link} to="/register" variant="primary">
                  Register
                </Button>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;