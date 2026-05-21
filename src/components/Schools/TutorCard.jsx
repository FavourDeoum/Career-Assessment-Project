import { Link } from 'react-router-dom';
import { Star, Briefcase, Award, CheckCircle, Languages, Quote, Calendar } from 'lucide-react';

const slugify = (text) => {
  if (!text) return '';
  return text.toString().toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
};

const renderStars = (ratingValue) => {
  if (!ratingValue) return null;
  const stars = [];
  const full = Math.floor(ratingValue);
  const half = ratingValue % 1 !== 0;
  for (let i = 0; i < 5; i++) {
    if (i < full) {
      stars.push(<Star key={i} size={14} className="text-yellow-400 fill-yellow-400" />);
    } else if (i === full && half) {
      stars.push(<Star key={i} size={14} className="text-yellow-400 fill-yellow-400/50" />);
    } else {
      stars.push(<Star key={i} size={14} className="text-gray-200 fill-gray-200" />);
    }
  }
  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center gap-0.5">{stars}</div>
      <span className="text-xs text-gray-400 ml-1">({ratingValue})</span>
    </div>
  );
};

const TutorCard = ({ tutor }) => {
  if (!tutor) return null;

  const {
    name,
    image,
    role,
    rating,
    experience,
    specialization,
    languages = [],
    studentFeedback,
    completedSessions,
  } = tutor;

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col">

      {/* Header */}
      <div className="p-5 pb-4 flex items-start gap-3">
        <img
          src={image || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=ede9fe&color=7c3aed&size=64`}
          alt={name}
          className="w-12 h-12 rounded-full object-cover border border-gray-100 flex-shrink-0"
        />
        <div className="min-w-0 flex-1">
          <h4 className="text-sm font-semibold text-gray-900 leading-snug">{name}</h4>
          <p className="text-xs text-purple-600 font-medium mt-0.5 truncate">{role}</p>
          {rating && <div className="mt-1.5">{renderStars(rating)}</div>}
        </div>
      </div>

      <div className="px-5 pb-4 flex-1 space-y-2.5">
        {/* Stats row */}
        <div className="flex flex-wrap gap-x-4 gap-y-1.5">
          {experience && (
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <Briefcase size={12} className="text-purple-400 flex-shrink-0" />
              <span>{experience}</span>
            </div>
          )}
          {completedSessions && (
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <CheckCircle size={12} className="text-purple-400 flex-shrink-0" />
              <span>{completedSessions}+ sessions</span>
            </div>
          )}
        </div>

        {/* Specialization */}
        {specialization && (
          <div className="flex items-start gap-1.5 text-xs text-gray-500">
            <Award size={12} className="text-purple-400 flex-shrink-0 mt-0.5" />
            <span className="leading-relaxed">{specialization}</span>
          </div>
        )}

        {/* Quote */}
        {studentFeedback && (
          <div className="pt-1">
            <div className="flex items-start gap-2 bg-purple-50 rounded-lg px-3 py-2.5">
              <Quote size={12} className="text-purple-400 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-gray-600 italic leading-relaxed line-clamp-3">
                "{studentFeedback}"
              </p>
            </div>
          </div>
        )}

        {/* Languages */}
        {languages.length > 0 && (
          <div className="flex items-center gap-1.5 text-xs text-gray-400">
            <Languages size={12} className="text-purple-400 flex-shrink-0" />
            <span>{languages.join(', ')}</span>
          </div>
        )}
      </div>

      {/* CTA */}
      <div className="px-5 pb-5">
        <Link
          to={`/book-session/${slugify(name)}`}
          state={{ tutor }}
          className="w-full inline-flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium py-2.5 rounded-lg transition-colors duration-150"
        >
          <Calendar size={14} />
          Book Session
        </Link>
      </div>
    </div>
  );
};

export default TutorCard;
