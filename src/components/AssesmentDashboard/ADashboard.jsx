"use client"

import { useState, useEffect } from "react"
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts"
import { useUser, useClerk } from "@clerk/clerk-react"
import { Link } from "react-router-dom"
import {
  Compass,
  TrendingUp,
  Target,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Book,
  Users,
  BarChart2,
  Lightbulb,
  Award,
  Briefcase,
  Zap,
  ArrowRight,
} from "lucide-react"
import { deleteAssessmentResults, supabase } from "../../supabaseClient"
import "./ADashboard.css"

const CareerDashboard = () => {
  const [results, setResults] = useState(null)
  const [activeSection, setActiveSection] = useState("overview")
  const [expandedCard, setExpandedCard] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const { user, isLoaded } = useUser()
  const { openUserProfile } = useClerk()

  const fetchResults = async () => {
    try {
      setIsLoading(true)

      if (!user) {
        throw new Error("User must be authenticated to access assessment data")
      }

      console.log(`Fetching assessment data for user: ${user.id}`)

      const { data, error } = await supabase.from("career_assessments").select("*").eq("user_id", user.id).maybeSingle()

      if (error) {
        console.error("Supabase fetch error:", error)
        throw error
      }

      if (!data || !data.results) {
        console.warn("Assessment data not found or results missing")
        setResults(getDefaultResults())
        return
      }

      setResults(data.results)
      console.log("Assessment results:", data.results)
    } catch (error) {
      console.error("Error fetching assessment results:", error)
      setResults(getDefaultResults())
    } finally {
      setIsLoading(false)
    }
  }

  const getDefaultResults = () => ({
    careerRecommendations: [],
    skillsAnalysis: { strengths: [], skillsToDevelop: [] },
    actionPlans: {
      immediateNextSteps: [],
      shortTermGoals: [],
      longTermRoadmap: [],
    },
    potentialChallenges: {
      challenges: [],
      mitigationStrategies: [],
    },
    growthOpportunities: {
      sectors: [],
      emergingRoles: [],
    },
    personalInsights: {
      keyTakeaways: [],
      motivationalQuote: "",
    },
    resources: {
      recommendedCourses: [],
      suggestedReadings: [],
      professionalTools: [],
    },
  })

  const handleTakeNewAssessment = async () => {
    try {
      if (user) {
        await deleteAssessmentResults(user.id)
      }
      setResults(null)
      window.location.href = "/assessment"
    } catch (error) {
      console.error("Error deleting assessment:", error)
    }
  }

  useEffect(() => {
    if (isLoaded && user) {
      fetchResults()
    }
  }, [isLoaded, user])

  const handleProfileClick = () => {
    openUserProfile()
  }

  const mockSkillsData = [
    { name: "Technical", value: 85 },
    { name: "Leadership", value: 72 },
    { name: "Communication", value: 90 },
    { name: "Problem Solving", value: 88 },
    { name: "Creativity", value: 78 },
  ]

  const generateSkillsData = () => {
    if (!results?.skillsAnalysis?.strengths) return []

    return results.skillsAnalysis.strengths.map((strength, index) => ({
      name: strength.split(":")[0] || `Skill ${index + 1}`,
      value: Number.parseInt(strength.split(":")[1]) || 70 + index * 5,
    }))
  }

  const ExpandableCard = ({ title, content, icon, id }) => {
    const isExpanded = expandedCard === id

    return (
      <div
        className={`dashboard-card ${isExpanded ? "expanded" : ""}`}
        onClick={() => setExpandedCard(isExpanded ? null : id)}
      >
        <div className="card-header">
          <div className="card-title">
            {icon}
            <h3>{title}</h3>
          </div>
          <span className="expand-icon">{isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}</span>
        </div>
        <div className={`card-content ${isExpanded ? "expanded" : ""}`}>{content}</div>
      </div>
    )
  }

  if (!results || !results.analysis || results.analysis.careerRecommendations.length === 0) {
    return (
      <div className="dashboard-container welcome-container">
        <div className="welcome-content">
          <div className="welcome-header">
            <div className="welcome-text">
              <h1>Welcome, {user?.fullName || user?.username || "Guest"}!</h1>
              {user ? (
                <p>Get started with your career assessment to discover your ideal career path.</p>
              ) : (
                <p>Please sign in to access and save your career assessment results.</p>
              )}
            </div>
            {user && (
              <div className="profile-image-container" onClick={handleProfileClick}>
                <img src={user.imageUrl || "/placeholder.svg"} alt="Profile" className="profile-image" />
              </div>
            )}
          </div>

          <div className="welcome-card">
            <h2>Start Your Career Journey</h2>
            <p>
              Our comprehensive assessment will analyze your skills, interests, and preferences to provide tailored
              career recommendations and growth opportunities.
            </p>
            <p>
              After completing the assessment, you'll receive a personalized dashboard with actionable insights to guide
              your professional development.
            </p>
            {user ? (
              <Link to="/assessment" className="assessment-button">
                Take Career Assessment
              </Link>
            ) : (
              <Link to="/sign-in" className="assessment-button">
                Sign In to Get Started
              </Link>
            )}
          </div>
        </div>
      </div>
    )
  }

  const renderSectionContent = () => {
    if (!results) return null

    switch (activeSection) {
      case "overview":
        return (
          <div className="dashboard-grid">
            <ExpandableCard
              id="paths"
              title="Recommended Career Paths"
              icon={<Compass className="card-icon-svg" />}
              content={
                <div className="career-paths">
                  {results.analysis.careerRecommendations.map((recommendation, index) => (
                    <div key={index} className="career-path-item">
                      <div className="path-number">{index + 1}</div>
                      <div className="path-content">
                        <p className="job-title">{recommendation.jobTitle}</p>
                        <p className="explanation">{recommendation.explanation}</p>
                      </div>
                    </div>
                  ))}
                </div>
              }
            />
            <ExpandableCard
              id="growth"
              title="Growth Opportunities"
              icon={<TrendingUp className="card-icon-svg" />}
              content={
                <div className="growth-opportunities">
                  <div className="opportunity-section">
                    <h4>Emerging Roles</h4>
                    <ul className="recommendation-list">
                      {results.analysis.growthOpportunities.emergingRoles.map((role, index) => (
                        <li key={index} className="role-item">
                          {role}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="opportunity-section">
                    <h4>Growing Sectors</h4>
                    <ul className="recommendation-list">
                      {results.analysis.growthOpportunities.sectors.map((sector, index) => (
                        <li key={index} className="sector-item">
                          {sector}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              }
            />
            <ExpandableCard
              id="steps"
              title="Recommended Next Steps"
              icon={<Target className="card-icon-svg" />}
              content={
                <div className="next-steps">
                  <div className="steps-section">
                    <h4>Immediate Next Steps</h4>
                    <ul className="recommendation-list">
                      {results.analysis.actionPlan.immediateNextSteps.map((step, index) => (
                        <li key={index} className="step-item">
                          <p>{step}</p>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="steps-section">
                    <h4>Short Term Goals</h4>
                    <ul className="recommendation-list">
                      {results.analysis.actionPlan.shortTermGoals.map((goal, index) => (
                        <li key={index} className="goal-item">
                          <p>{goal}</p>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="steps-section">
                    <h4>Long Term Roadmap</h4>
                    <ul className="recommendation-list">
                      {results.analysis.actionPlan.longTermRoadmap.map((roadmap, index) => (
                        <li key={index} className="roadmap-item">
                          <p>{roadmap}</p>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              }
            />
            <ExpandableCard
              id="challenges"
              title="Potential Challenges"
              icon={<AlertTriangle className="card-icon-svg" />}
              content={
                <div className="challenges">
                  <div className="challenge-section">
                    <h4>Challenges</h4>
                    <ul className="recommendation-list">
                      {results.analysis.potentialChallenges.challenges.map((challenge, index) => (
                        <li key={index} className="challenge-item">
                          {challenge}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="challenge-section">
                    <h4>Mitigation Strategies</h4>
                    <ul className="recommendation-list">
                      {results.analysis.potentialChallenges.mitigationStrategies.map((strategy, index) => (
                        <li key={index} className="strategy-item">
                          {strategy}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              }
            />
          </div>
        )

      case "skills":
        return (
          <div className="section-content">
            <h2 className="section-title">Skills Analysis</h2>
            <div className="dashboard-grid">
              <ExpandableCard
                id="strengths"
                title="Your Strengths"
                icon={<Award className="card-icon-svg" />}
                content={
                  <div className="skills-container">
                    <h4>Key Strengths</h4>
                    <ul className="recommendation-list strengths-list">
                      {results.analysis.skillsAnalysis.strengths.map((strength, index) => (
                        <li key={index} className="strength-item">
                          {strength}
                        </li>
                      ))}
                    </ul>
                  </div>
                }
              />

              <ExpandableCard
                id="develop"
                title="Skills to Develop"
                icon={<Zap className="card-icon-svg" />}
                content={
                  <div className="skills-container">
                    <h4>Areas for Growth</h4>
                    <ul className="recommendation-list develop-list">
                      {results.analysis.skillsAnalysis.skillsToDevelop.map((skill, index) => (
                        <li key={index} className="skill-item">
                          {skill}
                        </li>
                      ))}
                    </ul>
                  </div>
                }
              />

              {/* <ExpandableCard
                id="skill-visualization"
                title="Skills Visualization"
                icon={<BarChart2 className="card-icon-svg" />}
                content={
                  <div className="skills-chart">
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={mockSkillsData}>
                        <XAxis dataKey="name" />
                        <YAxis domain={[0, 100]} />
                        <Tooltip />
                        <Line
                          type="monotone"
                          dataKey="value"
                          stroke="#4c6fff"
                          strokeWidth={2}
                          dot={{ r: 6, fill: "#4c6fff", strokeWidth: 2 }}
                          activeDot={{ r: 8, fill: "#6c8fff" }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                }
              /> */}
            </div>
          </div>
        )

      case "paths":
        return (
          <div className="section-content">
            <h2 className="section-title">Career Paths</h2>
            <div className="dashboard-grid">
              <ExpandableCard
                id="detailed-paths"
                title="Detailed Career Paths"
                icon={<Briefcase className="card-icon-svg" />}
                content={
                  <div className="detailed-paths">
                    {results.analysis.careerRecommendations.map((recommendation, index) => (
                      <div key={index} className="detailed-path-item">
                        <div className="path-header">
                          <div className="path-number-large">{index + 1}</div>
                          <h3 className="path-title">{recommendation.jobTitle}</h3>
                        </div>
                        <div className="path-details">
                          <p className="path-explanation">{recommendation.explanation}</p>
                          <div className="path-actions">
                            <Link to="/explore">
                            <button className="path-action-button">
                              Explore This Path <ArrowRight size={16} />
                            </button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                }
              />

              <ExpandableCard
                id="insights"
                title="Key Insights"
                icon={<Lightbulb className="card-icon-svg" />}
                content={
                  <div className="insights">
                    <div className="insights-section">
                      <h4>Key Takeaways</h4>
                      <ul className="recommendation-list">
                        {results.analysis.insights.keyTakeaways.map((takeaway, index) => (
                          <li key={index} className="takeaway-item">
                            {takeaway}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="quote-section">
                      <h4>Motivational Quote</h4>
                      <blockquote className="motivational-quote">
                        "{results.analysis.insights.motivationalQuote}"
                      </blockquote>
                    </div>
                  </div>
                }
              />
            </div>
          </div>
        )

      case "development":
        return (
          <div className="section-content">
            <h2 className="section-title">Professional Development</h2>
            <div className="dashboard-grid">
              <ExpandableCard
                id="resources"
                title="Learning Resources"
                icon={<Book className="card-icon-svg" />}
                content={
                  <div className="resources">
                    <div className="resource-section">
                      <h4>Recommended Courses</h4>
                      <div className="resource-cards">
                        {mockSkillsData.slice(0, 3).map((skill, index) => (
                          <div key={index} className="resource-card">
                            <h5>Advanced {skill.name} Skills</h5>
                            <p className="resource-provider">Professional Learning Academy</p>
                            <p className="resource-description">
                              This course focuses on developing advanced {skill.name.toLowerCase()} skills required for
                              career progression in your field.
                            </p>
                            <button className="resource-button">View Course</button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                }
              />

              <ExpandableCard
                id="resources"
                title="Learning Resources"
                icon={<Book className="card-icon-svg" />}
                content={
                  <div className="resources">
                    <div className="resource-section">
                      <h4>Recommended Courses</h4>
                      <div className="resource-cards">
                        {mockSkillsData.slice(0, 3).map((skill, index) => (
                          <div key={index} className="resource-card">
                            <h5>Advanced {skill.name} Skills</h5>
                            <p className="resource-provider">Professional Learning Academy</p>
                            <p className="resource-description">
                              This course focuses on developing advanced {skill.name.toLowerCase()} skills required for
                              career progression in your field.
                            </p>
                            <button className="resource-button">View Course</button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                }
              />

              <ExpandableCard
                id="resources"
                title="Learning Resources"
                icon={<Book className="card-icon-svg" />}
                content={
                  <div className="resources">
                    <div className="resource-section">
                      <h4>Recommended Courses</h4>
                      <div className="resource-cards">
                        {mockSkillsData.slice(0, 3).map((skill, index) => (
                          <div key={index} className="resource-card">
                            <h5>Advanced {skill.name} Skills</h5>
                            <p className="resource-provider">Professional Learning Academy</p>
                            <p className="resource-description">
                              This course focuses on developing advanced {skill.name.toLowerCase()} skills required for
                              career progression in your field.
                            </p>
                            <button className="resource-button">View Course</button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                }
              />

              {/* <ExpandableCard
                id="mentorship"
                title="Mentorship Opportunities"
                icon={<Users className="card-icon-svg" />}
                content={
                  <div className="mentorship-opportunities">
                    <div className="mentorship-section">
                      <h4>Find a Mentor</h4>
                      <p>
                        Based on your career goals, connecting with a mentor in your desired field can significantly
                        accelerate your professional development.
                      </p>
                      <button className="resource-button">Explore Mentorship Program</button>
                    </div>

                    <div className="mentorship-section">
                      <h4>Peer Learning Groups</h4>
                      <p>
                        Join a community of professionals with similar career goals to share experiences, challenges,
                        and resources.
                      </p>
                      <button className="resource-button">Join Learning Group</button>
                    </div>
                  </div>
                }
              /> */}
            </div>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="header-content">
          <div className="header-text">
            <h1>Your Career Journey Dashboard</h1>
            <p>Personalized insights based on your assessment results</p>
          </div>
          <div className="profile-image-container" onClick={handleProfileClick} title="Manage your account settings">
            <img src={user.imageUrl || "/placeholder.svg"} alt="Profile" className="profile-image" />
          </div>
        </div>
      </header>

      <nav className="dashboard-nav">
        {["overview", "skills", "paths", "development"].map((section) => (
          <button
            key={section}
            onClick={() => setActiveSection(section)}
            className={`nav-button ${activeSection === section ? "active" : ""}`}
          >
            {section.charAt(0).toUpperCase() + section.slice(1)}
          </button>
        ))}
      </nav>

      {renderSectionContent()}

      <div className="dashboard-footer">
        <button onClick={handleTakeNewAssessment} className="retake-button">
          Retake Assessment
        </button>
      </div>
    </div>
  )
}

export default CareerDashboard
