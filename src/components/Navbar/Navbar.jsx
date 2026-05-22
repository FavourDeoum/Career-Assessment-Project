import { useState, useEffect } from "react"
import { Link, useLocation } from "react-router-dom"
import { FaHome, FaUser, FaEnvelope, FaTachometerAlt } from "react-icons/fa"
import "./Navbar.css"
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react"

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY
      setScrolled(offset > 50)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    setIsOpen(false)
  }, [location.pathname])

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  // Function to handle link clicks
  const handleLinkClick = () => {
    setIsOpen(false)
  }

  const navItems = [
    { path: "/", label: "Home", icon: <FaHome /> },
    { path: "/about", label: "About", icon: <FaUser /> },
    { path: "/contact", label: "Contact", icon: <FaEnvelope /> },
  ]

  return (
    <>
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="navbar-container">
          {/* Logo */}
          <Link to="/" className="navbar-logo">
            <div className="logo-container">
              <div className="logo-icon">
                <img src="/images/logo2.png" alt="EduVate logo" />
              </div>
              <span className="logo-text">EduVate</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="navbar-nav-desktop" aria-label="Main navigation">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-link ${location.pathname === item.path ? "active" : ""}`}
                onClick={handleLinkClick}
              >
                <span className="nav-link-text">{item.label}</span>
                <div className="nav-link-indicator"></div>
              </Link>
            ))}

            <SignedIn>
              <Link
                to="/dashboard"
                className={`nav-link ${location.pathname === "/dashboard" ? "active" : ""}`}
                onClick={handleLinkClick}
              >
                <span className="nav-link-text">Dashboard</span>
                <div className="nav-link-indicator"></div>
              </Link>
            </SignedIn>
          </nav>

          {/* Auth Section */}
          <div className="navbar-auth">
            <SignedOut>
              <SignInButton mode="modal">
                <button className="auth-button signin-btn">
                  <span>Sign In</span>
                </button>
              </SignInButton>
              <SignInButton mode="modal">
                <button className="auth-button getstarted-btn">
                  <span>Get Started</span>
                  <div className="button-glow"></div>
                </button>
              </SignInButton>
            </SignedOut>

            <SignedIn>
              <div className="user-profile">
                <UserButton 
                  afterSignOutUrl="/" 
                  appearance={{
                    elements: {
                      avatarBox: "user-avatar-custom",
                      userButtonPopoverCard: "user-popover-custom"
                    }
                  }}
                />
              </div>
            </SignedIn>

            {/* Mobile Menu Toggle */}
            <button
              className="mobile-menu-toggle"
              onClick={toggleMenu}
              aria-label={isOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isOpen}
              aria-controls="mobile-nav"
            >
              <span className="hamburger-line"></span>
              <span className="hamburger-line"></span>
              <span className="hamburger-line"></span>
            </button>
          </div>
        </div>

        {/* Mobile Menu Backdrop */}
        <div className={`mobile-backdrop ${isOpen ? 'active' : ''}`} onClick={handleLinkClick}></div>

        {/* Mobile Navigation — right-side drawer */}
        <nav id="mobile-nav" className={`mobile-nav ${isOpen ? 'active' : ''}`} aria-label="Mobile navigation">
          {/* Drawer Header */}
          <div className="mobile-nav-header">
            <Link to="/" className="mobile-nav-brand" onClick={handleLinkClick}>
              <img src="/images/logo2.png" alt="EduVate logo" />
              <span className="mobile-nav-brand-text">EduVate</span>
            </Link>
            <button className="mobile-nav-close" onClick={handleLinkClick} aria-label="Close menu">
              ✕
            </button>
          </div>

          {/* Nav Links */}
          <div className="mobile-nav-links">
            <p className="mobile-nav-section-label">Navigation</p>
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`mobile-nav-link ${location.pathname === item.path ? "active" : ""}`}
                onClick={handleLinkClick}
              >
                <div className="mobile-link-icon">{item.icon}</div>
                <span className="mobile-link-text">{item.label}</span>
              </Link>
            ))}

            <SignedIn>
              <Link
                to="/dashboard"
                className={`mobile-nav-link ${location.pathname === "/dashboard" ? "active" : ""}`}
                onClick={handleLinkClick}
              >
                <div className="mobile-link-icon"><FaTachometerAlt /></div>
                <span className="mobile-link-text">Dashboard</span>
              </Link>
            </SignedIn>
          </div>

          {/* Spacer pushes footer down */}
          <div className="mobile-nav-spacer" />

          {/* Footer */}
          <div className="mobile-nav-footer">
            <SignedOut>
              <p className="mobile-footer-hint">Discover your career path — it's free.</p>
              <SignInButton mode="modal">
                <button className="mobile-auth-button" onClick={handleLinkClick}>
                  Get Started Free
                </button>
              </SignInButton>
            </SignedOut>

            <SignedIn>
              <div className="mobile-user-section">
                <UserButton
                  afterSignOutUrl="/"
                  appearance={{
                    elements: {
                      avatarBox: "mobile-user-avatar",
                      userButtonPopoverCard: "mobile-user-popover"
                    }
                  }}
                />
                <div className="user-info">
                  <span className="user-greeting">Welcome back!</span>
                </div>
              </div>
            </SignedIn>
          </div>
        </nav>
      </nav>

      {/* Spacer to prevent content jump */}
      <div className="navbar-spacer"></div>
    </>
  )
}

export default Navbar