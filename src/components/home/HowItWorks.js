import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { FaUserPlus, FaFileAlt, FaPaperPlane } from 'react-icons/fa';

const HowItWorks = () => {
  const steps = [
    {
      icon: FaUserPlus,
      title: 'Create an Account',
      description: 'Sign up as a candidate or employer to access all features of our platform.'
    },
    {
      icon: FaFileAlt,
      title: 'Complete Your Profile',
      description: 'Upload your resume, add your skills, and set your preferences to get matched with the right opportunities.'
    },
    {
      icon: FaPaperPlane,
      title: 'Apply for Jobs',
      description: 'Browse listings, apply with one click, and track your application status in real-time.'
    }
  ];

  return (
    <section className="py-5 bg-light">
      <Container>
        <Row className="mb-5">
          <Col className="text-center">
            <h2 className="fw-bold section-title">How It Works</h2>
            <p className="text-muted">Simple steps to find your next career opportunity</p>
          </Col>
        </Row>
        <Row>
          {steps.map((step, index) => (
            <Col md={4} className="mb-4 mb-md-0" key={index}>
              <Card className="border-0 h-100 text-center shadow-sm hover-lift">
                <Card.Body className="p-4">
                  <div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center mx-auto mb-4" style={{ width: '80px', height: '80px' }}>
                    <step.icon size={30} />
                  </div>
                  <Card.Title className="fw-bold mb-3">{step.title}</Card.Title>
                  <Card.Text className="text-muted">
                    {step.description}
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
};

export default HowItWorks;