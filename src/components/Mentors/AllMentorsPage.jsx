import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useResults } from '../../contexts/ResultsContext';
import TutorCard from '../../components/Schools/TutorCard';
import { ArrowLeft, Search, Frown, Users, Star, BookOpen } from 'lucide-react';

const AllMentorsPage = () => {
  const { results, isLoading: resultsLoading } = useResults();
  const [allMentors, setAllMentors] = useState([]);
  const [filteredMentors, setFilteredMentors] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(resultsLoading);
    if (!resultsLoading && results?.analysis?.recommendedSchools) {
      const mentorsMap = new Map();
      results.analysis.recommendedSchools.forEach(school => {
        school.programs?.forEach(program => {
          program.availableTutors?.forEach(tutor => {
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

  // Compute real stats from data
  const avgRating = allMentors.length
    ? (allMentors.reduce((sum, m) => sum + (m.rating || 0), 0) / allMentors.length).toFixed(1)
    : '—';
  const uniqueSpecCount = new Set(allMentors.map(m => m.specialization).filter(Boolean)).size;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500 text-sm">Loading mentors…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Back */}
        <div className="mb-6">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-purple-600 transition-colors duration-150"
          >
            <ArrowLeft size={16} />
            Back to Dashboard
          </Link>
        </div>

        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Find Your Mentor</h1>
          <p className="mt-1 text-gray-500 text-sm">
            Connect with experienced professionals ready to guide your learning journey.
          </p>
        </div>

        {/* Stats strip */}
        <div className="flex flex-wrap gap-6 mb-8">
          <div className="flex items-center gap-2">
            <Users size={18} className="text-purple-600" />
            <span className="text-2xl font-bold text-gray-900">{allMentors.length}</span>
            <span className="text-sm text-gray-500">Mentors</span>
          </div>
          <div className="w-px bg-gray-200 hidden sm:block" />
          <div className="flex items-center gap-2">
            <Star size={18} className="text-purple-600" />
            <span className="text-2xl font-bold text-gray-900">{avgRating}</span>
            <span className="text-sm text-gray-500">Avg Rating</span>
          </div>
          <div className="w-px bg-gray-200 hidden sm:block" />
          <div className="flex items-center gap-2">
            <BookOpen size={18} className="text-purple-600" />
            <span className="text-2xl font-bold text-gray-900">{uniqueSpecCount}</span>
            <span className="text-sm text-gray-500">Specializations</span>
          </div>
        </div>

        {/* Search */}
        <div className="mb-6">
          <label htmlFor="mentor-search" className="sr-only">Search mentors</label>
          <div className="relative max-w-lg">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            <input
              id="mentor-search"
              type="text"
              placeholder="Search by name, role, or expertise…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-150"
            />
          </div>
          {searchTerm && (
            <div className="mt-2 flex items-center gap-3">
              <span className="text-sm text-gray-500">
                {filteredMentors.length} result{filteredMentors.length !== 1 ? 's' : ''} for "{searchTerm}"
              </span>
              <button
                onClick={() => setSearchTerm('')}
                className="text-sm text-purple-600 hover:text-purple-700 font-medium"
              >
                Clear
              </button>
            </div>
          )}
        </div>

        {/* Result count */}
        {!searchTerm && (
          <p className="text-sm text-gray-400 mb-4">
            Showing {filteredMentors.length} mentor{filteredMentors.length !== 1 ? 's' : ''}
          </p>
        )}

        {/* Grid */}
        {filteredMentors.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredMentors.map(mentor => (
              <TutorCard key={mentor.name} tutor={mentor} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-14 h-14 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Frown size={28} className="text-purple-400" />
            </div>
            <h2 className="text-lg font-semibold text-gray-800 mb-1">No mentors found</h2>
            <p className="text-sm text-gray-500 mb-4 max-w-xs mx-auto">
              No mentors match "{searchTerm}". Try a different search term.
            </p>
            <button
              onClick={() => setSearchTerm('')}
              className="text-sm text-purple-600 hover:text-purple-700 font-medium underline underline-offset-2"
            >
              View all mentors
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllMentorsPage;
