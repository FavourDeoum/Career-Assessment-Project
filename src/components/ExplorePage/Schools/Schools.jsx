"use client"

import { useState } from "react"
import { Link, useLocation } from "react-router-dom"
import {
  Search,
  MapPin,
  Star,
  Filter,
  BookOpen,
  ArrowLeft,
  Heart,
  GraduationCap,
  Users,
  Award,
  DollarSign,
} from "lucide-react"
import "./Schools.css"

const SchoolsPage = () => {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedType, setSelectedType] = useState("all")
  const [selectedLocation, setSelectedLocation] = useState("all")
  const [favorites, setFavorites] = useState(new Set())
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [selectedSchool, setSelectedSchool] = useState(null)
  const [showApplicationForm, setShowApplicationForm] = useState(false)
  const [applicationData, setApplicationData] = useState({
    name: "",
    email: "",
    phone: "",
    paymentMethod: "credit-card",
    motivation: "",
    experience: "",
  })

  // Get URL parameters using useLocation instead of useSearchParams
  const location = useLocation()
  const urlParams = new URLSearchParams(location.search)
  const careerFilter = urlParams.get("career")

  // Enhanced schools data
  const schools = [
    {
      id: 1,
      name: "Tech Valley Institute",
      image: "/placeholder.svg?height=250&width=400",
      rating: 4.8,
      location: "San Francisco, CA",
      programs: ["Software Engineering", "Data Science", "AI", "Cybersecurity"],
      tuition: "$25,000/year",
      type: "Private",
      description:
        "Leading technology education institution with strong industry partnerships and hands-on learning approach.",
      requirements: [
        "High school diploma or equivalent",
        "Basic programming knowledge (preferred)",
        "Strong mathematical foundation",
        "Portfolio of projects (for advanced programs)",
      ],
      applicationProcess: "Complete online application → Technical assessment → Interview → Enrollment",
      accreditation: "ABET Accredited",
      graduationRate: "92%",
      employmentRate: "96% within 6 months",
      campusLife: "Modern facilities, tech labs, student organizations, career services",
      studentCount: "2,500+",
      facultyRatio: "1:12",
      careers: ["software-engineering", "data-science"],
    },
    {
      id: 2,
      name: "Creative Arts Academy",
      image: "/placeholder.svg?height=250&width=400",
      rating: 4.6,
      location: "Los Angeles, CA",
      programs: ["Graphic Design", "Digital Media", "Animation", "UI/UX Design"],
      tuition: "$18,000/year",
      type: "Private",
      description: "Premier creative education institution fostering artistic excellence and professional development.",
      requirements: [
        "High school diploma or equivalent",
        "Portfolio submission",
        "Creative aptitude test",
        "Letter of recommendation",
      ],
      applicationProcess: "Submit portfolio → Creative assessment → Interview → Enrollment decision",
      accreditation: "NASAD Accredited",
      graduationRate: "88%",
      employmentRate: "89% within 6 months",
      campusLife: "Art studios, exhibition spaces, industry mentorship, creative workshops",
      studentCount: "1,800+",
      facultyRatio: "1:10",
      careers: ["graphic-design", "digital-media"],
    },
    {
      id: 3,
      name: "Digital Marketing Hub",
      image: "/placeholder.svg?height=250&width=400",
      rating: 4.5,
      location: "New York, NY",
      programs: ["Digital Marketing", "Social Media Strategy", "SEO Specialization", "Content Marketing"],
      tuition: "$15,000/year",
      type: "Online",
      description:
        "Comprehensive digital marketing education with real-world campaign experience and industry certifications.",
      requirements: [
        "High school diploma or equivalent",
        "Basic computer skills",
        "Interest in marketing and communications",
        "No prior experience required",
      ],
      applicationProcess: "Online application → Skills assessment → Virtual interview → Program start",
      accreditation: "Google Partner Certified",
      graduationRate: "85%",
      employmentRate: "91% within 6 months",
      campusLife: "Virtual classrooms, online communities, industry webinars, career coaching",
      studentCount: "3,200+",
      facultyRatio: "1:15",
      careers: ["digital-marketing"],
    },
    {
      id: 4,
      name: "Business Leadership University",
      image: "/placeholder.svg?height=250&width=400",
      rating: 4.7,
      location: "Chicago, IL",
      programs: ["Business Administration", "Entrepreneurship", "Finance", "Management"],
      tuition: "$22,000/year",
      type: "University",
      description: "Comprehensive business education with focus on leadership development and real-world application.",
      requirements: [
        "High school diploma or equivalent",
        "SAT/ACT scores",
        "Personal statement",
        "Letters of recommendation",
      ],
      applicationProcess: "Online application → Document submission → Interview → Admission decision",
      accreditation: "AACSB Accredited",
      graduationRate: "90%",
      employmentRate: "94% within 6 months",
      campusLife: "Modern campus, business incubator, networking events, internship programs",
      studentCount: "4,500+",
      facultyRatio: "1:18",
      careers: ["business-administration", "entrepreneurship"],
    },
    {
      id: 5,
      name: "Healthcare Professional Institute",
      image: "/placeholder.svg?height=250&width=400",
      rating: 4.9,
      location: "Boston, MA",
      programs: ["Nursing", "Medical Technology", "Healthcare Administration", "Physical Therapy"],
      tuition: "$28,000/year",
      type: "University",
      description: "Premier healthcare education with state-of-the-art facilities and clinical partnerships.",
      requirements: [
        "High school diploma with science courses",
        "Minimum GPA of 3.0",
        "Healthcare experience (preferred)",
        "Background check and health screening",
      ],
      applicationProcess: "Application → Prerequisites review → Interview → Clinical placement",
      accreditation: "CCNE Accredited",
      graduationRate: "95%",
      employmentRate: "98% within 6 months",
      campusLife: "Simulation labs, clinical rotations, research opportunities, student health services",
      studentCount: "3,800+",
      facultyRatio: "1:8",
      careers: ["nursing", "healthcare"],
    },
    {
      id: 6,
      name: "Data Science Academy",
      image: "/placeholder.svg?height=250&width=400",
      rating: 4.7,
      location: "Austin, TX",
      programs: ["Data Science", "Machine Learning", "Big Data Analytics", "AI Engineering"],
      tuition: "$22,000/year",
      type: "Bootcamp",
      description: "Intensive data science education with industry mentorship and job placement assistance.",
      requirements: [
        "Bachelor's degree in any field",
        "Basic programming knowledge",
        "Statistics background (preferred)",
        "Commitment to full-time study",
      ],
      applicationProcess: "Application → Technical assessment → Interview → Bootcamp enrollment",
      accreditation: "Industry Certified",
      graduationRate: "87%",
      employmentRate: "93% within 6 months",
      campusLife: "Collaborative workspace, industry projects, career coaching, networking events",
      studentCount: "800+",
      facultyRatio: "1:12",
      careers: ["data-science", "machine-learning"],
    },
  ]

  const schoolTypes = ["all", "University", "Private", "Online", "Bootcamp"]
  const locations = [
    "all",
    "San Francisco, CA",
    "Los Angeles, CA",
    "New York, NY",
    "Chicago, IL",
    "Boston, MA",
    "Austin, TX",
  ]

  const toggleFavorite = (id) => {
    const newFavorites = new Set(favorites)
    if (newFavorites.has(id)) {
      newFavorites.delete(id)
    } else {
      newFavorites.add(id)
    }
    setFavorites(newFavorites)
  }

  const handleApplicationSubmit = (e) => {
    e.preventDefault()
    console.log("Application submitted:", applicationData)
    alert("Application submitted successfully! You will receive a confirmation email shortly.")
    setShowApplicationForm(false)
    setApplicationData({
      name: "",
      email: "",
      phone: "",
      paymentMethod: "credit-card",
      motivation: "",
      experience: "",
    })
  }

  // Filter schools based on search, type, location, and career
  const filteredSchools = schools.filter((school) => {
    const matchesSearch =
      school.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      school.programs.join(" ").toLowerCase().includes(searchQuery.toLowerCase()) ||
      school.location.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = selectedType === "all" || school.type === selectedType
    const matchesLocation = selectedLocation === "all" || school.location === selectedLocation
    const matchesCareer = !careerFilter || school.careers.includes(careerFilter)

    return matchesSearch && matchesType && matchesLocation && matchesCareer
  })

  // School Detail Component
  const SchoolDetailView = ({ school, onBack }) => {
    return (
      <div className="school-detail-view">
        <div className="school-detail-header">
          <button className="back-button" onClick={onBack}>
            <ArrowLeft size={20} />
            Back to Schools
          </button>

          <div className="school-hero">
            <img src={school.image || "/placeholder.svg"} alt={school.name} className="school-hero-image" />
            <div className="school-hero-content">
              <h1>{school.name}</h1>
              <div className="school-rating-location">
                <span className="rating">⭐ {school.rating}</span>
                <span className="location">
                  <MapPin size={16} />
                  {school.location}
                </span>
                <span className="type">{school.type}</span>
              </div>
              <div className="school-quick-stats">
                <div className="quick-stat">
                  <Users size={16} />
                  <span>{school.studentCount} students</span>
                </div>
                <div className="quick-stat">
                  <GraduationCap size={16} />
                  <span>{school.facultyRatio} faculty ratio</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="school-detail-content">
          <section className="school-overview">
            <h2>About {school.name}</h2>
            <p>{school.description}</p>

            <div className="school-stats-grid">
              <div className="stat-card">
                <Award size={24} />
                <h3>Graduation Rate</h3>
                <span className="stat-value">{school.graduationRate}</span>
              </div>
              <div className="stat-card">
                <Users size={24} />
                <h3>Employment Rate</h3>
                <span className="stat-value">{school.employmentRate}</span>
              </div>
              <div className="stat-card">
                <DollarSign size={24} />
                <h3>Tuition</h3>
                <span className="stat-value">{school.tuition}</span>
              </div>
              <div className="stat-card">
                <BookOpen size={24} />
                <h3>Accreditation</h3>
                <span className="stat-value">{school.accreditation}</span>
              </div>
            </div>
          </section>

          <section className="school-programs">
            <h2>Programs Offered</h2>
            <div className="programs-grid">
              {school.programs.map((program, index) => (
                <div key={index} className="program-card">
                  <BookOpen size={20} />
                  <span>{program}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="school-requirements">
            <h2>Admission Requirements</h2>
            <ul className="requirements-list">
              {school.requirements.map((requirement, index) => (
                <li key={index}>
                  <span className="requirement-bullet">✓</span>
                  {requirement}
                </li>
              ))}
            </ul>
          </section>

          <section className="application-process">
            <h2>Application Process</h2>
            <div className="process-timeline">
              {school.applicationProcess.split(" → ").map((step, index) => (
                <div key={index} className="process-step">
                  <div className="step-number">{index + 1}</div>
                  <div className="step-content">{step}</div>
                </div>
              ))}
            </div>
          </section>

          <section className="campus-life">
            <h2>Campus Life & Facilities</h2>
            <p>{school.campusLife}</p>
          </section>

          <div className="apply-section">
            <button className="apply-now-btn" onClick={() => setShowApplicationForm(true)}>
              Apply Now
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Application Form Component
  const ApplicationForm = ({ school, onClose }) => {
    return (
      <div className="application-form-overlay">
        <div className="application-form">
          <div className="form-header">
            <h2>Apply to {school.name}</h2>
            <button className="close-btn" onClick={onClose}>
              ×
            </button>
          </div>

          <form onSubmit={handleApplicationSubmit}>
            <div className="form-section">
              <h3>Personal Information</h3>
              <div className="form-group">
                <label>Full Name *</label>
                <input
                  type="text"
                  value={applicationData.name}
                  onChange={(e) => setApplicationData({ ...applicationData, name: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Email Address *</label>
                <input
                  type="email"
                  value={applicationData.email}
                  onChange={(e) => setApplicationData({ ...applicationData, email: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Phone Number *</label>
                <input
                  type="tel"
                  value={applicationData.phone}
                  onChange={(e) => setApplicationData({ ...applicationData, phone: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="form-section">
              <h3>Payment Information</h3>
              <div className="form-group">
                <label>Payment Method *</label>
                <select
                  value={applicationData.paymentMethod}
                  onChange={(e) => setApplicationData({ ...applicationData, paymentMethod: e.target.value })}
                  required
                >
                  <option value="credit-card">Credit Card</option>
                  <option value="debit-card">Debit Card</option>
                  <option value="bank-transfer">Bank Transfer</option>
                  <option value="financial-aid">Financial Aid</option>
                </select>
              </div>
            </div>

            <div className="form-section">
              <h3>Additional Information</h3>
              <div className="form-group">
                <label>Why do you want to join this program?</label>
                <textarea
                  value={applicationData.motivation}
                  onChange={(e) => setApplicationData({ ...applicationData, motivation: e.target.value })}
                  rows={4}
                  placeholder="Tell us about your motivation and goals..."
                />
              </div>

              <div className="form-group">
                <label>Previous Experience (if any)</label>
                <textarea
                  value={applicationData.experience}
                  onChange={(e) => setApplicationData({ ...applicationData, experience: e.target.value })}
                  rows={3}
                  placeholder="Describe any relevant experience or background..."
                />
              </div>
            </div>

            <div className="form-actions">
              <button type="button" className="cancel-btn" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="submit-btn">
                Submit Application
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  }

  // Show school detail view
  if (selectedSchool) {
    return (
      <>
        <SchoolDetailView school={selectedSchool} onBack={() => setSelectedSchool(null)} />
        {showApplicationForm && (
          <ApplicationForm school={selectedSchool} onClose={() => setShowApplicationForm(false)} />
        )}
      </>
    )
  }

  return (
    <div className="schools-page">
      {/* Header */}
      <header className="schools-header">
        <button className="back-button" >
            <ArrowLeft size={20} />
            Back to Schools
          </button>

        <div className="header-content">
          <h1>Find Your Perfect School</h1>
          <p>Discover educational institutions that align with your career goals</p>

          <div className="search-container">
            <div className="search-box">
              <Search size={20} />
              <input
                type="text"
                placeholder="Search schools, programs, or locations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button className="filter-btn" onClick={() => setIsFilterOpen(!isFilterOpen)}>
              <Filter size={20} />
            </button>
          </div>
        </div>

        {/* Filters */}
        {isFilterOpen && (
          <div className="filters-section">
            <div className="filter-group">
              <label>School Type</label>
              <select value={selectedType} onChange={(e) => setSelectedType(e.target.value)}>
                {schoolTypes.map((type) => (
                  <option key={type} value={type}>
                    {type === "all" ? "All Types" : type}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label>Location</label>
              <select value={selectedLocation} onChange={(e) => setSelectedLocation(e.target.value)}>
                {locations.map((location) => (
                  <option key={location} value={location}>
                    {location === "all" ? "All Locations" : location}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
      </header>

      {/* Results */}
      <main className="schools-content">
        <div className="results-header">
          <h2>
            {filteredSchools.length} School{filteredSchools.length !== 1 ? "s" : ""} Found
            {careerFilter && ` for ${careerFilter.replace("-", " ")}`}
          </h2>
        </div>

        <div className="schools-grid">
          {filteredSchools.length > 0 ? (
            filteredSchools.map((school) => (
              <div key={school.id} className="school-card">
                <div className="school-image-container">
                  <img src={school.image || "/placeholder.svg"} alt={school.name} />
                  <div className="school-type-badge">{school.type}</div>
                  <button className="favorite-btn" onClick={() => toggleFavorite(school.id)}>
                    <Heart
                      size={18}
                      fill={favorites.has(school.id) ? "#ff4757" : "none"}
                      color={favorites.has(school.id) ? "#ff4757" : "#fff"}
                    />
                  </button>
                </div>

                <div className="school-content">
                  <div className="school-header">
                    <h3>{school.name}</h3>
                    <div className="school-rating">
                      <Star size={16} fill="#ffc048" color="#ffc048" />
                      <span>{school.rating}</span>
                    </div>
                  </div>

                  <div className="school-location">
                    <MapPin size={16} />
                    <span>{school.location}</span>
                  </div>

                  <div className="school-programs">
                    <BookOpen size={16} />
                    <span>
                      {school.programs.slice(0, 2).join(", ")}
                      {school.programs.length > 2 ? "..." : ""}
                    </span>
                  </div>

                  <div className="school-stats">
                    <div className="stat">
                      <span className="stat-label">Students</span>
                      <span className="stat-value">{school.studentCount}</span>
                    </div>
                    <div className="stat">
                      <span className="stat-label">Employment</span>
                      <span className="stat-value">{school.employmentRate}</span>
                    </div>
                  </div>

                  <div className="school-tuition">
                    <strong>{school.tuition}</strong>
                  </div>

                  <div className="school-actions">
                    <button className="explore-btn" onClick={() => setSelectedSchool(school)}>
                      Explore School
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="no-results">
              <h3>No schools found</h3>
              <p>Try adjusting your search criteria or filters.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default SchoolsPage
