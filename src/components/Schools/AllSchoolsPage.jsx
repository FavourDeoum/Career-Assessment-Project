import { useState, useEffect } from 'react';
import { useResults } from '../../contexts/ResultsContext';
import SchoolCard from './SchoolCard';
import { ArrowLeft, Search, AlertTriangle, GraduationCap } from 'lucide-react';
import { Link } from 'react-router-dom';

const AllSchoolsPage = () => {
  const { results, isLoading, error } = useResults();
  const [allSchools, setAllSchools] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (results?.analysis?.recommendedSchools) {
      setAllSchools(results.analysis.recommendedSchools);
    }
  }, [results]);

  const displayedSchools = allSchools.filter((school) => {
    const q = searchTerm.toLowerCase();
    return (
      school.name?.toLowerCase().includes(q) ||
      school.description?.toLowerCase().includes(q) ||
      school.associatedCareers?.some((c) => c.toLowerCase().includes(q))
    );
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-gray-500 font-medium">Loading schools…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <div className="w-14 h-14 bg-red-50 border border-red-100 rounded-2xl flex items-center justify-center mx-auto mb-5">
            <AlertTriangle size={22} className="text-red-500" />
          </div>
          <h2 className="text-lg font-semibold text-gray-800 mb-2">Couldn't load schools</h2>
          <p className="text-sm text-gray-500 mb-6 leading-relaxed">
            {error.message || 'Please check your connection and try again.'}
          </p>
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-purple-600 text-white text-sm font-medium rounded-xl hover:bg-purple-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
          >
            <ArrowLeft size={15} />
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Back link */}
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors mb-8 py-2 -my-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 rounded"
        >
          <ArrowLeft size={15} />
          Back to Dashboard
        </Link>

        {/* Page header */}
        <div className="mb-6">
          <h1 className="text-xl font-bold text-gray-900">Recommended Schools</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Institutions matched to your career goals
          </p>
        </div>

        {/* Search */}
        <div className="relative mb-6 max-w-md">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          <input
            type="search"
            placeholder="Search by name, program, or career…"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-shadow"
            aria-label="Search schools"
          />
        </div>

        {/* Results */}
        {allSchools.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center max-w-md mx-auto">
            <GraduationCap size={28} className="text-gray-300 mx-auto mb-4" />
            <h2 className="text-base font-semibold text-gray-700 mb-2">No schools yet</h2>
            <p className="text-sm text-gray-400 mb-6 leading-relaxed">
              Complete your assessment to get personalised school recommendations.
            </p>
            <Link
              to="/assessment"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-purple-600 text-white text-sm font-medium rounded-xl hover:bg-purple-700 transition-colors"
            >
              Take assessment
            </Link>
          </div>
        ) : displayedSchools.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center max-w-md mx-auto">
            <Search size={24} className="text-gray-300 mx-auto mb-4" />
            <h2 className="text-base font-semibold text-gray-700 mb-1">No matches</h2>
            <p className="text-sm text-gray-400">Try a different search term.</p>
          </div>
        ) : (
          <>
            <p className="text-xs text-gray-400 mb-4">
              {displayedSchools.length} of {allSchools.length} school{allSchools.length !== 1 ? 's' : ''}
            </p>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {displayedSchools.map((school, index) => (
                <SchoolCard key={school.id || `school-${index}`} school={school} />
              ))}
            </div>
          </>
        )}

      </main>
    </div>
  );
};

export default AllSchoolsPage;
