// LandingPage.jsx
import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaRocket, FaChartBar, FaUserGraduate } from 'react-icons/fa';
import "./LandingPage.css";
import { useUser } from '@clerk/clerk-react';

const LandingPage = () => {

  //   const { isSignedIn, isLoaded } = useUser();
  // const navigate = useNavigate();

  // useEffect(() => {
  //   if (isLoaded && isSignedIn) {
  //     navigate('/cdashboard');
  //   }
  // }, [isSignedIn, isLoaded, navigate]);

  return (
    <div className="landing-page">
      <header className="landing-header">
        <div className="header-content">
          <div className="header-text-container">
            <h1 className="header-title">Discover Your Perfect Career Path</h1>
            <p className="header-description">
              EduVate which is a blend of <b>Education</b> and <b>Elevate</b>, is a Career Assessment Tool which helps Advanced Level students in Cameroon find their ideal career based on skills, interests, and personality.
            </p>
            <Link to="/signup" className="cta-button">
              Get Started
            </Link>
          </div>
        </div>
      </header>

      <section className="features-section">
        <div className="section-content">
          <h2 className="section-title">Key Features</h2>
          <div className="features-grid">
            <FeatureCard
              icon={<FaRocket className="feature-icon" />}
              title="Personalized Assessments"
              description="Take our comprehensive assessment to discover your unique strengths and interests."
            />
            <FeatureCard
              icon={<FaChartBar className="feature-icon" />}
              title="Career Recommendations"
              description="Receive tailored career suggestions based on your assessment results."
            />
            <FeatureCard
              icon={<FaUserGraduate className="feature-icon" />}
              title="Educational Resources"
              description="Access a wealth of information about various career paths and educational opportunities."
            />
          </div>
        </div>
      </section>

      <section className="testimonials-section">
        <div className="section-content">
          <h2 className="section-title">Success Stories</h2>
          <div className="testimonials-grid">
            <TestimonialCard
              name="Acha Grace"
              text="The Career Assessment Tool helped me discover my passion for environmental science. I'm now pursuing my dream career!"
            />
            <TestimonialCard
              name="Neba Kevin"
              text="Thanks to this platform, I found the perfect balance between my technical skills and creative interests. I'm excited about my future in web development!"
            />
          </div>
        </div>
      </section>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }) => (
  <div className="feature-card">
    <div className="feature-icon-wrapper">{icon}</div>
    <h3 className="feature-title">{title}</h3>
    <p className="feature-description">{description}</p>
  </div>
);

const TestimonialCard = ({ name, text }) => (
  <div className="testimonial-card">
    <p className="testimonial-text">"{text}"</p>
    <p className="testimonial-name">{name}</p>
  </div>
);

export default LandingPage;