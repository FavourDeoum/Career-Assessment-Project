import { useState, useEffect } from "react";
import { useUser, useClerk } from "@clerk/clerk-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Compass, TrendingUp, Target, AlertTriangle, ChevronDown,
  Book, Lightbulb, Award, Briefcase, Zap, ArrowRight, GraduationCap, UserCheck,
  ExternalLink, Home, Users, MessageCircle, RefreshCw, Menu, X
} from "lucide-react";
import { deleteAssessmentResults, supabaseAdmin } from "../../supabaseClient";
import { useResults } from "../../contexts/ResultsContext";

const slugify = (text) => text.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]+/g, "");

// ─── Mobile Bottom Nav (standalone so it doesn't re-mount on state changes) ──
const MobileNav = () => {
  const { pathname } = useLocation();
  const navItems = [
    { to: "/cdashboard", icon: Home, label: "Dashboard" },
    { to: "/schools/all", icon: GraduationCap, label: "Schools" },
    { to: "/mentors/all", icon: Users, label: "Mentors" },
    { to: "/contact", icon: MessageCircle, label: "Contact" },
  ];
  return (
    <div
      className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 z-50 md:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      <div className="flex justify-around items-center h-14">
        {navItems.map(({ to, icon: Icon, label }) => {
          const active = pathname === to;
          return (
            <Link
              key={to}
              to={to}
              aria-label={label}
              className={`flex flex-col items-center gap-0.5 px-4 py-1 transition-colors ${
                active ? "text-purple-600" : "text-gray-400 hover:text-gray-600"
              }`}
            >
              <Icon size={20} strokeWidth={active ? 2.5 : 1.5} />
              <span className={`text-[10px] ${active ? "font-semibold" : "font-normal"}`}>{label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

const CareerDashboard = () => {
  const { results, setResults, isLoading, setIsLoading } = useResults();
  const [activeSection, setActiveSection] = useState("overview");
  const [expandedCards, setExpandedCards] = useState(new Set(["career-matches", "next-steps"]));
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [fetchError, setFetchError] = useState(false);
  const [showRetakeConfirm, setShowRetakeConfirm] = useState(false);
  const [assessmentDate, setAssessmentDate] = useState(null);
  const { user, isLoaded } = useUser();
  const { openUserProfile } = useClerk();
  const navigate = useNavigate();

  const getDefaultResults = () => ({
    analysis: {
      careerRecommendations: [],
      skillsAnalysis: { strengths: [], skillsToDevelop: [] },
      actionPlan: { immediateNextSteps: [], shortTermGoals: [], longTermRoadmap: [] },
      potentialChallenges: { challenges: [], mitigationStrategies: [] },
      growthOpportunities: { sectors: [], emergingRoles: [] },
      insights: { keyTakeaways: [], motivationalQuote: "" },
      resources: { recommendedCourses: [], suggestedReadings: [], professionalTools: [] },
      recommendedSchools: [],
      recommendedMentors: [],
    },
  });

  const fetchResults = async () => {
    try {
      setIsLoading(true);
      setFetchError(false);
      if (!user) { setResults(getDefaultResults()); return; }
      const { data, error } = await supabaseAdmin
        .from("career_assessments")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();
      if (error) throw error;
      if (!data?.results?.analysis) { setResults(getDefaultResults()); return; }
      setResults(data.results);
      if (data.created_at) setAssessmentDate(new Date(data.created_at));
    } catch (err) {
      console.error("Error fetching results:", err);
      setFetchError(true);
      setResults(getDefaultResults());
    } finally {
      setIsLoading(false);
    }
  };

  const handleTakeNewAssessment = () => setShowRetakeConfirm(true);

  const confirmRetake = async () => {
    try {
      if (user) await deleteAssessmentResults(user.id);
      setResults(null);
      setShowRetakeConfirm(false);
      navigate("/assessment");
    } catch (err) {
      console.error("Error deleting assessment:", err);
      setShowRetakeConfirm(false);
    }
  };

  useEffect(() => {
    if (isLoaded) fetchResults();
  }, [isLoaded, user]);

  // Close modal on Escape
  useEffect(() => {
    if (!showRetakeConfirm) return;
    const handler = (e) => { if (e.key === "Escape") setShowRetakeConfirm(false); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [showRetakeConfirm]);

  const handleProfileClick = () => openUserProfile?.();

  // ─── Section Tabs ─────────────────────────────────────────────────────────
  const SectionTabs = () => {
    const a = results?.analysis;
    const sections = [
      { id: "overview",     label: "Overview",   count: null },
      { id: "skills",       label: "Skills",     count: (a?.skillsAnalysis?.strengths?.length || 0) + (a?.skillsAnalysis?.skillsToDevelop?.length || 0) || null },
      { id: "paths",        label: "Paths",      count: a?.careerRecommendations?.length || null },
      { id: "schools",      label: "Schools",    count: a?.recommendedSchools?.length || null },
      { id: "mentors",      label: "Mentors",    count: (a?.recommendedSchools || []).reduce((acc, s) => acc + (s.programs || []).reduce((pa, p) => pa + (p.availableTutors?.length || 0), 0), 0) || null },
      { id: "development",  label: "Resources",  count: ((a?.resources?.recommendedCourses?.length || 0) + (a?.resources?.suggestedReadings?.length || 0) + (a?.resources?.professionalTools?.length || 0)) || null },
    ];

    return (
      <div className="mb-6">
        {/* Desktop underline tabs */}
        <div className="hidden md:flex border-b border-gray-200 overflow-x-auto scrollbar-none" role="tablist">
          {sections.map((s) => (
            <button
              key={s.id}
              role="tab"
              aria-selected={activeSection === s.id}
              id={`tab-${s.id}`}
              onClick={() => setActiveSection(s.id)}
              className={`flex items-center gap-2 px-5 py-3 text-sm font-medium border-b-2 -mb-px whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-inset ${
                activeSection === s.id
                  ? "border-purple-600 text-purple-700"
                  : "border-transparent text-gray-500 hover:text-gray-800 hover:border-gray-300"
              }`}
            >
              {s.label}
              {s.count !== null && (
                <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${
                  activeSection === s.id ? "bg-purple-100 text-purple-700" : "bg-gray-100 text-gray-500"
                }`}>
                  {s.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Mobile dropdown */}
        <div className="md:hidden relative">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-expanded={mobileMenuOpen}
            className="w-full flex items-center justify-between px-4 py-2.5 bg-white rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <span>{sections.find((s) => s.id === activeSection)?.label}</span>
            {mobileMenuOpen ? <X size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
          </button>
          {mobileMenuOpen && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl border border-gray-200 shadow-lg z-40 overflow-hidden">
              {sections.map((s) => (
                <button
                  key={s.id}
                  onClick={() => { setActiveSection(s.id); setMobileMenuOpen(false); }}
                  className={`w-full flex items-center justify-between px-4 py-3 text-sm text-left transition-colors ${
                    activeSection === s.id
                      ? "bg-purple-50 text-purple-700 font-medium"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {s.label}
                  {s.count !== null && (
                    <span className="text-xs px-1.5 py-0.5 rounded-full bg-gray-100 text-gray-500 font-medium">{s.count}</span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  // ─── Expandable Card ──────────────────────────────────────────────────────
  const ExpandableCard = ({ title, content, icon, id }) => {
    const isExpanded = expandedCards.has(id);
    const toggle = () =>
      setExpandedCards((prev) => {
        const next = new Set(prev);
        isExpanded ? next.delete(id) : next.add(id);
        return next;
      });
    return (
      <div
        className={`bg-white rounded-2xl border transition-all ${
          isExpanded ? "border-purple-200 shadow-md" : "border-gray-100 shadow-sm hover:border-gray-200 hover:shadow-md"
        }`}
      >
        <button
          onClick={toggle}
          aria-expanded={isExpanded}
          className="w-full flex items-center justify-between p-5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-inset rounded-2xl"
        >
          <div className="flex items-center gap-3">
            <div className="text-purple-500">{icon}</div>
            <span className="text-base font-semibold text-gray-800">{title}</span>
          </div>
          <ChevronDown
            size={18}
            className={`text-gray-400 transition-transform duration-200 flex-shrink-0 ${isExpanded ? "rotate-180" : ""}`}
          />
        </button>
        {isExpanded && (
          <div className="px-5 pb-5 border-t border-gray-50">
            <div className="pt-4">{content}</div>
          </div>
        )}
      </div>
    );
  };

  // ─── Section Content ──────────────────────────────────────────────────────
  const renderSectionContent = () => {
    if (!results?.analysis) return <p className="text-gray-500 text-sm">No assessment data available.</p>;
    const { analysis } = results;

    switch (activeSection) {
      // ── OVERVIEW ──────────────────────────────────────────────────────────
      case "overview":
        return (
          <div className="space-y-5">
            {/* Hero card */}
            {analysis.careerRecommendations?.length > 0 && (
              <div className="bg-white rounded-2xl border border-purple-100 shadow-sm p-5 sm:p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="text-xs font-semibold text-purple-500 uppercase tracking-wider">Top Match</span>
                    <h2 className="text-xl font-bold text-gray-900 mt-1">
                      {analysis.careerRecommendations[0].jobTitle}
                    </h2>
                    {analysis.careerRecommendations[0].salaryRange && (
                      <p className="text-gray-500 text-sm mt-0.5">
                        {analysis.careerRecommendations[0].salaryRange}
                      </p>
                    )}
                  </div>
                  <div className="w-11 h-11 bg-purple-50 border border-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Briefcase className="text-purple-600" size={20} />
                  </div>
                </div>
                {(analysis.skillsAnalysis?.strengths?.[0] || analysis.actionPlan?.immediateNextSteps?.[0]) && (
                  <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t border-gray-50">
                    {analysis.skillsAnalysis?.strengths?.[0] && (
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-semibold text-purple-400 uppercase tracking-wider">Top skill</span>
                        <span className="text-xs bg-purple-50 text-purple-700 px-2.5 py-1 rounded-full border border-purple-100 font-medium">
                          {analysis.skillsAnalysis.strengths[0]}
                        </span>
                      </div>
                    )}
                    {analysis.actionPlan?.immediateNextSteps?.[0] && (
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Next action</span>
                        <span className="text-xs bg-gray-50 text-gray-600 px-2.5 py-1 rounded-full border border-gray-200 font-medium">
                          {analysis.actionPlan.immediateNextSteps[0]}
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Career Matches */}
              <ExpandableCard
                id="career-matches"
                title="Career Matches"
                icon={<Compass size={18} />}
                content={
                  <div className="space-y-3">
                    {analysis.careerRecommendations.map((rec, i) => (
                      <div key={i} className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
                        <span className="w-6 h-6 rounded-full bg-purple-600 text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                          {i + 1}
                        </span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 flex-wrap">
                            <span className="font-semibold text-sm text-gray-800">{rec.jobTitle}</span>
                            {rec.salaryRange && (
                              <span className="text-xs bg-green-50 text-green-700 border border-green-100 px-2 py-0.5 rounded-full whitespace-nowrap">
                                {rec.salaryRange}
                              </span>
                            )}
                          </div>
                          <p className="text-gray-500 text-xs mt-0.5 leading-relaxed">{rec.explanation}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                }
              />

              {/* Growth Opportunities */}
              <ExpandableCard
                id="growth"
                title="Growth Opportunities"
                icon={<TrendingUp size={18} />}
                content={
                  <div className="space-y-4">
                    {analysis.growthOpportunities?.emergingRoles?.length > 0 && (
                      <div>
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Emerging Roles</p>
                        <div className="flex flex-wrap gap-2">
                          {analysis.growthOpportunities.emergingRoles.map((role, i) => (
                            <span key={i} className="text-xs bg-blue-50 text-blue-700 border border-blue-100 px-3 py-1 rounded-full">
                              {role}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    {analysis.growthOpportunities?.sectors?.length > 0 && (
                      <div>
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Growing Sectors</p>
                        <div className="flex flex-wrap gap-2">
                          {analysis.growthOpportunities.sectors.map((sector, i) => (
                            <span key={i} className="text-xs bg-teal-50 text-teal-700 border border-teal-100 px-3 py-1 rounded-full">
                              {sector}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                }
              />

              {/* Next Steps */}
              <ExpandableCard
                id="next-steps"
                title="Next Steps"
                icon={<Target size={18} />}
                content={
                  <div className="space-y-4">
                    {analysis.actionPlan?.immediateNextSteps?.length > 0 && (
                      <div>
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Immediate</p>
                        <div className="space-y-2">
                          {analysis.actionPlan.immediateNextSteps.map((step, i) => (
                            <div key={i} className="flex items-start gap-2.5">
                              <div className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-1.5 flex-shrink-0" />
                              <p className="text-sm text-gray-600 leading-relaxed">{step}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    {analysis.actionPlan?.shortTermGoals?.length > 0 && (
                      <div>
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Short-term</p>
                        <div className="space-y-2">
                          {analysis.actionPlan.shortTermGoals.map((goal, i) => (
                            <div key={i} className="flex items-start gap-2.5">
                              <div className="w-1.5 h-1.5 rounded-full bg-gray-400 mt-1.5 flex-shrink-0" />
                              <p className="text-sm text-gray-600 leading-relaxed">{goal}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                }
              />

              {/* Challenges */}
              <ExpandableCard
                id="challenges"
                title="Challenges & Strategies"
                icon={<AlertTriangle size={18} />}
                content={
                  <div className="space-y-4">
                    {analysis.potentialChallenges?.challenges?.length > 0 && (
                      <div>
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Challenges</p>
                        <div className="space-y-2">
                          {analysis.potentialChallenges.challenges.map((c, i) => (
                            <div key={i} className="flex items-start gap-2.5 p-3 bg-red-50 rounded-lg border-l-2 border-red-300">
                              <p className="text-sm text-red-700 leading-relaxed">{c}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    {analysis.potentialChallenges?.mitigationStrategies?.length > 0 && (
                      <div>
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">How to overcome</p>
                        <div className="space-y-2">
                          {analysis.potentialChallenges.mitigationStrategies.map((s, i) => (
                            <div key={i} className="flex items-start gap-2.5 p-3 bg-green-50 rounded-lg border-l-2 border-green-400">
                              <p className="text-sm text-green-700 leading-relaxed">{s}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                }
              />
            </div>
          </div>
        );

      // ── SKILLS ────────────────────────────────────────────────────────────
      case "skills":
        return (
          <div className="space-y-5">
            <div>
              <h2 className="text-lg font-semibold text-gray-800">Skills Profile</h2>
              <p className="text-gray-500 text-sm mt-0.5">Your current strengths and areas to grow</p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Award size={18} className="text-purple-500" />
                  <h3 className="font-semibold text-gray-800 text-sm">Your Strengths</h3>
                  <span className="ml-auto text-xs text-gray-400">{analysis.skillsAnalysis?.strengths?.length || 0} identified</span>
                </div>
                {analysis.skillsAnalysis?.strengths?.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {analysis.skillsAnalysis.strengths.map((s, i) => (
                      <span key={i} className="px-3 py-1.5 bg-purple-50 text-purple-700 border border-purple-100 rounded-full text-sm font-medium">
                        {s}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-400">No strengths identified yet.</p>
                )}
              </div>

              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Zap size={18} className="text-orange-500" />
                  <h3 className="font-semibold text-gray-800 text-sm">Growth Areas</h3>
                  <span className="ml-auto text-xs text-gray-400">{analysis.skillsAnalysis?.skillsToDevelop?.length || 0} identified</span>
                </div>
                {analysis.skillsAnalysis?.skillsToDevelop?.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {analysis.skillsAnalysis.skillsToDevelop.map((s, i) => (
                      <span key={i} className="px-3 py-1.5 bg-orange-50 text-orange-700 border border-orange-100 rounded-full text-sm font-medium">
                        {s}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-400">No growth areas identified yet.</p>
                )}
              </div>
            </div>

            {/* Key Insights */}
            {(analysis.insights?.keyTakeaways?.length > 0 || analysis.insights?.motivationalQuote) && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Lightbulb size={18} className="text-yellow-500" />
                  <h3 className="font-semibold text-gray-800 text-sm">Key Insights</h3>
                </div>
                {analysis.insights.keyTakeaways?.length > 0 && (
                  <div className="space-y-2 mb-4">
                    {analysis.insights.keyTakeaways.map((t, i) => (
                      <div key={i} className="flex items-start gap-2.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-yellow-400 mt-1.5 flex-shrink-0" />
                        <p className="text-sm text-gray-600 leading-relaxed">{t}</p>
                      </div>
                    ))}
                  </div>
                )}
                {analysis.insights.motivationalQuote && (
                  <blockquote className="border-l-2 border-purple-200 pl-4 py-1">
                    <p className="text-sm text-gray-500 italic">"{analysis.insights.motivationalQuote}"</p>
                  </blockquote>
                )}
              </div>
            )}
          </div>
        );

      // ── PATHS ─────────────────────────────────────────────────────────────
      case "paths":
        return (
          <div className="space-y-5">
            <div>
              <h2 className="text-lg font-semibold text-gray-800">Career Paths</h2>
              <p className="text-gray-500 text-sm mt-0.5">Detailed view of your recommended career directions</p>
            </div>
            <div className="space-y-4">
              {analysis.careerRecommendations.map((rec, i) => (
                <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:border-purple-100 hover:shadow-md transition-all">
                  <div className="flex items-start gap-4">
                    <span className="w-9 h-9 rounded-xl bg-purple-600 text-white text-sm font-bold flex items-center justify-center flex-shrink-0">
                      {i + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3 flex-wrap">
                        <h3 className="font-semibold text-gray-800">{rec.jobTitle}</h3>
                        {rec.salaryRange && (
                          <span className="text-xs bg-green-50 text-green-700 border border-green-100 px-2 py-1 rounded-full whitespace-nowrap">
                            {rec.salaryRange}
                          </span>
                        )}
                      </div>
                      <p className="text-gray-500 text-sm mt-1.5 leading-relaxed">{rec.explanation}</p>
                      <div className="mt-4 flex gap-4">
                        <Link
                          to={`/schools/career/${slugify(rec.jobTitle)}`}
                          className="inline-flex items-center gap-1.5 text-sm font-medium text-purple-600 hover:text-purple-700 transition-colors"
                        >
                          <GraduationCap size={13} /> Schools
                        </Link>
                        <Link
                          to={`/mentors/career/${slugify(rec.jobTitle)}`}
                          className="inline-flex items-center gap-1.5 text-sm font-medium text-purple-600 hover:text-purple-700 transition-colors"
                        >
                          <Users size={13} /> Mentors
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      // ── SCHOOLS ───────────────────────────────────────────────────────────
      case "schools": {
        const schools = analysis.recommendedSchools || [];
        return (
          <div className="space-y-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-800">Schools & Education</h2>
                <p className="text-gray-500 text-sm mt-0.5">Institutions matched to your career goals</p>
              </div>
              <Link
                to="/schools/all"
                className="flex-shrink-0 text-sm font-medium text-purple-600 hover:text-purple-700 transition-colors flex items-center gap-1"
              >
                Browse all <ArrowRight size={14} />
              </Link>
            </div>

            {schools.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-10 text-center">
                <GraduationCap size={28} className="text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 text-sm mb-3">No school recommendations yet. Complete the assessment to see matches.</p>
                <Link to="/schools/all" className="text-sm font-medium text-purple-600 hover:text-purple-700 transition-colors">
                  Browse all schools
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {schools.map((school, i) => (
                  <div key={school.id || i} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:border-purple-100 hover:shadow-md transition-all flex flex-col">
                    <div className="w-10 h-10 bg-purple-50 border border-purple-100 rounded-xl flex items-center justify-center mb-3 flex-shrink-0">
                      <GraduationCap className="text-purple-600" size={18} />
                    </div>
                    <h4 className="font-semibold text-gray-800 text-sm mb-0.5">{school.name}</h4>
                    {school.location && (
                      <p className="text-xs text-gray-400 mb-2">{school.location}</p>
                    )}
                    {school.reasonForRecommendation && (
                      <p className="text-gray-500 text-xs leading-relaxed flex-1 line-clamp-3">
                        {school.reasonForRecommendation}
                      </p>
                    )}
                    {school.identifiedRelevantPrograms?.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-3">
                        {school.identifiedRelevantPrograms.slice(0, 2).map((prog, pi) => (
                          <span key={pi} className="text-[10px] bg-purple-50 text-purple-600 border border-purple-100 px-2 py-0.5 rounded-full">
                            {prog}
                          </span>
                        ))}
                      </div>
                    )}
                    <Link
                      to={`/school/${school.id}`}
                      className="inline-flex items-center gap-1 mt-4 text-sm font-medium text-purple-600 hover:text-purple-700 transition-colors"
                    >
                      View school <ArrowRight size={13} />
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      }

      // ── MENTORS ───────────────────────────────────────────────────────────
      case "mentors": {
        // Extract unique tutors from all recommended school programs
        const seenNames = new Set();
        const mentors = (analysis.recommendedSchools || []).flatMap((school) =>
          (school.programs || []).flatMap((program) =>
            (program.availableTutors || [])
              .filter((t) => {
                if (seenNames.has(t.name)) return false;
                seenNames.add(t.name);
                return true;
              })
              .map((t) => ({ ...t, schoolName: school.name }))
          )
        );
        return (
          <div className="space-y-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-800">Mentors & Guidance</h2>
                <p className="text-gray-500 text-sm mt-0.5">Professionals from your recommended schools</p>
              </div>
              <Link
                to="/mentors/all"
                className="flex-shrink-0 text-sm font-medium text-purple-600 hover:text-purple-700 transition-colors flex items-center gap-1"
              >
                Browse all <ArrowRight size={14} />
              </Link>
            </div>

            {mentors.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-10 text-center">
                <UserCheck size={28} className="text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 text-sm mb-3">No mentors found yet. Complete the assessment to see matches.</p>
                <Link to="/mentors/all" className="text-sm font-medium text-purple-600 hover:text-purple-700 transition-colors">
                  Browse all mentors
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {mentors.slice(0, 6).map((mentor, i) => (
                  <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:border-purple-100 hover:shadow-md transition-all flex flex-col">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 text-purple-700 font-bold text-sm">
                        {mentor.name?.[0] || "M"}
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-semibold text-gray-800 text-sm truncate">{mentor.name}</h4>
                        <p className="text-xs text-gray-400 truncate">{mentor.role || mentor.specialization}</p>
                      </div>
                    </div>
                    {mentor.schoolName && (
                      <p className="text-[10px] text-purple-500 font-medium mb-2 truncate">{mentor.schoolName}</p>
                    )}
                    {mentor.expertise?.length > 0 && (
                      <div className="flex flex-wrap gap-1 flex-1">
                        {mentor.expertise.slice(0, 3).map((e, ei) => (
                          <span key={ei} className="text-[10px] bg-gray-50 text-gray-500 border border-gray-100 px-2 py-0.5 rounded-full">
                            {e}
                          </span>
                        ))}
                      </div>
                    )}
                    <Link
                      to="/mentors/all"
                      className="inline-flex items-center gap-1 mt-4 text-sm font-medium text-purple-600 hover:text-purple-700 transition-colors"
                    >
                      View profile <ArrowRight size={13} />
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      }

      // ── DEVELOPMENT ───────────────────────────────────────────────────────
      case "development":
        return (
          <div className="space-y-5">
            <div>
              <h2 className="text-lg font-semibold text-gray-800">Learning Resources</h2>
              <p className="text-gray-500 text-sm mt-0.5">Curated resources to accelerate your growth</p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Courses */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Book size={18} className="text-blue-500" />
                  <h3 className="font-semibold text-gray-800 text-sm">Recommended Courses</h3>
                </div>
                {analysis.resources.recommendedCourses?.length > 0 ? (
                  <div className="space-y-3">
                    {analysis.resources.recommendedCourses.map((course, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                          {i + 1}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-800 leading-snug">{course.title || course}</p>
                          {course.description && (
                            <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{course.description}</p>
                          )}
                          {course.url && (
                            <a
                              href={course.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 mt-1 text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors"
                            >
                              View course <ExternalLink size={11} />
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-400">No course recommendations yet.</p>
                )}
              </div>

              {/* Readings */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Lightbulb size={18} className="text-yellow-500" />
                  <h3 className="font-semibold text-gray-800 text-sm">Suggested Readings</h3>
                </div>
                {analysis.resources.suggestedReadings?.length > 0 ? (
                  <div className="space-y-3">
                    {analysis.resources.suggestedReadings.map((r, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <span className="w-5 h-5 rounded-full bg-yellow-100 text-yellow-700 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                          {i + 1}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-800 leading-snug">{r.title || r}</p>
                          {r.author && <p className="text-xs text-gray-500 mt-0.5">by {r.author}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-400">No reading recommendations yet.</p>
                )}
              </div>

              {/* Tools */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Zap size={18} className="text-orange-500" />
                  <h3 className="font-semibold text-gray-800 text-sm">Professional Tools</h3>
                </div>
                {analysis.resources.professionalTools?.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {analysis.resources.professionalTools.map((tool, i) => (
                      <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-orange-50 text-orange-700 border border-orange-100 rounded-full text-xs font-medium">
                        <Zap size={10} />
                        {tool.name || tool}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-400">No tool recommendations yet.</p>
                )}
              </div>

              {/* Roadmap */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Target size={18} className="text-purple-500" />
                  <h3 className="font-semibold text-gray-800 text-sm">Long-term Roadmap</h3>
                </div>
                {analysis.actionPlan?.longTermRoadmap?.length > 0 ? (
                  <div className="space-y-3">
                    {analysis.actionPlan.longTermRoadmap.map((milestone, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <div className="flex flex-col items-center flex-shrink-0">
                          <span className="w-6 h-6 rounded-full bg-purple-600 text-white text-xs font-bold flex items-center justify-center">
                            {i + 1}
                          </span>
                          {i < analysis.actionPlan.longTermRoadmap.length - 1 && (
                            <div className="w-px h-6 bg-purple-200 mt-1" />
                          )}
                        </div>
                        <div className={`flex-1 pb-3 ${i < analysis.actionPlan.longTermRoadmap.length - 1 ? "border-b border-gray-50" : ""}`}>
                          <p className="text-sm text-gray-600 leading-relaxed">{milestone}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-400">Roadmap will appear after assessment.</p>
                )}
              </div>
            </div>
          </div>
        );

      default:
        return (
          <p className="text-gray-500 text-sm text-center py-12">
            Select a section to view your insights.
          </p>
        );
    }
  };

  // ─── Loading State ────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-medium text-sm">Loading your dashboard…</p>
          <p className="text-gray-400 text-xs mt-1">Preparing your personalized insights</p>
        </div>
      </div>
    );
  }

  // ─── Fetch Error ──────────────────────────────────────────────────────────
  if (fetchError && user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <div className="w-14 h-14 bg-red-50 border border-red-100 rounded-2xl flex items-center justify-center mx-auto mb-5">
            <AlertTriangle className="text-red-500" size={24} />
          </div>
          <h2 className="text-lg font-semibold text-gray-800 mb-2">Couldn't load your results</h2>
          <p className="text-gray-500 text-sm mb-5 leading-relaxed">
            There was a problem retrieving your data. Your results are saved — please try again.
          </p>
          <button
            onClick={fetchResults}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-purple-600 text-white text-sm font-medium rounded-xl hover:bg-purple-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2"
          >
            <RefreshCw size={14} /> Try Again
          </button>
        </div>
        <MobileNav />
      </div>
    );
  }

  // ─── Guest State ──────────────────────────────────────────────────────────
  if (!user && isLoaded) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-16">
        <div className="max-w-md w-full text-center">
          <div className="w-14 h-14 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Compass className="text-purple-600" size={24} />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome</h1>
          <p className="text-gray-500 text-sm leading-relaxed mb-8">
            Sign in to access your career dashboard and personalized recommendations.
          </p>
          <div className="space-y-3">
            <Link
              to="/sign-in"
              className="flex items-center justify-center gap-2 w-full px-6 py-3 bg-purple-600 text-white text-sm font-semibold rounded-xl hover:bg-purple-700 transition-colors"
            >
              Sign in <ArrowRight size={16} />
            </Link>
            <p className="text-sm text-gray-400">
              No account?{" "}
              <Link to="/sign-up" className="text-purple-600 hover:text-purple-700 font-medium">
                Create one free
              </Link>
            </p>
          </div>
        </div>
        <MobileNav />
      </div>
    );
  }

  // ─── No Assessment State ──────────────────────────────────────────────────
  if (!results?.analysis?.careerRecommendations?.length) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                Hi, {user?.firstName || user?.username || "there"}
              </h1>
              <p className="text-gray-500 text-sm mt-0.5">You haven't taken an assessment yet</p>
            </div>
            {user && (
              <button
                onClick={handleProfileClick}
                aria-label="View profile"
                className="w-9 h-9 rounded-full overflow-hidden ring-2 ring-transparent hover:ring-purple-200 transition-all focus-visible:outline-none focus-visible:ring-purple-400"
              >
                <img src={user.imageUrl || "/placeholder.svg"} alt={user.fullName || "Profile"} className="w-full h-full object-cover" />
              </button>
            )}
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center mb-6">
            <div className="w-14 h-14 bg-purple-50 border border-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-5">
              <Target className="text-purple-600" size={24} />
            </div>
            <h2 className="text-lg font-semibold text-gray-800 mb-2">Discover your career path</h2>
            <p className="text-gray-500 text-sm leading-relaxed mb-6 max-w-sm mx-auto">
              Answer 16 questions and get AI-powered career recommendations, skill analysis, and a personalized roadmap.
            </p>
            <Link
              to="/assessment"
              className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 text-white text-sm font-semibold rounded-xl hover:bg-purple-700 transition-colors"
            >
              Start assessment <ArrowRight size={15} />
            </Link>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {[
              { icon: <Lightbulb size={16} className="text-blue-500" />, label: "Personalized insights", bg: "bg-blue-50" },
              { icon: <Award size={16} className="text-green-500" />, label: "Skills analysis", bg: "bg-green-50" },
              { icon: <TrendingUp size={16} className="text-orange-500" />, label: "Growth roadmap", bg: "bg-orange-50" },
            ].map(({ icon, label, bg }, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 text-center">
                <div className={`w-8 h-8 ${bg} rounded-lg flex items-center justify-center mx-auto mb-2`}>{icon}</div>
                <p className="text-xs font-medium text-gray-600">{label}</p>
              </div>
            ))}
          </div>
        </div>
        <MobileNav />
      </div>
    );
  }

  // ─── Main Dashboard ───────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-8">
      <div className="max-w-6xl mx-auto px-4 py-6 sm:py-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-6 pb-5 border-b border-gray-100">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Career Dashboard</h1>
            <p className="text-gray-500 text-sm mt-0.5">
              {user?.firstName || user?.username || "Welcome back"}
              {assessmentDate && (
                <span className="ml-2 text-gray-400 text-xs font-normal">
                  · Results from {assessmentDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                </span>
              )}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleTakeNewAssessment}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-red-600 bg-white border border-red-200 rounded-xl hover:bg-red-50 hover:border-red-300 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400 focus-visible:ring-offset-1"
            >
              <RefreshCw size={13} />
              Retake
            </button>
            {user && (
              <button
                onClick={handleProfileClick}
                aria-label="View profile"
                className="w-9 h-9 rounded-full overflow-hidden ring-2 ring-transparent hover:ring-purple-200 transition-all focus-visible:outline-none focus-visible:ring-purple-400"
              >
                <img src={user.imageUrl || "/placeholder.svg"} alt={user.fullName || "Profile"} className="w-full h-full object-cover" />
              </button>
            )}
          </div>
        </div>

        {/* Tabs */}
        <SectionTabs />

        {/* Content */}
        <div
          role="tabpanel"
          id={`panel-${activeSection}`}
          aria-labelledby={`tab-${activeSection}`}
          className="min-h-[50vh]"
        >
          {renderSectionContent()}
        </div>
      </div>

      <MobileNav />

      {/* Retake Confirmation Modal */}
      {showRetakeConfirm && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="retake-title"
          onClick={(e) => e.target === e.currentTarget && setShowRetakeConfirm(false)}
        >
          <div className="bg-white rounded-2xl p-6 shadow-xl max-w-sm w-full">
            <div className="w-12 h-12 bg-red-50 border border-red-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="text-red-500" size={22} />
            </div>
            <h3 id="retake-title" className="text-base font-semibold text-gray-800 text-center mb-1">
              Retake assessment?
            </h3>
            <p className="text-gray-500 text-sm text-center mb-5">
              Your current results will be permanently deleted. This cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowRetakeConfirm(false)}
                className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={confirmRetake}
                className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-red-600 rounded-xl hover:bg-red-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
              >
                Yes, retake
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CareerDashboard;
