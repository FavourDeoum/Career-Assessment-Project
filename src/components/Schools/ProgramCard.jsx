import { Link } from 'react-router-dom';
import { Clock, ArrowRight } from 'lucide-react';
import { slugify } from '../../utils/slugify';

const ProgramCard = ({ program, schoolId }) => {
  if (!program) return null;

  const programSlug = slugify(program.program);
  const to = `/school/${schoolId}/program/${programSlug}`;

  return (
    // Fix 4: entire card is a Link — no more tiny text-only CTA at the bottom
    <Link
      to={to}
      aria-label={`View details for ${program.program}`}
      className="group flex flex-col bg-gray-50 rounded-xl border border-gray-100 p-4 hover:border-purple-200 hover:bg-white transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-1"
    >
      <h3 className="text-sm font-semibold text-gray-800 leading-snug mb-2.5 group-hover:text-purple-700 transition-colors duration-150">
        {program.program}
      </h3>

      <div className="flex flex-wrap gap-1.5 mb-3">
        {program.duration && (
          <span className="inline-flex items-center gap-1 text-[11px] text-gray-500 bg-white border border-gray-200 px-2 py-0.5 rounded-full">
            <Clock size={10} />
            {program.duration}
          </span>
        )}
        {program.degreeLevel && (
          <span className="text-[11px] text-purple-600 bg-purple-50 border border-purple-100 px-2 py-0.5 rounded-full">
            {program.degreeLevel}
          </span>
        )}
        {/* Fix: tuition uses gray instead of green so program name is read first */}
        {program.tuition && (
          <span className="text-[11px] text-gray-500 bg-white border border-gray-200 px-2 py-0.5 rounded-full">
            {program.tuition}
          </span>
        )}
      </div>

      {program.description && (
        <p className="text-xs text-gray-500 leading-relaxed line-clamp-2 flex-1 mb-3">
          {program.description}
        </p>
      )}

      <span className="inline-flex items-center gap-1 text-xs font-medium text-purple-600 mt-auto">
        View details
        <ArrowRight size={11} className="group-hover:translate-x-0.5 transition-transform duration-150" />
      </span>
    </Link>
  );
};

export default ProgramCard;
