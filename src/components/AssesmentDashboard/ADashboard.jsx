import { useState, useEffect } from "react";
import { useUser, useClerk } from "@clerk/clerk-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Compass, TrendingUp, Target, AlertTriangle, ChevronDown,
  Book, Lightbulb, Award, Briefcase, Zap, ArrowRight, GraduationCap, UserCheck,
  ExternalLink, Home, Users, MessageCircle, RefreshCw, Menu
} from "lucide-react";
import { deleteAssessmentResults, supabaseAdmin } from "../../supabaseClient";
import { useResults } from "../../contexts/ResultsContext";

const slugify = (text) => text.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]+/g, "");

const formatSalary = (str) => {
  if (!str) return null;
  // XAF range: "150,000 – 400,000 XAF/mo" or "150000-400000 XAF"
  const xaf = str.match(/(\d[\d,]+)\s*[-–]\s*(\d[\d,]+)\s*XAF/i);
  if (xaf) {
    const fmt = (n) => parseInt(n.replace(/,/g, ""), 10).toLocaleString("fr-CM");
    return `${fmt(xaf[1])} – ${fmt(xaf[2])} XAF/mois`;
  }
  // Legacy USD: convert to XAF at ~600 XAF/USD
  const usd = str.match(/(\d[\d,]+)\s*[-–]\s*(\d[\d,]+)\s*USD/i);
  if (usd) {
    const fmt = (n) => (parseInt(n.replace(/,/g, ""), 10) * 600).toLocaleString("fr-CM");
    return `${fmt(usd[1])} – ${fmt(usd[2])} XAF/mois`;
  }
  return str;
};

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

        {/* Mobile scrollable pill tabs */}
        <div className="md:hidden relative">
          <div className="overflow-x-auto scrollbar-none -mx-4 px-4" role="tablist">
            <div className="flex gap-2 pb-2">
              {sections.map((s) => (
                <button
                  key={s.id}
                  role="tab"
                  aria-selected={activeSection === s.id}
                  id={`tab-${s.id}`}
                  onClick={() => setActiveSection(s.id)}
                  className={`flex items-center gap-1.5 px-3 py-2.5 rounded-full text-sm font-medium whitespace-nowrap flex-shrink-0 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 ${
                    activeSection === s.id
                      ? "bg-purple-600 text-white"
                      : "bg-white text-gray-600 border border-gray-200 hover:border-gray-300"
                  }`}
                >
                  {s.label}
                  {s.count !== null && (
                    <span className={`text-xs font-medium ${activeSection === s.id ? "opacity-70" : "text-gray-400"}`}>
                      {s.count}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
          {/* Right-fade affordance — signals more tabs off-screen */}
          <div className="pointer-events-none absolute right-0 top-0 h-full w-10 bg-gradient-to-l from-gray-50 to-transparent" />
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
          <div className="space-y-4">
            {/* Top Match hero */}
            {analysis.careerRecommendations?.length > 0 && (
              <div className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-2xl p-5 sm:p-6 text-white">
                <p className="text-white/70 text-xs font-semibold uppercase tracking-widest mb-1">Top Match</p>
                <h2 className="text-2xl font-bold leading-tight">
                  {analysis.careerRecommendations[0].jobTitle}
                </h2>
                {analysis.careerRecommendations[0].salaryRange && (
                  <p className="text-white/80 text-sm mt-1">
                    {formatSalary(analysis.careerRecommendations[0].salaryRange)}
                  </p>
                )}
                <div className="flex flex-wrap gap-2 mt-4">
                  {analysis.skillsAnalysis?.strengths?.[0] && (
                    <span className="text-xs bg-white/25 text-white px-3 py-1 rounded-full font-medium">
                      {analysis.skillsAnalysis.strengths[0]}
                    </span>
                  )}
                  {analysis.actionPlan?.immediateNextSteps?.[0] && (
                    <span className="text-xs bg-white/25 text-white px-3 py-1 rounded-full font-medium max-w-[200px] truncate">
                      {analysis.actionPlan.immediateNextSteps[0]}
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Career Matches — stacked title + salary */}
            {analysis.careerRecommendations?.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Career Matches</p>
                <div className="divide-y divide-gray-100">
                  {analysis.careerRecommendations.map((rec, i) => (
                    <div key={i} className="flex items-start gap-3 py-2.5 first:pt-0 last:pb-0">
                      <span className="w-5 h-5 rounded-full bg-purple-100 text-purple-600 text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                        {i + 1}
                      </span>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-gray-800 leading-snug">{rec.jobTitle}</p>
                        {rec.salaryRange && (
                          <p className="text-xs text-green-700 mt-0.5">{formatSalary(rec.salaryRange)}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Bottom row: Growth + Next Steps */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Growth Opportunities */}
              {(analysis.growthOpportunities?.emergingRoles?.length > 0 || analysis.growthOpportunities?.sectors?.length > 0) && (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Growth Opportunities</p>
                  <div className="flex flex-wrap gap-1.5">
                    {analysis.growthOpportunities.emergingRoles?.map((role, i) => (
                      <span key={i} className="text-xs bg-blue-50 text-blue-700 border border-blue-100 px-2.5 py-1 rounded-full">
                        {role}
                      </span>
                    ))}
                    {analysis.growthOpportunities.sectors?.map((sector, i) => (
                      <span key={i} className="text-xs bg-teal-50 text-teal-700 border border-teal-100 px-2.5 py-1 rounded-full">
                        {sector}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Next Steps */}
              {analysis.actionPlan?.immediateNextSteps?.length > 0 && (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Next Steps</p>
                  <div className="space-y-2.5">
                    {analysis.actionPlan.immediateNextSteps.slice(0, 3).map((step, i) => (
                      <div key={i} className="flex items-start gap-2.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-1.5 flex-shrink-0" />
                        <p className="text-sm text-gray-600 leading-snug">{step}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        );

      // ── SKILLS ────────────────────────────────────────────────────────────
      case "skills":
        return (
          <div className="space-y-4">
            {/* Strengths + Growth side by side in one card */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <div className="flex items-center gap-1.5 mb-3">
                    <Award size={15} className="text-purple-500" />
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Your Strengths</p>
                    <span className="ml-auto text-xs text-gray-300">{analysis.skillsAnalysis?.strengths?.length || 0}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {analysis.skillsAnalysis?.strengths?.length > 0
                      ? analysis.skillsAnalysis.strengths.map((s, i) => (
                          <span key={i} className="px-2.5 py-1 bg-purple-50 text-purple-700 border border-purple-100 rounded-full text-xs font-medium">
                            {s}
                          </span>
                        ))
                      : <p className="text-xs text-gray-400">None identified yet.</p>
                    }
                  </div>
                </div>
                <div className="sm:border-l sm:border-gray-50 sm:pl-6">
                  <div className="flex items-center gap-1.5 mb-3">
                    <Zap size={15} className="text-orange-500" />
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Growth Areas</p>
                    <span className="ml-auto text-xs text-gray-300">{analysis.skillsAnalysis?.skillsToDevelop?.length || 0}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {analysis.skillsAnalysis?.skillsToDevelop?.length > 0
                      ? analysis.skillsAnalysis.skillsToDevelop.map((s, i) => (
                          <span key={i} className="px-2.5 py-1 bg-orange-50 text-orange-700 border border-orange-100 rounded-full text-xs font-medium">
                            {s}
                          </span>
                        ))
                      : <p className="text-xs text-gray-400">None identified yet.</p>
                    }
                  </div>
                </div>
              </div>
            </div>

            {/* Key Insights */}
            {(analysis.insights?.keyTakeaways?.length > 0 || analysis.insights?.motivationalQuote) && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <div className="flex items-center gap-1.5 mb-3">
                  <Lightbulb size={15} className="text-yellow-500" />
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Key Insights</p>
                </div>
                {analysis.insights.keyTakeaways?.length > 0 && (
                  <div className="space-y-2 mb-3">
                    {analysis.insights.keyTakeaways.map((t, i) => (
                      <div key={i} className="flex items-start gap-2.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-yellow-400 mt-1.5 flex-shrink-0" />
                        <p className="text-sm text-gray-600 leading-snug">{t}</p>
                      </div>
                    ))}
                  </div>
                )}
                {analysis.insights.motivationalQuote && (
                  <blockquote className="border-l-2 border-purple-200 pl-3 mt-3">
                    <p className="text-xs text-gray-400 italic">"{analysis.insights.motivationalQuote}"</p>
                  </blockquote>
                )}
              </div>
            )}
          </div>
        );

      // ── PATHS ─────────────────────────────────────────────────────────────
      case "paths":
        return (
          <div className="space-y-3">
            {analysis.careerRecommendations.map((rec, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-5 hover:border-purple-100 hover:shadow-md transition-all">
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="w-7 h-7 rounded-lg bg-purple-600 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
                      {i + 1}
                    </span>
                    <h3 className="font-semibold text-gray-800 text-sm">{rec.jobTitle}</h3>
                  </div>
                  {rec.salaryRange && (
                    <span className="text-xs bg-green-50 text-green-700 border border-green-100 px-2.5 py-0.5 rounded-full whitespace-nowrap flex-shrink-0">
                      {formatSalary(rec.salaryRange)}
                    </span>
                  )}
                </div>
                {rec.explanation && (
                  <p className="text-gray-500 text-xs mt-2 leading-relaxed line-clamp-2 ml-10">{rec.explanation}</p>
                )}
                <div className="mt-3 ml-10 flex gap-3">
                  <Link
                    to={`/schools/career/${slugify(rec.jobTitle)}`}
                    className="inline-flex items-center gap-1 text-xs font-medium text-purple-600 hover:text-purple-700 transition-colors bg-purple-50 px-2.5 py-1 rounded-full border border-purple-100"
                  >
                    <GraduationCap size={11} /> Schools
                  </Link>
                  <Link
                    to={`/mentors/career/${slugify(rec.jobTitle)}`}
                    className="inline-flex items-center gap-1 text-xs font-medium text-purple-600 hover:text-purple-700 transition-colors bg-purple-50 px-2.5 py-1 rounded-full border border-purple-100"
                  >
                    <Users size={11} /> Mentors
                  </Link>
                </div>
              </div>
            ))}
          </div>
        );

      // ── SCHOOLS ───────────────────────────────────────────────────────────
      case "schools": {
        const schools = analysis.recommendedSchools || [];
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                {schools.length} school{schools.length !== 1 ? "s" : ""} matched
              </p>
              <Link
                to="/schools/all"
                className="text-xs font-medium text-purple-600 hover:text-purple-700 transition-colors flex items-center gap-1"
              >
                Browse all <ArrowRight size={12} />
              </Link>
            </div>

            {schools.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-10 text-center">
                <GraduationCap size={40} className="text-gray-200 mx-auto mb-3" />
                <p className="text-gray-500 text-sm mb-3">No school recommendations yet.</p>
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
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                {mentors.length} mentor{mentors.length !== 1 ? "s" : ""} matched
              </p>
              <Link
                to="/mentors/all"
                className="text-xs font-medium text-purple-600 hover:text-purple-700 transition-colors flex items-center gap-1"
              >
                Browse all <ArrowRight size={12} />
              </Link>
            </div>

            {mentors.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-10 text-center">
                <UserCheck size={28} className="text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 text-sm mb-3">No mentors found yet.</p>
                <Link to="/mentors/all" className="text-sm font-medium text-purple-600 hover:text-purple-700 transition-colors">
                  Browse all mentors
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {mentors.slice(0, 6).map((mentor, i) => (
                  <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 hover:border-purple-100 hover:shadow-md transition-all flex flex-col gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 text-purple-700 font-bold text-sm">
                        {mentor.name?.[0] || "M"}
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-semibold text-gray-800 text-sm truncate leading-tight">{mentor.name}</h4>
                        <p className="text-xs text-gray-400 truncate leading-tight">{mentor.role || mentor.specialization}</p>
                      </div>
                    </div>
                    {mentor.schoolName && (
                      <p className="text-xs text-purple-500 font-medium truncate">{mentor.schoolName}</p>
                    )}
                    {mentor.expertise?.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {mentor.expertise.slice(0, 2).map((e, ei) => (
                          <span key={ei} className="text-[10px] bg-gray-50 text-gray-500 border border-gray-100 px-2 py-0.5 rounded-full">
                            {e}
                          </span>
                        ))}
                      </div>
                    )}
                    <Link
                      to="/mentors/all"
                      className="inline-flex items-center gap-1 text-xs font-medium text-purple-600 hover:text-purple-700 transition-colors mt-auto pt-1"
                    >
                      View profile <ArrowRight size={11} />
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
          <div className="space-y-4">
            {/* Courses + Readings */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
                <div className="flex items-center gap-1.5 mb-3">
                  <Book size={14} className="text-blue-500" />
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Courses</p>
                </div>
                {analysis.resources.recommendedCourses?.length > 0 ? (
                  <div className="divide-y divide-gray-50">
                    {analysis.resources.recommendedCourses.map((course, i) => (
                      <div key={i} className="flex items-center gap-2.5 py-2 first:pt-0 last:pb-0">
                        <span className="w-4 h-4 rounded-full bg-blue-100 text-blue-600 text-[9px] font-bold flex items-center justify-center flex-shrink-0">
                          {i + 1}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-700 leading-snug truncate">{course.title || course}</p>
                          {course.url && (
                            <a href={course.url} target="_blank" rel="noopener noreferrer"
                              className="inline-flex items-center gap-0.5 text-[10px] text-blue-500 hover:text-blue-600">
                              Open <ExternalLink size={9} />
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : <p className="text-xs text-gray-400">None yet.</p>}
              </div>

              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
                <div className="flex items-center gap-1.5 mb-3">
                  <Lightbulb size={14} className="text-yellow-500" />
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Readings</p>
                </div>
                {analysis.resources.suggestedReadings?.length > 0 ? (
                  <div className="divide-y divide-gray-50">
                    {analysis.resources.suggestedReadings.map((r, i) => (
                      <div key={i} className="flex items-center gap-2.5 py-2 first:pt-0 last:pb-0">
                        <span className="w-4 h-4 rounded-full bg-yellow-100 text-yellow-700 text-[9px] font-bold flex items-center justify-center flex-shrink-0">
                          {i + 1}
                        </span>
                        <div className="min-w-0">
                          <p className="text-sm text-gray-700 leading-snug truncate">{r.title || r}</p>
                          {r.author && <p className="text-[10px] text-gray-400">by {r.author}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : <p className="text-xs text-gray-400">None yet.</p>}
              </div>
            </div>

            {/* Tools + Roadmap */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
                <div className="flex items-center gap-1.5 mb-3">
                  <Zap size={14} className="text-orange-500" />
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Tools</p>
                </div>
                {analysis.resources.professionalTools?.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {analysis.resources.professionalTools.map((tool, i) => (
                      <span key={i} className="inline-flex items-center gap-1 px-2.5 py-1 bg-orange-50 text-orange-700 border border-orange-100 rounded-full text-xs font-medium">
                        <Zap size={9} />{tool.name || tool}
                      </span>
                    ))}
                  </div>
                ) : <p className="text-xs text-gray-400">None yet.</p>}
              </div>

              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
                <div className="flex items-center gap-1.5 mb-3">
                  <Target size={14} className="text-purple-500" />
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Long-term Roadmap</p>
                </div>
                {analysis.actionPlan?.longTermRoadmap?.length > 0 ? (
                  <div className="space-y-2.5">
                    {analysis.actionPlan.longTermRoadmap.map((milestone, i) => (
                      <div key={i} className="flex items-start gap-2.5">
                        <span className="w-4 h-4 rounded-full bg-purple-600 text-white text-[9px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                          {i + 1}
                        </span>
                        <p className="text-sm text-gray-600 leading-snug">{milestone}</p>
                      </div>
                    ))}
                  </div>
                ) : <p className="text-xs text-gray-400">Roadmap will appear after assessment.</p>}
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
        <div className="flex items-center justify-between mb-6 pb-5 border-b border-gray-100 gap-3">
          <div className="min-w-0">
            <h1 className="text-xl font-bold text-gray-900 truncate">Career Dashboard</h1>
            <p className="text-gray-500 text-sm mt-0.5 flex items-center gap-1 flex-wrap">
              <span className="truncate">{user?.firstName || user?.username || "Welcome back"}</span>
              {assessmentDate && (
                <span className="text-gray-400 text-xs font-normal hidden sm:inline whitespace-nowrap">
                  · Results from {assessmentDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                </span>
              )}
            </p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={handleTakeNewAssessment}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-xl hover:border-gray-300 hover:text-gray-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-1"
            >
              <RefreshCw size={13} />
              Retake
            </button>
            {user && (
              <button
                onClick={handleProfileClick}
                aria-label="View profile"
                className="hidden sm:block w-11 h-11 rounded-full overflow-hidden ring-2 ring-transparent hover:ring-purple-200 transition-all focus-visible:outline-none focus-visible:ring-purple-400 flex-shrink-0"
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
          key={activeSection}
          role="tabpanel"
          id={`panel-${activeSection}`}
          aria-labelledby={`tab-${activeSection}`}
          className="min-h-[50vh] animate-[fadeSlideIn_0.18s_ease-out]"
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
