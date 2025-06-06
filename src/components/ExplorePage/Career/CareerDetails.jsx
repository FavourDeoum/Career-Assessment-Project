"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { useParams, Link } from "react-router-dom"
import { ArrowLeft, Heart, Share2, BookOpen, Users, Play, Star, MapPin, Clock, DollarSign } from "lucide-react"
import "./CareerDetails.css"

// Move all mock data outside the component to make it globally accessible
const mockCareers = {
  "software-engineering": {
    title: "Software Engineering",
    icon: "💻",
    demand: "Very High",
    avgSalary: "$80k - $130k",
    duration: "2-4 years",
    category: "technology",
    roadmapImage: "/placeholder.svg?height=300&width=400",
    detailedDescription:
      "Software engineering is one of the most in-demand careers in today's digital economy. As a software engineer, you'll design, develop, and maintain software applications and systems that solve real-world problems. This field offers excellent growth opportunities, competitive salaries, and the chance to work with cutting-edge technologies.",
    skills: ["Programming Languages", "Problem Solving", "System Design", "Testing", "Version Control"],
    workEnvironment: "Collaborative teams, remote-friendly, fast-paced innovation",
    careerProgression: "Junior Developer → Senior Developer → Tech Lead → Engineering Manager",
    jobOutlook: "22% growth expected through 2030",
    topCompanies: ["Google", "Microsoft", "Amazon", "Meta", "Apple"],
    certifications: ["AWS Certified", "Google Cloud Professional", "Microsoft Azure"],
    averageHours: "40-45 hours/week",
    remoteOpportunities: "95% of positions offer remote work",
  },
  "data-science": {
    title: "Data Science",
    icon: "📊",
    demand: "Very High",
    avgSalary: "$90k - $150k",
    duration: "2-4 years",
    category: "technology",
    roadmapImage: "/placeholder.svg?height=300&width=400",
    detailedDescription:
      "Data science combines statistics, mathematics, and programming to extract insights from data. As a data scientist, you'll analyze complex datasets, build predictive models, and help organizations make data-driven decisions. This rapidly growing field offers excellent career prospects across various industries.",
    skills: ["Python/R", "Statistics", "Machine Learning", "Data Visualization", "SQL"],
    workEnvironment: "Research-oriented, collaborative, project-based work",
    careerProgression: "Data Analyst → Data Scientist → Senior Data Scientist → Chief Data Officer",
    jobOutlook: "31% growth expected through 2030",
    topCompanies: ["Netflix", "Uber", "Airbnb", "Tesla", "IBM"],
    certifications: ["Certified Analytics Professional", "Google Data Analytics", "IBM Data Science"],
    averageHours: "40-50 hours/week",
    remoteOpportunities: "85% of positions offer remote work",
  },
  "digital-marketing": {
    title: "Digital Marketing",
    icon: "📱",
    demand: "High",
    avgSalary: "$50k - $90k",
    duration: "6 months - 2 years",
    category: "business",
    roadmapImage: "/placeholder.svg?height=300&width=400",
    detailedDescription:
      "Digital marketing focuses on promoting products and services through digital channels. As a digital marketer, you'll create and execute marketing campaigns across various online platforms, analyze performance data, and develop strategies to reach target audiences effectively.",
    skills: ["SEO/SEM", "Social Media Marketing", "Content Creation", "Analytics", "Email Marketing"],
    workEnvironment: "Creative agencies, in-house marketing teams, freelance opportunities",
    careerProgression: "Marketing Assistant → Digital Marketer → Marketing Manager → CMO",
    jobOutlook: "19% growth expected through 2030",
    topCompanies: ["HubSpot", "Salesforce", "Adobe", "Mailchimp", "Buffer"],
    certifications: ["Google Ads", "Facebook Blueprint", "HubSpot Content Marketing"],
    averageHours: "40-45 hours/week",
    remoteOpportunities: "75% of positions offer remote work",
  },
}

