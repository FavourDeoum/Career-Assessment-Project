import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useResults } from "../../contexts/ResultsContext";
import {
  ArrowLeft, Briefcase, Loader2, TrendingUp, Zap, Target,
  GraduationCap, Users, Book, PlayCircle, Award, AlertTriangle,
  CheckCircle, ArrowRight, ExternalLink, Lightbulb, Globe, ChevronRight
} from "lucide-react";

const slugify = (text) => (text || "").toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]+/g, "");

const formatSalary = (str) => {
  if (!str) return null;
  const xaf = str.match(/(\d[\d,]+)\s*[-–]\s*(\d[\d,]+)\s*XAF/i);
  if (xaf) {
    const fmt = (n) => parseInt(n.replace(/,/g, ""), 10).toLocaleString("fr-CM");
    return `${fmt(xaf[1])} – ${fmt(xaf[2])} XAF/mois`;
  }
  return str;
};

const Section = ({ icon, title, color = "purple", children }) => (
  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
    <div className="flex items-center gap-2 mb-4">
      <span className={`text-${color}-500`}>{icon}</span>
      <h2 className={`text-sm font-semibold text-${color}-700 uppercase tracking-wider`}>{title}</h2>
    </div>
    {children}
  </div>
);

const Pill = ({ children, color = "gray" }) => (
  <span className={`inline-flex items-center text-xs font-medium px-3 py-1 rounded-full bg-${color}-100 text-${color}-700 border border-${color}-200`}>
    {children}
  </span>
);

