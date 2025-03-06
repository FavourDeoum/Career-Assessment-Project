import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, BarChart, Bar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { useUser, useClerk } from '@clerk/clerk-react';
import { Link } from 'react-router-dom';
import "./ADashboard.css";

const CareerDashboard = () => {
    const [results, setResults] = useState(null);
    const [activeSection, setActiveSection] = useState('overview');
    const [expandedCard, setExpandedCard] = useState(null);
    const { user, isLoaded } = useUser();
    const { openUserProfile } = useClerk();

    // Fetch results from the backend
    const fetchResults = async () => {
        try {
            const storedResults = localStorage.getItem('careerAssessmentResults');
            if (storedResults) {
                setResults(JSON.parse(storedResults));
            } else {
                const response = await fetch('/api/app.js', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        answers: {}, // Add assessment answers here
                        categories: [], // Add assessment categories here
                    }),
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch results');
                }

                const data = await response.json();
                localStorage.setItem('careerAssessmentResults', JSON.stringify(data));
                setResults(data);
            }
        } catch (error) {
            console.error('Error fetching results:', error);
            setResults({ analysis: {}, resources: {} });
        }
    };
console.log(results)
    useEffect(() => {
        if (isLoaded && user) {
            fetchResults();
        }
    }, [isLoaded, user]);

    const handleProfileClick = () => {
        openUserProfile();
    };
    const mockSkillsData = [
        { name: 'Technical', value: 85 },
        { name: 'Leadership', value: 72 },
        { name: 'Communication', value: 90 },
        { name: 'Problem Solving', value: 88 },
        { name: 'Creativity', value: 78 },
    ];

    if (!isLoaded) {
        return (
            <div className="loading-container">
                <div className="loader"></div>
                <p>Loading...</p>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="auth-required-container">
                <h2>Authentication Required</h2>
                <p>Please sign in to access your career dashboard.</p>
                <Link to="/sign-in" className="auth-button">Sign In</Link>
            </div>
        );
    }

    const ExpandableCard = ({ title, content, icon, id }) => (
        <div
            className={`dashboard-card ${expandedCard === id ? 'expanded' : ''}`}
            onClick={() => setExpandedCard(expandedCard === id ? null : id)}
        >
            <div className="card-header">
                <div className="card-title">
                    <span className={`card-icon ${icon}`}></span>
                    <h3>{title}</h3>
                </div>
                <span className="expand-icon"></span>
            </div>
            <div className="card-content">
                {content}
            </div>
        </div>
    );


    // Welcome screen for users who haven't taken the assessment yet
    if (!results) {
        return (
            <div className="dashboard-container welcome-container">
                <div className="welcome-content">
                    <div className="welcome-header">
                        <div className="welcome-text">
                            <h1>Welcome, {user.firstName || user.username}!</h1>
                            <p>Discover your ideal career path with our personalized assessment.</p>
                        </div>
                        <div 
                            className="profile-image-container" 
                            onClick={handleProfileClick}
                            title="Manage your account settings"
                        >
                            <img
                                src={user.imageUrl}
                                alt="Profile"
                                className="profile-image"
                            />
                        </div>
                    </div>
                    
                    <div className="welcome-card">
                        <h2>Start Your Career Journey</h2>
                        <p>
                            Our comprehensive assessment will analyze your skills, interests, and preferences
                            to provide tailored career recommendations and growth opportunities.
                        </p>
                        <p>
                            After completing the assessment, you'll receive a personalized dashboard with
                            actionable insights to guide your professional development.
                        </p>
                        <Link to="/assessment" className="assessment-button">
                            Take Career Assessment
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    const renderSectionContent = () => {
        if (!results) return null;

        switch (activeSection) {
            case 'overview':
                return (
                    <div className="dashboard-grid">
                        <ExpandableCard
                            id="paths"
                            title="Recommended Career Paths"
                            icon="icon-compass"
                            content={
                                <div className="career-paths">
                                {results.analysis.careerRecommendations.length > 0 && (
                                    <div className="career-path-item">
                                        <h4>{results.analysis.careerRecommendations[0].jobTitle}</h4>
                                        <p>{results.analysis.careerRecommendations[0].explanation}</p>
                                    </div>
                                )}
                            </div>
                        }
                    />
                        {/* Add more ExpandableCards for other overview sections */}
                        {/* Skills Analysis Card */}
                    <ExpandableCard
                        id="skills"
                        title="Skills Analysis"
                        icon="icon-star"
                        content={
                            <div className="skills-chart">
                                <ResponsiveContainer width="100%" height={300}>
                                    <LineChart data={mockSkillsData}>
                                        <XAxis dataKey="name" />
                                        <YAxis />
                                        <Tooltip />
                                        <Line type="monotone" dataKey="value" stroke="#3B82F6" strokeWidth={2} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        }
                    />

                    {/* Growth Opportunities Card */}
                    <ExpandableCard
    id="growth"
    title="Growth Opportunities"
    icon="icon-trending-up"
    content={
        <div className="growth-opportunities">
            <h4>Emerging Roles</h4>
            <ul>
                {results.analysis.growthOpportunities.emergingRoles.map((role, index) => (
                    <li key={index} className="role-item">
                        {role}
                    </li>
                ))}
            </ul>

            <h4>Sectors</h4>
            <ul>
                {results.analysis.growthOpportunities.sectors.map((sector, index) => (
                    <li key={index} className="sector-item">
                        {sector}
                    </li>
                ))}
            </ul>
        </div>
    }
/>

                {/* Next Steps Card */}
                <ExpandableCard
                        id="steps"
                        title="Recommended Next Steps"
                        icon="icon-target"
                    content={
                       <div className="next-steps">
                       <h4>Immediate Next Steps</h4>
                      <ul>
                         {results.analysis.actionPlan.immediateNextSteps.map((step, index) => (
                        <li key={index} className="step-item" style={{ display: 'flex', alignItems: 'center' }}>
                            <div className="step-number" style={{ marginRight: '10px' }}>{index + 1}.</div>
                            <p>{step}</p>
                       </li>
                    ))}
                </ul>

            <h4>Short Term Goals</h4>
            <ul>
                {results.analysis.actionPlan.shortTermGoals.map((goal, index) => (
                    <li key={index} className="goal-item" style={{ display: 'flex', alignItems: 'center' }}>
                        <div className="goal-number" style={{ marginRight: '10px' }}>{index + 1}.</div>
                        <p>{goal}</p>
                    </li>
                ))}
            </ul>

            {/* <h4>Long Term Roadmap</h4>
            <ul>
                {results.analysis.actionPlan.longTermRoadmap.map((roadmap, index) => (
                    <li key={index} className="roadmap-item" style={{ display: 'flex', alignItems: 'center' }}>
                        <div className="roadmap-number" style={{ marginRight: '10px' }}>{index + 1}.</div>
                        <p>{roadmap}</p>
                    </li>
                ))}
            </ul> */}
        </div>
    }
/>
                    
                     {/* Challenges Card */}
                     <ExpandableCard
    id="challenges"
    title="Potential Challenges"
    icon="icon-alert"
    content={
        <div className="challenges">
            <h4>Challenges</h4>
            <ul>
                {results.analysis.potentialChallenges.challenges.map((challenge, index) => (
                    <li key={index} className="challenge-item">
                        {challenge}
                    </li>
                ))}
            </ul>

            <h4>Mitigation Strategies</h4>
            <ul>
                {results.analysis.potentialChallenges.mitigationStrategies.map((strategy, index) => (
                    <li key={index} className="strategy-item">
                        {strategy}
                    </li>
                ))}
            </ul>
        </div>
    }
/>


                    {/* Resources Card */}
                    {/* <ExpandableCard
                        id="resources"
                        title="Recommended Resources"
                        icon="icon-book"
                        content={
                            <div className="resources">
                                <div className="resource-section">
                                    <h4>Courses</h4>
                                    <ul>
                                        {results.resources.recommendedCourses.map((course, index) => (
                                            <li key={index}>{course}</li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="resource-section">
                                    <h4>Reading Materials</h4>
                                    <ul>
                                        {results.resources.suggestedReadings.map((reading, index) => (
                                            <li key={index}>{reading}</li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        }
                    /> */}
                    </div>
                );

            case 'skills':
                return (
                    <div className="section-content">
                        <h2>Skills Analysis</h2>
                        <div className="dashboard-grid">
                            <ExpandableCard
                                id="skill-breakdown"
                                title="Skill Breakdown"
                                icon="icon-chart"
                                content={
                                    <div className="charts-container">
                                        <ResponsiveContainer width="100%" height={300}>
                                            <BarChart data={results.analysis.skillsData}>
                                                <XAxis dataKey="name" />
                                                <YAxis />
                                                <Tooltip />
                                                <Bar dataKey="value" fill="#3B82F6" />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                }
                            />
                            {/* Add other skill-related ExpandableCards */}

                            <div className="section-content">
    <h2>Skills Analysis</h2>
    <div className="dashboard-grid">
        <ExpandableCard
            id="skill-breakdown"
            title="Skill Breakdown"
            icon="icon-chart"
            content={
                <div className="charts-container">
                    {/* Skills to Develop Section */}
                    <h4>Skills to Develop</h4>
                    <ul>
                        {results.analysis.skillsAnalysis.skillsToDevelop.map((skill, index) => (
                            <li key={index} className="skill-item">
                                {skill}
                            </li>
                        ))}
                    </ul>

                    {/* Strengths Section */}
                    <h4>Strengths</h4>
                    <ul>
                        {results.analysis.skillsAnalysis.strengths.map((strength, index) => (
                            <li key={index} className="strength-item">
                                {strength}
                            </li>
                        ))}
                    </ul>
                </div>
            }
        />
    </div>
</div>
                        </div>
                    </div>
                );

            case 'paths':
                return (
                    <div className="section-content">
                        <h2>Career Paths</h2>
                        <div className="dashboard-grid">
                        <ExpandableCard
    id="paths"
    title="Recommended Career Paths"
    icon="icon-compass"
    content={
        <div className="career-paths">
            {results.analysis.careerRecommendations.map((recommendation, index) => (
                <div key={index} className="career-path-item">
                    <div className="path-number">{index + 1}</div>
                    {index === 1 ? (
                        <div className="job-info">
                            <p className="job-title">{recommendation.jobTitle}</p>
                            <p className="explanation">{recommendation.explanation}</p>
                        </div>
                    ) : (
                        <>
                            <p className="job-title">{recommendation.jobTitle}</p>
                            <p className="explanation">{recommendation.explanation}</p>
                        </>
                    )}
                    {/* <p className="salary-range">{recommendation.salaryRange}</p> */}
                </div>
            ))}
        </div>
    }
/>
                            {/* Add other path-related ExpandableCards */}
                        </div>
                    </div>
                );

            case 'development':
                return (
                    <div className="section-content">
                        <h2>Professional Development</h2>
                        <div className="dashboard-grid">
                            <ExpandableCard
                                id="learning-resources"
                                title="Learning Resources"
                                icon="icon-book"
                                content={
                                    <div className="learning-resources">
                                        {/* Render learning resources */}
                                    </div>
                                }
                            />
                            {/* Add other development-related ExpandableCards */}
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="dashboard-container">
            <header className="dashboard-header">
                <div className="header-content">
                        <div className="header-text">
                            <h1>Your Career Journey Dashboard</h1>
                            <p>Based on your assessment, we have crafted personalized insights to guide your career path.</p>
                        </div>
                        {/* Display the user's profile image with click handler */}
                        <div 
                            className="profile-image-container" 
                            onClick={handleProfileClick}
                            title="Manage your account settings"
                        >
                            <img
                                src={user.imageUrl}
                                alt="Profile"
                                className="profile-image"
                            />
                        </div>
                    </div>
            </header>

            <nav className="dashboard-nav">
                {['overview', 'skills', 'paths', 'development'].map((section) => (
                    <button
                        key={section}
                        onClick={() => setActiveSection(section)}
                        className={`nav-button ${activeSection === section ? 'active' : ''}`}
                    >
                        {section.charAt(0).toUpperCase() + section.slice(1)}
                    </button>
                ))}
            </nav>

            {renderSectionContent()}
        </div>
    );
};

export default CareerDashboard;