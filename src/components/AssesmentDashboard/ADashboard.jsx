import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { useUser, useClerk } from '@clerk/clerk-react';
import { supabase } from '../../supabaseClient';
import { Link } from 'react-router-dom';
import "./ADashboard.css";

const CareerDashboard = () => {
    const [results, setResults] = useState(null);
    const [activeSection, setActiveSection] = useState('overview');
    const [expandedCard, setExpandedCard] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const { user, isLoaded } = useUser();
    const { openUserProfile } = useClerk();

    // Fetch results from Supabase or API if not found
    const fetchResults = async () => {
        try {
            setIsLoading(true);

            if (!user) {
                setIsLoading(false);
                return;
            }

            // Try to get results from Supabase first
            const { data, error } = await supabase
                .from('user_assessment_results')
                .select('answers, categories, results')
                .eq('user_id', user.id)
                .single();

            if (error) {
                if (error.code === 'PGRST116') {
                    console.log("No assessment results found in Supabase.");
                    setIsLoading(false);
                    return;
                } else {
                    console.error('Error fetching from Supabase:', error);
                    throw error;
                }
            }

            // If results exist in Supabase, use them
            if (data && data.results) {
                console.log("Retrieved results from Supabase:", data.results);
                setResults(data.results);
                setIsLoading(false);
                return;
            }

            // If no results in Supabase, fetch from API using stored answers and categories
            if (!data.answers || !data.categories) {
                throw new Error('No assessment data found.');
            }

            const response = await fetch('http://localhost:3000/api/app', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    answers: data.answers,
                    categories: data.categories,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to fetch results from API');
            }

            const apiData = await response.json();
            console.log("API Response:", apiData);

            // Ensure the response has the expected structure
            if (!apiData.analysis || !apiData.analysis.careerRecommendations) {
                throw new Error('Invalid API response format');
            }

            // Store results in Supabase
            await storeResultsInSupabase(apiData);

            setResults(apiData);
            console.log("Fetched new results from API:", apiData);

        } catch (error) {
            console.error('Error in fetchResults:', error);
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

    // Store results in Supabase
    const storeResultsInSupabase = async (data) => {
        if (!user) return;

        try {
            // Check if user already has results
            const { data: existingData, error: checkError } = await supabase
                .from('user_assessment_results')
                .select('id')
                .eq('user_id', user.id)
                .single();

            if (checkError && checkError.code !== 'PGRST116') {
                console.error('Error checking for existing results:', checkError);
                return;
            }

            // If results exist, update them
            if (existingData) {
                const { error: updateError } = await supabase
                    .from('user_assessment_results')
                    .update({
                        answers: data.answers,
                        categories: data.categories,
                        results: data,
                        updated_at: new Date().toISOString()
                    })
                    .eq('user_id', user.id);

                if (updateError) {
                    console.error('Error updating results in Supabase:', updateError);
                } else {
                    console.log('Successfully updated results in Supabase');
                }
            }
            // If results don't exist, insert them
            else {
                const { error: insertError } = await supabase
                    .from('user_assessment_results')
                    .insert({
                        user_id: user.id,
                        answers: data.answers,
                        categories: data.categories,
                        results: data
                    });

                if (insertError) {
                    console.error('Error inserting results in Supabase:', insertError);
                } else {
                    console.log('Successfully stored results in Supabase');
                }
            }
        } catch (error) {
            console.error('Error in storeResultsInSupabase:', error);
        }
    };

    // Function to handle taking a new assessment
    const handleTakeNewAssessment = () => {
        // Clear existing results in state
        setResults(null);
        // Navigate to assessment page
        window.location.href = '/assessment';
    };

    useEffect(() => {
        if (isLoaded && user) {
            fetchResults();
        } else if (isLoaded && !user) {
            setIsLoading(false);
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

                                    <h4>Long Term Roadmap</h4>
                                    <ul>
                                        {results.analysis.actionPlan.longTermRoadmap.map((roadmap, index) => (
                                            <li key={index} className="roadmap-item" style={{ display: 'flex', alignItems: 'center' }}>
                                                <div className="roadmap-number" style={{ marginRight: '10px' }}>{index + 1}.</div>
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

            // Add more cases for 'skills', 'paths', and 'development' as needed
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