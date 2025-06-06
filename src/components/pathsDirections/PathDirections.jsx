"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import {
  ArrowRight,
  PlayCircle,
  GraduationCap,
  Users,
  ArrowLeft,
  ExternalLink,
  Star,
  MapPin,
  Clock,
  TrendingUp,
  ChevronDown,
  ChevronUp,
} from "lucide-react"
import "./PathDirections.css"
import { allMockSchools } from "./mockApi"

// const mockSchool= allMockSchools
const cameroonianSchoolsFormatted=allMockSchools
console.log("mock school is- ", cameroonianSchoolsFormatted)

const CareerExplorePage = () => {
  const [activeTab, setActiveTab] = useState("videos")
  const [isVisible, setIsVisible] = useState(false)
  const [descExpanded, setDescExpanded] = useState(false)
  const navigate = useNavigate()

  // Mock data - in real app, this would come from props or API based on the career path
  const careerData = {
    title: "Data Science",
    description:
      "Data science is an interdisciplinary field that uses scientific methods, processes, algorithms and systems to extract knowledge and insights from structured and unstructured data. Data scientists combine domain expertise, programming skills, and knowledge of mathematics and statistics to extract meaningful insights from data.",
    roadmapImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop&auto=format",

    videos: [
      {
        id: 1,
        title: "Introduction to Data Science in 2024",
        duration: "15:30",
        views: "2.3M",
        thumbnail: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=300&h=200&fit=crop",
        author: "DataTech Academy",
        rating: 4.8,
      },
      {
        id: 2,
        title: "Machine Learning Fundamentals",
        duration: "22:45",
        views: "1.8M",
        thumbnail: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=300&h=200&fit=crop",
        author: "ML Mastery",
        rating: 4.9,
      },
      {
        id: 3,
        title: "Python for Data Science - Complete Guide",
        duration: "45:12",
        views: "950K",
        thumbnail: "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=300&h=200&fit=crop",
        author: "CodeWith Data",
        rating: 4.7,
      },
      {
        id: 4,
        title: "Data Visualization with Tableau",
        duration: "18:20",
        views: "1.2M",
        thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=300&h=200&fit=crop",
        author: "Visual Analytics",
        rating: 4.6,
      },
      {
        id: 5,
        title: "SQL for Data Scientists",
        duration: "35:50",
        views: "800K",
        thumbnail: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=300&h=200&fit=crop",
        author: "Database Pro",
        rating: 4.8,
      },
      {
        id: 6,
        title: "Deep Learning Neural Networks",
        duration: "28:15",
        views: "1.5M",
        thumbnail: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=200&fit=crop",
        author: "AI Research Lab",
        rating: 4.9,
      },
    ],

    schools: [
      {
        id: 1,
        name: "Stanford University",
        program: "MS in Data Science",
        location: "California, USA",
        duration: "2 Years",
        tuition: "$58,000/year",
        ranking: "#1",
        rating: 4.9,
        image: "https://images.unsplash.com/photo-1562774053-701939374585?w=300&h=200&fit=crop",
        description:
          "Stanford's Master of Science in Data Science is a rigorous program that combines statistical theory, computational methods, and real-world applications. Students work with world-renowned faculty and gain hands-on experience with cutting-edge technologies.",
        requirements: [
          "Bachelor's degree in Computer Science, Mathematics, Statistics, or related field",
          "GPA of 3.5 or higher",
          "GRE scores (minimum 320 combined)",
          "TOEFL/IELTS for international students",
          "3 letters of recommendation",
          "Statement of purpose",
          "Programming experience in Python/R",
        ],
        applicationProcess:
          "Applications are reviewed holistically. Submit all required documents through the Stanford Graduate Admissions portal. Early applications are encouraged as admission is highly competitive.",
      },
      {
        id: 2,
        name: "MIT",
        program: "Master of Business Analytics",
        location: "Massachusetts, USA",
        duration: "12 Months",
        tuition: "$78,000",
        ranking: "#2",
        rating: 4.8,
        image: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=300&h=200&fit=crop",
        description:
          "MIT's Master of Business Analytics is an intensive 12-month program that prepares students to harness the power of data analytics to drive business decisions. The program combines technical rigor with business acumen.",
        requirements: [
          "Bachelor's degree from an accredited institution",
          "Strong quantitative background",
          "GMAT or GRE scores",
          "2+ years of work experience preferred",
          "English proficiency (TOEFL/IELTS)",
          "Essays and recommendations",
          "Interview (by invitation)",
        ],
        applicationProcess:
          "Submit application through MIT Sloan portal. Include all transcripts, test scores, essays, and recommendations. Interview invitations are extended to qualified candidates.",
      },
      {
        id: 3,
        name: "University of California, Berkeley",
        program: "Master of Information & Data Science",
        location: "California, USA",
        duration: "20 Months",
        tuition: "$70,000",
        ranking: "#3",
        rating: 4.7,
        image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=300&h=200&fit=crop",
        description:
          "UC Berkeley's MIDS program is designed for working professionals who want to advance their careers in data science. The program offers both online and on-campus options with flexible scheduling.",
        requirements: [
          "Bachelor's degree with minimum 3.0 GPA",
          "Statistics and programming coursework",
          "Professional work experience",
          "Statement of purpose",
          "Resume",
          "2 letters of recommendation",
          "No GRE required",
        ],
        applicationProcess:
          "Applications are submitted online through UC Berkeley's application system. Rolling admissions with multiple start dates throughout the year.",
      },
      {
        id: 4,
        name: "Carnegie Mellon University",
        program: "MS in Computational Data Science",
        location: "Pennsylvania, USA",
        duration: "2 Years",
        tuition: "$52,000/year",
        ranking: "#4",
        rating: 4.8,
        image: "https://images.unsplash.com/photo-1607237138185-eedd9c632b0b?w=300&h=200&fit=crop",
        description:
          "CMU's MS in Computational Data Science focuses on the computational and statistical foundations needed to work with large-scale data. Students learn from faculty across multiple departments.",
        requirements: [
          "Bachelor's degree in relevant field",
          "Strong mathematical background",
          "Programming experience",
          "GRE scores recommended",
          "3 letters of recommendation",
          "Personal statement",
          "Transcripts from all institutions",
        ],
        applicationProcess:
          "Submit application through CMU's online portal. Include all required documents and pay application fee. Decisions are made on a rolling basis.",
      },
      {
        id: 5,
        name: "Harvard University",
        program: "Data Science Master's",
        location: "Massachusetts, USA",
        duration: "2 Years",
        tuition: "$65,000/year",
        ranking: "#5",
        rating: 4.9,
        image: "https://images.unsplash.com/photo-1564981797816-1043664bf78d?w=300&h=200&fit=crop",
        description:
          "Harvard's Data Science Master's program combines rigorous training in statistical methods, computational techniques, and domain expertise. Students work on real-world projects with industry partners.",
        requirements: [
          "Bachelor's degree with strong academic record",
          "Mathematics and statistics background",
          "Programming proficiency",
          "GRE or GMAT scores",
          "TOEFL/IELTS for international students",
          "3 recommendation letters",
          "Research statement",
        ],
        applicationProcess:
          "Applications are submitted through Harvard's centralized application system. All materials must be received by the deadline. Interviews may be required for selected candidates.",
      },
      {
        id: 6,
        name: "University of Washington",
        program: "MS in Data Science",
        location: "Washington, USA",
        duration: "18 Months",
        tuition: "$45,000",
        ranking: "#6",
        rating: 4.6,
        image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=200&fit=crop",
        description:
          "UW's MS in Data Science is a professional master's program that emphasizes practical skills and real-world applications. The program includes a capstone project with industry partners.",
        requirements: [
          "Bachelor's degree from accredited institution",
          "Calculus and linear algebra coursework",
          "Programming experience (Python/R preferred)",
          "Minimum 3.0 GPA",
          "Statement of purpose",
          "Resume",
          "2 letters of recommendation",
        ],
        applicationProcess:
          "Submit application online with all supporting documents. Applications are reviewed in the order received. Early application is recommended due to limited enrollment.",
      },
    ],

    mentors: [
      {
        id: 1,
        name: "Dr. Sarah Chen",
        title: "Senior Data Scientist at Google",
        experience: "8+ years",
        expertise: ["Machine Learning", "Big Data", "Python"],
        rating: 4.9,
        sessions: 150,
        price: "$120/hour",
        image: "https://images.unsplash.com/photo-1494790108755-2616c02a0e15?w=150&h=150&fit=crop&crop=face",
        bio: "Dr. Sarah Chen is a Senior Data Scientist at Google with over 8 years of experience in machine learning and big data analytics. She holds a PhD in Computer Science from MIT and has published numerous papers in top-tier conferences.",
        specializations: ["Deep Learning", "Natural Language Processing", "Computer Vision", "MLOps"],
        availability: ["Monday 9AM-5PM PST", "Wednesday 1PM-8PM PST", "Friday 10AM-6PM PST"],
        languages: ["English", "Mandarin"],
        sessionTypes: ["1-on-1 Mentoring", "Code Review", "Career Guidance", "Technical Interview Prep"],
      },
      {
        id: 2,
        name: "Michael Rodriguez",
        title: "Lead Data Engineer at Microsoft",
        experience: "10+ years",
        expertise: ["Data Engineering", "Cloud Computing", "SQL"],
        rating: 4.8,
        sessions: 200,
        price: "$100/hour",
        image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
        bio: "Michael Rodriguez is a Lead Data Engineer at Microsoft with extensive experience in building scalable data pipelines and cloud infrastructure. He specializes in Azure, AWS, and modern data stack technologies.",
        specializations: ["Data Pipeline Architecture", "Cloud Platforms", "ETL/ELT", "Data Warehousing"],
        availability: ["Tuesday 8AM-4PM PST", "Thursday 12PM-8PM PST", "Saturday 9AM-3PM PST"],
        languages: ["English", "Spanish"],
        sessionTypes: ["Architecture Review", "System Design", "Career Mentoring", "Technical Consultation"],
      },
      {
        id: 3,
        name: "Dr. Emily Watson",
        title: "AI Research Scientist at Meta",
        experience: "12+ years",
        expertise: ["Deep Learning", "NLP", "Computer Vision"],
        rating: 5.0,
        sessions: 95,
        price: "$150/hour",
        image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
        bio: "Dr. Emily Watson is an AI Research Scientist at Meta focusing on cutting-edge research in deep learning and computer vision. She has led multiple breakthrough projects and holds several patents in AI.",
        specializations: ["Research Methodology", "Paper Writing", "Conference Presentations", "AI Ethics"],
        availability: ["Monday 2PM-8PM EST", "Wednesday 10AM-4PM EST", "Friday 1PM-7PM EST"],
        languages: ["English", "French"],
        sessionTypes: ["Research Guidance", "Paper Review", "PhD Mentoring", "Industry Transition"],
      },
      {
        id: 4,
        name: "James Park",
        title: "VP of Analytics at Netflix",
        experience: "15+ years",
        expertise: ["Business Analytics", "Strategy", "Leadership"],
        rating: 4.9,
        sessions: 180,
        price: "$200/hour",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
        bio: "James Park is VP of Analytics at Netflix, leading data-driven decision making across the platform. He has extensive experience in scaling analytics teams and implementing data strategies at Fortune 500 companies.",
        specializations: ["Executive Leadership", "Team Building", "Data Strategy", "Business Intelligence"],
        availability: ["Tuesday 3PM-7PM PST", "Thursday 9AM-1PM PST", "Sunday 11AM-3PM PST"],
        languages: ["English", "Korean"],
        sessionTypes: ["Leadership Coaching", "Career Strategy", "Executive Mentoring", "Business Consultation"],
      },
      {
        id: 5,
        name: "Dr. Priya Sharma",
        title: "Principal Data Scientist at Amazon",
        experience: "9+ years",
        expertise: ["Statistics", "A/B Testing", "R"],
        rating: 4.7,
        sessions: 120,
        price: "$110/hour",
        image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face",
        bio: "Dr. Priya Sharma is a Principal Data Scientist at Amazon with deep expertise in statistical modeling and experimentation. She leads the A/B testing platform used across Amazon's e-commerce ecosystem.",
        specializations: ["Statistical Modeling", "Experimental Design", "Causal Inference", "Product Analytics"],
        availability: ["Monday 11AM-5PM EST", "Wednesday 2PM-8PM EST", "Friday 9AM-3PM EST"],
        languages: ["English", "Hindi"],
        sessionTypes: ["Statistical Consulting", "Experiment Design", "Data Analysis", "Academic Mentoring"],
      },
      {
        id: 6,
        name: "Alex Thompson",
        title: "Senior ML Engineer at Tesla",
        experience: "7+ years",
        expertise: ["MLOps", "AutoML", "Deployment"],
        rating: 4.8,
        sessions: 88,
        price: "$130/hour",
        image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
        bio: "Alex Thompson is a Senior ML Engineer at Tesla working on autonomous driving systems. He specializes in MLOps, model deployment, and building production-ready machine learning systems.",
        specializations: ["Model Deployment", "CI/CD for ML", "Monitoring & Observability", "Edge Computing"],
        availability: ["Tuesday 10AM-6PM PST", "Thursday 1PM-7PM PST", "Saturday 8AM-2PM PST"],
        languages: ["English"],
        sessionTypes: ["Technical Mentoring", "Code Review", "System Architecture", "Career Guidance"],
      },
    ],
  }

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const handleNavigateToSchool = (school) => {
    navigate(`/explore/school/${school.id}`)
  }

  const handleNavigateToMentor = (mentor) => {
    navigate(`/explore/mentor/${mentor.id}`)
  }

  const TabButton = ({ id, label, icon, isActive, onClick }) => (
    <button onClick={() => onClick(id)} className={`tab-button ${isActive ? "tab-button-active" : ""}`}>
      {icon}
      <span className="tab-button-text">{label}</span>
    </button>
  )

  const VideoCard = ({ video }) => (
    <div className="video-card">
      <div className="video-thumbnail-container">
        <img src={video.thumbnail || "/placeholder.svg"} alt={video.title} className="video-thumbnail" />
        <div className="video-overlay">
          <PlayCircle className="play-icon" size={48} />
        </div>
        <div className="video-duration">{video.duration}</div>
        <div className="video-rating">
          <Star className="star-icon" size={16} />
          <span className="rating-text">{video.rating}</span>
        </div>
      </div>
      <div className="video-content">
        <h3 className="video-title">{video.title}</h3>
        <p className="video-author">{video.author}</p>
        <div className="video-footer">
          <span className="video-views">{video.views} views</span>
          <button className="watch-button">
            <PlayCircle size={16} />
            Watch
          </button>
        </div>
      </div>
    </div>
  )

  const SchoolCard = ({ school }) => (
    <div className="school-card">
      <div className="school-image-container">
        <img src={school.image || "/placeholder.svg"} alt={school.name} className="school-image" />
        <div className="school-ranking">{school.ranking}</div>
        <div className="school-rating">
          <Star className="star-icon" size={16} />
          <span className="rating-text">{school.rating}</span>
        </div>
      </div>
      <div className="school-content">
        <h3 className="school-name">{school.name}</h3>
        <p className="school-program">{school.program}</p>
        <div className="school-details">
          <div className="school-detail">
            <MapPin size={16} />
            <span className="detail-text">{school.location}</span>
          </div>
          <div className="school-detail">
            <Clock size={16} />
            <span className="detail-text">{school.duration}</span>
          </div>
          <div className="school-detail">
            <TrendingUp size={16} />
            <span className="tuition-text">{school.tuition}</span>
          </div>
        </div>
        <button className="explore-button" onClick={() => handleNavigateToSchool(school)}>
          <ExternalLink size={16} />
          Explore Program
        </button>
      </div>
    </div>
  )

  const MentorCard = ({ mentor }) => (
    <div className="mentor-card">
      <div className="mentor-content">
        <div className="mentor-header">
          <div className="mentor-avatar-container">
            <img src={mentor.image || "/placeholder.svg"} alt={mentor.name} className="mentor-avatar" />
            <div className="online-indicator"></div>
          </div>
          <div className="mentor-info">
            <h3 className="mentor-name">{mentor.name}</h3>
            <p className="mentor-title">{mentor.title}</p>
          </div>
        </div>

        <div className="mentor-stats">
          <div className="mentor-stat">
            <span className="stat-label">Experience</span>
            <span className="stat-value">{mentor.experience}</span>
          </div>
          <div className="mentor-stat">
            <span className="stat-label">Sessions</span>
            <span className="stat-value">{mentor.sessions}</span>
          </div>
          <div className="mentor-stat">
            <span className="stat-label">Rating</span>
            <div className="rating-container">
              <Star className="star-icon" size={16} />
              <span className="stat-value">{mentor.rating}</span>
            </div>
          </div>
        </div>

        <div className="mentor-expertise">
          <p className="expertise-label">Expertise:</p>
          <div className="expertise-tags">
            {mentor.expertise.map((skill, index) => (
              <span key={index} className="expertise-tag">
                {skill}
              </span>
            ))}
          </div>
        </div>

        <div className="mentor-booking">
          <span className="mentor-price">{mentor.price}</span>
          <button className="book-button" onClick={() => handleNavigateToMentor(mentor)}>
            <Users size={16} />
            Book Session
          </button>
        </div>
      </div>
    </div>
  )

  return (
    <div className={`career-explore-page ${isVisible ? "visible" : ""}`}>
      {/* Header Section */}
      <div className="header">
        <div className="header-content">
          <button className="back-button" onClick={() => navigate("/cdashboard")}>
            <ArrowLeft size={20} />
            <span className="back-text">Back to Dashboard</span>
          </button>
        </div>
      </div>

      <div className="main-content">
        {/* Career Title and Roadmap with Description */}
        <div className="hero-section">
          <div className="hero-text">
            <h1 className="career-title">{careerData.title}</h1>
            <div className={`description-container ${descExpanded ? "expanded" : "collapsed"}`}>
              <p className="description-text">{descExpanded ? careerData.description : careerData.description.slice(0, 150) + "..."}</p>
              <button
                className="desc-toggle-button"
                onClick={() => setDescExpanded(!descExpanded)}
                aria-label={descExpanded ? "Collapse description" : "Expand description"}
              >
                {descExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </button>
            </div>
          </div>

          <div className="roadmap-container">
            <div className="roadmap-card">
              <img src={careerData.roadmapImage || "/placeholder.svg"} alt="Career Roadmap" className="roadmap-image" />
              <div className="roadmap-content">
                <h3 className="roadmap-title">Career Roadmap</h3>
                <p className="roadmap-description">Your path to success in {careerData.title}</p>
              </div>
            </div>
          </div>
        </div>

        {/* More About Section */}
        <div className="more-about-section">
          <h2 className="section-title">
            More about <span className="title-highlight">{careerData.title}</span>
          </h2>

          {/* Tab Navigation */}
          <div className="tab-navigation">
            <TabButton
              id="videos"
              label="Videos"
              icon={<PlayCircle size={20} />}
              isActive={activeTab === "videos"}
              onClick={setActiveTab}
            />
            <TabButton
              id="schools"
              label="Schools"
              icon={<GraduationCap size={20} />}
              isActive={activeTab === "schools"}
              onClick={setActiveTab}
            />
            <TabButton
              id="mentors"
              label="Mentors"
              icon={<Users size={20} />}
              isActive={activeTab === "mentors"}
              onClick={setActiveTab}
            />
          </div>

          {/* Tab Content */}
          <div className="tab-content">
            {activeTab === "videos" && (
              <div className="content-section">
                <div className="section-header">
                  <h3 className="content-title">Featured Videos</h3>
                  <button className="view-all-button">
                    View All <ArrowRight size={16} />
                  </button>
                </div>
                <div className="cards-grid">
                  {careerData.videos.map((video) => (
                    <VideoCard key={video.id} video={video} />
                  ))}
                </div>
              </div>
            )}

            {activeTab === "schools" && (
              <div className="content-section">
                <div className="section-header">
                  <h3 className="content-title">Top Schools & Programs</h3>
                  <button className="view-all-button">
                    View All <ArrowRight size={16} />
                  </button>
                </div>
                <div className="cards-grid">
                  {careerData.schools.map((school) => (
                    <SchoolCard key={school.id} school={school} />
                  ))}
                </div>
              </div>
            )}

            {activeTab === "mentors" && (
              <div className="content-section">
                <div className="section-header">
                  <h3 className="content-title">Expert Mentors</h3>
                  <button className="view-all-button">
                    View All <ArrowRight size={16} />
                  </button>
                </div>
                <div className="cards-grid">
                  {careerData.mentors.map((mentor) => (
                    <MentorCard key={mentor.id} mentor={mentor} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CareerExplorePage
