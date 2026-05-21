import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useResults } from '../../contexts/ResultsContext';
import {
  ArrowLeft, Star, Briefcase, MessageSquare, Calendar, CheckCircle, ExternalLink, BookOpen, Loader2
} from 'lucide-react';

const slugify = (text) => (text || '').toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]+/g, '');

const MentorDetailsPage = () => {
  const { mentorId: mentorSlugFromParams } = useParams();
  const { results, isLoading: resultsLoading } = useResults();
  const [mentorData, setMentorData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState("overview");
  const [bookingError, setBookingError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!resultsLoading && results?.analysis?.recommendedMentors) {
      const found = results.analysis.recommendedMentors.find(
        m => (m.id || slugify(m.name)) === mentorSlugFromParams
      );
      setMentorData(found || null);
    }
    setLoading(resultsLoading);
  }, [results, resultsLoading, mentorSlugFromParams]);

  const handleBookSession = (mentor) => {
    if (mentor.bookingLink) {
      window.open(mentor.bookingLink, '_blank');
    } else {
      setBookingError(`Booking for ${mentor.name} isn't available online yet. Use the contact details below.`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-100/50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-10 h-10 text-purple-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Loading mentor details...</p>
        </div>
      </div>
    );
  }

  if (!mentorData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-100/50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-10 text-center max-w-md w-full">
          <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Briefcase className="w-8 h-8 text-purple-500" />
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Mentor Not Found</h2>
          <p className="text-gray-500 mb-6">We couldn't find this mentor in your recommendations.</p>
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold px-5 py-2.5 rounded-xl transition-colors"
          >
            <ArrowLeft size={16} />
            <span>Go Back</span>
          </button>
        </div>
      </div>
    );
  }

  const { name, title, image, experience, sessions, rating, expertise = [], price, bio, availability, testimonials = [], communicationChannels = {} } = mentorData;

  const sections = [
    { id: "overview", label: "Overview", icon: <BookOpen size={16} /> },
    { id: "testimonials", label: "Testimonials", icon: <MessageSquare size={16} /> },
    { id: "contact", label: "Contact & Availability", icon: <Calendar size={16} /> },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center space-x-2 text-purple-600 hover:text-purple-700 bg-white border border-gray-200 hover:border-purple-200 px-4 py-2 rounded-xl text-sm font-medium transition-colors mb-6 shadow-sm"
        >
          <ArrowLeft size={16} />
          <span>Back to Mentors</span>
        </button>

        {/* Hero card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8 mb-6">
          <div className="flex flex-col sm:flex-row gap-6 items-start">
            <img
              src={image || '/placeholder.svg'}
              alt={name}
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border border-gray-100 flex-shrink-0"
            />

            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-bold text-gray-900 mb-1">{name}</h1>
              {title && <p className="text-purple-600 font-medium mb-3">{title}</p>}

              <div className="flex flex-wrap gap-3 text-sm text-gray-500 mb-4">
                {experience && (
                  <span className="flex items-center gap-1.5">
                    <Briefcase size={14} className="text-gray-400" />
                    {experience}
                  </span>
                )}
                {rating && (
                  <span className="flex items-center gap-1.5">
                    <Star size={14} className="text-yellow-400 fill-yellow-400" />
                    {rating} · {sessions || 0} sessions
                  </span>
                )}
              </div>

              {expertise.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {expertise.slice(0, 5).map(skill => (
                    <span key={skill} className="text-xs bg-purple-50 text-purple-700 px-2.5 py-1 rounded-full border border-purple-100">
                      {skill}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="flex flex-col gap-2 sm:flex-shrink-0 w-full sm:w-auto">
              <button
                onClick={() => handleBookSession(mentorData)}
                className="inline-flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold px-5 py-2.5 rounded-xl transition-colors text-sm shadow-sm"
              >
                <Calendar size={16} />
                Book Session{price && ` · ${price}`}
              </button>
              {communicationChannels.profile && (
                <a
                  href={communicationChannels.profile}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 bg-white border border-gray-200 hover:border-purple-200 text-gray-700 hover:text-purple-700 font-medium px-5 py-2.5 rounded-xl transition-colors text-sm"
                >
                  <ExternalLink size={14} />
                  View Profile
                </a>
              )}
              {bookingError && (
                <p className="text-xs text-red-600 mt-1 leading-snug">{bookingError}</p>
              )}
            </div>
          </div>
        </div>

        {/* Section tabs */}
        <div className="border-b border-gray-200 mb-6">
          <div className="flex gap-1">
            {sections.map(s => (
              <button
                key={s.id}
                onClick={() => setActiveSection(s.id)}
                className={`inline-flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeSection === s.id
                    ? 'border-purple-600 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {s.icon}
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Section content */}
        {activeSection === "overview" && (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h3 className="text-base font-bold text-gray-800 mb-3">About {name}</h3>
              <p className="text-gray-600 leading-relaxed">{bio || "No biography available."}</p>
            </div>
            {expertise.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <h3 className="text-base font-bold text-gray-800 mb-4">Areas of Expertise</h3>
                <ul className="space-y-2">
                  {expertise.map(skill => (
                    <li key={skill} className="flex items-center gap-2.5 text-gray-700 text-sm">
                      <CheckCircle size={15} className="text-purple-500 flex-shrink-0" />
                      {skill}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {activeSection === "testimonials" && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h3 className="text-base font-bold text-gray-800 mb-4">What Mentees Say</h3>
            {testimonials.length > 0 ? (
              <div className="space-y-4">
                {testimonials.map((t, i) => (
                  <blockquote key={i} className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                    <p className="text-gray-700 italic mb-2">"{t.quote}"</p>
                    <footer className="text-sm text-gray-500">— {t.menteeName}, {t.menteeRole}</footer>
                  </blockquote>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No testimonials available yet.</p>
            )}
          </div>
        )}

        {activeSection === "contact" && (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h3 className="text-base font-bold text-gray-800 mb-3">Availability</h3>
              <p className="text-gray-600 text-sm">{availability || "Contact mentor directly for availability details."}</p>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h3 className="text-base font-bold text-gray-800 mb-4">Get in Touch</h3>
              {communicationChannels.email && (
                <p className="text-sm mb-2">
                  <span className="text-gray-500">Email: </span>
                  <a href={`mailto:${communicationChannels.email}`} className="text-purple-600 hover:underline">
                    {communicationChannels.email}
                  </a>
                </p>
              )}
              {communicationChannels.linkedin && (
                <p className="text-sm mb-2">
                  <span className="text-gray-500">LinkedIn: </span>
                  <a href={communicationChannels.linkedin} target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:underline">
                    {communicationChannels.linkedin.split('/').pop()}
                  </a>
                </p>
              )}
              {!communicationChannels.email && !communicationChannels.linkedin && (
                <p className="text-sm text-gray-500">Contact information not publicly listed. Use the booking button above.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MentorDetailsPage;
