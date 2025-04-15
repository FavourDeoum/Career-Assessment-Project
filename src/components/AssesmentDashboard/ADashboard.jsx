import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { useUser, useClerk } from '@clerk/clerk-react';
import { Link } from 'react-router-dom';
import "./ADashboard.css";

const CareerDashboard = () => {
    const [results, setResults] = useState(null);
    const [activeSection, setActiveSection] = useState('overview');
    const [expandedCard, setExpandedCard] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const { user, isLoaded } = useUser();
    const { openUserProfile } = useClerk();

    // LocalStorage keys
    const RESULTS_KEY = 'careerAssessmentResults';
    const ASSESSMENT_DATA_KEY = 'careerAssessmentData';

    // Fetch results from localStorage or API
    const fetchResults = async () => {
        try {
            setIsLoading(true);

            if (!user) {
                setIsLoading(false);
                return;
            }

            // Try to get results from localStorage first
            const storedResults = localStorage.getItem(RESULTS_KEY);
            
            if (storedResults) {
                console.log("Retrieved results from localStorage");
                setResults(JSON.parse(storedResults));
                setIsLoading(false);
                return;
            }

            // Get assessment data from localStorage
            const assessmentData = localStorage.getItem(ASSESSMENT_DATA_KEY);
            if (!assessmentData) {
                throw new Error('No assessment data found');
            }

            const { answers, categories } = JSON.parse(assessmentData);

            // Fetch from API
            const response = await fetch('http://localhost:3000/api/app', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ answers, categories }),
            });

            if (!response.ok) {
                throw new Error('Failed to fetch results from API');
            }

            const apiData = await response.json();
            
            // Validate response structure
            if (!apiData.analysis || !apiData.analysis.careerRecommendations) {
                throw new Error('Invalid API response format');
            }

            // Store results in localStorage
            localStorage.setItem(RESULTS_KEY, JSON.stringify(apiData));
            setResults(apiData);

        } catch (error) {
            console.error('Error in fetchResults:', error);
            // Set default empty results
            setResults({
                analysis: {
                    careerRecommendations: [],
                    growthOpportunities: { emergingRoles: [], sectors: [] },
                    actionPlan: { immediateNextSteps: [], shortTermGoals: [], longTermRoadmap: [] },
                    potentialChallenges: { challenges: [], mitigationStrategies: [] },
                    insights: { keyTakeaways: [], motivationalQuote: '' },
                    skillsAnalysis: { skillsToDevelop: [], strengths: [] },
                    resources: {
                        recommendedCourses: [],
                        suggestedReadings: [],
                        professionalTools: []
                    },
                },
            });
        } finally {
            setIsLoading(false);
        }
    };

    // Store assessment data in localStorage
    const storeAssessmentData = (answers, categories) => {
        localStorage.setItem(ASSESSMENT_DATA_KEY, JSON.stringify({ answers, categories }));
    };

    // Handle taking a new assessment
    const handleTakeNewAssessment = () => {
        // Clear existing results
        localStorage.removeItem(RESULTS_KEY);
        localStorage.removeItem(ASSESSMENT_DATA_KEY);
        setResults(null);
        // Navigate to assessment page
        window.location.href = '/assessment';
    };

    useEffect(() => {
        if (isLoaded) {
            fetchResults();
        }
    }, [isLoaded]);

    const handleProfileClick = () => {
        openUserProfile();
    };

    // Mock data for skills chart
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

    // Expandable card component
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

    // Welcome screen for new users
    if (!results || results.analysis.careerRecommendations.length === 0) {
        return (
            <div className="dashboard-container welcome-container">
                <div className="welcome-content">
                    <div className="welcome-header">
                        <div className="welcome-text">
                            <h1>Welcome, {user.fullName || user.username}!</h1>
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

    // Render content based on active section
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
                                    {results.analysis.careerRecommendations.map((recommendation, index) => (
                                        <div key={index} className="career-path-item">
                                            <div className="path-number">{index + 1}</div>
                                            <p className="job-title">{recommendation.jobTitle}</p>
                                            <p className="explanation">{recommendation.explanation}</p>
                                        </div>
                                    ))}
                                </div>
                            }
                        />
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
                        <ExpandableCard
                            id="steps"
                            title="Recommended Next Steps"
                            icon="icon-target"
                            content={
                                <div className="next-steps">
                                    <h4>Immediate Next Steps</h4>
                                    <ul>
                                        {results.analysis.actionPlan.immediateNextSteps.map((step, index) => (
                                            <li key={index} className="step-item">
                                                <div className="step-number">{index + 1}.</div>
                                                <p>{step}</p>
                                            </li>
                                        ))}
                                    </ul>

                                    <h4>Short Term Goals</h4>
                                    <ul>
                                        {results.analysis.actionPlan.shortTermGoals.map((goal, index) => (
                                            <li key={index} className="goal-item">
                                                <div className="goal-number">{index + 1}.</div>
                                                <p>{goal}</p>
                                            </li>
                                        ))}
                                    </ul>

                                    <h4>Long Term Roadmap</h4>
                                    <ul>
                                        {results.analysis.actionPlan.longTermRoadmap.map((roadmap, index) => (
                                            <li key={index} className="roadmap-item">
                                                <div className="roadmap-number">{index + 1}.</div>
                                                <p>{roadmap}</p>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            }
                        />
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