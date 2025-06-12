// src/components/Schools/TutorCard.jsx

import React from 'react';
// Import Link from react-router-dom
import { Link } from 'react-router-dom';
import { Star, Briefcase, Award, CheckCircle, Languages, Quote, Phone, Calendar } from 'lucide-react';

// You'll need a slugify function here too
const slugify = (text) => {
  if (!text) return '';
  return text.toString().toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '').replace(/--+/g, '-').replace(/^-+/, '').replace(/-+$/, '');
};

const TutorCard = ({ tutor }) => {
  if (!tutor) return null;

  const {
    name, 
    image, 
    role, 
    rating, 
    experience, 
    specialization,
    languages = [], 
    studentFeedback, 
    completedSessions
  } = tutor;

  // Render stars function
  const renderStars = (ratingValue) => {
    if (!ratingValue) return null;
    const stars = [];
    const fullStars = Math.floor(ratingValue);
    const hasHalfStar = ratingValue % 1 !== 0;
    
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <Star key={i} size={16} className="text-yellow-400 fill-yellow-400" />
        );
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <Star key={i} size={16} className="text-yellow-400 fill-yellow-400/50" />
        );
      } else {
        stars.push(
          <Star key={i} size={16} className="text-gray-300" />
        );
      }
    }
    
    return (
      <div className="flex items-center space-x-1">
        <div className="flex items-center space-x-0.5">
          {stars}
        </div>
        <span className="text-sm text-gray-600 ml-2">({ratingValue})</span>
      </div>
    );
  };

  return (
    <div className="group bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-purple-100 hover:shadow-xl hover:border-purple-200 transition-all duration-300 hover:-translate-y-1">
      {/* Header Section */}
      <div className="flex items-start space-x-4 mb-6">
        <div className="relative">
          <img 
            src={image || '/api/placeholder/64/64'} 
            alt={name} 
            className="w-16 h-16 rounded-full object-cover border-4 border-purple-100 shadow-md"
          />
          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white shadow-sm"></div>
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-lg font-bold text-gray-800 truncate">{name}</h4>
          <p className="text-purple-600 font-medium text-sm mb-2">{role}</p>
          {rating && renderStars(rating)}
        </div>
      </div>

      {/* Key Stats */}
      <div className="space-y-3 mb-6">
        {experience && (
          <div className="flex items-center space-x-3 text-sm">
            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
              <Briefcase size={16} className="text-purple-600" />
            </div>
            <span className="text-gray-700 font-medium">{experience} Experience</span>
          </div>
        )}
        
        {specialization && (
          <div className="flex items-center space-x-3 text-sm">
            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
              <Award size={16} className="text-purple-600" />
            </div>
            <span className="text-gray-700 font-medium">{specialization}</span>
          </div>
        )}
        
        {completedSessions && (
          <div className="flex items-center space-x-3 text-sm">
            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
              <CheckCircle size={16} className="text-purple-600" />
            </div>
            <span className="text-gray-700 font-medium">{completedSessions}+ Sessions</span>
          </div>
        )}
      </div>

      {/* Student Feedback */}
      {studentFeedback && (
        <div className="mb-6 p-4 bg-purple-50/80 rounded-xl border border-purple-100">
          <div className="flex items-start space-x-3">
            <Quote size={18} className="text-purple-500 mt-0.5 flex-shrink-0" />
            <p className="text-gray-700 text-sm italic leading-relaxed">
              "{studentFeedback}"
            </p>
          </div>
        </div>
      )}

      {/* Languages */}
      {languages.length > 0 && (
        <div className="mb-6 p-3 bg-gray-50 rounded-xl">
          <div className="flex items-center space-x-2">
            <Languages size={16} className="text-purple-600" />
            <span className="text-sm text-gray-700">
              <span className="font-medium">Speaks:</span> {languages.join(', ')}
            </span>
          </div>
        </div>
      )}
      
      {/* Book Session Button */}
      <Link
        to={`/book-session/${slugify(name)}`}
        state={{ tutor }}
        className="w-full inline-flex items-center justify-center space-x-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white px-6 py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-purple-800 transition-all duration-200 shadow-md hover:shadow-lg group-hover:shadow-xl transform hover:scale-105"
      >
        <Calendar size={18} />
        <span>Book Session</span>
      </Link>
    </div>
  );
};

export default TutorCard;