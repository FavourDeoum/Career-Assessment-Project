import React from 'react';
import { motion } from 'framer-motion';
import { FaStar, FaGraduationCap, FaDollarSign, FaBookmark } from 'react-icons/fa';
import './CareerRecommendations.css';

const careerRecommendations = [
  {
    title: 'Software Developer',
    description: 'Design, develop, and maintain software applications and systems.',
    matchPercentage: 95,
    education: "Bachelor's degree in Computer Science or related field",
    salary: '$70,000 - $120,000',
  },
  {
    title: 'Data Scientist',
    description: 'Analyze complex data to help companies make better decisions.',
    matchPercentage: 88,
    education: "Master's degree in Data Science, Statistics, or related field",
    salary: '$80,000 - $140,000',
  },
  {
    title: 'UX Designer',
    description: 'Create user-friendly interfaces for websites and applications.',
    matchPercentage: 82,
    education: "Bachelor's degree in Design, HCI, or related field",
    salary: '$60,000 - $110,000',
  },
];

const CareerRecommendations = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="recommendations-page"
    >
      <div className="recommendations-container">
        <h1 className="recommendations-title">Your Career Recommendations</h1>
        <div className="recommendations-grid">
          {careerRecommendations.map((career, index) => (
            <CareerCard key={index} career={career} />
          ))}
        </div>
      </div>
    </motion.div>
  );
};

const CareerCard = ({ career }) => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    className="career-card"
  >
    <div className="card-header">
      <h2 className="career-title">{career.title}</h2>
      <span className="match-percentage">{career.matchPercentage}% Match</span>
    </div>
    <p className="career-description">{career.description}</p>
    <div className="career-details">
      <div className="detail-item">
        <FaGraduationCap className="detail-icon" />
        <span className="detail-text">{career.education}</span>
      </div>
      <div className="detail-item">
        <FaDollarSign className="detail-icon" />
        <span className="detail-text">{career.salary}</span>
      </div>
    </div>
    <div className="card-actions">
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="action-button primary"
      >
        <FaStar className="button-icon" /> Learn More
      </motion.button>
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="action-button secondary"
      >
        <FaBookmark className="button-icon" /> Save
      </motion.button>
    </div>
  </motion.div>
);

export default CareerRecommendations;

