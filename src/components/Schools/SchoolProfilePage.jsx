import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useResults } from '../../contexts/ResultsContext';
import ProgramCard from './ProgramCard';
import {
  ArrowLeft, MapPin, Globe, BookCheck, Users,
  Building, Lightbulb, Star, GraduationCap, ChevronDown
} from 'lucide-react';
import { Link } from 'react-router-dom';

const slugify = (text) =>
  (text || '').toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');

const SchoolProfilePage = () => {
  const { schoolId: schoolSlugFromParams } = useParams();
  const { results, isLoading: resultsLoading } = useResults();
  const [schoolData, setSchoolData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!resultsLoading && results?.analysis?.recommendedSchools) {
      const found = results.analysis.recommendedSchools.find(
        (s) => s.id === schoolSlugFromParams || slugify(s.name) === schoolSlugFromParams
      );
      setSchoolData(found || null);
    }
  }, [results, resultsLoading, schoolSlugFromParams]);

  if (resultsLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-gray-500 font-medium">Loading school profile…</p>
        </div>
      </div>
    );
  }

  if (!schoolData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-5">
            <GraduationCap size={24} className="text-gray-400" />
          </div>
          <h1 className="text-lg font-semibold text-gray-800 mb-2">School not found</h1>
          <p className="text-sm text-gray-500 mb-6 leading-relaxed">
            This school profile couldn't be loaded. It may not be in your recommendations.
          </p>
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-purple-600 text-white text-sm font-medium rounded-xl hover:bg-purple-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2"
          >
            <ArrowLeft size={15} />
            Go back
          </button>
        </div>
      </div>
    );
  }

  const {
    name, image, location, description, ranking, website,
    generalAdmissionsInfo, campusLife, programs = [],
    reasonForRecommendation,
  } = schoolData;

  // Count how many info sections exist so we can decide grid layout
  const infoSections = [description, generalAdmissionsInfo].filter(Boolean).length;

  // Pick program grid columns based on item count — avoids orphaned cards
  const programColClass =
    programs.length === 1
      ? 'grid-cols-1 max-w-sm'
      : programs.length === 2
      ? 'grid-cols-1 sm:grid-cols-2'
      : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3';

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Back link — py-2 expands tap target to ≥44px without visual change */}
        <Link
          to="/schools/all"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors mb-8 py-2 -my-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 rounded"
        >
          <ArrowLeft size={15} />
          Back to all schools
        </Link>

        {/* ── School header ─────────────────────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-4">
          <div className="flex items-start gap-5">
            {/* Fix 3: object-contain keeps full crest visible on white bg */}
            <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-white border border-gray-100 flex items-center justify-center">
              <img
                src={image || '/placeholder.svg'}
                alt={`${name} logo`}
                className="w-full h-full object-contain p-1"
              />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h1 className="text-xl font-bold text-gray-900 leading-snug">{name}</h1>
                  {location && (
                    <p className="text-sm text-gray-500 mt-1 flex items-center gap-1.5">
                      <MapPin size={13} className="text-gray-400 flex-shrink-0" />
                      {location}
                    </p>
                  )}
                  {ranking && ranking !== 'N/A' && (
                    <span className="inline-flex items-center gap-1 mt-2 text-xs font-medium text-amber-700 bg-amber-50 border border-amber-100 px-2 py-0.5 rounded-full">
                      <Star size={10} fill="currentColor" />
                      {ranking}
                    </span>
                  )}
                </div>

                {/* Fix 2: Primary CTA + optional secondary website link */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  {programs.length > 0 && (
                    <a
                      href="#programs"
                      className="inline-flex items-center gap-1.5 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 px-3 py-1.5 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
                    >
                      Browse programs
                      <ChevronDown size={13} />
                    </a>
                  )}
                  {website && (
                    <a
                      href={website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm font-medium text-purple-600 border border-purple-200 px-3 py-1.5 rounded-lg hover:bg-purple-50 hover:border-purple-300 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
                    >
                      <Globe size={13} />
                      Website
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Why recommended ───────────────────────────────────────────── */}
        {reasonForRecommendation && (
          <div className="bg-purple-50 border border-purple-100 rounded-2xl p-5 mb-4 flex items-start gap-3">
            <Lightbulb size={15} className="text-purple-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-[11px] font-semibold text-purple-500 uppercase tracking-wider mb-1">
                Why we recommended this school
              </p>
              <p className="text-sm text-gray-700 leading-relaxed">{reasonForRecommendation}</p>
            </div>
          </div>
        )}

        {/* ── Info cards ────────────────────────────────────────────────── */}
        {/* Fix 1 (info grid): single card gets col-span-full so it stretches */}
        {(description || generalAdmissionsInfo || campusLife) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {description && (
              <div className={`bg-white rounded-2xl border border-gray-100 shadow-sm p-5 ${infoSections === 1 ? 'md:col-span-2' : ''}`}>
                <div className="flex items-center gap-2 mb-3">
                  <Building size={14} className="text-gray-400" />
                  <h2 className="text-sm font-semibold text-gray-700">About the school</h2>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">{description}</p>
              </div>
            )}

            {generalAdmissionsInfo && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <div className="flex items-center gap-2 mb-3">
                  <BookCheck size={14} className="text-gray-400" />
                  <h2 className="text-sm font-semibold text-gray-700">Admissions</h2>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">{generalAdmissionsInfo}</p>
              </div>
            )}

            {campusLife && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 md:col-span-2">
                <div className="flex items-center gap-2 mb-3">
                  <Users size={14} className="text-gray-400" />
                  <h2 className="text-sm font-semibold text-gray-700">Campus life & facilities</h2>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">{campusLife}</p>
              </div>
            )}
          </div>
        )}

        {/* ── Programs ──────────────────────────────────────────────────── */}
        {/* Fix 1 (programs grid): col count matches item count */}
        <div id="programs" className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-semibold text-gray-800">Programs</h2>
            {programs.length > 0 && (
              <span className="text-xs text-gray-400 font-medium">{programs.length} available</span>
            )}
          </div>

          {programs.length > 0 ? (
            <div className={`grid gap-3 ${programColClass}`}>
              {programs.map((program, index) => (
                <ProgramCard
                  key={program.program || index}
                  program={program}
                  schoolId={schoolSlugFromParams}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <GraduationCap size={22} className="text-gray-300 mx-auto mb-3" />
              <p className="text-sm text-gray-400">No programs identified for this school.</p>
            </div>
          )}
        </div>

      </main>
    </div>
  );
};

export default SchoolProfilePage;
