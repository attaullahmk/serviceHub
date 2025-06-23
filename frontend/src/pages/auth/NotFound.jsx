import React from 'react';
import { Container, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiHome } from 'react-icons/fi';
import './NotFound.css';

function NotFound() {
  const navigate = useNavigate();

  return (
    <Container className="not-found-container">
      <div className="not-found-content">
        <div className="error-code">404</div>
        <h1 className="error-title">Page Not Found</h1>
        <p className="error-message">
          Oops! The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="action-buttons">
          <Button 
            variant="outline-primary" 
            onClick={() => navigate(-1)}
            className="me-3"
          >
            <FiArrowLeft className="me-2" />
            Go Back
          </Button>
          <Button 
            variant="primary" 
            onClick={() => navigate('/')}
          >
            <FiHome className="me-2" />
            Return Home
          </Button>
        </div>
      </div>
    </Container>
  );
}

export default NotFound;