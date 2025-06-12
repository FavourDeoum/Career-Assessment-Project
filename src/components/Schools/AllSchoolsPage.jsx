import React, { useState, useEffect } from 'react';
import { useResults } from '../../contexts/ResultsContext';
import SchoolCard from './SchoolCard';
import { ArrowLeft, Search, Loader, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

const AllSchoolsPage = () => {
  // Get loading and error states directly from the context.
  // This is the source of truth for the data fetching status.
  const { results, isLoading, error } = useResults();

  const [allSchools, setAllSchools] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  // This effect correctly syncs local component state with the context's results.
  useEffect(() => {
    // Only update state if the data is available and valid.
    if (results?.analysis?.recommendedSchools) {
      setAllSchools(results.analysis.recommendedSchools);
    }
  }, [results]); // Dependency on `results` is correct.

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  // The search functionality is already well-implemented.
  const displayedSchools = allSchools.filter(school =>
    (school.name && school.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (school.program && school.program.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (school.associatedCareers && school.associatedCareers.some(career => career.toLowerCase().includes(searchTerm.toLowerCase())))
  );

  // --- FIX 1: Handle Loading State FIRST ---
  // Before checking for data, check if we are currently loading.
  // This prevents the "No schools" message from appearing on reload.
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-100/50 flex flex-col items-center justify-center px-4">
        {/* Animated background elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-200/30 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-300/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
        
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-12 shadow-xl border border-purple-100 text-center relative z-10">
          <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Loader className="animate-spin text-purple-600" size={32} />
          </div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent mb-2">
            Loading Recommended Schools
          </h2>
          <p className="text-gray-600">Finding the perfect matches for you...</p>
        </div>
      </div>
    );
  }

  // --- FIX 2: Handle Error State SECOND ---
  // If we are not loading, check if an error occurred during the fetch.
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-100/50 flex flex-col items-center justify-center px-4">
        {/* Animated background elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-200/30 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-300/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
        
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-12 shadow-xl border border-red-100 text-center relative z-10 max-w-md">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertTriangle className="text-red-600" size={32} />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Could not load recommendations
          </h2>
          <p className="text-gray-600 mb-6">
            {error.message || 'Please check your connection and try again.'}
          </p>
          <Link to='/cdashboard'>
            <button className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 flex items-center space-x-2 mx-auto shadow-lg hover:shadow-xl">
              <ArrowLeft size={20} />
              <span>Back to Dashboard</span>
            </button>
          </Link>
        </div>
      </div>
    );
  }

  // --- MAIN RENDER LOGIC ---
  // If we reach this point, we know we are NOT loading and there is NO error.
  // Now, we can safely check the length of `allSchools` to determine what to display.
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-100/50 py-8 px-4 sm:px-6 lg:px-8">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-200/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-300/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header Section */}
        <div className="mb-8">
          <Link to='/cdashboard'>
            <button className="bg-white/80 backdrop-blur-sm hover:bg-white/90 text-purple-700 font-semibold py-3 px-6 rounded-xl transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl border border-purple-100 mb-6">
              <ArrowLeft size={20} />
              <span>Back to Dashboard</span>
            </button>
          </Link>
          
          <div className="text-center mb-8">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent mb-4">
              Recommended Schools
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Discover educational opportunities tailored to your interests and career goals
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="text-gray-400" size={20} />
              </div>
              <input
                type="text"
                placeholder="Search schools, programs, or careers..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-full pl-12 pr-4 py-4 border border-purple-200 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 bg-white/80 backdrop-blur-sm shadow-lg text-lg placeholder-gray-500"
              />
            </div>
          </div>
        </div>

        {/* Content Section */}
        {allSchools.length > 0 ? (
          displayedSchools.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {displayedSchools.map((school, index) => (
                <div key={school.id || `school-${index}`} className="transform hover:scale-105 transition-all duration-200">
                  <SchoolCard school={school} />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-12 shadow-xl border border-purple-100 text-center max-w-md">
                <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Search className="text-purple-600" size={32} />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                  No matches found
                </h3>
                <p className="text-gray-600">
                  No schools match your search criteria. Try adjusting your search terms.
                </p>
              </div>
            </div>
          )
        ) : (
          // This now correctly shows ONLY when loading is finished, there are no errors,
          // and the recommendedSchools array is genuinely empty.
          <div className="flex flex-col items-center justify-center py-16">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-12 shadow-xl border border-purple-100 text-center max-w-lg">
              <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertTriangle className="text-purple-600" size={32} />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                No schools recommended yet
              </h3>
              <p className="text-gray-600 mb-6">
                Complete an assessment on your dashboard to see personalized school recommendations.
              </p>
              <Link to='/cdashboard'>
                <button className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl">
                  Take Assessment
                </button>
              </Link>
            </div>
          </div>
        )}

        {/* Results count */}
        {allSchools.length > 0 && (
          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Showing {displayedSchools.length} of {allSchools.length} recommended schools
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllSchoolsPage;