import React from 'react';
import { motion } from 'framer-motion';
import { FaGraduationCap, FaChartLine, FaHandshake } from 'react-icons/fa';
import './About.css';

const About = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="about-page"
    >
      <div className="about-container">
        <h1 className="about-title">About The Career Assessment Tool</h1>
        <div className="features-grid">
          <FeatureCard
            icon={<FaGraduationCap className="feature-icon" />}
            title="Empowering Students"
            description="We help Advanced Level students in Cameroon discover their potential and make informed career decisions."
          />
          <FeatureCard
            icon={<FaChartLine className="feature-icon" />}
            title="Data-Driven Insights"
            description="Our assessments use advanced algorithms to match your skills and interests with suitable career paths."
          />
          <FeatureCard
            icon={<FaHandshake className="feature-icon" />}
            title="Personalized Guidance"
            description="We provide tailored resources and recommendations to support your career journey."
          />
        </div>
        <div className="mission-section">
          <h2 className="mission-title">Our Mission</h2>
          <p className="mission-text">
            The Career Assessment Tool is dedicated to empowering students in Cameroon with the knowledge and resources they need to make informed decisions about their future. We believe that every student has unique talents and potential, and our goal is to help them discover and nurture these abilities.
          </p>
        </div>
      </div>
    </motion.div>
  );
};

const FeatureCard = ({ icon, title, description }) => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    className="feature-card"
  >
    <div className="feature-icon-wrapper">{icon}</div>
    <h3 className="feature-title">{title}</h3>
    <p className="feature-description">{description}</p>
  </motion.div>
);

export default About;

