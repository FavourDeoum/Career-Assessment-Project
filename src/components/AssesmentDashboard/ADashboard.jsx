import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { useUser } from '@clerk/clerk-react'; // Import Clerk's useUser hook
import "./ADashboard.css";

const CareerDashboard = () => {
    const [results, setResults] = useState(null);
    const [activeSection, setActiveSection] = useState('overview');
    const [expandedCard, setExpandedCard] = useState(null);
    const [profileImage, setProfileImage] = useState(null); // State to store the uploaded profile image
    const { user } = useUser(); // Fetch the signed-in user's data

    useEffect(() => {
        const storedResults = localStorage.getItem('careerAssessmentResults');
        if (storedResults) {
            setResults(JSON.parse(storedResults));
        }
    }, []);

    // Handle file upload for profile image
    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfileImage(reader.result); // Set the uploaded image as the profile image
            };
            reader.readAsDataURL(file); // Read the file as a data URL
        }
    };

    if (!results) {
        return (
            <div className="loading-container">
                <div className="loader"></div>
                <p>Loading your career insights...</p>
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
                        {/* Display the user's profile image */}
                        {user && (
                            <div className="profile-image-container">
                                <input
                                    type="file"
                                    id="profile-upload"
                                    accept="image/*"
                                    style={{ display: 'none' }}
                                    onChange={handleFileUpload}
                                />
                                <label htmlFor="profile-upload">
                                    <img
                                        src={profileImage || user.profileImageUrl} // Use uploaded image or Clerk's default
                                        alt="Profile"
                                        className="profile-image"
                                    />
                                </label>
                            </div>
                        )}
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