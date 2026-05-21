import { Link } from 'react-router-dom';
import { MapPin, GraduationCap, ArrowRight } from 'lucide-react';

const slugify = (text) =>
  (text || '').toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');

const SchoolCard = ({ school }) => {
  if (!school) return null;

  const schoolSlug = school.id || slugify(school.name);
  const programCount = school.programs?.length ?? 0;

  return (
    <Link
      to={`/school/${schoolSlug}`}
      aria-label={`View ${school.name}`}
      className="group flex flex-col bg-white rounded-2xl border border-gray-100 shadow-sm hover:border-purple-200 hover:shadow-md transition-all duration-150 overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-1"
    >
      {/* Logo strip — contained so crests aren't cropped */}
      <div className="h-36 bg-gray-50 border-b border-gray-100 flex items-center justify-center p-6">
        {school.image ? (
          <img
            src={school.image}
            alt={`${school.name} logo`}
            className="max-h-full max-w-full object-contain"
          />
        ) : (
          <div className="w-16 h-16 rounded-2xl bg-purple-50 border border-purple-100 flex items-center justify-center">
            <GraduationCap size={28} className="text-purple-400" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5">
        <h3 className="text-sm font-semibold text-gray-900 leading-snug mb-1 group-hover:text-purple-700 transition-colors duration-150">
          {school.name}
        </h3>

        {school.location && (
          <p className="text-xs text-gray-400 flex items-center gap-1 mb-3">
            <MapPin size={11} className="flex-shrink-0" />
            {school.location}
          </p>
        )}

        {school.reasonForRecommendation && (
          <p className="text-xs text-gray-500 leading-relaxed line-clamp-2 mb-3 flex-1">
            {school.reasonForRecommendation}
          </p>
        )}

        {/* Program count + CTA row */}
        <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-50">
          {programCount > 0 ? (
            <span className="text-[11px] text-gray-400 font-medium">
              {programCount} program{programCount !== 1 ? 's' : ''}
            </span>
          ) : (
            <span />
          )}
          <span className="inline-flex items-center gap-1 text-xs font-medium text-purple-600 group-hover:gap-1.5 transition-all duration-150">
            View school
            <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform duration-150" />
          </span>
        </div>
      </div>
    </Link>
  );
};

export default SchoolCard;
