// src/components/Mentors/MentorDetailsPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useResults } from '../../contexts/ResultsContext';
import {
  ArrowLeft, Star, Users, Briefcase, MessageSquare, Calendar, CheckCircle, ExternalLink, BookOpen
} from 'lucide-react';
import './MentorDetailsPage.css'; // Create this CSS file

// Helper
const slugify = (text) => (text || '').toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]+/g, '');

const MentorDetailsPage = () => {
  const { mentorId: mentorSlugFromParams } = useParams();
  const { results, isLoading: resultsLoading } = useResults();
  const [mentorData, setMentorData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState("overview");
  const navigate = useNavigate();

  useEffect(() => {
    if (!resultsLoading && results && results.analysis && results.analysis.recommendedMentors) {
      const foundMentor = results.analysis.recommendedMentors.find(
        m => (m.id || slugify(m.name)) === mentorSlugFromParams
      );
      setMentorData(foundMentor);
    }
    setLoading(resultsLoading);
  }, [results, resultsLoading, mentorSlugFromParams]);

  const handleBack = () => navigate(-1);

  const handleBookSession = (mentor) => {
    // Implement booking logic: navigate to external site or internal booking system
    if (mentor.bookingLink) {
      window.open(mentor.bookingLink, '_blank');
    } else {
      alert(`Booking system for ${mentor.name} not available yet. Contact them via provided means.`);
    }
  };
  
  const SectionButton = ({ id, label, icon, isActive, onClick }) => (
    <button onClick={() => onClick(id)} className={`section-button ${isActive ? "section-button-active" : ""}`}>
      {icon}
      <span className="section-button-text">{label}</span>
    </button>
  );


  if (loading) return <div className="mentor-details-container" style={{ padding: "20px", textAlign: "center" }}>Loading mentor details...</div>;
  if (!mentorData) return <div className="mentor-details-container" style={{ padding: "20px", textAlign: "center" }}>Mentor not found.</div>;
  
  const { name, title, image, experience, sessions, rating, expertise = [], price, bio, availability, testimonials = [], communicationChannels = {} } = mentorData;

  return (
    <div className="mentor-details-page">
      <div className="mentor-page-header">
        <button className="back-button" onClick={handleBack}>
          <ArrowLeft size={20} />
          <span className="back-text">Back to Mentors</span>
        </button>
      </div>

      <div className="mentor-hero-section">
        <div className="mentor-hero-avatar">
          <img src={image || '/placeholder.svg'} alt={name} className="hero-avatar-img" />
        </div>
        <div className="mentor-hero-info">
          <h1 className="mentor-hero-name">{name}</h1>
          <p className="mentor-hero-title">{title}</p>
          <div className="mentor-hero-stats">
            {experience && <span><Briefcase size={16} /> {experience}</span>}
            {rating && <span><Star size={16} /> {rating} ({sessions || 0} sessions)</span>}
          </div>
          {expertise.length > 0 && (
            <div className="mentor-hero-expertise">
              {expertise.slice(0,5).map(skill => <span key={skill} className="expertise-tag-hero">{skill}</span>)}
            </div>
          )}
        </div>
        <div className="mentor-hero-actions">
          <button className="book-session-button" onClick={() => handleBookSession(mentorData)}>
            <Calendar size={20} /> Book Session {price && `(${price})`}
          </button>
          {communicationChannels.profile && 
            <a href={communicationChannels.profile} target="_blank" rel="noopener noreferrer" className="view-profile-button">
              <ExternalLink size={18} /> View Full Profile
            </a>
          }
        </div>
      </div>
      
      <div className="mentor-section-navigation">
        <SectionButton id="overview" label="Overview" icon={<BookOpen size={18} />} isActive={activeSection === "overview"} onClick={setActiveSection} />
        <SectionButton id="testimonials" label="Testimonials" icon={<MessageSquare size={18} />} isActive={activeSection === "testimonials"} onClick={setActiveSection} />
        <SectionButton id="contact" label="Contact & Availability" icon={<Calendar size={18} />} isActive={activeSection === "contact"} onClick={setActiveSection} />
      </div>

      <div className="mentor-content-sections">
        {activeSection === "overview" && (
          <div className="content-section">
            <div className="section-card">
              <h3 className="section-title">About {name}</h3>
              <p className="mentor-bio">{bio || "No detailed biography available."}</p>
            </div>
            {expertise.length > 0 &&
              <div className="section-card">
                <h3 className="section-title">Areas of Expertise</h3>
                <ul className="expertise-list">
                  {expertise.map(skill => <li key={skill}><CheckCircle size={16} /> {skill}</li>)}
                </ul>
              </div>
            }
          </div>
        )}
        {activeSection === "testimonials" && (
          <div className="content-section">
             <div className="section-card">
              <h3 className="section-title">What Mentees Say</h3>
              {testimonials.length > 0 ? (
                <div className="testimonials-list">
                  {testimonials.map((testimonial, index) => (
                    <blockquote key={index} className="testimonial-item">
                      <p>"{testimonial.quote}"</p>
                      <footer>- {testimonial.menteeName}, {testimonial.menteeRole}</footer>
                    </blockquote>
                  ))}
                </div>
              ) : <p>No testimonials available yet.</p>}
            </div>
          </div>
        )}
        {activeSection === "contact" && (
           <div className="content-section">
            <div className="section-card">
              <h3 className="section-title">Availability</h3>
              <p>{availability || "Contact mentor for availability details."}</p>
            </div>
            <div className="section-card">
                <h3 className="section-title">Get in Touch</h3>
                {communicationChannels.email && <p>Email: <a href={`mailto:${communicationChannels.email}`}>{communicationChannels.email}</a></p>}
                {communicationChannels.linkedin && <p>LinkedIn: <a href={communicationChannels.linkedin} target="_blank" rel="noopener noreferrer">{communicationChannels.linkedin.split('/').pop()}</a></p>}
                {!communicationChannels.email && !communicationChannels.linkedin && <p>Contact information not publicly available. Use booking link if provided.</p>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MentorDetailsPage;