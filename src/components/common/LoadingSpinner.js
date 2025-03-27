import React from 'react';
import { Spinner } from 'react-bootstrap';

const LoadingSpinner = ({ text = 'Loading...', size = 'md', variant = 'primary', className = '' }) => {
  return (
    <div className={`d-flex flex-column align-items-center justify-content-center py-5 ${className}`}>
      <Spinner 
        animation="border" 
        variant={variant} 
        className={`mb-3 ${size === 'lg' ? 'spinner-border-lg' : ''}`}
      />
      <p className="text-muted">{text}</p>
    </div>
  );
};

export default LoadingSpinner;