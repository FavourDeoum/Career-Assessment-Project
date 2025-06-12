// src/pages/AllMentorsPage.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useResults } from '../../contexts/ResultsContext';
import TutorCard from '../../components/Schools/TutorCard';
import { ArrowLeft, Search, Frown, Users, Star, Filter, BookOpen } from 'lucide-react';

const AllMentorsPage = () => {
  const { results, isLoading: resultsLoading } = useResults();
  const [allMentors, setAllMentors] = useState([]);
  const [filteredMentors, setFilteredMentors] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Set loading state based on the context
    setIsLoading(resultsLoading);
    if (!resultsLoading && results?.analysis?.recommendedSchools) {
      // Aggregate all mentors from all schools and programs
      const mentorsMap = new Map();
      results.analysis.recommendedSchools.forEach(school => {
        school.programs?.forEach(program => {
          program.availableTutors?.forEach(tutor => {
            // Use tutor's name as a unique key to prevent duplicates
            if (!mentorsMap.has(tutor.name)) {
              mentorsMap.set(tutor.name, tutor);
            }
          });
        });
      });
      const uniqueMentors = Array.from(mentorsMap.values());
      setAllMentors(uniqueMentors);
      setFilteredMentors(uniqueMentors);
    }
  }, [results, resultsLoading]);

  // Effect to handle filtering when search term changes
  useEffect(() => {
    if (searchTerm === '') {
      setFilteredMentors(allMentors);
    } else {
      const lowercasedFilter = searchTerm.toLowerCase();
      const filtered = allMentors.filter(mentor =>
        mentor.name.toLowerCase().includes(lowercasedFilter) ||
        mentor.role.toLowerCase().includes(lowercasedFilter) ||
        mentor.specialization.toLowerCase().includes(lowercasedFilter) ||
        mentor.expertise?.some(e => e.toLowerCase().includes(lowercasedFilter))
      );
      setFilteredMentors(filtered);
    }
  }, [searchTerm, allMentors]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-100/50 flex items-center justify-center">
        {/* Animated background elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-200/30 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-300/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
        
        <div className="text-center relative z-10">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-purple-700 rounded-full flex items-center justify-center mx-auto mb-4 animate-spin">
            <Users className="text-white text-2xl" />
          </div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent mb-2">
            Loading Mentors...
          </h2>
          <p className="text-gray-600">Finding the perfect mentors for you</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-100/50">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-200/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-300/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-purple-100/20 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="max-w-7xl mx-auto">
          {/* Back Button */}
          <div className="mb-8">
            <Link 
              to="/cdashboard" 
              className="inline-flex items-center space-x-2 text-purple-600 hover:text-purple-700 transition-colors duration-200 bg-white/70 backdrop-blur-sm px-4 py-2 rounded-xl border border-purple-100 hover:bg-white/80 shadow-sm"
            >
              <ArrowLeft size={20} />
              <span className="font-medium">Back to Dashboard</span>
            </Link>
          </div>

          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-gradient-to-r from-purple-600 to-purple-700 rounded-full flex items-center justify-center shadow-lg">
                <Users className="text-white text-3xl" />
              </div>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent mb-4">
              Find Your Mentor
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed mb-8">
              Connect with experienced professionals ready to guide you on your learning journey.
            </p>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto mb-8">
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 border border-purple-100 shadow-sm">
                <div className="flex items-center justify-center space-x-2">
                  <Users className="text-purple-600 text-xl" />
                  <span className="text-2xl font-bold text-gray-800">{allMentors.length}</span>
                </div>
                <p className="text-sm text-gray-600 mt-1">Available Mentors</p>
              </div>
              
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 border border-purple-100 shadow-sm">
                <div className="flex items-center justify-center space-x-2">
                  <Star className="text-purple-600 text-xl" />
                  <span className="text-2xl font-bold text-gray-800">4.9</span>
                </div>
                <p className="text-sm text-gray-600 mt-1">Average Rating</p>
              </div>
              
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 border border-purple-100 shadow-sm">
                <div className="flex items-center justify-center space-x-2">
                  <BookOpen className="text-purple-600 text-xl" />
                  <span className="text-2xl font-bold text-gray-800">50+</span>
                </div>
                <p className="text-sm text-gray-600 mt-1">Specializations</p>
              </div>
            </div>
          </div>

          {/* Search and Filter Section */}
          <div className="mb-8">
            <div className="max-w-2xl mx-auto">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-purple-100">
                <div className="flex items-center space-x-4">
                  <div className="flex-1 relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Search className="text-gray-400" size={20} />
                    </div>
                    <input
                      type="text"
                      placeholder="Search by name, role, or expertise (e.g., Nursing, Paul, Technician)"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 bg-white/50 backdrop-blur-sm"
                    />
                  </div>
                  
                  <button className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white p-3 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl">
                    <Filter size={20} />
                  </button>
                </div>
                
                {searchTerm && (
                  <div className="mt-4 flex items-center justify-between">
                    <p className="text-sm text-gray-600">
                      Found {filteredMentors.length} mentor{filteredMentors.length !== 1 ? 's' : ''} matching "{searchTerm}"
                    </p>
                    {searchTerm && (
                      <button
                        onClick={() => setSearchTerm('')}
                        className="text-sm text-purple-600 hover:text-purple-700 font-medium"
                      >
                        Clear search
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Mentors Grid */}
          <div className="max-w-7xl mx-auto">
            {filteredMentors.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredMentors.map(mentor => (
                  <div key={mentor.name} className="transform hover:scale-105 transition-transform duration-200">
                    <TutorCard tutor={mentor} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-12 shadow-lg border border-purple-100 max-w-md mx-auto">
                  <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Frown size={40} className="text-purple-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">No Mentors Found</h2>
                  <p className="text-gray-600 mb-6">
                    We couldn't find any mentors matching your search. Try a different term or browse all available mentors.
                  </p>
                  <button
                    onClick={() => setSearchTerm('')}
                    className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    View All Mentors
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Footer Section */}
          {filteredMentors.length > 0 && (
            <div className="text-center mt-16">
              <div className="bg-gradient-to-r from-purple-600 to-purple-700 rounded-3xl p-8 text-white max-w-2xl mx-auto">
                <h3 className="text-2xl font-bold mb-4">Ready to Start Learning?</h3>
                <p className="text-purple-100 mb-6">
                  Connect with any of these amazing mentors and accelerate your learning journey today.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button className="bg-white/20 hover:bg-white/30 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 backdrop-blur-sm">
                    Browse Programs
                  </button>
                  <button className="bg-white text-purple-700 hover:bg-purple-50 font-semibold py-3 px-6 rounded-xl transition-all duration-200">
                    Get Started
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AllMentorsPage;