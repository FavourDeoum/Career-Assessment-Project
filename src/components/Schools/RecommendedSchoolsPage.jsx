// src/components/Schools/RecommendedSchoolsPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useResults } from '../../contexts/ResultsContext';
import SchoolCard from './SchoolCard';
import { ArrowLeft, GraduationCap, ExternalLink } from 'lucide-react';

// Helper (can be in a utils file)
const deslugify = (slug) => (slug || '').replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase());

const RecommendedSchoolsPage = () => {
  const { careerSlug } = useParams();
  const { results, isLoading: resultsLoading } = useResults();
  const [filteredSchools, setFilteredSchools] = useState([]);
  const navigate = useNavigate();

  const careerTitle = deslugify(careerSlug);

  useEffect(() => {
    if (results && results.analysis && results.analysis.recommendedSchools) {
      const schools = results.analysis.recommendedSchools.filter(school =>
        school.associatedCareers && school.associatedCareers.some(career =>
          career.toLowerCase() === careerTitle.toLowerCase()
        )
      );
      setFilteredSchools(schools);
    }
  }, [results, careerTitle]);

  // Loading state
  if (resultsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-100/50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                <GraduationCap className="text-white text-2xl" />
              </div>
              <p className="text-xl text-gray-600 animate-pulse">Loading schools...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // No data state
  if (!results || !results.analysis) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-100/50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <GraduationCap className="text-white text-2xl" />
              </div>
              <p className="text-xl text-gray-600">Assessment data not available.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-100/50 py-12 px-4 sm:px-6 lg:px-8">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-200/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-300/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header Section */}
        <div className="mb-8">
          {/* Back Button */}
          <button 
            onClick={() => navigate(-1)} 
            className="group inline-flex items-center space-x-2 mb-6 px-4 py-2 bg-white/70 backdrop-blur-sm rounded-xl border border-purple-100 text-purple-700 hover:bg-purple-50 hover:border-purple-200 transition-all duration-200 shadow-sm hover:shadow-md"
          >
            <ArrowLeft 
              size={20} 
              className="group-hover:-translate-x-1 transition-transform duration-200" 
            />
            <span className="font-medium">Back</span>
          </button>

          {/* Page Title */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                <GraduationCap className="text-white text-2xl" />
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent">
                Recommended Schools
              </h1>
            </div>
            <div className="max-w-2xl mx-auto">
              <p className="text-lg sm:text-xl text-gray-600 mb-2">
                Curated institutions for your career in
              </p>
              <span className="inline-block px-4 py-2 bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800 rounded-full font-semibold text-lg">
                {careerTitle}
              </span>
            </div>
          </div>
        </div>

        {/* Content Section */}
        {filteredSchools.length > 0 ? (
          <div>
            {/* Stats Banner */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 mb-8 border border-purple-100 shadow-sm">
              <div className="text-center">
                <div className="inline-flex items-center space-x-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600">
                      {filteredSchools.length}
                    </div>
                    <div className="text-sm text-gray-600">
                      {filteredSchools.length === 1 ? 'School' : 'Schools'} Found
                    </div>
                  </div>
                  <div className="w-px h-12 bg-purple-200"></div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-gray-800">
                      Tailored for You
                    </div>
                    <div className="text-sm text-gray-600">
                      Based on your assessment
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Schools Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredSchools.map((school, index) => (
                <div 
                  key={school.id || `school-${index}`}
                  className="transform transition-all duration-300 hover:scale-105"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <SchoolCard school={school} />
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* No Schools Found */
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-purple-200 rounded-full flex items-center justify-center mx-auto mb-6">
                <GraduationCap className="text-purple-600 text-3xl" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                No Specific Schools Found
              </h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                No specific schools recommended for this career path based on your assessment.
              </p>
              <Link 
                to="/schools/all" 
                className="group inline-flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <span>Explore All Schools</span>
                <ExternalLink 
                  size={18} 
                  className="group-hover:scale-110 transition-transform duration-200" 
                />
              </Link>
            </div>
          </div>
        )}

        {/* Footer Note */}
        <div className="text-center mt-12">
          <p className="text-gray-500 text-sm">
            Recommendations are based on your assessment results and career preferences
          </p>
        </div>
      </div>
    </div>
  );
};

export default RecommendedSchoolsPage;