const mockSchools = [
  {
    id: 1,
    name: "Tech Valley Institute",
    image: "/placeholder.svg?height=200&width=300",
    rating: 4.8,
    location: "San Francisco, CA",
    programs: ["Software Engineering", "Data Science", "AI"],
    tuition: "$25,000/year",
    type: "Private",
    careers: ["software-engineering", "data-science"],
    duration: "12-18 months",
    jobPlacementRate: "94%",
    studentReviews: 1247,
    accreditation: "ACCET Accredited",
    financialAid: true,
    onlineAvailable: true,
  },
  {
    id: 2,
    name: "Digital Marketing Hub",
    image: "/placeholder.svg?height=200&width=300",
    rating: 4.5,
    location: "New York, NY",
    programs: ["Digital Marketing", "Social Media Strategy", "SEO Specialization"],
    tuition: "$15,000/year",
    type: "Online",
    careers: ["digital-marketing"],
    duration: "6-12 months",
    jobPlacementRate: "87%",
    studentReviews: 892,
    accreditation: "DEAC Accredited",
    financialAid: true,
    onlineAvailable: true,
  },
  {
    id: 3,
    name: "Data Science Academy",
    image: "/placeholder.svg?height=200&width=300",
    rating: 4.7,
    location: "Boston, MA",
    programs: ["Data Science", "Machine Learning", "Big Data Analytics"],
    tuition: "$22,000/year",
    type: "University",
    careers: ["data-science"],
    duration: "18-24 months",
    jobPlacementRate: "91%",
    studentReviews: 1056,
    accreditation: "NEASC Accredited",
    financialAid: true,
    onlineAvailable: false,
  },
]

const mockMentors = [
  {
    id: 1,
    name: "Sarah Chen",
    image: "/placeholder.svg?height=150&width=150",
    specialty: "Software Engineering",
    rating: 4.9,
    experience: "8 years",
    hourlyRate: "$45/hour",
    phone: "+1234567890",
    bio: "Senior full-stack developer with expertise in React, Node.js, and cloud technologies.",
    careers: ["software-engineering"],
    availability: "Mon-Fri, Evenings",
    totalSessions: 342,
    responseTime: "< 2 hours",
    languages: ["English", "Mandarin"],
    timezone: "PST",
    specializations: ["React", "Node.js", "AWS", "System Design"],
  },
  {
    id: 2,
    name: "Marcus Johnson",
    image: "/placeholder.svg?height=150&width=150",
    specialty: "Data Science & ML",
    rating: 4.8,
    experience: "6 years",
    hourlyRate: "$50/hour",
    phone: "+1234567891",
    bio: "Data scientist specializing in machine learning, Python, and statistical analysis.",
    careers: ["data-science"],
    availability: "Flexible, Weekends",
    totalSessions: 278,
    responseTime: "< 4 hours",
    languages: ["English", "Spanish"],
    timezone: "EST",
    specializations: ["Python", "Machine Learning", "Statistics", "Deep Learning"],
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    image: "/placeholder.svg?height=150&width=150",
    specialty: "Digital Marketing",
    rating: 4.7,
    experience: "5 years",
    hourlyRate: "$40/hour",
    phone: "+1234567892",
    bio: "Marketing strategist with proven track record in social media, SEO, and content marketing.",
    careers: ["digital-marketing"],
    availability: "Weekends, Tue/Thu Evenings",
    totalSessions: 195,
    responseTime: "< 3 hours",
    languages: ["English", "Spanish"],
    timezone: "CST",
    specializations: ["SEO", "Social Media", "Content Strategy", "PPC"],
  },
]

