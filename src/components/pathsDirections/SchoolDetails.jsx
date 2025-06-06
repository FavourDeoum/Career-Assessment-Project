"use client"

import { useState, useEffect } from "react"
import {
  ArrowLeft,
  MapPin,
  Clock,
  Star,
  GraduationCap,
  FileText,
  CheckCircle,
  ExternalLink,
  Download,
  Calendar,
  DollarSign,
  Users,
  Award,
} from "lucide-react"
import "./SchoolDetails.css"

const SchoolDetailsPage = ({ school, onBack, onNavigateToApplication }) => {
  const [isVisible, setIsVisible] = useState(false)
  const [activeSection, setActiveSection] = useState("overview")

  useEffect(() => {
    setIsVisible(true)
  }, [])

  if (!school) {
    return <div>School not found</div>
  }

  const SectionButton = ({ id, label, icon, isActive, onClick }) => (
    <button onClick={() => onClick(id)} className={`section-button ${isActive ? "section-button-active" : ""}`}>
      {icon}
      <span className="section-button-text">{label}</span>
    </button>
  )

  return (
    <div className={`school-details-page ${isVisible ? "visible" : ""}`}>
      {/* Header */}
      <div className="school-header">
        <div className="school-header-content">
          <button className="back-button" onClick={onBack}>
            <ArrowLeft size={20} />
            <span className="back-text">Back to Schools</span>
          </button>
        </div>
      </div>

      {/* Hero Section */}
      <div className="school-hero">
        <div className="school-hero-image">
          <img src={school.image || "/placeholder.svg"} alt={school.name} className="hero-image" />
          <div className="hero-overlay">
            <div className="hero-badges">
              <div className="ranking-badge">{school.ranking}</div>
              <div className="rating-badge">
                <Star className="star-icon" size={16} />
                <span>{school.rating}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="school-hero-content">
          <div className="school-info">
            <h1 className="school-name">{school.name}</h1>
            <h2 className="program-name">{school.program}</h2>

            <div className="quick-stats">
              <div className="stat-item">
                <MapPin className="stat-icon" size={18} />
                <span>{school.location}</span>
              </div>
              <div className="stat-item">
                <Clock className="stat-icon" size={18} />
                <span>{school.duration}</span>
              </div>
              <div className="stat-item">
                <DollarSign className="stat-icon" size={18} />
                <span>{school.tuition}</span>
              </div>
            </div>
          </div>

          <div className="hero-actions">
            <button
              className="apply-now-button"
              onClick={() => onNavigateToApplication && onNavigateToApplication(school)}
            >
              <GraduationCap size={20} />
              Apply Now
            </button>
            <button className="download-brochure-button">
              <Download size={18} />
              Download Brochure
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="section-navigation">
        <SectionButton
          id="overview"
          label="Overview"
          icon={<FileText size={18} />}
          isActive={activeSection === "overview"}
          onClick={setActiveSection}
        />
        <SectionButton
          id="requirements"
          label="Requirements"
          icon={<CheckCircle size={18} />}
          isActive={activeSection === "requirements"}
          onClick={setActiveSection}
        />
        <SectionButton
          id="application"
          label="How to Apply"
          icon={<ExternalLink size={18} />}
          isActive={activeSection === "application"}
          onClick={setActiveSection}
        />
      </div>

      {/* Content Sections */}
      <div className="school-content">
        {activeSection === "overview" && (
          <div className="content-section overview-section">
            <div className="section-card">
              <h3 className="section-title">Program Overview</h3>
              <p className="program-description">{school.description}</p>
            </div>

            <div className="highlights-grid">
              <div className="highlight-card">
                <div className="highlight-icon">
                  <Users size={24} />
                </div>
                <h4>Small Class Sizes</h4>
                <p>Average class size of 25 students for personalized attention</p>
              </div>

              <div className="highlight-card">
                <div className="highlight-icon">
                  <Award size={24} />
                </div>
                <h4>Industry Recognition</h4>
                <p>Ranked among top programs globally by leading publications</p>
              </div>

              <div className="highlight-card">
                <div className="highlight-icon">
                  <Calendar size={24} />
                </div>
                <h4>Flexible Schedule</h4>
                <p>Evening and weekend classes available for working professionals</p>
              </div>
            </div>

            <div className="section-card">
              <h3 className="section-title">Career Outcomes</h3>
              <div className="outcomes-stats">
                <div className="outcome-stat">
                  <div className="stat-number">95%</div>
                  <div className="stat-label">Employment Rate</div>
                </div>
                <div className="outcome-stat">
                  <div className="stat-number">$120K</div>
                  <div className="stat-label">Average Starting Salary</div>
                </div>
                <div className="outcome-stat">
                  <div className="stat-number">6 months</div>
                  <div className="stat-label">Average Time to Employment</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeSection === "requirements" && (
          <div className="content-section requirements-section">
            <div className="section-card">
              <h3 className="section-title">Admission Requirements</h3>
              <div className="requirements-list">
                {school.requirements.map((requirement, index) => (
                  <div key={index} className="requirement-item">
                    <CheckCircle className="check-icon" size={20} />
                    <span>{requirement}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="section-card">
              <h3 className="section-title">Important Deadlines</h3>
              <div className="deadlines-list">
                <div className="deadline-item">
                  <div className="deadline-date">March 15, 2024</div>
                  <div className="deadline-description">Early Decision Application Deadline</div>
                </div>
                <div className="deadline-item">
                  <div className="deadline-date">May 1, 2024</div>
                  <div className="deadline-description">Regular Decision Application Deadline</div>
                </div>
                <div className="deadline-item">
                  <div className="deadline-date">June 15, 2024</div>
                  <div className="deadline-description">Final Application Deadline</div>
                </div>
              </div>
            </div>

            <div className="section-card">
              <h3 className="section-title">Financial Aid</h3>
              <p>
                Various scholarships and financial aid options are available including merit-based scholarships,
                need-based grants, and graduate assistantships. Contact our financial aid office for more information.
              </p>
            </div>
          </div>
        )}

        {activeSection === "application" && (
          <div className="content-section application-section">
            <div className="section-card">
              <h3 className="section-title">Application Process</h3>
              <p className="application-description">{school.applicationProcess}</p>
            </div>

            <div className="application-steps">
              <div className="step-item">
                <div className="step-number">1</div>
                <div className="step-content">
                  <h4>Prepare Documents</h4>
                  <p>Gather all required documents including transcripts, test scores, and recommendations</p>
                </div>
              </div>

              <div className="step-item">
                <div className="step-number">2</div>
                <div className="step-content">
                  <h4>Submit Application</h4>
                  <p>Complete the online application form and upload all required documents</p>
                </div>
              </div>

              <div className="step-item">
                <div className="step-number">3</div>
                <div className="step-content">
                  <h4>Interview Process</h4>
                  <p>Selected candidates will be invited for an interview (virtual or in-person)</p>
                </div>
              </div>

              <div className="step-item">
                <div className="step-number">4</div>
                <div className="step-content">
                  <h4>Decision Notification</h4>
                  <p>Admission decisions will be communicated within 4-6 weeks of application completion</p>
                </div>
              </div>
            </div>

            <div className="application-cta">
              <button
                className="start-application-button"
                onClick={() => onNavigateToApplication && onNavigateToApplication(school)}
              >
                <GraduationCap size={20} />
                Start Your Application
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default SchoolDetailsPage
