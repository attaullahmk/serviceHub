import React from 'react';
import { 
  FaFacebookF, 
  FaTwitter, 
  FaInstagram, 
  FaLinkedinIn,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaClock
} from 'react-icons/fa';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer  pt-5 pb-4">
   
      <div className="container bg ">
        <div className="row g-4 bg">
          {/* About Section */}
          <div className="col-lg-4 col-md-6 mb-4 ">
            <h5 className="text-uppercase fw-bold mb-4 text-dark">
              <span className="text-primary">Service</span>Hub
            </h5>
            <p className="text-secondary">
              Connecting customers with the best service providers in your area. 
              Find, book, and manage services with ease.
            </p>
            <div className="social-icons mt-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="me-3">
                <FaFacebookF className="social-icon" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="me-3">
                <FaTwitter className="social-icon" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="me-3">
                <FaInstagram className="social-icon" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
                <FaLinkedinIn className="social-icon" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-lg-2 col-md-6 mb-4">
            <h5 className="text-uppercase fw-bold mb-4 text-dark">Quick Links</h5>
            <ul className="list-unstyled">
              <li className="mb-2">
                <Link to="/" className="text-secondary text-decoration-none footer-link">Home</Link>
              </li>
              <li className="mb-2">
                <Link to="/services" className="text-secondary text-decoration-none footer-link">Services</Link>
              </li>
              <li className="mb-2">
                <Link to="/about" className="text-secondary text-decoration-none footer-link">About Us</Link>
              </li>
              <li className="mb-2">
                <Link to="/contact" className="text-secondary text-decoration-none footer-link">Contact</Link>
              </li>
              <li className="mb-2">
                <Link to="/faq" className="text-secondary text-decoration-none footer-link">FAQ</Link>
              </li>
            </ul>
          </div>

          {/* Service Categories */}
          <div className="col-lg-3 col-md-6 mb-4">
            <h5 className="text-uppercase fw-bold mb-4 text-dark">Categories</h5>
            <ul className="list-unstyled">
              <li className="mb-2">
                <Link to="/services/electricians" className="text-secondary text-decoration-none footer-link">Electricians</Link>
              </li>
              <li className="mb-2">
                <Link to="/services/plumbers" className="text-secondary text-decoration-none footer-link">Plumbers</Link>
              </li>
              <li className="mb-2">
                <Link to="/services/cleaning" className="text-secondary text-decoration-none footer-link">Cleaning Services</Link>
              </li>
              <li className="mb-2">
                <Link to="/services/landscaping" className="text-secondary text-decoration-none footer-link">Landscaping</Link>
              </li>
              <li className="mb-2">
                <Link to="/services/auto" className="text-secondary text-decoration-none footer-link">Auto Services</Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="col-lg-3 col-md-6 mb-4">
            <h5 className="text-uppercase fw-bold mb-4 text-dark">Contact</h5>
            <ul className="list-unstyled text-secondary">
              <li className="mb-3 d-flex align-items-start">
                <FaMapMarkerAlt className="me-3 mt-1 contact-icon" />
                <span>University of Malakand</span>
              </li>
              <li className="mb-3 d-flex align-items-center">
                <FaPhoneAlt className="me-3 contact-icon" />
                <span>0349 1312099</span>
              </li>
              <li className="mb-3 d-flex align-items-center">
                <FaEnvelope className="me-3 contact-icon" />
                <span>contact@servicehub.com</span>
              </li>
              <li className="d-flex align-items-center">
                <FaClock className="me-3 contact-icon" />
                <span>Mon-Fri: 9AM - 6PM</span>
              </li>
            </ul>
          </div>
        </div>

        <hr className="my-4" />

        {/* Copyright */}
        <div className="text-center">
          <p className="mb-2 text-secondary">
            © 2025 ServiceHub. All rights reserved.
          </p>
          <div className="d-flex justify-content-center">
            <Link to="/privacy" className="text-secondary text-decoration-none footer-link mx-2">Privacy Policy</Link>
            <span className="text-secondary">•</span>
            <Link to="/terms" className="text-secondary text-decoration-none footer-link mx-2">Terms of Service</Link>
            <span className="text-secondary">•</span>
            <Link to="/sitemap" className="text-secondary text-decoration-none footer-link mx-2">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;