const mockVideos = {
  "software-engineering": [
    {
      id: 1,
      title: "Day in the Life of a Software Engineer",
      duration: "12:30",
      thumbnail: "/placeholder.svg?height=120&width=200",
      views: "125K",
      uploadDate: "2024-01-15",
      channel: "TechCareers",
      description: "Follow a senior software engineer through their typical workday at a tech startup.",
      tags: ["career", "software", "day-in-life"],
    },
    {
      id: 2,
      title: "How to Become a Software Engineer",
      duration: "18:45",
      thumbnail: "/placeholder.svg?height=120&width=200",
      views: "89K",
      uploadDate: "2024-01-10",
      channel: "CodePath",
      description: "Complete roadmap and guide to starting your software engineering career.",
      tags: ["tutorial", "career-change", "beginner"],
    },
    {
      id: 3,
      title: "Software Engineering Skills & Salary Guide",
      duration: "15:20",
      thumbnail: "/placeholder.svg?height=120&width=200",
      views: "67K",
      uploadDate: "2024-01-08",
      channel: "TechSalaries",
      description: "Comprehensive breakdown of skills needed and salary expectations.",
      tags: ["salary", "skills", "career-guide"],
    },
  ],
  "data-science": [
    {
      id: 1,
      title: "Day in the Life of a Data Scientist",
      duration: "14:20",
      thumbnail: "/placeholder.svg?height=120&width=200",
      views: "98K",
      uploadDate: "2024-01-12",
      channel: "DataCareers",
      description: "Experience a typical day working with data and machine learning models.",
      tags: ["career", "data-science", "day-in-life"],
    },
    {
      id: 2,
      title: "How to Become a Data Scientist",
      duration: "20:15",
      thumbnail: "/placeholder.svg?height=120&width=200",
      views: "76K",
      uploadDate: "2024-01-09",
      channel: "DataPath",
      description: "Step-by-step guide to breaking into data science from any background.",
      tags: ["tutorial", "career-change", "beginner"],
    },
    {
      id: 3,
      title: "Data Science Skills & Salary Guide",
      duration: "16:40",
      thumbnail: "/placeholder.svg?height=120&width=200",
      views: "54K",
      uploadDate: "2024-01-07",
      channel: "DataSalaries",
      description: "Essential skills and salary expectations for data science roles.",
      tags: ["salary", "skills", "career-guide"],
    },
  ],
  "digital-marketing": [
    {
      id: 1,
      title: "Day in the Life of a Digital Marketer",
      duration: "11:45",
      thumbnail: "/placeholder.svg?height=120&width=200",
      views: "87K",
      uploadDate: "2024-01-11",
      channel: "MarketingCareers",
      description: "See how digital marketers create campaigns and analyze performance.",
      tags: ["career", "marketing", "day-in-life"],
    },
    {
      id: 2,
      title: "How to Become a Digital Marketer",
      duration: "17:30",
      thumbnail: "/placeholder.svg?height=120&width=200",
      views: "65K",
      uploadDate: "2024-01-06",
      channel: "MarketingPath",
      description: "Complete guide to starting your digital marketing career.",
      tags: ["tutorial", "career-change", "beginner"],
    },
    {
      id: 3,
      title: "Digital Marketing Skills & Salary Guide",
      duration: "13:55",
      thumbnail: "/placeholder.svg?height=120&width=200",
      views: "42K",
      uploadDate: "2024-01-05",
      channel: "MarketingSalaries",
      description: "Key skills and salary ranges for digital marketing professionals.",
      tags: ["salary", "skills", "career-guide"],
    },
  ],
}

