import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { useUser, useClerk } from '@clerk/clerk-react';
import { Link } from 'react-router-dom';
import "./ADashboard.css";
import { deleteAssessmentResults, supabase } from '../../supabaseClient'; 

const CareerDashboard = () => {
    const [results, setResults] = useState(null);
    const [activeSection, setActiveSection] = useState('overview');
    const [expandedCard, setExpandedCard] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const { user, isLoaded } = useUser();
    const { openUserProfile } = useClerk();
    
    const fetchResults = async () => {
        try {
            setIsLoading(true);

            if (!user) {
                throw new Error('User must be authenticated to access assessment data');
            }

            console.log(`Fetching assessment data for user: ${user.id}`);

            const { data, error } = await supabase
                .from('career_assessments')
                .select('*')
                .eq('user_id', user.id)
                .maybeSingle();

            if (error) {
                console.error('Supabase fetch error:', error);
                throw error;
            }

            if (!data || !data.results) {
                console.warn('Assessment data not found or results missing');
                setResults(getDefaultResults());
                return;
            }

            setResults(data.results);
            console.log('Assessment results:', data.results);

        } catch (error) {
            console.error('Error fetching assessment results:', error);
            setResults(getDefaultResults());
        } finally {
            setIsLoading(false);
        }
    };

    const getDefaultResults = () => ({
        careerRecommendations: [],
        skillsAnalysis: { strengths: [], skillsToDevelop: [] },
        actionPlans: {
            immediateNextSteps: [],
            shortTermGoals: [],
            longTermRoadmap: []
        },
        potentialChallenges: {
            challenges: [],
            mitigationStrategies: []
        },
        growthOpportunities: {
            sectors: [],
            emergingRoles: []
        },
        personalInsights: {
            keyTakeaways: [],
            motivationalQuote: ""
        },
        resources: {
            recommendedCourses: [],
            suggestedReadings: [],
            professionalTools: []
        }
    });
    const handleTakeNewAssessment = async () => {
        try {
            if (user) {
                await deleteAssessmentResults(user.id);
            }
            setResults(null);
            window.location.href = '/assessment';
        } catch (error) {
            console.error('Error deleting assessment:', error);
        }
    };
    useEffect(() => {
        if (isLoaded && user) {
            fetchResults();
        }
    }, [isLoaded, user]);

    const handleProfileClick = () => {
        openUserProfile();
    };

    const generateSkillsData = () => {
        if (!results?.skillsAnalysis?.strengths) return [];
        
        return results.skillsAnalysis.strengths.map((strength, index) => ({
            name: strength.split(':')[0] || `Skill ${index + 1}`,
            value: parseInt(strength.split(':')[1]) || 70 + index * 5
        }));
    };

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

    if (!results || !results.analysis || results.analysis.careerRecommendations.length === 0) {
        return (
            <div className="dashboard-container welcome-container">
                <div className="welcome-content">
                    <div className="welcome-header">
                        <div className="welcome-text">
                            <h1>Welcome, {user?.fullName || user?.username || 'Guest'}!</h1>
                            {user ? (
                                <p>Get started with your career assessment to discover your ideal career path.</p>
                            ) : (
                                <p>Please sign in to access and save your career assessment results.</p>
                            )}
                        </div>
                        {user && (
                            <div className="profile-image-container" onClick={handleProfileClick}>
                                <img src={user.imageUrl} alt="Profile" className="profile-image" />
                            </div>
                        )}
                    </div>
    
                    <div className="welcome-card">
                        <h2>Start Your Career Journey</h2>
                        <p>
                            Our comprehensive assessment will analyze your skills, interests, and preferences
                            to provide tailored career recommendations and growth opportunities.
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
        );
    }

    const renderSectionContent = () => {
        if (isLoading) return <p>Loading your assessment results...</p>;
    
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
                                    {Array.isArray(results.analysis.careerRecommendations) && results.analysis.careerRecommendations.length > 0 ? (
                                        results.analysis.careerRecommendations.map((recommendation, index) => (
                                            <div key={index} className="career-path-item">
                                                <div className="path-number">{index + 1}</div>
                                                <p className="job-title">{recommendation.jobTitle || `Career Path ${index + 1}`}</p>
                                                <p className="explanation">{recommendation.explanation || 'No explanation provided'}</p>
                                            </div>
                                        ))
                                    ) : (
                                        <p>No career recommendations available.</p>
                                    )}
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
                                        <LineChart data={generateSkillsData()}>
                                            <XAxis dataKey="name" />
                                            <YAxis domain={[0, 100]} />
                                            <Tooltip />
                                            <Line type="monotone" dataKey="value" stroke="#3B82F6" strokeWidth={2} />
                                        </LineChart>
                                    </ResponsiveContainer>
                                    <div className="skills-list">
                                        <h4>Skills to Develop</h4>
                                        <ul>
                                            {Array.isArray(results.analysis.skillsAnalysis.skillsToDevelop) && results.analysis.skillsAnalysis.skillsToDevelop.length > 0 ? (
                                                results.analysis.skillsAnalysis.skillsToDevelop.map((skill, index) => (
                                                    <li key={index}>{skill}</li>
                                                ))
                                            ) : (
                                                <li>No skills to develop identified.</li>
                                            )}
                                        </ul>
                                    </div>
                                </div>
                            }
                        />
                        
                        {/* Other cards for growth opportunities, next steps, etc. */}
                    </div>
                );
    
            // Handle other sections similarly...
            
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
                        <p>Personalized insights based on your assessment results</p>
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

            <div className="dashboard-footer">
                <button onClick={handleTakeNewAssessment} className="retake-button">
                    Retake Assessment
                </button>
            </div>
        </div>
    );
};

export default CareerDashboard;