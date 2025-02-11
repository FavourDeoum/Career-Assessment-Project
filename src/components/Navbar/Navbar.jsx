import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaBars, FaTimes } from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, logout, loading } = useAuth(); // Include loading state
  const navigate = useNavigate();
  const location = useLocation();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Close the mobile menu when a link is clicked
  useEffect(() => {
    if (isOpen) {
      setIsOpen(false);
    }
  }, [location.pathname]);

  // Don't render the navbar until authentication state is determined
  if (loading) {
    return null; // Or a loading spinner
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <button className="menu-toggle" onClick={toggleMenu}>
          {isOpen ? <FaTimes /> : <FaBars />}
        </button>
        <Link to="/" className="logo-text">
          <img src="/images/logo2.png" alt="Logo" />
        </Link>
        <div className={`navbar-links ${isOpen ? 'active' : ''}`}>
          <Link to="/" className={`navbar-link ${location.pathname === '/' ? 'active' : ''}`}>Home</Link>
          <Link to="/about" className={`navbar-link ${location.pathname === '/about' ? 'active' : ''}`}>About</Link>
          <Link to="/contact" className={`navbar-link ${location.pathname === '/contact' ? 'active' : ''}`}>Contact</Link>
          {isAuthenticated ? (
            <>
              <Link to="/dashboard" className={`navbar-link ${location.pathname === '/dashboard' ? 'active' : ''}`}>Dashboard</Link>
              <Link to="/assessment" className={`navbar-link ${location.pathname === '/assessment' ? 'active' : ''}`}>Assessment</Link>
              <Link to="/recommendations" className={`navbar-link ${location.pathname === '/recommendations' ? 'active' : ''}`}>Recommendations</Link>
              <Link to="/resources" className={`navbar-link ${location.pathname === '/resources' ? 'active' : ''}`}>Resources</Link>
              <Link to="/profile" className={`navbar-link ${location.pathname === '/profile' ? 'active' : ''}`}>Profile</Link>
              <button onClick={handleLogout} className="navbar-link logout-button">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className={`navbar-link ${location.pathname === '/login' ? 'active' : ''}`}>Sign In</Link>
              <Link to="/signup" className={`navbar-link signup ${location.pathname === '/signup' ? 'active' : ''}`}>Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;