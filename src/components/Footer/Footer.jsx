import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-section">
            <h2 className="footer-title">Career Assessment Tool</h2>
            <p>Helping students in Cameroon find their perfect career path.</p>
          </div>
          <div className="footer-section">
            <h3 className="footer-subtitle">Quick Links</h3>
            <ul className="footer-links">
              <li><Link to="/privacy-policy" className="footer-link">Privacy Policy</Link></li>
              <li><Link to="/terms-of-service" className="footer-link">Terms of Service</Link></li>
              <li><Link to="/contact" className="footer-link">Contact Us</Link></li>
            </ul>
          </div>
          <div className="footer-section">
            <h3 className="footer-subtitle">Follow Us</h3>
            <div className="social-icons">
              <a href="#" className="social-icon"><FaFacebook size={24} /></a>
              <a href="#" className="social-icon"><FaTwitter size={24} /></a>
              <a href="#" className="social-icon"><FaInstagram size={24} /></a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2023 Career Assessment Tool. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

