import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Clock, TrendingUp, Star, ExternalLink, GraduationCap, Users } from 'lucide-react';

// Helper (can be in a utils file)
const slugify = (text) => (text || '').toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]+/g, '');

const SchoolCard = ({ school }) => {
  if (!school) return null;

  // Assuming school.id is a unique identifier for routing.
  // If school.id is not available, use slugify(school.name) + slugify(school.program) or similar
  const schoolSlug = school.id || slugify(school.name + school.program);

  // Handle navigation without React Router for demo
  const handleExplore = () => {
    console.log(`Navigate to /school/${schoolSlug}`);
    // In your actual app, replace with: navigate(`/school/${schoolSlug}`)
  };

  return (
    <div className="group relative">
      {/* Main Card Container */}
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-purple-100/50 overflow-hidden transform hover:-translate-y-1">
        
        {/* Image Container */}
        <div className="relative h-48 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-400/20 to-purple-600/30"></div>
          <img 
            src={school.image || "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"} 
            alt={school.name} 
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          
          {/* Overlay badges */}
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            {school.ranking && (
              <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
                #{school.ranking}
              </div>
            )}
            {school.rating && (
              <div className="bg-white/90 backdrop-blur-sm text-gray-800 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 shadow-lg">
                <Star className="text-yellow-500 fill-current" size={14} />
                <span>{school.rating}</span>
              </div>
            )}
          </div>

          {/* Program Badge */}
          {school.program && (
            <div className="absolute top-4 right-4">
              <div className="bg-white/90 backdrop-blur-sm text-purple-700 px-3 py-1 rounded-full text-sm font-medium shadow-lg flex items-center gap-1">
                <GraduationCap size={14} />
                <span className="hidden sm:inline">{school.program}</span>
              </div>
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="p-6 space-y-4">
          {/* School Name */}
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-gray-800 group-hover:text-purple-700 transition-colors duration-200 line-clamp-2">
              {school.name}
            </h3>
            <p className="text-purple-600 font-medium text-sm bg-purple-50 px-3 py-1 rounded-full inline-block">
              {school.program}
            </p>
          </div>

          {/* School Details */}
          <div className="space-y-3">
            {school.location && (
              <div className="flex items-start gap-3 text-gray-600">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <MapPin size={14} className="text-purple-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-700">Location</p>
                  <p className="text-sm text-gray-600">{school.location}</p>
                </div>
              </div>
            )}

            {school.duration && (
              <div className="flex items-start gap-3 text-gray-600">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Clock size={14} className="text-purple-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-700">Duration</p>
                  <p className="text-sm text-gray-600">{school.duration}</p>
                </div>
              </div>
            )}

            {school.tuition && (
              <div className="flex items-start gap-3 text-gray-600">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <TrendingUp size={14} className="text-purple-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-700">Tuition</p>
                  <p className="text-sm text-gray-600">{school.tuition}</p>
                </div>
              </div>
            )}

            {/* Associated Careers */}
            {school.associatedCareers && school.associatedCareers.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Users size={14} className="text-purple-600" />
                  </div>
                  <p className="text-sm font-medium text-gray-700">Career Paths</p>
                </div>
                <div className="flex flex-wrap gap-2 ml-10">
                  {school.associatedCareers.slice(0, 3).map((career, index) => (
                    <span 
                      key={index}
                      className="bg-gradient-to-r from-purple-100 to-purple-50 text-purple-700 px-2 py-1 rounded-lg text-xs font-medium border border-purple-200"
                    >
                      {career}
                    </span>
                  ))}
                  {school.associatedCareers.length > 3 && (
                    <span className="text-purple-600 text-xs font-medium px-2 py-1">
                      +{school.associatedCareers.length - 3} more
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Action Button */}
          <div className="pt-2">

            <Link  to={`/school/${schoolSlug}`}>
            <button 
              onClick={handleExplore}
              className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
            >
              <ExternalLink size={16} />
              <span>Explore Program</span>
            </button>
            </Link>
    
          </div>
        </div>

        {/* Hover effect overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 to-purple-800/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-3xl"></div>
      </div>
    </div>
  );
};

export default SchoolCard;