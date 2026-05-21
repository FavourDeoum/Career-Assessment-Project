import { Link } from 'react-router-dom';
import { Clock, ArrowRight } from 'lucide-react';
import { slugify } from '../../utils/slugify';

const ProgramCard = ({ program, schoolId }) => {
  if (!program) return null;

  const programSlug = slugify(program.program);

  return (
    <div className="group bg-gray-50 rounded-xl border border-gray-100 p-4 flex flex-col hover:border-purple-200 hover:bg-white transition-colors duration-150">
      <h3 className="text-sm font-semibold text-gray-800 leading-snug mb-2.5">
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
        {program.tuition && (
          <span className="text-[11px] text-green-700 bg-green-50 border border-green-100 px-2 py-0.5 rounded-full">
            {program.tuition}
          </span>
        )}
      </div>

      {program.description && (
        <p className="text-xs text-gray-500 leading-relaxed mb-3 line-clamp-2 flex-1">
          {program.description}
        </p>
      )}

      <Link
        to={`/school/${schoolId}/program/${programSlug}`}
        className="inline-flex items-center gap-1 text-xs font-medium text-purple-600 hover:text-purple-700 mt-auto transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 rounded"
        aria-label={`View details for ${program.program}`}
      >
        View details
        <ArrowRight size={11} className="group-hover:translate-x-0.5 transition-transform duration-150" />
      </Link>
    </div>
  );
};

export default ProgramCard;
