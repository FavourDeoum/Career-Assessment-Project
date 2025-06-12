// src/components/Mentors/RecommendedMentorsPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useResults } from '../../contexts/ResultsContext';
import MentorCard from './MentorCard';
import { ArrowLeft } from 'lucide-react';
import './MentorsPages.css'; // Common styles for mentor list pages

// Helper
const deslugify = (slug) => (slug || '').replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase());

const RecommendedMentorsPage = () => {
  const { careerSlug } = useParams();
  const { results, isLoading: resultsLoading } = useResults();
  const [filteredMentors, setFilteredMentors] = useState([]);
  const navigate = useNavigate();
  const careerTitle = deslugify(careerSlug);

  useEffect(() => {
    if (results && results.analysis && results.analysis.recommendedMentors) {
      const mentors = results.analysis.recommendedMentors.filter(mentor =>
        mentor.associatedCareers && mentor.associatedCareers.some(career =>
          career.toLowerCase() === careerTitle.toLowerCase()
        )
      );
      setFilteredMentors(mentors);
    }
  }, [results, careerTitle]);

  if (resultsLoading) return <div className="mentors-page-container"><p>Loading mentors...</p></div>;
  if (!results || !results.analysis) return <div className="mentors-page-container"><p>Assessment data not available.</p></div>;

  return (
    <div className="mentors-page-container">
      <button onClick={() => navigate(-1)} className="back-to-dashboard-button">
        <ArrowLeft size={20} /> Back
      </button>
      <h1 className="mentors-page-title">Recommended Mentors for {careerTitle}</h1>
      {filteredMentors.length > 0 ? (
        <div className="mentors-grid">
          {filteredMentors.map((mentor, index) => (
            <MentorCard key={mentor.id || `mentor-${index}`} mentor={mentor} />
          ))}
        </div>
      ) : (
        <p className="no-mentors-message">
          No specific mentors recommended for this career path based on your assessment.
          Consider exploring <Link to="/mentors/all">all recommended mentors</Link>.
        </p>
      )}
    </div>
  );
};

export default RecommendedMentorsPage;