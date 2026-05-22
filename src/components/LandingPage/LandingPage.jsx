"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../../contexts/AuthContext"
import { FaRocket, FaChartBar, FaUserGraduate, FaStar, FaArrowRight, FaPlay, FaCompass } from "react-icons/fa"
import "./LandingPage.css"
import { Link } from "react-router-dom"

const LandingPage = () => {
  const [isVisible, setIsVisible] = useState(false)
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100)
    return () => clearTimeout(timer)
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
            <h1 className="hero-title">
              <span className="title-line-1">Discover Your</span>
              <span className="title-line-2">Perfect Career</span>
              <span className="title-line-3">Path</span>
            </h1>

            <p className="hero-description">
              <span className="brand-name">EduVate</span>, a blend of <strong>Education</strong> and{" "}
              <strong>Elevate</strong>. A career assessment tool built for Advanced Level students in
              Cameroon — helping you discover the right path based on your background, skills, interests, and personality.
            </p>

            <div className="hero-buttons">
              <button className="cta-primary" onClick={handleGetStarted}>
                <span>{isAuthenticated ? "Go to Dashboard" : "Get Started Free"}</span>
                <FaArrowRight className="button-icon" />
              </button>

              <a className="cta-secondary" href="https://youtu.be/xNiFOWbpMRg?feature=shared" target="_blank" rel="noopener noreferrer">
                <FaPlay className="play-icon" />
                <span>Watch Demo</span>
              </a>
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

          {/* Right — Mock Assessment Preview */}
          <div className={`hero-illustration ${isVisible ? "animate-slide-in-right" : ""}`}>
            <div className="mock-card">
              <div className="mock-card-header">
                <div className="mock-progress-bar">
                  <div className="mock-progress-fill" style={{ width: "40%" }}></div>
                </div>
                <span className="mock-step-label">Step 2 of 5</span>
              </div>

              <div className="mock-card-body">
                <p className="mock-question">What kind of activities do you enjoy most?</p>

                <div className="mock-options">
                  <div className="mock-option mock-option-selected">
                    <div className="mock-option-dot"></div>
                    <span>Working with people and helping others</span>
                  </div>
                  <div className="mock-option">
                    <div className="mock-option-dot"></div>
                    <span>Building or fixing things</span>
                  </div>
                  <div className="mock-option">
                    <div className="mock-option-dot"></div>
                    <span>Analysing data and solving problems</span>
                  </div>
                  <div className="mock-option">
                    <div className="mock-option-dot"></div>
                    <span>Writing, drawing, or creating</span>
                  </div>
                </div>
              </div>

              <div className="mock-card-footer">
                <button className="mock-next-btn">Next Question →</button>
              </div>

              <div className="mock-result-badge">
                <FaUserGraduate className="mock-result-icon" />
                <div>
                  <div className="mock-result-title">Top Match</div>
                  <div className="mock-result-value">Environmental Science</div>
                </div>
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
              How <span className="highlight">EduVate</span> Works
            </h2>
            <p className="section-subtitle">
              A simple, structured way to explore your strengths, match them to careers that suit you, and find
              the schools and people who can help you get there.
            </p>
          </div>

          <div className="features-grid">
            <FeatureCard
              icon={<FaRocket />}
              title="Know Your Strengths"
              description="Answer honest questions about your interests, skills, and personality. Takes about 15 minutes and gives you real clarity."
              color="purple"
              delay="0"
            />
            <FeatureCard
              icon={<FaChartBar />}
              title="See Your Options"
              description="Get a clear list of careers that match who you are — not generic advice, but paths grounded in the Cameroonian job market."
              color="blue"
              delay="200"
            />
            <FeatureCard
              icon={<FaUserGraduate />}
              title="Get Real Guidance"
              description="Connect with counselors and professionals who know the local landscape and can walk you through the next steps."
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
            <p className="section-subtitle">Hear from students who used EduVate to find direction</p>
          </div>

          <div className="testimonials-grid">
            <TestimonialCard
              name="Acha Grace"
              role="Environmental Science Student"
              text="Before EduVate, I had no idea what to study. After the assessment, I knew environmental science was the right fit. It gave me the confidence to make a real decision."
              avatar="AG"
              color="purple"
            />
            <TestimonialCard
              name="Neba Kevin"
              role="Web Developer"
              text="The assessment helped me see that my love for building things could actually lead to a career. I've been doing web development for two years now and it still feels like the right call."
              avatar="NK"
              color="blue"
            />
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

const TestimonialCard = ({ name, role, text, avatar, color }) => (
  <div className="testimonial-card">
    <div className={`testimonial-accent testimonial-accent-${color}`}></div>
    <p className="testimonial-text">"{text}"</p>
    <div className="testimonial-author">
      <div className={`author-avatar author-avatar-${color}`}>
        <span>{avatar}</span>
      </div>
      <div className="author-info">
        <div className="author-name">{name}</div>
        <div className="author-role">{role}</div>
      </div>
    </div>
  </div>
)

export default LandingPage
