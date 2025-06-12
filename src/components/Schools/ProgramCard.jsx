// src/components/Schools/ProgramCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Clock, DollarSign, ChevronRight } from 'lucide-react';
// Assuming you put slugify in a utils file
import { slugify } from '../../utils/slugify';
// Or define it here if you prefer:
// const slugify = (text) => { ... };

const ProgramCard = ({ program, schoolId }) => {
  if (!program) return null;
  
  // Use the slugified program name as the program's unique identifier for the URL
  const programSlug = slugify(program.program);
  
  return (
    <div className="group relative bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-purple-100 hover:shadow-xl transition-all duration-300 hover:scale-105 hover:bg-white/90">
      {/* Gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 to-purple-100/30 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-start space-x-4 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
            <BookOpen size={24} className="text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-xl font-bold text-gray-800 group-hover:text-purple-700 transition-colors duration-300 line-clamp-2 leading-tight">
              {program.program}
            </h3>
          </div>
        </div>

        {/* Meta Information */}
        <div className="flex flex-wrap gap-3 mb-4">
          {program.duration && (
            <span className="inline-flex items-center space-x-2 px-3 py-1.5 bg-purple-50 text-purple-700 rounded-full text-sm font-medium">
              <Clock size={14} />
              <span>{program.duration}</span>
            </span>
          )}
          {program.degreeLevel && (
            <span className="inline-flex items-center px-3 py-1.5 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
              {program.degreeLevel}
            </span>
          )}
          {program.tuition && (
            <span className="inline-flex items-center space-x-2 px-3 py-1.5 bg-green-50 text-green-700 rounded-full text-sm font-medium">
              <DollarSign size={14} />
              <span>{program.tuition}</span>
            </span>
          )}
        </div>

        {/* Description */}
        <p className="text-gray-600 text-sm leading-relaxed mb-6 line-clamp-3">
          {program.description ? `${program.description.substring(0, 120)}...` : 'Detailed information available.'}
        </p>

        {/* Explore Button */}
        <Link 
          to={`/school/${schoolId}/program/${programSlug}`} 
          className="group/btn inline-flex items-center space-x-2 w-full justify-center bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg"
        >
          <span>Explore Program Details</span>
          <ChevronRight 
            size={18} 
            className="group-hover/btn:translate-x-1 transition-transform duration-200" 
          />
        </Link>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-4 right-4 w-2 h-2 bg-purple-300 rounded-full opacity-30 group-hover:opacity-60 transition-opacity duration-300"></div>
      <div className="absolute bottom-4 left-4 w-1 h-1 bg-purple-400 rounded-full opacity-20 group-hover:opacity-40 transition-opacity duration-300"></div>
    </div>
  );
};

export default ProgramCard;