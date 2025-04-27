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

    const mockSkillsData = [
        { name: 'Technical', value: 85 },
        { name: 'Leadership', value: 72 },
        { name: 'Communication', value: 90 },
        { name: 'Problem Solving', value: 88 },
        { name: 'Creativity', value: 78 },
    ];

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
                        <p>
                            After completing the assessment, you'll receive a personalized dashboard with
                            actionable insights to guide your professional development.
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
        if (!results) return null;

        switch (activeSection) {
            case 'overview':
                return (
                    <div className="dashboard-grid">
                        <ExpandableCard
                            id="paths"
                            title="Recommended Career Paths"
                            icon="icon-compass"
                            className='recommend'
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
                        {/* <ExpandableCard
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
                        /> */}
                        <ExpandableCard
                            id="growth"
                            title="Growth Opportunities"
                            icon="icon-trending-up"
                            content={
                                <div className="growth-opportunities">
                                    <h4>Emerging Roles</h4>
                                    <ul  className="recommendation-list">
                                        {results.analysis.growthOpportunities.emergingRoles.map((role, index) => (
                                            <li key={index} className="role-item">
                                                {role}
                                            </li>
                                        ))}
                                    </ul>

                                    <h4>Sectors</h4>
                                    <ul className="recommendation-list">
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
                                    <ul className="recommendation-list">
                                        {results.analysis.actionPlan.immediateNextSteps.map((step, index) => (
                                            <li key={index} className="step-item">
                                                {/* <div className="step-number" style={{ marginRight: '10px' }}>{index + 1}.</div> */}
                                                <p>{step}</p>
                                            </li>
                                        ))}
                                    </ul>

                                    <h4>Short Term Goals</h4>
                                    <ul className="recommendation-list">
                                        {results.analysis.actionPlan.shortTermGoals.map((goal, index) => (
                                            <li key={index} className="goal-item">
                                                {/* <div className="goal-number" style={{ marginRight: '10px' }}>{index + 1}.</div> */}
                                                <p>{goal}</p>
                                            </li>
                                        ))}
                                    </ul>

                                    <h4>Long Term Roadmap</h4>
                                    <ul className="recommendation-list">
                                        {results.analysis.actionPlan.longTermRoadmap.map((roadmap, index) => (
                                            <li key={index} className="roadmap-item">
                                                {/* <div className="roadmap-number" style={{ marginRight: '10px' }}>{index + 1}.</div> */}
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
                                    <ul className="recommendation-list">
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

            // Add more cases for 'skills', 'paths', and 'development' as needed

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
                    {/* Skills to Develop Section */}
                    <h4>Skills to Develop</h4>
                    <ul className="recommendation-list">
                        {results.analysis.skillsAnalysis.skillsToDevelop.map((skill, index) => (
                            <li key={index} className="skill-item">
                                {skill}
                            </li>
                        ))}
                    </ul>
                </div>
            }
        />

<ExpandableCard
            id="skill-breakdown"
            title="Skill Breakdown"
            icon="icon-chart"
            content={
                <div className="charts-container">
                    {/* Strengths Section */}
                    <h4>Strengths</h4>
                    <ul className="recommendation-list">
                        {results.analysis.skillsAnalysis.strengths.map((strength, index) => (
                            <li key={index} className="strength-item">
                                {strength}
                            </li>
                        ))}
                    </ul>
                </div>
            }
        />
                            {/* Add other skill-related ExpandableCards */}

                        </div>
                    </div>
                );

            case 'paths':
                return (
                    <div className="section-content">
                        <h2>Career Paths</h2>
                        <div className="dashboard-grid">
                        <ExpandableCard
    id="insights"
    title="Key Insights"
    icon="icon-insight"
    content={
        <div className="insights">
            <h4>Key Takeaways</h4>
            <ul className="recommendation-list">
                {results.analysis.insights.keyTakeaways.map((takeaway, index) => (
                    <li key={index} className="takeaway-item">
                        {takeaway}
                    </li>
                ))}
            </ul >
        </div>
    }
/>

<ExpandableCard
    id="insights"
    title="Key Insights"
    icon="icon-insight"
    content={
        <div className="insights">

            <h4>Motivational Quote</h4>
            <p className="motivational-quote">
                "{results.analysis.insights.motivationalQuote}"
            </p>
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
                        {/* <ExpandableCard
    id="resources"
    title="Recommended Resources"
    icon="icon-book"
    content={
        <div className="resources">
            <div className="resource-section">
                <h4>Recommended Courses</h4>
                <ul>
                    {results.analysis.resources.recommendedCourses > 0 ? (
                        results.analysis.resources.recommendedCourses.map((course, index) => (
                            <li key={index}>{course}</li>
                        ))
                    ) : (
                        <li>No courses available.</li>
                    )}
                </ul>
            </div>
            <div className="resource-section">
                <h4>Suggested Readings</h4>
                <ul>
                    {results.analysis.resources.suggestedReadings > 0 ? (
                        results.analysis.resources.suggestedReadings.map((reading, index) => (
                            <li key={index}>{reading}</li>
                        ))
                    ) : (
                        <li>No readings available.</li>
                    )}
                </ul>
            </div>
            <div className="resource-section">
                <h4>Professional Tools</h4>
                <ul>
                    {results.analysis.resources.professionalTools > 0 ? (
                        results.analysis.resources.professionalTools.map((tool, index) => (
                            <li key={index}>{tool}</li>
                        ))
                    ) : (
                        <li>No tools available.</li>
                    )}
                </ul>
            </div>
        </div>
    }
/> */}
                            {/* Add other development-related ExpandableCards */}

                            {/* <ExpandableCard
                                id="learning-resources"
                                title="Learning Resources"
                                icon="icon-book"
                                content={
                                    <div className="learning-resources">
                                        <h4>Recommended Courses</h4>
                                        <ul className="courses-list">
                                            {mockSkillsData.map((skill, index) => (
                                                <li key={index} className="course-item">
                                                    <h5>Advanced {skill.name} Skills</h5>
                                                    <p className="course-provider">Provider: Professional Learning Academy</p>
                                                    <p className="course-description">
                                                        This course focuses on developing advanced {skill.name.toLowerCase()} skills
                                                        required for career progression in your field.
                                                    </p>
                                                    <button className="resource-button">View Course</button>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                }
                            /> */}



                            <ExpandableCard
                                id="mentorship"
                                title="Mentorship Opportunities"
                                icon="icon-users"
                                content={
                                    <div className="mentorship-opportunities">
                                        <h4>Find a Mentor</h4>
                                        <p>
                                            Based on your career goals, connecting with a mentor in your desired field
                                            can significantly accelerate your professional development.
                                        </p>
                                        <button className="resource-button">Explore Mentorship Program</button>
                                        
                                        <h4>Peer Learning Groups</h4>
                                        <p>
                                            Join a community of professionals with similar career goals to share experiences,
                                            challenges, and resources.
                                        </p>
                                        <button className="resource-button">Join Learning Group</button>
                                    </div>
                                }
                            />
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