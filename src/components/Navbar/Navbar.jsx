import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaBars, FaTimes } from 'react-icons/fa';
import './Navbar.css';
import { SignedIn, SignedOut, SignInButton, UserButton} from '@clerk/clerk-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Close the mobile menu when a link is clicked
  useEffect(() => {
    if (isOpen) {
      setIsOpen(false);
    }
  }, [location.pathname]);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

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
          
          <SignedOut>
            <SignInButton mode="modal">
              <button className="navbar-link">Sign In</button>
            </SignInButton>
          </SignedOut>

          <SignedIn>
            <Link to="/cdashboard" className={`navbar-link ${location.pathname === '/cdashboard' ? 'active' : ''}`}>Dashboard</Link>
            {/* <Link to="/assessment" className={`navbar-link ${location.pathname === '/assessment' ? 'active' : ''}`}>Assessment</Link> */}
            
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;