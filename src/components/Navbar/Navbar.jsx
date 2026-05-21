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
              className={`mobile-menu-toggle ${isOpen ? 'active' : ''}`}
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

        {/* Mobile Navigation */}
        <nav id="mobile-nav" className={`mobile-nav ${isOpen ? 'active' : ''}`} aria-label="Mobile navigation">
          <div className="mobile-nav-header">
            <div className="mobile-logo">
              <div className="logo-icon">
                <img src="/images/logo2.png" alt="EduVate" />
              </div>
            </div>
          </div>

          <div className="mobile-nav-content">
            <div className="mobile-nav-links">
              {navItems.map((item, index) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`mobile-nav-link ${location.pathname === item.path ? "active" : ""}`}
                  onClick={handleLinkClick}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="mobile-link-icon">{item.icon}</div>
                  <span className="mobile-link-text">{item.label}</span>
                  <div className="mobile-link-indicator"></div>
                </Link>
              ))}

              <SignedIn>
                <Link
                  to="/dashboard"
                  className={`mobile-nav-link ${location.pathname === "/dashboard" ? "active" : ""}`}
                  onClick={handleLinkClick}
                  style={{ animationDelay: `${navItems.length * 0.1}s` }}
                >
                  <div className="mobile-link-icon"><FaTachometerAlt /></div>
                  <span className="mobile-link-text">Dashboard</span>
                  <div className="mobile-link-indicator"></div>
                </Link>
              </SignedIn>
            </div>

            <div className="mobile-nav-footer">
              <SignedOut>
                <SignInButton mode="modal">
                  <button className="mobile-auth-button" onClick={handleLinkClick}>
                    <span>Sign In to Continue</span>
                    <div className="button-shimmer"></div>
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
          </div>
        </nav>
      </nav>

      {/* Spacer to prevent content jump */}
      <div className="navbar-spacer"></div>
    </>
  )
}

export default Navbar