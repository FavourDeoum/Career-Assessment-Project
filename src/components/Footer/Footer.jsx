import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram, FaArrowRight } from 'react-icons/fa';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      {/* CTA Strip */}
      <div className="footer-cta-strip">
        <div className="footer-cta-inner">
          <div className="footer-cta-text">
            <h3 className="footer-cta-title">Not sure what to study?</h3>
            <p className="footer-cta-sub">Take the free assessment — it takes about 15 minutes.</p>
          </div>
          <Link to="/signup" className="footer-cta-btn">
            Get Started Free <FaArrowRight className="footer-cta-arrow" />
          </Link>
        </div>
      </div>

      {/* Main Footer Body */}
      <div className="footer-body">
        <div className="footer-container">
          <div className="footer-content">

            {/* Brand */}
            <div className="footer-brand">
              <div className="footer-logo">
                <img src="/images/logo4.png" alt="EduVate logo" className="footer-logo-img" />
                <span className="footer-logo-name">EduVate</span>
              </div>
              <p className="footer-tagline">
                Helping Advanced Level students in Cameroon discover the right career path — based on who they actually are.
              </p>
            </div>

            {/* Navigate */}
            <div className="footer-section">
              <h4 className="footer-section-title">Navigate</h4>
              <ul className="footer-links">
                <li><Link to="/" className="footer-link">Home</Link></li>
                <li><Link to="/about" className="footer-link">About</Link></li>
                <li><Link to="/contact" className="footer-link">Contact</Link></li>
              </ul>
            </div>

            {/* Legal */}
            <div className="footer-section">
              <h4 className="footer-section-title">Legal</h4>
              <ul className="footer-links">
                <li><Link to="/privacy-policy" className="footer-link">Privacy Policy</Link></li>
                <li><Link to="/terms-of-service" className="footer-link">Terms of Service</Link></li>
              </ul>
            </div>

            {/* Social */}
            <div className="footer-section">
              <h4 className="footer-section-title">Follow Us</h4>
              <div className="social-icons">
                <a href="https://www.facebook.com/profile.php?id=100075832277920" className="social-icon" aria-label="Facebook" target="_blank" rel="noopener noreferrer">
                  <FaFacebook />
                </a>
                <a href="https://x.com/FavourDeoum?s=09" className="social-icon" aria-label="Twitter / X" target="_blank" rel="noopener noreferrer">
                  <FaTwitter />
                </a>
                <a href="#" className="social-icon" aria-label="Instagram">
                  <FaInstagram />
                </a>
              </div>
            </div>

          </div>

          <div className="footer-bottom">
            <p>&copy; {new Date().getFullYear()} EduVate. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
