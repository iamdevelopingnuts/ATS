import React from 'react';
import { Row, Col } from 'react-bootstrap';
import { FaCheckCircle, FaClock, FaUserTie, FaFileContract, FaHandshake } from 'react-icons/fa';

const ApplicationTimeline = ({ status }) => {
  // Define the possible statuses and their order
  const statuses = [
    { key: 'applied', label: 'Applied', icon: FaCheckCircle },
    { key: 'reviewed', label: 'Reviewed', icon: FaClock },
    { key: 'interview', label: 'Interview', icon: FaUserTie },
    { key: 'offered', label: 'Offered', icon: FaFileContract },
    { key: 'hired', label: 'Hired', icon: FaHandshake }
  ];

  // Find the current status index
  const currentStatusIndex = statuses.findIndex(s => s.key === status) || 0;

  return (
    <div className="timeline-container my-4">
      <Row className="timeline">
        {statuses.map((statusItem, index) => {
          const isActive = index <= currentStatusIndex;
          const isPast = index < currentStatusIndex;
          
          return (
            <Col key={statusItem.key} className="timeline-item text-center px-0">
              <div 
                className={`timeline-marker ${isActive ? 'active' : ''}`}
                style={{ 
                  backgroundColor: isActive ? '#4e73df' : 'white',
                  borderColor: '#4e73df'
                }}
              />
              <div 
                className={`timeline-content ${isActive ? 'fw-bold' : 'text-muted'}`}
              >
                <div className="mb-2">
                  <statusItem.icon 
                    size={20} 
                    className={isActive ? 'text-primary' : 'text-muted'} 
                  />
                </div>
                <div className="timeline-label">{statusItem.label}</div>
              </div>
              {index < statuses.length - 1 && (
                <div 
                  className="timeline-connector" 
                  style={{ 
                    backgroundColor: isPast ? '#4e73df' : '#e3e6f0',
                    height: '2px',
                    width: '100%',
                    position: 'absolute',
                    top: '10px',
                    left: '50%',
                    zIndex: 0
                  }}
                />
              )}
            </Col>
          );
        })}
      </Row>
    </div>
  );
};

export default ApplicationTimeline;