// Now define the component
export const CareerDetailPage = () => {
  const { career } = useParams()
  const [careerData, setCareerData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")
  const [favorites, setFavorites] = useState(new Set())
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("rating")
  const [showShareModal, setShowShareModal] = useState(false)
  const [error, setError] = useState(null)

  // Load favorites from localStorage
  useEffect(() => {
    const savedFavorites = localStorage.getItem("career-favorites")
    if (savedFavorites) {
      setFavorites(new Set(JSON.parse(savedFavorites)))
    }
  }, [])

  // Save favorites to localStorage
  useEffect(() => {
    localStorage.setItem("career-favorites", JSON.stringify([...favorites]))
  }, [favorites])

  useEffect(() => {
    // Simulate API fetch with error handling
    const fetchCareerData = async () => {
      try {
        setLoading(true)
        setError(null)

        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 500))

        if (mockCareers[career]) {
          setCareerData(mockCareers[career])
        } else {
          throw new Error(`Career "${career}" not found`)
        }
      } catch (err) {
        setError(err.message)
        console.error("Error fetching career data:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchCareerData()
  }, [career])

  const toggleFavorite = useCallback((id, type) => {
    const key = `${type}-${id}`
    setFavorites((prev) => {
      const newFavorites = new Set(prev)
      if (newFavorites.has(key)) {
        newFavorites.delete(key)
      } else {
        newFavorites.add(key)
      }
      return newFavorites
    })
  }, [])

  const openWhatsApp = useCallback((phone, name, specialty) => {
    const message = encodeURIComponent(
      `Hi ${name}, I'm interested in learning ${specialty}. Can you help me get started?`,
    )
    window.open(`https://wa.me/${phone.replace(/[^0-9]/g, "")}?text=${message}`, "_blank")
  }, [])

  const shareCareer = useCallback(async () => {
    const shareData = {
      title: `${careerData.title} Career Path`,
      text: `Check out this ${careerData.title} career information!`,
      url: window.location.href,
    }

    if (navigator.share) {
      try {
        await navigator.share(shareData)
      } catch (err) {
        console.log("Error sharing:", err)
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href)
      alert("Link copied to clipboard!")
    }
  }, [careerData])

  // Filtered and sorted data
  const filteredSchools = useMemo(() => {
    const filtered = mockSchools.filter(
      (school) =>
        school.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        school.programs.some((program) => program.toLowerCase().includes(searchQuery.toLowerCase())),
    )

    return filtered.sort((a, b) => {
      switch (sortBy) {
        case "rating":
          return b.rating - a.rating
        case "tuition":
          return Number.parseInt(a.tuition.replace(/[^0-9]/g, "")) - Number.parseInt(b.tuition.replace(/[^0-9]/g, ""))
        case "name":
          return a.name.localeCompare(b.name)
        default:
          return 0
      }
    })
  }, [searchQuery, sortBy])

  const filteredMentors = useMemo(() => {
    const filtered = mockMentors.filter(
      (mentor) =>
        mentor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        mentor.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
        mentor.specializations.some((spec) => spec.toLowerCase().includes(searchQuery.toLowerCase())),
    )

    return filtered.sort((a, b) => {
      switch (sortBy) {
        case "rating":
          return b.rating - a.rating
        case "price":
          return (
            Number.parseInt(a.hourlyRate.replace(/[^0-9]/g, "")) - Number.parseInt(b.hourlyRate.replace(/[^0-9]/g, ""))
          )
        case "experience":
          return Number.parseInt(b.experience) - Number.parseInt(a.experience)
        default:
          return 0
      }
    })
  }, [searchQuery, sortBy])

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading career information...</p>
      </div>
    )
  }

  if (error || !careerData) {
    return (
      <div className="error-container">
        <h2>Career Not Found</h2>
        <p>{error || "Sorry, we couldn't find information about this career path."}</p>
        <Link to="/explore" className="back-link">
          <ArrowLeft size={20} />
          Back to Explore
        </Link>
      </div>
    )
  }

  const relatedSchools = mockSchools.filter((school) => school.careers.includes(career))
  const relatedMentors = mockMentors.filter((mentor) => mentor.careers.includes(career))
  const careerVideos = mockVideos[career] || []

  return (
    <div className="career-detail-container">
      {/* Header with back button */}
      <div className="career-detail-header">
        <div className="header-actions">
          <Link to="/explore" className="back-button">
            <ArrowLeft size={20} />
            Back to Explore
          </Link>

          <div className="header-buttons">
            <button
              className="action-button"
              onClick={() => toggleFavorite(career, "career")}
              aria-label="Add to favorites"
            >
              <Heart
                size={20}
                fill={favorites.has(`career-${career}`) ? "#ef4444" : "none"}
                color={favorites.has(`career-${career}`) ? "#ef4444" : "currentColor"}
              />
            </button>
            <button className="action-button" onClick={shareCareer} aria-label="Share career">
              <Share2 size={20} />
            </button>
          </div>
        </div>

        <div className="career-hero">
          <div className="career-hero-left">
            <div className="career-icon-large">{careerData.icon}</div>
            <h1 className="career-title">{careerData.title}</h1>
            <div className="career-stats">
              <div className="stat-item">
                <DollarSign size={16} />
                <span className="stat-label">Salary</span>
                <span className="stat-value">{careerData.avgSalary}</span>
              </div>
              <div className="stat-item">
                <Clock size={16} />
                <span className="stat-label">Duration</span>
                <span className="stat-value">{careerData.duration}</span>
              </div>
              <div className="stat-item">
                <span className={`demand-badge ${careerData.demand.toLowerCase().replace(" ", "-")}`}>
                  {careerData.demand} Demand
                </span>
              </div>
            </div>
          </div>
          <div className="career-hero-right">
            <img
              src={careerData.roadmapImage || "/placeholder.svg"}
              alt="Career Roadmap"
              className="roadmap-image"
              loading="lazy"
            />
          </div>
        </div>
      </div>

      {/* Navigation tabs */}
      <nav className="career-nav" role="tablist">
        {["overview", "videos", "schools", "mentors"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`nav-tab ${activeTab === tab ? "active" : ""}`}
            role="tab"
            aria-selected={activeTab === tab}
            aria-controls={`${tab}-panel`}
          >
            {tab === "overview" && <BookOpen size={16} />}
            {tab === "videos" && <Play size={16} />}
            {tab === "schools" && <BookOpen size={16} />}
            {tab === "mentors" && <Users size={16} />}
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </nav>

      {/* Content based on active tab */}
      <div className="career-content">
        {activeTab === "overview" && (
          <div className="overview-content" role="tabpanel" id="overview-panel">
            <section className="career-description">
              <h2>About This Career</h2>
              <p>{careerData.detailedDescription}</p>

              <div className="career-info-grid">
                <div className="info-card">
                  <h3>Key Skills</h3>
                  <div className="skills-list">
                    {careerData.skills.map((skill, index) => (
                      <span key={index} className="skill-tag">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="info-card">
                  <h3>Work Environment</h3>
                  <p>{careerData.workEnvironment}</p>
                </div>

                <div className="info-card">
                  <h3>Career Progression</h3>
                  <p>{careerData.careerProgression}</p>
                </div>

                <div className="info-card">
                  <h3>Job Outlook</h3>
                  <p>{careerData.jobOutlook}</p>
                </div>

                <div className="info-card">
                  <h3>Top Companies</h3>
                  <div className="companies-list">
                    {careerData.topCompanies.map((company, index) => (
                      <span key={index} className="company-tag">
                        {company}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="info-card">
                  <h3>Certifications</h3>
                  <ul className="certifications-list">
                    {careerData.certifications.map((cert, index) => (
                      <li key={index}>{cert}</li>
                    ))}
                  </ul>
                </div>

                <div className="info-card">
                  <h3>Work-Life Balance</h3>
                  <p>
                    <strong>Average Hours:</strong> {careerData.averageHours}
                  </p>
                  <p>
                    <strong>Remote Work:</strong> {careerData.remoteOpportunities}
                  </p>
                </div>
              </div>
            </section>
          </div>
        )}

        {activeTab === "videos" && (
          <div className="videos-content" role="tabpanel" id="videos-panel">
            <div className="section-header">
              <h2>Video Resources</h2>
              <p>Learn from industry experts and get insights into the {careerData.title} field</p>
            </div>
            <div className="video-grid">
              {careerVideos.map((video) => (
                <div key={video.id} className="video-card">
                  <div className="video-thumbnail">
                    <img src={video.thumbnail || "/placeholder.svg"} alt={video.title} loading="lazy" />
                    <div className="play-overlay">
                      <div className="play-button">
                        <Play size={24} />
                      </div>
                    </div>
                    <div className="video-duration">{video.duration}</div>
                  </div>
                  <div className="video-info">
                    <h4>{video.title}</h4>
                    <p className="video-channel">{video.channel}</p>
                    <p className="video-description">{video.description}</p>
                    <div className="video-meta">
                      <span className="video-views">{video.views} views</span>
                      <span className="video-date">{new Date(video.uploadDate).toLocaleDateString()}</span>
                    </div>
                    <div className="video-tags">
                      {video.tags.map((tag, index) => (
                        <span key={index} className="video-tag">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "schools" && (
          <div className="schools-content" role="tabpanel" id="schools-panel">
            <div className="section-header">
              <h2>Top Schools for {careerData.title}</h2>
              <div className="filters">
                <input
                  type="text"
                  placeholder="Search schools..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-input"
                />
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="sort-select">
                  <option value="rating">Sort by Rating</option>
                  <option value="tuition">Sort by Tuition</option>
                  <option value="name">Sort by Name</option>
                </select>
              </div>
            </div>
            <div className="schools-grid">
              {filteredSchools.map((school) => (
                <div key={school.id} className="school-card">
                  <div className="school-header">
                    <img
                      src={school.image || "/placeholder.svg"}
                      alt={school.name}
                      className="school-image"
                      loading="lazy"
                    />
                    <button
                      className="favorite-btn"
                      onClick={() => toggleFavorite(school.id, "school")}
                      aria-label="Add to favorites"
                    >
                      <Heart
                        size={16}
                        fill={favorites.has(`school-${school.id}`) ? "#ef4444" : "none"}
                        color={favorites.has(`school-${school.id}`) ? "#ef4444" : "currentColor"}
                      />
                    </button>
                  </div>
                  <div className="school-info">
                    <h3>{school.name}</h3>
                    <div className="school-meta">
                      <span className="rating">
                        <Star size={14} fill="#fbbf24" color="#fbbf24" />
                        {school.rating} ({school.studentReviews} reviews)
                      </span>
                      <span className="location">
                        <MapPin size={14} />
                        {school.location}
                      </span>
                      <span className="type">{school.type}</span>
                    </div>
                    <div className="school-details">
                      <p>
                        <strong>Duration:</strong> {school.duration}
                      </p>
                      <p>
                        <strong>Job Placement:</strong> {school.jobPlacementRate}
                      </p>
                      <p>
                        <strong>Accreditation:</strong> {school.accreditation}
                      </p>
                      {school.onlineAvailable && <span className="online-badge">Online Available</span>}
                      {school.financialAid && <span className="aid-badge">Financial Aid</span>}
                    </div>
                    <div className="programs">
                      <strong>Programs:</strong> {school.programs.join(", ")}
                    </div>
                    <div className="tuition">{school.tuition}</div>
                    <Link to={`/explore/schools/${school.id}`}>
                      <button className="explore-school-btn">Explore School</button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "mentors" && (
          <div className="mentors-content" role="tabpanel" id="mentors-panel">
            <div className="section-header">
              <h2>Expert Mentors in {careerData.title}</h2>
              <div className="filters">
                <input
                  type="text"
                  placeholder="Search mentors..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-input"
                />
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="sort-select">
                  <option value="rating">Sort by Rating</option>
                  <option value="price">Sort by Price</option>
                  <option value="experience">Sort by Experience</option>
                </select>
              </div>
            </div>
            <div className="mentors-grid">
              {filteredMentors.map((mentor) => (
                <div key={mentor.id} className="mentor-card">
                  <div className="mentor-header">
                    <img
                      src={mentor.image || "/placeholder.svg"}
                      alt={mentor.name}
                      className="mentor-image"
                      loading="lazy"
                    />
                    <button
                      className="favorite-btn"
                      onClick={() => toggleFavorite(mentor.id, "mentor")}
                      aria-label="Add to favorites"
                    >
                      <Heart
                        size={16}
                        fill={favorites.has(`mentor-${mentor.id}`) ? "#ef4444" : "none"}
                        color={favorites.has(`mentor-${mentor.id}`) ? "#ef4444" : "currentColor"}
                      />
                    </button>
                  </div>
                  <div className="mentor-info">
                    <h3>{mentor.name}</h3>
                    <p className="mentor-specialty">{mentor.specialty}</p>
                    <div className="mentor-meta">
                      <span className="rating">
                        <Star size={14} fill="#fbbf24" color="#fbbf24" />
                        {mentor.rating} ({mentor.totalSessions} sessions)
                      </span>
                      <span className="experience">{mentor.experience} exp</span>
                      <span className="response-time">Responds in {mentor.responseTime}</span>
                    </div>
                    <p className="mentor-bio">{mentor.bio}</p>
                    <div className="mentor-specializations">
                      <strong>Specializations:</strong>
                      <div className="specializations-list">
                        {mentor.specializations.map((spec, index) => (
                          <span key={index} className="specialization-tag">
                            {spec}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="mentor-details">
                      <div className="hourly-rate">{mentor.hourlyRate}</div>
                      <div className="availability">Available: {mentor.availability}</div>
                      <div className="languages">Languages: {mentor.languages.join(", ")}</div>
                      <div className="timezone">Timezone: {mentor.timezone}</div>
                    </div>
                    <button
                      className="connect-mentor-btn"
                      onClick={() => openWhatsApp(mentor.phone, mentor.name, mentor.specialty)}
                    >
                      Connect via WhatsApp
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// Export the mock data as well for external access
export { mockCareers, mockSchools, mockMentors, mockVideos }

// Keep the attachment for backward compatibility
CareerDetailPage.mockCareers = mockCareers
CareerDetailPage.mockSchools = mockSchools
CareerDetailPage.mockMentors = mockMentors
CareerDetailPage.mockVideos = mockVideos

export default CareerDetailPage
