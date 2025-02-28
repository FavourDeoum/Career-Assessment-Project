import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { useUser, useClerk } from '@clerk/clerk-react'; // Import useClerk hook
import { Link } from 'react-router-dom'; // Import Link for navigation
import "./ADashboard.css";

const CareerDashboard = () => {
    const [results, setResults] = useState(null);
    const [activeSection, setActiveSection] = useState('overview');
    const [expandedCard, setExpandedCard] = useState(null);
    const { user, isLoaded } = useUser(); // Fetch the signed-in user's data and loading state
    const { openUserProfile } = useClerk(); // Get the openUserProfile function from Clerk

    useEffect(() => {
        const storedResults = localStorage.getItem('careerAssessmentResults');
        if (storedResults) {
            setResults(JSON.parse(storedResults));
        }
    }, []);

    // Function to handle profile image click
    const handleProfileClick = () => {
        // Open Clerk's user profile management
        openUserProfile();
    };

    // Loading state while authentication data is being fetched
    if (!isLoaded) {
        return (
            <div className="loading-container">
                <div className="loader"></div>
                <p>Loading...</p>
            </div>
        );
    }

    // If user is not authenticated, redirect to login page
    if (!user) {
        return (
            <div className="auth-required-container">
                <h2>Authentication Required</h2>
                <p>Please sign in to access your career dashboard.</p>
                <Link to="/sign-in" className="auth-button">Sign In</Link>
            </div>
        );
    }

    const mockSkillsData = [
        { name: 'Technical', value: 85 },
        { name: 'Leadership', value: 72 },
        { name: 'Communication', value: 90 },
        { name: 'Problem Solving', value: 88 },
        { name: 'Creativity', value: 78 },
    ];

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

    // Dashboard for users who have completed the assessment
    return (
        <div className="dashboard-container">
            <div className="dashboard-content">
                {/* Header */}
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

                {/* Navigation */}
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

                {/* Main Grid */}
                <div className="dashboard-grid">
                    {/* Career Paths Card */}
                    <ExpandableCard
                        id="paths"
                        title="Recommended Career Paths"
                        icon="icon-compass"
                        content={
                            <div className="career-paths">
                                {results.analysis.careerPaths.split('\n').map((path, index) => (
                                    <div key={index} className="career-path-item">
                                        <div className="path-number">{index + 1}</div>
                                        <p>{path}</p>
                                    </div>
                                ))}
                            </div>
                        }
                    />

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
                                {results.analysis.growthOpportunities.split('\n').map((opportunity, index) => (
                                    <div key={index} className="opportunity-item">
                                        <span className="opportunity-icon"></span>
                                        <p>{opportunity}</p>
                                    </div>
                                ))}
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
                                {results.analysis.nextSteps.split('\n').map((step, index) => (
                                    <div key={index} className="step-item">
                                        <div className="step-number">{index + 1}</div>
                                        <p>{step}</p>
                                    </div>
                                ))}
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
                                {results.analysis.challenges.split('\n').map((challenge, index) => (
                                    <div key={index} className="challenge-item">
                                        <p>{challenge}</p>
                                    </div>
                                ))}
                            </div>
                        }
                    />

                    {/* Resources Card */}
                    <ExpandableCard
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
                    />
                </div>
            </div>
        </div>
    );
};

export default CareerDashboard;