"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../../contexts/AuthContext"
import { FaRocket, FaChartBar, FaUserGraduate, FaStar, FaArrowRight, FaPlay, FaBrain } from "react-icons/fa"
import "./LandingPage.css"

const LandingPage = () => {
  const [isVisible, setIsVisible] = useState(false)
  const [activeTestimonial, setActiveTestimonial] = useState(0)
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % 2)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate("/dashboard")
    } else {
      navigate("/signup")
    }
  }

  return (
    <div className="landing-page">
      {/* Hero Section */}
      <header className="hero-section">
        {/* Animated Background */}
        <div className="background-animation">
          <div className="floating-shape shape-1"></div>
          <div className="floating-shape shape-2"></div>
          <div className="floating-shape shape-3"></div>
          <div className="floating-shape shape-4"></div>
        </div>

        <div className="hero-container">
          {/* Left Content */}
          <div className={`hero-content ${isVisible ? "animate-slide-in-left" : ""}`}>
            <div className="badge">
              <FaStar className="badge-icon" />
              <span>Trusted by 10,000+ Students</span>
            </div>

            <h1 className="hero-title">
              <span className="title-line-1">Discover Your</span>
              <span className="title-line-2">Perfect Career</span>
              <span className="title-line-3">Path</span>
            </h1>

            <p className="hero-description">
              <span className="brand-name">EduVate</span>, a blend of <strong>Education</strong> and{" "}
              <strong>Elevate</strong>. Our AI-powered career assessment tool which helps Advanced Level students in
              Cameroon discover their ideal career based on background, skills, interests, and personality.
            </p>

            <div className="hero-buttons">
              <button className="cta-primary" onClick={handleGetStarted}>
                <span>{isAuthenticated ? "Go to Dashboard" : "Get Started Free"}</span>
                <FaArrowRight className="button-icon" />
              </button>

              <button className="cta-secondary">
                <div className="play-button">
                  <FaPlay />
                </div>
                <span>Watch Demo</span>
              </button>
            </div>

            <div className="hero-stats">
              <div className="stat-item">
                <div className="stat-number">98%</div>
                <div className="stat-label">Success Rate</div>
              </div>
              <div className="stat-divider"></div>
              <div className="stat-item">
                <div className="stat-number">15min</div>
                <div className="stat-label">Assessment Time</div>
              </div>
              <div className="stat-divider"></div>
              <div className="stat-item">
                <div className="stat-number">500+</div>
                <div className="stat-label">Career Paths</div>
              </div>
            </div>
          </div>

          {/* Right Illustration */}
          <div className={`hero-illustration ${isVisible ? "animate-slide-in-right" : ""}`}>
            <div className="illustration-container">
              {/* Main Illustration */}
              <div className="main-illustration">
                <div className="student-figures">
                  <div className="student student-1">
                    <div className="student-head"></div>
                    <div className="student-body"></div>
                  </div>
                  <div className="student student-2">
                    <div className="student-head"></div>
                    <div className="student-body"></div>
                  </div>
                  <div className="student student-3">
                    <div className="student-head"></div>
                    <div className="student-body"></div>
                  </div>
                </div>

                <div className="graduation-cap">
                  <FaUserGraduate />
                </div>
              </div>

              {/* Floating Elements */}
              <div className="floating-element element-1">
                <FaRocket />
              </div>

              <div className="floating-element element-2">
                <FaChartBar />
              </div>

              <div className="floating-element element-3">
                <FaBrain />
              </div>

              {/* Floating Cards */}
              <div className="floating-card card-1">
                <div className="card-indicator"></div>
                <span>Career Match Found!</span>
              </div>

              <div className="floating-card card-2">
                <FaStar className="card-star" />
                <span>4.9/5 Rating</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section className="features-section">
        <div className="section-container">
          <div className="section-header">
            <h2 className="section-title">
              Why Choose <span className="highlight">EduVate?</span>
            </h2>
            <p className="section-subtitle">
              Our comprehensive platform combines cutting-edge technology with educational expertise to guide your
              career journey.
            </p>
          </div>

          <div className="features-grid">
            <FeatureCard
              icon={<FaRocket />}
              title="Personalized Assessments"
              description="Take our comprehensive assessment to discover your unique strengths and interest."
              color="purple"
              delay="0"
            />
            <FeatureCard
              icon={<FaChartBar />}
              title="Career Recommendations"
              description="Recieve tailred career suggestions based on your assessment results."
              color="blue"
              delay="200"
            />
            <FeatureCard
              icon={<FaUserGraduate />}
              title="Expert Guidance"
              description="Access resources and guidance from industry professionals and career counselors specialized in the Cameroonian job market."
              color="pink"
              delay="400"
            />
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <div className="section-container">
          <div className="section-header">
            <h2 className="section-title">
              Success <span className="highlight">Stories</span>
            </h2>
            <p className="section-subtitle">Join thousands of students who discovered their dream careers</p>
          </div>

          <div className="testimonials-container">
            <div className={`testimonial-slide ${activeTestimonial === 0 ? "active" : ""}`}>
              <TestimonialCard
                name="Acha Grace"
                role="Environmental Science Student"
                text="EduVate didn't just help me find my passion for environmental science - it showed me exactly how to turn that passion into a meaningful career. The personalized recommendations were spot-on!"
                avatar="AG"
              />
            </div>

            <div className={`testimonial-slide ${activeTestimonial === 1 ? "active" : ""}`}>
              <TestimonialCard
                name="Neba Kevin"
                role="Web Developer"
                text="Thanks to EduVate, I discovered the perfect balance between my technical skills and creative interests. The platform guided me towards web development, and I couldn't be happier with my career choice!"
                avatar="NK"
              />
            </div>
          </div>

          <div className="testimonial-indicators">
            <button
              className={`indicator ${activeTestimonial === 0 ? "active" : ""}`}
              onClick={() => setActiveTestimonial(0)}
            ></button>
            <button
              className={`indicator ${activeTestimonial === 1 ? "active" : ""}`}
              onClick={() => setActiveTestimonial(1)}
            ></button>
          </div>
        </div>
      </section>
    </div>
  )
}

const FeatureCard = ({ icon, title, description, color, delay }) => (
  <div className={`feature-card feature-${color}`} style={{ animationDelay: `${delay}ms` }}>
    <div className="feature-icon-container">
      <div className={`feature-icon feature-icon-${color}`}>{icon}</div>
    </div>
    <h3 className="feature-title">{title}</h3>
    <p className="feature-description">{description}</p>
    <div className="feature-hover-effect"></div>
  </div>
)

const TestimonialCard = ({ name, role, text, avatar }) => (
  <div className="testimonial-card">
    <div className="testimonial-content">
      <div className="quote-icon">"</div>
      <p className="testimonial-text">{text}</p>
      <div className="testimonial-author">
        <div className="author-avatar">
          <span>{avatar}</span>
        </div>
        <div className="author-info">
          <div className="author-name">{name}</div>
          <div className="author-role">{role}</div>
        </div>
      </div>
    </div>
    <div className="testimonial-decoration"></div>
  </div>
)

export default LandingPage
