// src/components/Mentors/MentorCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Users } from 'lucide-react';
import './MentorCard.css'; // Create this CSS file

// Helper (can be in a utils file)
const slugify = (text) => (text || '').toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]+/g, '');

const MentorCard = ({ mentor }) => {
  if (!mentor) return null;

  const mentorSlug = mentor.id || slugify(mentor.name);

  return (
    <div className="mentor-card">
      <div className="mentor-content">
        <div className="mentor-header">
          <div className="mentor-avatar-container">
            <img src={mentor.image || "/placeholder.svg"} alt={mentor.name} className="mentor-avatar" />
            {/* You might want a real online status, this is just a visual placeholder */}
            {mentor.isOnline && <div className="online-indicator"></div>}
          </div>
          <div className="mentor-info">
            <h3 className="mentor-name">{mentor.name}</h3>
            <p className="mentor-title">{mentor.title}</p>
          </div>
        </div>

        <div className="mentor-stats">
          {mentor.experience && (
            <div className="mentor-stat">
              <span className="stat-label">Experience</span>
              <span className="stat-value">{mentor.experience}</span>
            </div>
          )}
          {mentor.sessions !== undefined && ( // Check for undefined if 0 is a valid value
            <div className="mentor-stat">
              <span className="stat-label">Sessions</span>
              <span className="stat-value">{mentor.sessions}</span>
            </div>
          )}
          {mentor.rating && (
            <div className="mentor-stat">
              <span className="stat-label">Rating</span>
              <div className="rating-container">
                <Star className="star-icon" size={16} />
                <span className="stat-value">{mentor.rating}</span>
              </div>
            </div>
          )}
        </div>

        {mentor.expertise && mentor.expertise.length > 0 && (
          <div className="mentor-expertise">
            <p className="expertise-label">Expertise:</p>
            <div className="expertise-tags">
              {mentor.expertise.map((skill, index) => (
                <span key={index} className="expertise-tag">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="mentor-booking">
          {mentor.price && <span className="mentor-price">{mentor.price}</span>}
          <Link to={`/mentor/${mentorSlug}`} className="book-button">
            <Users size={16} />
            View Profile {/* Changed from Book Session to View Profile, booking on details page */}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MentorCard;