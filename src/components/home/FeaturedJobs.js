import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import JobCard from '../JobCard';

const FeaturedJobs = ({ jobs = [] }) => {
  // If no jobs are provided, use mock data
  const mockJobs = [
    {
      id: 1,
      title: 'Senior Software Engineer',
      company_name: 'Tech Innovations Inc.',
      location: 'San Francisco, CA',
      job_type: 'Full-time',
      salary_range: '$120K - $150K',
      description: 'Join our team to build innovative solutions using cutting-edge technologies...'
    },
    {
      id: 2,
      title: 'UX/UI Designer',
      company_name: 'Creative Solutions',
      location: 'New York, NY',
      job_type: 'Full-time',
      salary_range: '$90K - $120K',
      description: 'Design beautiful and intuitive user interfaces for web and mobile applications...'
    },
    {
      id: 3,
      title: 'Marketing Manager',
      company_name: 'Growth Strategies',
      location: 'Chicago, IL',
      job_type: 'Full-time',
      salary_range: '$80K - $110K',
      description: 'Lead our marketing team and develop strategies to increase brand awareness...'
    },
    {
      id: 4,
      title: 'Data Scientist',
      company_name: 'Data Insights Corp',
      location: 'Remote',
      job_type: 'Full-time',
      salary_range: '$100K - $140K',
      description: 'Analyze complex data sets and develop machine learning models to drive business decisions...'
    },
    {
      id: 5,
      title: 'Frontend Developer',
      company_name: 'Web Solutions',
      location: 'Austin, TX',
      job_type: 'Contract',
      salary_range: '$70K - $90K',
      description: 'Build responsive and interactive user interfaces using modern JavaScript frameworks...'
    },
    {
      id: 6,
      title: 'Product Manager',
      company_name: 'Innovative Products Inc.',
      location: 'Seattle, WA',
      job_type: 'Full-time',
      salary_range: '$110K - $140K',
      description: 'Lead product development from conception to launch, working with cross-functional teams...'
    }
  ];

  // Use provided jobs or mock jobs
  const displayJobs = jobs.length > 0 ? jobs : mockJobs;

  return (
    <section className="py-5 bg-light">
      <Container>
        <Row className="mb-4">
          <Col className="text-center">
            <h2 className="fw-bold section-title">Featured Job Opportunities</h2>
            <p className="text-muted">Discover your next career move with these handpicked opportunities</p>
          </Col>
        </Row>
        <Row>
          {displayJobs.map((job) => (
            <Col lg={4} md={6} className="mb-4" key={job.id}>
              <JobCard job={job} />
            </Col>
          ))}
        </Row>
        <Row className="mt-4">
          <Col className="text-center">
            <Button 
              variant="primary" 
              as={Link} 
              to="/jobs"
              className="rounded-pill px-4 py-2 hover-lift"
            >
              Browse All Jobs
            </Button>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default FeaturedJobs;