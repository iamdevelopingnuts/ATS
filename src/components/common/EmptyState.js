import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const EmptyState = ({
  title = 'No data found',
  message = 'There are no items to display at this time.',
  icon = null,
  actionText = '',
  actionLink = '',
  onAction = null,
  className = ''
}) => {
  return (
    <Card className={`border-0 shadow-sm text-center p-4 ${className}`}>
      <Card.Body>
        {icon && (
          <div className="mb-3 text-muted">
            {icon}
          </div>
        )}
        <h5 className="mb-2">{title}</h5>
        <p className="text-muted mb-4">{message}</p>
        
        {(actionText && actionLink) && (
          <Button 
            as={Link} 
            to={actionLink} 
            variant="primary" 
            className="rounded-pill px-4 hover-lift"
          >
            {actionText}
          </Button>
        )}
        
        {(actionText && onAction) && (
          <Button 
            onClick={onAction} 
            variant="primary" 
            className="rounded-pill px-4 hover-lift"
          >
            {actionText}
          </Button>
        )}
      </Card.Body>
    </Card>
  );
};

export default EmptyState;