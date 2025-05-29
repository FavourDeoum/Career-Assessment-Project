"use client"

import { useState, useEffect } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { FaBars, FaTimes } from "react-icons/fa"
import "./Navbar.css"
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react"

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  // Close the mobile menu when location changes
  useEffect(() => {
    setIsOpen(false)
  }, [location.pathname])

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  // Function to handle link clicks
  const handleLinkClick = () => {
    setIsOpen(false)
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <button className="menu-toggle" onClick={toggleMenu} aria-label="Toggle menu">
          {isOpen ? <FaTimes /> : <FaBars />}
        </button>
        <Link to="/" className="logo-text" onClick={handleLinkClick}>
          <img src="/images/logo2.png" alt="Logo" />
        </Link>
        <div className={`navbar-links ${isOpen ? "active" : ""}`}>
          <Link to="/" className={`navbar-link ${location.pathname === "/" ? "active" : ""}`} onClick={handleLinkClick}>
            Home
          </Link>
          <Link
            to="/about"
            className={`navbar-link ${location.pathname === "/about" ? "active" : ""}`}
            onClick={handleLinkClick}
          >
            About
          </Link>
          <Link
            to="/contact"
            className={`navbar-link ${location.pathname === "/contact" ? "active" : ""}`}
            onClick={handleLinkClick}
          >
            Contact
          </Link>

          <SignedOut>
            <SignInButton mode="modal">
              <button className="navbar-link" onClick={handleLinkClick}>
                Sign In
              </button>
            </SignInButton>
          </SignedOut>

          <SignedIn>
            <Link
              to="/cdashboard"
              className={`navbar-link ${location.pathname === "/cdashboard" ? "active" : ""}`}
              onClick={handleLinkClick}
            >
              Dashboard
            </Link>
            <div className="user-button-container" onClick={handleLinkClick}>
              <UserButton afterSignOutUrl="/" />
            </div>
          </SignedIn>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
