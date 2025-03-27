import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, InputGroup, Button, Badge, Spinner, Alert, Pagination } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FaSearch, FaMapMarkerAlt, FaFilter, FaBuilding, FaBriefcase, FaMoneyBillWave, FaSlidersH } from 'react-icons/fa';
import JobCard from '../components/JobCard';
import '../components/styles/CustomStyles.css';

const JobList = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [location, setLocation] = useState('');
  const [jobType, setJobType] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchJobs();
  }, [currentPage]);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      setError(null);
      
      let url = '/api/jobs/?status=active';
      
      // Add pagination parameters
      url += `&page=${currentPage}`;
      
      const response = await axios.get(url);
      
      setJobs(response.data.results || response.data);
      
      // Set total pages if pagination info is available
      if (response.data.count) {
        const count = response.data.count;
        const pages = Math.ceil(count / 10); // Assuming 10 items per page
        setTotalPages(pages);
      }
    } catch (err) {
      console.error('Error fetching jobs:', err);
      setError('Failed to load jobs. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      setCurrentPage(1); // Reset to first page on new search
      
      let url = '/api/job-search/?status=active';
      
      if (searchTerm) {
        url += `&search=${encodeURIComponent(searchTerm)}`;
      }
      
      if (location) {
        url += `&location=${encodeURIComponent(location)}`;
      }
      
      if (jobType) {
        url += `&job_type=${encodeURIComponent(jobType)}`;
      }
      
      const response = await axios.get(url);
      
      setJobs(response.data.results || response.data);
      
      // Set total pages if pagination info is available
      if (response.data.count) {
        const count = response.data.count;
        const pages = Math.ceil(count / 10); // Assuming 10 items per page
        setTotalPages(pages);
      }
    } catch (err) {
      console.error('Error searching jobs:', err);
      setError('Failed to search jobs. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const renderPagination = () => {
    const items = [];
    
    // Previous button
    items.push(
      <Pagination.Prev 
        key="prev" 
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
      />
    );
    
    // First page
    items.push(
      <Pagination.Item 
        key={1} 
        active={currentPage === 1}
        onClick={() => handlePageChange(1)}
      >
        1
      </Pagination.Item>
    );
    
    // Ellipsis if needed
    if (currentPage > 3) {
      items.push(<Pagination.Ellipsis key="ellipsis1" />);
    }
    
    // Pages around current page
    for (let page = Math.max(2, currentPage - 1); page <= Math.min(totalPages - 1, currentPage + 1); page++) {
      items.push(
        <Pagination.Item 
          key={page} 
          active={currentPage === page}
          onClick={() => handlePageChange(page)}
        >
          {page}
        </Pagination.Item>
      );
    }
    
    // Ellipsis if needed
    if (currentPage < totalPages - 2) {
      items.push(<Pagination.Ellipsis key="ellipsis2" />);
    }
    
    // Last page if there are more than 1 page
    if (totalPages > 1) {
      items.push(
        <Pagination.Item 
          key={totalPages} 
          active={currentPage === totalPages}
          onClick={() => handlePageChange(totalPages)}
        >
          {totalPages}
        </Pagination.Item>
      );
    }
    
    // Next button
    items.push(
      <Pagination.Next 
        key="next" 
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      />
    );
    
    return <Pagination>{items}</Pagination>;
  };

  return (
    <Container className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="mb-0 section-title">Browse Jobs</h1>
        <div className="d-none d-md-block">
          <Badge bg="light" text="dark" className="me-2 py-2 px-3">
            <FaBriefcase className="me-2" />
            {jobs.length} Jobs Found
          </Badge>
        </div>
      </div>
      
      {/* Search Form */}
      <Card className="mb-4 shadow-sm border-0 rounded-lg overflow-hidden">
        <Card.Body className="p-4">
          <Form onSubmit={handleSearch}>
            <Row>
              <Col lg={4} md={6} className="mb-3 mb-lg-0">
                <InputGroup className="shadow-sm rounded-pill overflow-hidden">
                  <InputGroup.Text className="bg-white border-0">
                    <FaSearch className="text-primary" />
                  </InputGroup.Text>
                  <Form.Control
                    className="border-0 search-bar"
                    placeholder="Job title or keywords"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </InputGroup>
              </Col>
              <Col lg={3} md={6} className="mb-3 mb-lg-0">
                <InputGroup className="shadow-sm rounded-pill overflow-hidden">
                  <InputGroup.Text className="bg-white border-0">
                    <FaMapMarkerAlt className="text-primary" />
                  </InputGroup.Text>
                  <Form.Control
                    className="border-0 search-bar"
                    placeholder="Location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </InputGroup>
              </Col>
              <Col lg={3} md={8} className="mb-3 mb-lg-0">
                <Form.Select 
                  className="shadow-sm rounded-pill border-0 py-2 px-3"
                  value={jobType}
                  onChange={(e) => setJobType(e.target.value)}
                >
                  <option value="">All Job Types</option>
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contract">Contract</option>
                  <option value="Internship">Internship</option>
                  <option value="Freelance">Freelance</option>
                </Form.Select>
              </Col>
              <Col lg={2} md={4}>
                <div className="d-grid">
                  <Button 
                    type="submit" 
                    variant="primary" 
                    className="rounded-pill py-2 hover-lift"
                  >
                    <FaSearch className="me-2" />
                    Search
                  </Button>
                </div>
              </Col>
            </Row>
            
            <div className="mt-3">
              <Button 
                variant="link" 
                className="p-0 text-decoration-none" 
                onClick={() => setShowFilters(!showFilters)}
              >
                <FaSlidersH className="me-1" />
                {showFilters ? 'Hide Advanced Filters' : 'Show Advanced Filters'}
              </Button>
            </div>
            
            {showFilters && (
              <Row className="mt-3 pt-3 border-top">
                {/* Additional filters can be added here */}
                <Col md={4} className="mb-3 mb-md-0">
                  <Form.Group>
                    <Form.Label className="fw-bold">Salary Range</Form.Label>
                    <Form.Select className="rounded-pill border-0 shadow-sm">
                      <option>Any Salary</option>
                      <option>$30,000+</option>
                      <option>$50,000+</option>
                      <option>$70,000+</option>
                      <option>$100,000+</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={4} className="mb-3 mb-md-0">
                  <Form.Group>
                    <Form.Label className="fw-bold">Experience Level</Form.Label>
                    <Form.Select className="rounded-pill border-0 shadow-sm">
                      <option>Any Experience</option>
                      <option>Entry Level</option>
                      <option>Mid Level</option>
                      <option>Senior Level</option>
                      <option>Executive</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group>
                    <Form.Label className="fw-bold">Posted Date</Form.Label>
                    <Form.Select className="rounded-pill border-0 shadow-sm">
                      <option>Any Time</option>
                      <option>Last 24 hours</option>
                      <option>Last 7 days</option>
                      <option>Last 14 days</option>
                      <option>Last 30 days</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>
            )}
          </Form>
        </Card.Body>
      </Card>
      
      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3">Loading jobs...</p>
        </div>
      ) : error ? (
        <Alert variant="danger" className="rounded-lg border-0 shadow-sm">{error}</Alert>
      ) : jobs.length === 0 ? (
        <Alert variant="info" className="rounded-lg border-0 shadow-sm">
          <div className="d-flex align-items-center">
            <FaSearch size={24} className="me-3 text-info" />
            <div>
              <h5 className="mb-1">No jobs found</h5>
              <p className="mb-0">Try adjusting your search criteria or browse all available jobs.</p>
            </div>
          </div>
        </Alert>
      ) : (
        <>
          <Row>
            {jobs.map((job) => (
              <Col md={6} lg={4} className="mb-4" key={job.id}>
                <JobCard job={job} />
              </Col>
            ))}
          </Row>
          
          {/* Pagination with improved styling */}
          {totalPages > 1 && (
            <div className="d-flex justify-content-center mt-4">
              <Pagination className="shadow-sm">
                <Pagination.Prev 
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="rounded-start"
                />
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                  // Show first page, last page, and pages around current page
                  if (
                    page === 1 ||
                    page === totalPages ||
                    (page >= currentPage - 1 && page <= currentPage + 1)
                  ) {
                    return (
                      <Pagination.Item
                        key={page}
                        active={page === currentPage}
                        onClick={() => handlePageChange(page)}
                      >
                        {page}
                      </Pagination.Item>
                    );
                  } else if (
                    page === 2 ||
                    page === totalPages - 1
                  ) {
                    return <Pagination.Ellipsis key={page} className="disabled" />;
                  }
                  return null;
                })}
                
                <Pagination.Next 
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="rounded-end"
                />
              </Pagination>
            </div>
          )}
        </>
      )}
    </Container>
  );
};

export default JobList;