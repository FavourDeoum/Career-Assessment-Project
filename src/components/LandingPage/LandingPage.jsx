import React from 'react';
import { Link } from 'react-router-dom';
import { FaRocket, FaChartBar, FaUserGraduate } from 'react-icons/fa';
// import LottieAnimation from "../LottieAnimation.js"; // Adjusted path
import animationData from "../../animations/Animation.json"; // Adjusted path
import "./LandingPage.css";

const LandingPage = () => {
  return (
    <div className="landing-page">
      <header className="landing-header">
        <div className="header-content">
          <h1 className="header-title">Discover Your Perfect Career Path</h1>
          <p className="header-description">The Career Assessment Tool helps Advanced Level students in Cameroon find their ideal career based on skills, interests, and personality.</p>
          <Link to="/signup" className="cta-button">
            Get Started
          </Link>
        </div>

        {/* <LottieAnimation animationData={animationData} className="lottie"/> */}
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
          <h2 className="section-title">Testimonials</h2>
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