export default function CareerPathDetail() {
  const { pathSlug } = useParams();
  const { results, isLoading: resultsLoading } = useResults();
  const [career, setCareer] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!resultsLoading && results?.analysis?.careerRecommendations) {
      const found = results.analysis.careerRecommendations.find(
        (r) => slugify(r.jobTitle) === pathSlug
      );
      setCareer(found || null);
      setLoading(false);
    }
    if (!resultsLoading) setLoading(false);
  }, [results, resultsLoading, pathSlug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-10 h-10 text-purple-600 animate-spin mx-auto mb-3" />
          <p className="text-gray-500 text-sm">Loading career details…</p>
        </div>
      </div>
    );
  }

  if (!career) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-10 text-center max-w-md w-full">
          <div className="w-14 h-14 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Briefcase className="w-7 h-7 text-purple-500" />
          </div>
          <h2 className="text-lg font-bold text-gray-800 mb-2">Path Not Found</h2>
          <p className="text-gray-500 text-sm mb-6">We couldn't find this career path in your results.</p>
          <button
            onClick={() => navigate("/dashboard")}
            className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors"
          >
            <ArrowLeft size={15} /> Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const analysis = results.analysis;
  const slug = slugify(career.jobTitle);
  const careerIndex = (analysis.careerRecommendations || []).findIndex(
    (r) => slugify(r.jobTitle) === pathSlug
  );

  const strengths       = analysis.skillsAnalysis?.strengths || [];
  const skillsToDevelop = analysis.skillsAnalysis?.skillsToDevelop || [];
  const nextSteps       = analysis.actionPlan?.immediateNextSteps || [];
  const shortTermGoals  = analysis.actionPlan?.shortTermGoals || [];
  const longTerm        = analysis.actionPlan?.longTermRoadmap || [];
  const challenges      = analysis.potentialChallenges?.challenges || [];
  const mitigations     = analysis.potentialChallenges?.mitigationStrategies || [];
  const sectors         = analysis.growthOpportunities?.sectors || [];
  const resources       = analysis.resources || {};
  const courses         = (resources.recommendedCourses || []).slice(0, 3);
  const videos          = (resources.videos || []).slice(0, 2);
  const certifications  = (resources.certifications || []).slice(0, 2);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 py-8">

        {/* Back breadcrumb */}
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-purple-600 transition-colors mb-6 group"
        >
          <ArrowLeft size={15} className="group-hover:-translate-x-0.5 transition-transform" />
          Back to Paths
        </button>

        {/* Hero card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-5">
          <div className="flex items-start gap-4">
            <span className="w-10 h-10 rounded-xl bg-purple-600 text-white text-sm font-bold flex items-center justify-center flex-shrink-0">
              {careerIndex + 1}
            </span>
            <div className="flex-1 min-w-0">
              <h1 className="text-xl font-bold text-gray-900 leading-tight mb-1">{career.jobTitle}</h1>
              {career.salaryRange && (
                <span className="inline-block text-xs font-semibold bg-green-50 text-green-700 border border-green-200 px-2.5 py-0.5 rounded-full mb-3">
                  {formatSalary(career.salaryRange)}
                </span>
              )}
              {career.explanation && (
                <p className="text-gray-600 text-sm leading-relaxed">{career.explanation}</p>
              )}
            </div>
          </div>

          {/* Quick action buttons */}
          <div className="flex flex-wrap gap-3 mt-5 pt-5 border-t border-gray-50">
            <Link
              to={`/schools/career/${slug}`}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-xl transition-colors"
            >
              <GraduationCap size={14} /> View Schools
            </Link>
            <Link
              to={`/mentors/career/${slug}`}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-purple-600 bg-purple-50 hover:bg-purple-100 border border-purple-200 px-4 py-2 rounded-xl transition-colors"
            >
              <Users size={14} /> View Mentors
            </Link>
          </div>
        </div>

        <div className="space-y-4">

          {/* Why this fits you */}
          {strengths.length > 0 && (
            <Section icon={<CheckCircle size={16} />} title="Why this fits you" color="purple">
              <p className="text-xs text-gray-500 mb-3">
                Based on your assessment, your existing strengths align well with this career path.
              </p>
              <div className="flex flex-wrap gap-2">
                {strengths.map((s, i) => (
                  <Pill key={i} color="purple">{s}</Pill>
                ))}
              </div>
            </Section>
          )}

          {/* Skills to build */}
          {skillsToDevelop.length > 0 && (
            <Section icon={<TrendingUp size={16} />} title="Skills to develop" color="blue">
              <p className="text-xs text-gray-500 mb-3">
                These are the key areas to focus on to succeed in this career.
              </p>
              <div className="flex flex-wrap gap-2">
                {skillsToDevelop.map((s, i) => (
                  <Pill key={i} color="blue">{s}</Pill>
                ))}
              </div>
            </Section>
          )}

          {/* Action Plan */}
          {(nextSteps.length > 0 || shortTermGoals.length > 0 || longTerm.length > 0) && (
            <Section icon={<Target size={16} />} title="Your action plan" color="orange">
              <div className="space-y-5">
                {nextSteps.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Immediate next steps (0–3 months)</p>
                    <ul className="space-y-2">
                      {nextSteps.map((step, i) => (
                        <li key={i} className="flex items-start gap-2.5">
                          <span className="w-4 h-4 rounded-full bg-orange-100 text-orange-600 text-[9px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                            {i + 1}
                          </span>
                          <p className="text-sm text-gray-600 leading-snug">{step}</p>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {shortTermGoals.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Short-term goals (3–12 months)</p>
                    <ul className="space-y-2">
                      {shortTermGoals.map((goal, i) => (
                        <li key={i} className="flex items-start gap-2.5">
                          <span className="w-4 h-4 rounded-full bg-orange-200 text-orange-700 text-[9px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                            {i + 1}
                          </span>
                          <p className="text-sm text-gray-600 leading-snug">{goal}</p>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {longTerm.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Long-term roadmap (1–5 years)</p>
                    <ul className="space-y-2">
                      {longTerm.map((milestone, i) => (
                        <li key={i} className="flex items-start gap-2.5">
                          <span className="w-4 h-4 rounded-full bg-orange-300 text-orange-800 text-[9px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                            {i + 1}
                          </span>
                          <p className="text-sm text-gray-600 leading-snug">{milestone}</p>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </Section>
          )}

          {/* Challenges */}
          {challenges.length > 0 && (
            <Section icon={<AlertTriangle size={16} />} title="Challenges to expect" color="yellow">
              <div className="space-y-3">
                {challenges.map((c, i) => (
                  <div key={i} className="flex items-start gap-2.5 p-2.5 rounded-xl bg-yellow-50 border border-yellow-100">
                    <AlertTriangle size={13} className="text-yellow-500 flex-shrink-0 mt-0.5" />
                    <div className="min-w-0">
                      <p className="text-sm text-gray-700 leading-snug">{c}</p>
                      {mitigations[i] && (
                        <p className="text-[11px] text-gray-500 mt-1 leading-snug">
                          <span className="font-semibold text-green-600">How to handle: </span>{mitigations[i]}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Section>
          )}

          {/* Growth opportunities */}
          {sectors.length > 0 && (
            <Section icon={<TrendingUp size={16} />} title="Growth opportunities" color="green">
              <p className="text-xs text-gray-500 mb-3">Industries and sectors where this career is growing.</p>
              <div className="flex flex-wrap gap-2">
                {sectors.map((s, i) => (
                  <Pill key={i} color="green">{s}</Pill>
                ))}
              </div>
            </Section>
          )}

          {/* Courses + Certifications + Videos */}
          {(courses.length > 0 || certifications.length > 0 || videos.length > 0) && (
            <Section icon={<Book size={16} />} title="Learning resources" color="blue">
              <div className="space-y-4">
                {courses.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Courses</p>
                    <div className="space-y-2">
                      {courses.map((c, i) => (
                        <div key={i} className="flex items-start gap-2.5">
                          <Book size={12} className="text-blue-400 flex-shrink-0 mt-0.5" />
                          <div className="min-w-0">
                            {c.url ? (
                              <a href={c.url} target="_blank" rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:underline leading-snug">
                                {c.title}
                                <ExternalLink size={10} className="opacity-60 flex-shrink-0" />
                              </a>
                            ) : (
                              <p className="text-sm font-medium text-gray-700">{c.title}</p>
                            )}
                            {c.platform && (
                              <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-blue-100 text-blue-600">{c.platform}</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {certifications.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Certifications</p>
                    <div className="space-y-2">
                      {certifications.map((cert, i) => (
                        <div key={i} className="flex items-start gap-2.5">
                          <Award size={12} className="text-green-500 flex-shrink-0 mt-0.5" />
                          <div className="min-w-0">
                            {cert.url ? (
                              <a href={cert.url} target="_blank" rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-sm font-medium text-green-700 hover:underline leading-snug">
                                {cert.name}
                                <ExternalLink size={10} className="opacity-60 flex-shrink-0" />
                              </a>
                            ) : (
                              <p className="text-sm font-medium text-gray-700">{cert.name}</p>
                            )}
                            {cert.level && (
                              <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${
                                cert.level === "Beginner" ? "bg-green-100 text-green-700" :
                                cert.level === "Intermediate" ? "bg-yellow-100 text-yellow-700" :
                                "bg-red-100 text-red-700"
                              }`}>{cert.level}</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {videos.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Videos</p>
                    <div className="space-y-2">
                      {videos.map((v, i) => (
                        <div key={i} className="flex items-start gap-2.5">
                          <PlayCircle size={12} className="text-red-400 flex-shrink-0 mt-0.5" />
                          <div className="min-w-0">
                            {v.url ? (
                              <a href={v.url} target="_blank" rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-sm font-medium text-red-600 hover:underline leading-snug">
                                {v.title}
                                <ExternalLink size={10} className="opacity-60 flex-shrink-0" />
                              </a>
                            ) : (
                              <p className="text-sm font-medium text-gray-700">{v.title}</p>
                            )}
                            {v.channel && (
                              <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-red-100 text-red-600">{v.channel}</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <Link
                to="/dashboard"
                onClick={() => {}}
                className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-purple-600 hover:text-purple-700"
              >
                View all resources <ArrowRight size={12} />
              </Link>
            </Section>
          )}

          {/* Bottom CTAs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link
              to={`/schools/career/${slug}`}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:border-purple-200 hover:shadow-md transition-all group flex items-center justify-between"
            >
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-0.5">Schools</p>
                <p className="text-sm font-semibold text-gray-800">Find programmes near you</p>
                <p className="text-xs text-gray-500 mt-0.5">Schools that offer this career track</p>
              </div>
              <GraduationCap size={22} className="text-purple-300 group-hover:text-purple-500 transition-colors flex-shrink-0" />
            </Link>
            <Link
              to={`/mentors/career/${slug}`}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:border-purple-200 hover:shadow-md transition-all group flex items-center justify-between"
            >
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-0.5">Mentors</p>
                <p className="text-sm font-semibold text-gray-800">Connect with a mentor</p>
                <p className="text-xs text-gray-500 mt-0.5">Get guidance from professionals</p>
              </div>
              <Users size={22} className="text-purple-300 group-hover:text-purple-500 transition-colors flex-shrink-0" />
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}
