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
                const parsedResults = JSON.parse(storedResults);
                setResults(parsedResults);
            } else {
                // Fetch results from the backend if not in localStorage
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
            setResults({
                analysis: {
                    careerRecommendations: "No career recommendations available",
                    skillsAnalysis: "No skills analysis available",
                    actionPlan: "No action plan available",
                    challenges: "No challenges identified",
                    growthOpportunities: "No growth opportunities available",
                },
                resources: {
                    recommendedCourses: [],
                    suggestedReadings: [],
                    usefulTools: [],
                },
            });
        }
    };

    useEffect(() => {
        if (isLoaded && user) {
            fetchResults();
        }
    }, [isLoaded, user]);

    // Helper function to safely split career recommendations into items
    const parseCareerRecommendations = (text) => {
        if (!text || typeof text !== 'string') return [];
        return text.split('\n').filter(line => line.trim().length > 0);
    };

    const handleProfileClick = () => {
        openUserProfile();
    };

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

    const skillsData = [
        { name: 'Technical', value: 85 },
        { name: 'Leadership', value: 72 },
        { name: 'Communication', value: 90 },
        { name: 'Problem Solving', value: 88 },
        { name: 'Creativity', value: 78 },
    ];

    const radarData = [
        { subject: 'Technical', A: 85, fullMark: 100 },
        { subject: 'Leadership', A: 72, fullMark: 100 },
        { subject: 'Communication', A: 90, fullMark: 100 },
        { subject: 'Problem Solving', A: 88, fullMark: 100 },
        { subject: 'Creativity', A: 78, fullMark: 100 },
    ];

    const topStrengths = [
        { skill: 'Communication', description: 'Excellent verbal and written communication skills with the ability to articulate complex ideas clearly.' },
        { skill: 'Problem Solving', description: 'Strong analytical approach to breaking down complex issues into manageable parts and finding solutions.' },
        { skill: 'Technical', description: 'Proficient in relevant technical skills required for your field with solid foundational knowledge.' },
    ];

    const areasForImprovement = [
        { skill: 'Leadership', description: 'Developing stronger delegation skills and building team management capabilities.' },
        { skill: 'Creativity', description: 'Enhancing innovative thinking and applying creative approaches to problem-solving.' },
    ];

    const skillGrowthOpportunities = [
        'Take an online course on "Leadership in the Modern Workplace" to build management skills',
        'Join a creative thinking workshop or hackathon to boost innovative problem-solving',
        'Practice public speaking through local Toastmasters clubs to enhance communication confidence',
        'Participate in cross-functional projects to develop versatility and adaptability',
    ];

    const industryInsights = [
        { industry: 'Technology', trend: 'Growing demand for AI and machine learning specialists', growth: 'Expected 22% growth over the next 5 years' },
        { industry: 'Healthcare', trend: 'Increasing need for digital health solutions', growth: 'Projected 18% growth in health tech roles' },
        { industry: 'Sustainability', trend: 'Rising focus on environmental solutions', growth: 'Estimated 15% annual growth in green technology positions' },
    ];

    const companyMatches = [
        { name: 'Innovative Tech Solutions', match: '90% match', reason: 'Values align with your collaborative work style and technical expertise' },
        { name: 'Health Connect', match: '85% match', reason: 'Offers growth opportunities in areas matching your skill development goals' },
        { name: 'Future Sustainability', match: '82% match', reason: 'Company culture emphasizes continuous learning and problem-solving' },
    ];

    const actionableSteps = [
        'Update your LinkedIn profile to highlight your strongest skills',
        'Reach out to professionals in your target industries for informational interviews',
        'Apply for roles that match your skill profile and career aspirations',
        'Attend industry conferences or webinars to expand your knowledge and network',
    ];

    const learningResources = [
        { type: 'Course', name: 'Advanced Technical Skills Masterclass', platform: 'Coursera' },
        { type: 'Book', name: 'Leadership in the Digital Age', author: 'Jane Smith' },
        { type: 'Podcast', name: 'Career Growth Strategies', host: 'Michael Johnson' },
        { type: 'Workshop', name: 'Creative Problem Solving', organization: 'Innovation Labs' },
    ];

    const mentorshipOpportunities = [
        'Join industry-specific mentorship programs through professional associations',
        'Use platforms like MentorCruise or ADPList to find relevant mentors',
        'Attend networking events with a focus on finding potential mentors',
        'Develop a clear mentorship goal and approach potential mentors with specific requests',
    ];

    const networkingTips = [
        'Set a goal to attend at least one industry event per month',
        'Be prepared with a concise elevator pitch about yourself',
        'Follow up with new connections within 48 hours of meeting',
        'Share relevant industry content on LinkedIn to establish your professional voice',
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

    // Helper function to safely split strings
    const safeSplit = (text) => {
        if (typeof text === 'string') {
            return text.split('\n');
        }
        return [String(text)];
    };

    if (!results) {
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

    // Render content based on activeSection
    const renderSectionContent = () => {
        switch (activeSection) {
            case 'skills':
                return (
                    <div className="section-content">
                        <div className="section-header">
                            <h2>Skills Analysis</h2>
                            <p className="section-subtitle">Understanding your skill set and identifying areas for growth</p>
                        </div>
                        
                        <div className="dashboard-grid">
                            <ExpandableCard
                                id="skill-breakdown"
                                title="Skill Breakdown"
                                icon="icon-chart"
                                content={
                                    <div className="charts-container">
                                        <div className="chart-wrapper">
                                            <h4>Bar Chart View</h4>
                                            <ResponsiveContainer width="100%" height={300}>
                                                <BarChart data={skillsData}>
                                                    <XAxis dataKey="name" />
                                                    <YAxis />
                                                    <Tooltip />
                                                    <Bar dataKey="value" fill="#3B82F6" />
                                                </BarChart>
                                            </ResponsiveContainer>
                                        </div>
                                        <div className="chart-wrapper">
                                            <h4>Radar Chart View</h4>
                                            <ResponsiveContainer width="100%" height={300}>
                                                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                                                    <PolarGrid />
                                                    <PolarAngleAxis dataKey="subject" />
                                                    <PolarRadiusAxis angle={30} domain={[0, 100]} />
                                                    <Radar name="Skills" dataKey="A" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                                                </RadarChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </div>
                                }
                            />

                            <ExpandableCard
                                id="top-strengths"
                                title="Top Strengths"
                                icon="icon-star"
                                content={
                                    <div className="strengths-list">
                                        {topStrengths.map((strength, index) => (
                                            <div key={index} className="strength-item">
                                                <h4>{strength.skill}</h4>
                                                <p>{strength.description}</p>
                                            </div>
                                        ))}
                                    </div>
                                }
                            />

                            <ExpandableCard
                                id="areas-improvement"
                                title="Areas for Improvement"
                                icon="icon-trending-up"
                                content={
                                    <div className="improvement-list">
                                        {areasForImprovement.map((area, index) => (
                                            <div key={index} className="improvement-item">
                                                <h4>{area.skill}</h4>
                                                <p>{area.description}</p>
                                            </div>
                                        ))}
                                    </div>
                                }
                            />

                            <ExpandableCard
                                id="skill-growth"
                                title="Skill Growth Opportunities"
                                icon="icon-target"
                                content={
                                    <div className="growth-list">
                                        {skillGrowthOpportunities.map((opportunity, index) => (
                                            <div key={index} className="growth-item">
                                                <div className="growth-number">{index + 1}</div>
                                                <p>{opportunity}</p>
                                            </div>
                                        ))}
                                    </div>
                                }
                            />

                            <ExpandableCard
                                id="skill-planner"
                                title="Interactive Skill Planner"
                                icon="icon-calendar"
                                content={
                                    <div className="skill-planner">
                                        <p>Set goals for improving specific skills and track your progress over time.</p>
                                        <div className="planner-prompt">
                                            <h4>Start Planning Your Skill Development</h4>
                                            <button className="planner-button">Create Skill Plan</button>
                                        </div>
                                    </div>
                                }
                            />
                        </div>
                    </div>
                );

            case 'paths':
                return (
                    <div className="section-content">
                        <div className="section-header">
                            <h2>Career Paths</h2>
                            <p className="section-subtitle">Explore roles, industries, and companies that match your profile</p>
                        </div>
                        
                        <div className="dashboard-grid">
                            <ExpandableCard
                                id="recommended-paths"
                                title="Recommended Career Paths"
                                icon="icon-compass"
                                content={
                                    <div className="career-paths">
                                        {safeSplit(results.analysis.careerRecommendations).map((path, index) => (
                                            <div key={index} className="career-path-item">
                                                <div className="path-number">{index + 1}</div>
                                                <p>{path}</p>
                                            </div>
                                        ))}
                                    </div>
                                }
                            />

                            <ExpandableCard
                                id="industry-insights"
                                title="Industry Insights"
                                icon="icon-briefcase"
                                content={
                                    <div className="industry-insights">
                                        {industryInsights.map((industry, index) => (
                                            <div key={index} className="industry-item">
                                                <h4>{industry.industry}</h4>
                                                <p><strong>Trend:</strong> {industry.trend}</p>
                                                <p><strong>Growth:</strong> {industry.growth}</p>
                                            </div>
                                        ))}
                                    </div>
                                }
                            />

                            <ExpandableCard
                                id="company-matches"
                                title="Company Matches"
                                icon="icon-building"
                                content={
                                    <div className="company-matches">
                                        {companyMatches.map((company, index) => (
                                            <div key={index} className="company-item">
                                                <h4>{company.name}</h4>
                                                <p className="match-percentage">{company.match}</p>
                                                <p>{company.reason}</p>
                                            </div>
                                        ))}
                                    </div>
                                }
                            />

                            <ExpandableCard
                                id="action-steps"
                                title="Actionable Steps"
                                icon="icon-target"
                                content={
                                    <div className="actionable-steps">
                                        {actionableSteps.map((step, index) => (
                                            <div key={index} className="step-item">
                                                <div className="step-number">{index + 1}</div>
                                                <p>{step}</p>
                                            </div>
                                        ))}
                                    </div>
                                }
                            />
                        </div>
                    </div>
                );

            case 'development':
                return (
                    <div className="section-content">
                        <div className="section-header">
                            <h2>Professional Development</h2>
                            <p className="section-subtitle">Enhance your skills and knowledge with curated resources</p>
                        </div>
                        
                        <div className="dashboard-grid">
                            <ExpandableCard
                                id="learning-resources"
                                title="Learning Resources"
                                icon="icon-book"
                                content={
                                    <div className="learning-resources">
                                        <div className="resource-filters">
                                            <button className="filter-button active">All</button>
                                            <button className="filter-button">Courses</button>
                                            <button className="filter-button">Books</button>
                                            <button className="filter-button">Podcasts</button>
                                            <button className="filter-button">Workshops</button>
                                        </div>
                                        <div className="resources-list">
                                            {learningResources.map((resource, index) => (
                                                <div key={index} className="resource-item">
                                                    <div className="resource-type">{resource.type}</div>
                                                    <h4>{resource.name}</h4>
                                                    <p>{resource.type === 'Book' ? `Author: ${resource.author}` : 
                                                        resource.type === 'Podcast' ? `Host: ${resource.host}` : 
                                                        resource.type === 'Workshop' ? `By: ${resource.organization}` : 
                                                        `Platform: ${resource.platform}`}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                }
                            />

                            <ExpandableCard
                                id="mentorship-opportunities"
                                title="Mentorship Opportunities"
                                icon="icon-users"
                                content={
                                    <div className="mentorship-opportunities">
                                        {mentorshipOpportunities.map((opportunity, index) => (
                                            <div key={index} className="mentorship-item">
                                                <div className="mentorship-number">{index + 1}</div>
                                                <p>{opportunity}</p>
                                            </div>
                                        ))}
                                    </div>
                                }
                            />

                            <ExpandableCard
                                id="networking-tips"
                                title="Networking Tips"
                                icon="icon-network"
                                content={
                                    <div className="networking-tips">
                                        {networkingTips.map((tip, index) => (
                                            <div key={index} className="tip-item">
                                                <div className="tip-number">{index + 1}</div>
                                                <p>{tip}</p>
                                            </div>
                                        ))}
                                    </div>
                                }
                            />

                            <ExpandableCard
                                id="development-goals"
                                title="Personal Development Goals"
                                icon="icon-target"
                                content={
                                    <div className="development-goals">
                                        <p>Create and track your personal development goals</p>
                                        <div className="goals-prompt">
                                            <h4>Start Setting Your Professional Development Goals</h4>
                                            <button className="goals-button">Create Development Plan</button>
                                        </div>
                                    </div>
                                }
                            />
                        </div>
                    </div>
                );

            default: // overview
                return (
                    <div className="dashboard-grid">
                        <ExpandableCard
                            id="paths"
                            title="Recommended Career Paths"
                            icon="icon-compass"
                            content={
                                <div className="career-paths">
                                    {safeSplit(results.analysis.careerRecommendations).map((path, index) => (
                                        <div key={index} className="career-path-item">
                                            <div className="path-number">{index + 1}</div>
                                            <p>{path}</p>
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
                                        <LineChart data={skillsData}>
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
                                    {safeSplit(results.analysis.growthOpportunities).map((opportunity, index) => (
                                        <div key={index} className="opportunity-item">
                                            <span className="opportunity-icon"></span>
                                            <p>{opportunity}</p>
                                        </div>
                                    ))}
                                </div>
                            }
                        />

                        <ExpandableCard
                            id="steps"
                            title="Recommended Next Steps"
                            icon="icon-target"
                            content={
                                <div className="next-steps">
                                    {safeSplit(results.analysis.actionPlan).map((step, index) => (
                                        <div key={index} className="step-item">
                                            <div className="step-number">{index + 1}</div>
                                            <p>{step}</p>
                                        </div>
                                    ))}
                                </div>
                            }
                        />

                        <ExpandableCard
                            id="challenges"
                            title="Potential Challenges"
                            icon="icon-alert"
                            content={
                                <div className="challenges">
                                    {safeSplit(results.analysis.challenges).map((challenge, index) => (
                                        <div key={index} className="challenge-item">
                                            <p>{challenge}</p>
                                        </div>
                                    ))}
                                </div>
                            }
                        />

                        <ExpandableCard
                            id="resources"
                            title="Recommended Resources"
                            icon="icon-book"
                            content={
                                <div className="resources">
                                    <div className="resource-section">
                                        <h4>Courses</h4>
                                        <ul>
                                            {(results.resources.recommendedCourses || []).map((course, index) => (
                                                <li key={index}>{course}</li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div className="resource-section">
                                        <h4>Reading Materials</h4>
                                        <ul>
                                            {(results.resources.suggestedReadings || []).map((reading, index) => (
                                                <li key={index}>{reading}</li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            }
                        />
                    </div>
                );
        }
    };

    return (
        <div className="dashboard-container">
            <div className="dashboard-content">
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
        </div>
    );
};

export default CareerDashboard;