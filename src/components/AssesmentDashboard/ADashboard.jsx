import { useState, useEffect } from "react";
import { useUser, useClerk } from "@clerk/clerk-react";
import { Link, useNavigate } from "react-router-dom";
import {
  Compass, TrendingUp, Target, AlertTriangle, ChevronDown, ChevronUp,
  Book, Lightbulb, Award, Briefcase, Zap, ArrowRight, GraduationCap, UserCheck,
  ExternalLink, Home, Users, MessageCircle, Menu, X, Settings
} from "lucide-react";
import { deleteAssessmentResults, supabase } from "../../supabaseClient";
import { useResults } from "../../contexts/ResultsContext";

// Helper to generate slugs
const slugify = (text) => text.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]+/g, '');

const CareerDashboard = () => {
  const { results, setResults, isLoading, setIsLoading } = useResults();
  const [activeSection, setActiveSection] = useState("overview");
  const [expandedCard, setExpandedCard] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, isLoaded } = useUser();
  const { openUserProfile } = useClerk();
  const navigate = useNavigate();

  const getDefaultResults = () => ({
    analysis: {
      careerRecommendations: [],
      skillsAnalysis: { strengths: [], skillsToDevelop: [] },
      actionPlan: {
        immediateNextSteps: [],
        shortTermGoals: [],
        longTermRoadmap: [],
      },
      potentialChallenges: {
        challenges: [],
        mitigationStrategies: [],
      },
      growthOpportunities: {
        sectors: [],
        emergingRoles: [],
      },
      insights: {
        keyTakeaways: [],
        motivationalQuote: "",
      },
      resources: {
        recommendedCourses: [],
        suggestedReadings: [],
        professionalTools: [],
      },
      recommendedSchools: [],
      recommendedMentors: [],
    }
  });

  const fetchResults = async () => {
    try {
      setIsLoading(true);
      if (!user) {
        console.warn("User not authenticated. Showing default/guest view.");
        setResults(getDefaultResults());
        return;
      }
      console.log(`Fetching assessment data for user: ${user.id}`);
      const { data, error } = await supabase
        .from("career_assessments")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) {
        console.error("Supabase fetch error:", error);
        throw error;
      }

      if (!data || !data.results || !data.results.analysis) {
        console.warn("Assessment data not found, results missing, or analysis missing");
        setResults(getDefaultResults());
        return;
      }
      setResults(data.results);
      console.log("Assessment results:", data.results);
    } catch (error) {
      console.error("Error fetching assessment results:", error);
      setResults(getDefaultResults());
    } finally {
      setIsLoading(false);
    }
  };

  const handleTakeNewAssessment = async () => {
    try {
      if (user) {
        await deleteAssessmentResults(user.id);
      }
      setResults(null);
      navigate("/assessment");
    } catch (error) {
      console.error("Error deleting assessment:", error);
    }
  };

  useEffect(() => {
    if (isLoaded) {
      fetchResults();
    }
  }, [isLoaded, user]);

  const handleProfileClick = () => {
    if (openUserProfile) openUserProfile();
  };

  // Mobile Navigation Component
  const MobileNav = () => (
    <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-purple-100 z-50 md:hidden">
      <div className="flex justify-around items-center py-2 px-4">
        <Link to="/dashboard" className="flex flex-col items-center p-2 text-purple-600">
          <Home size={20} />
          <span className="text-xs mt-1">Home</span>
        </Link>
        <Link to="/schools/all" className="flex flex-col items-center p-2 text-gray-500 hover:text-purple-600">
          <GraduationCap size={20} />
          <span className="text-xs mt-1">Schools</span>
        </Link>
        <Link to="/mentors/all" className="flex flex-col items-center p-2 text-gray-500 hover:text-purple-600">
          <Users size={20} />
          <span className="text-xs mt-1">Mentors</span>
        </Link>
        <Link to="/contact" className="flex flex-col items-center p-2 text-gray-500 hover:text-purple-600">
          <MessageCircle size={20} />
          <span className="text-xs mt-1">Contact</span>
        </Link>
      </div>
    </div>
  );

  // Section Navigation Tabs
  const SectionTabs = () => {
    const sections = [
      { id: "overview", label: "Overview", icon: <Compass size={16} /> },
      { id: "skills", label: "Skills", icon: <Award size={16} /> },
      { id: "paths", label: "Paths", icon: <Target size={16} /> },
      { id: "schools", label: "Schools", icon: <GraduationCap size={16} /> },
      { id: "mentors", label: "Mentors", icon: <UserCheck size={16} /> },
      { id: "development", label: "Development", icon: <Book size={16} /> }
    ];

    return (
      <div className="mb-8">
        {/* Desktop Navigation */}
        <div className="hidden md:flex bg-white/80 backdrop-blur-sm rounded-2xl p-2 border border-purple-100 shadow-lg">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                activeSection === section.id
                  ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-lg'
                  : 'text-gray-600 hover:text-purple-600 hover:bg-purple-50'
              }`}
            >
              {section.icon}
              <span>{section.label}</span>
            </button>
          ))}
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden">
          <div className="relative">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="w-full flex items-center justify-between px-4 py-3 bg-white/80 backdrop-blur-sm rounded-xl border border-purple-100 shadow-lg"
            >
              <div className="flex items-center space-x-2">
                {sections.find(s => s.id === activeSection)?.icon}
                <span className="font-medium text-gray-700">
                  {sections.find(s => s.id === activeSection)?.label}
                </span>
              </div>
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            
            {mobileMenuOpen && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white/95 backdrop-blur-sm rounded-xl border border-purple-100 shadow-xl z-50">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => {
                      setActiveSection(section.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center space-x-3 px-4 py-3 text-left transition-colors ${
                      activeSection === section.id
                        ? 'bg-purple-50 text-purple-700 border-r-4 border-purple-600'
                        : 'text-gray-600 hover:bg-purple-50 hover:text-purple-600'
                    }`}
                  >
                    {section.icon}
                    <span>{section.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const ExpandableCard = ({ title, content, icon, id, gradient = false }) => {
    const isExpanded = expandedCard === id;
    return (
      <div 
        className={`
          ${gradient 
            ? 'bg-gradient-to-br from-purple-500 to-purple-700 text-white' 
            : 'bg-white/80 backdrop-blur-sm border border-purple-100'
          } 
          rounded-3xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer
          ${isExpanded ? 'ring-2 ring-purple-300' : ''}
        `}
        onClick={() => setExpandedCard(isExpanded ? null : id)}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className={`p-3 rounded-full ${gradient ? 'bg-white/20' : 'bg-purple-100'}`}>
              <div className={gradient ? 'text-white' : 'text-purple-600'}>
                {icon}
              </div>
            </div>
            <h3 className="text-lg font-semibold">{title}</h3>
          </div>
          <div className={`transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
            {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </div>
        </div>
        <div className={`overflow-hidden transition-all duration-300 ${isExpanded ? 'max-h-none opacity-100' : 'max-h-0 opacity-0'}`}>
          {content}
        </div>
      </div>
    );
  };

  const renderSectionContent = () => {
    if (!results || !results.analysis) return <p>No assessment data available.</p>;
    const { analysis } = results;

    switch (activeSection) {
      case "overview":
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ExpandableCard
              id="paths"
              title="Recommended Career Paths"
              icon={<Compass size={24} />}
              content={
                <div className="space-y-4">
                  {analysis.careerRecommendations.map((recommendation, index) => (
                    <div key={index} className="flex items-start space-x-4 p-4 bg-purple-50 rounded-xl">
                      <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
                        {index + 1}
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-1">{recommendation.jobTitle}</h4>
                        <p className="text-gray-600 text-sm">{recommendation.explanation}</p>
                      </div>
                    </div>
                  ))}
                </div>
              }
            />
            <ExpandableCard
              id="growth"
              title="Growth Opportunities"
              icon={<TrendingUp size={24} />}
              gradient={true}
              content={
                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold mb-3 text-white/90">Emerging Roles</h4>
                    <div className="space-y-2">
                      {analysis.growthOpportunities.emergingRoles.map((role, index) => (
                        <div key={index} className="p-3 bg-white/10 rounded-lg text-white/90">
                          {role}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-3 text-white/90">Growing Sectors</h4>
                    <div className="space-y-2">
                      {analysis.growthOpportunities.sectors.map((sector, index) => (
                        <div key={index} className="p-3 bg-white/10 rounded-lg text-white/90">
                          {sector}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              }
            />
            <ExpandableCard
              id="steps"
              title="Recommended Next Steps"
              icon={<Target size={24} />}
              content={
                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-3">Immediate Next Steps</h4>
                    <div className="space-y-2">
                      {analysis.actionPlan.immediateNextSteps.map((step, index) => (
                        <div key={index} className="flex items-start space-x-2">
                          <div className="w-2 h-2 bg-purple-600 rounded-full mt-2 flex-shrink-0"></div>
                          <p className="text-gray-600 text-sm">{step}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-3">Short Term Goals</h4>
                    <div className="space-y-2">
                      {analysis.actionPlan.shortTermGoals.map((goal, index) => (
                        <div key={index} className="flex items-start space-x-2">
                          <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                          <p className="text-gray-600 text-sm">{goal}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              }
            />
            <ExpandableCard
              id="challenges"
              title="Potential Challenges"
              icon={<AlertTriangle size={24} />}
              content={
                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-3">Challenges</h4>
                    <div className="space-y-2">
                      {analysis.potentialChallenges.challenges.map((challenge, index) => (
                        <div key={index} className="p-3 bg-red-50 rounded-lg border-l-4 border-red-300">
                          <p className="text-red-700 text-sm">{challenge}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-3">Mitigation Strategies</h4>
                    <div className="space-y-2">
                      {analysis.potentialChallenges.mitigationStrategies.map((strategy, index) => (
                        <div key={index} className="p-3 bg-green-50 rounded-lg border-l-4 border-green-300">
                          <p className="text-green-700 text-sm">{strategy}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              }
            />
          </div>
        );

      case "skills":
        return (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent mb-4">
                Skills Analysis
              </h2>
              <p className="text-gray-600">Understand your strengths and areas for development</p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ExpandableCard
                id="strengths"
                title="Your Strengths"
                icon={<Award size={24} />}
                gradient={true}
                content={
                  <div className="space-y-3">
                    {analysis.skillsAnalysis.strengths.map((strength, index) => (
                      <div key={index} className="p-3 bg-white/10 rounded-lg text-white/90 flex items-center space-x-3">
                        <div className="w-2 h-2 bg-white rounded-full flex-shrink-0"></div>
                        <span>{strength}</span>
                      </div>
                    ))}
                  </div>
                }
              />
              <ExpandableCard
                id="develop"
                title="Skills to Develop"
                icon={<Zap size={24} />}
                content={
                  <div className="space-y-3">
                    {analysis.skillsAnalysis.skillsToDevelop.map((skill, index) => (
                      <div key={index} className="p-3 bg-orange-50 rounded-lg border-l-4 border-orange-300 flex items-center space-x-3">
                        <div className="w-2 h-2 bg-orange-500 rounded-full flex-shrink-0"></div>
                        <span className="text-orange-700">{skill}</span>
                      </div>
                    ))}
                  </div>
                }
              />
            </div>
          </div>
        );

      case "paths":
        return (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent mb-4">
                Career Paths
              </h2>
              <p className="text-gray-600">Detailed exploration of your recommended career paths</p>
            </div>
            <div className="grid grid-cols-1 gap-6">
              <ExpandableCard
                id="detailed-paths"
                title="Detailed Career Paths"
                icon={<Briefcase size={24} />}
                content={
                  <div className="space-y-6">
                    {analysis.careerRecommendations.map((recommendation, index) => (
                      <div key={index} className="p-6 bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl border border-purple-200">
                        <div className="flex items-start space-x-4 mb-4">
                          <div className="w-12 h-12 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold text-lg flex-shrink-0">
                            {index + 1}
                          </div>
                          <div className="flex-1">
                            <h3 className="text-xl font-bold text-gray-800 mb-2">{recommendation.jobTitle}</h3>
                            <p className="text-gray-600 mb-4">{recommendation.explanation}</p>
                            <Link 
                              to={`/explore/career/${slugify(recommendation.jobTitle)}`} 
                              className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                            >
                              Explore This Path <ArrowRight size={16} className="ml-2" />
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                }
              />
              <ExpandableCard
                id="insights"
                title="Key Insights"
                icon={<Lightbulb size={24} />}
                gradient={true}
                content={
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-semibold mb-3 text-white/90">Key Takeaways</h4>
                      <div className="space-y-2">
                        {analysis.insights.keyTakeaways.map((takeaway, index) => (
                          <div key={index} className="p-3 bg-white/10 rounded-lg text-white/90">
                            {takeaway}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-3 text-white/90">Motivational Quote</h4>
                      <blockquote className="p-4 bg-white/10 rounded-lg text-white/90 italic text-center">
                        "{analysis.insights.motivationalQuote}"
                      </blockquote>
                    </div>
                  </div>
                }
              />
            </div>
          </div>
        );

      case "schools":
        return (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent mb-4">
                Schools & Education
              </h2>
              <p className="text-gray-600">Find the right educational institutions for your career goals</p>
            </div>
            <ExpandableCard
              id="schools"
              title="Recommended Schools"
              icon={<GraduationCap size={24} />}
              content={
                <div className="space-y-6">
                  <p className="text-gray-600">Explore top educational institutions that offer programs aligned with your career goals.</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {(analysis.careerRecommendations || []).slice(0, 3).map((career, index) => (
                      <div key={index} className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border border-purple-200">
                        <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mb-4">
                          <GraduationCap className="text-white" size={24} />
                        </div>
                        <h4 className="font-semibold text-gray-800 mb-2">{career.jobTitle} Programs</h4>
                        <p className="text-gray-600 text-sm mb-4">Find schools offering specialized education in {career.jobTitle.toLowerCase()}.</p>
                        <Link 
                          to={`/schools/career/${slugify(career.jobTitle)}`} 
                          className="inline-flex items-center text-purple-600 hover:text-purple-700 font-medium"
                        >
                          Find Schools <ArrowRight size={16} className="ml-1" />
                        </Link>
                      </div>
                    ))}
                  </div>
                  <div className="text-center">
                    <Link 
                      to="/schools/all" 
                      className="inline-flex items-center px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors"
                    >
                      View All Recommended Schools <ArrowRight size={16} className="ml-2" />
                    </Link>
                  </div>
                </div>
              }
            />
          </div>
        );

      case "mentors":
        return (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent mb-4">
                Mentors & Guidance
              </h2>
              <p className="text-gray-600">Connect with experienced professionals who can guide your journey</p>
            </div>
            <ExpandableCard
              id="mentors"
              title="Connect with Mentors"
              icon={<UserCheck size={24} />}
              content={
                <div className="space-y-6">
                  <p className="text-gray-600">Connect with experienced professionals who can guide you on your career journey.</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {(analysis.careerRecommendations || []).slice(0, 3).map((career, index) => (
                      <div key={index} className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border border-purple-200">
                        <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mb-4">
                          <UserCheck className="text-white" size={24} />
                        </div>
                        <h4 className="font-semibold text-gray-800 mb-2">{career.jobTitle} Mentors</h4>
                        <p className="text-gray-600 text-sm mb-4">Connect with experienced {career.jobTitle.toLowerCase()} professionals.</p>
                        <Link 
                          to={`/mentors/career/${slugify(career.jobTitle)}`} 
                          className="inline-flex items-center text-purple-600 hover:text-purple-700 font-medium"
                        >
                          Find Mentors <ArrowRight size={16} className="ml-1" />
                        </Link>
                      </div>
                    ))}
                  </div>
                  <div className="text-center">
                    <Link 
                      to="/mentors/all" 
                      className="inline-flex items-center px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors"
                    >
                      View All Recommended Mentors <ArrowRight size={16} className="ml-2" />
                    </Link>
                  </div>
                </div>
              }
            />
          </div>
        );

      case "development":
        return (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent mb-4">
                Learning & Development
              </h2>
              <p className="text-gray-600">Resources to accelerate your professional growth</p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ExpandableCard
                id="courses"
                title="Recommended Courses"
                icon={<Book size={24} />}
                content={
                  <div className="space-y-4">
                    {analysis.resources.recommendedCourses?.length > 0 ? (
                      analysis.resources.recommendedCourses.map((course, index) => (
                        <div key={index} className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                          <div className="flex items-start space-x-3">
                            <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
                              {index + 1}
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-800 mb-1">{course.title || course}</h4>
                              {course.description && (
                                <p className="text-gray-600 text-sm mb-2">{course.description}</p>
                              )}
                              {course.url && (
                                <a 
                                  href={course.url} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center text-blue-600 hover:text-blue-700 text-sm font-medium"
                                >
                                  View Course <ExternalLink size={14} className="ml-1" />
                                </a>
                              )}
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-6 bg-gray-50 rounded-xl text-center">
                        <Book className="mx-auto mb-3 text-gray-400" size={32} />
                        <p className="text-gray-600">Course recommendations will appear here based on your assessment results.</p>
                      </div>
                    )}
                  </div>
                }
              />
              <ExpandableCard
                id="readings"
                title="Suggested Readings"
                icon={<Lightbulb size={24} />}
                gradient={true}
                content={
                  <div className="space-y-4">
                    {analysis.resources.suggestedReadings?.length > 0 ? (
                      analysis.resources.suggestedReadings.map((reading, index) => (
                        <div key={index} className="p-4 bg-white/10 rounded-xl">
                          <div className="flex items-start space-x-3">
                            <div className="w-8 h-8 bg-white/20 text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
                              {index + 1}
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold text-white mb-1">{reading.title || reading}</h4>
                              {reading.author && (
                                <p className="text-white/80 text-sm mb-2">by {reading.author}</p>
                              )}
                              {reading.description && (
                                <p className="text-white/70 text-sm">{reading.description}</p>
                              )}
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-6 bg-white/10 rounded-xl text-center">
                        <Lightbulb className="mx-auto mb-3 text-white/60" size={32} />
                        <p className="text-white/80">Reading recommendations will appear here based on your career interests.</p>
                      </div>
                    )}
                  </div>
                }
              />
              <ExpandableCard
                id="tools"
                title="Professional Tools"
                icon={<Zap size={24} />}
                content={
                  <div className="space-y-4">
                    {analysis.resources.professionalTools?.length > 0 ? (
                      analysis.resources.professionalTools.map((tool, index) => (
                        <div key={index} className="p-4 bg-yellow-50 rounded-xl border border-yellow-200">
                          <div className="flex items-start space-x-3">
                            <div className="w-8 h-8 bg-yellow-600 text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
                              <Zap size={16} />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-800 mb-1">{tool.name || tool}</h4>
                              {tool.description && (
                                <p className="text-gray-600 text-sm mb-2">{tool.description}</p>
                              )}
                              {tool.category && (
                                <span className="inline-block px-2 py-1 bg-yellow-200 text-yellow-800 text-xs rounded-full">
                                  {tool.category}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-6 bg-gray-50 rounded-xl text-center">
                        <Zap className="mx-auto mb-3 text-gray-400" size={32} />
                        <p className="text-gray-600">Tool recommendations will appear here to help enhance your productivity.</p>
                      </div>
                    )}
                  </div>
                }
              />
              <ExpandableCard
                id="roadmap"
                title="Long-term Roadmap"
                icon={<Target size={24} />}
                content={
                  <div className="space-y-4">
                    {analysis.actionPlan.longTermRoadmap?.length > 0 ? (
                      <div className="space-y-4">
                        {analysis.actionPlan.longTermRoadmap.map((milestone, index) => (
                          <div key={index} className="flex items-start space-x-4">
                            <div className="flex flex-col items-center">
                              <div className="w-10 h-10 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
                                {index + 1}
                              </div>
                              {index < analysis.actionPlan.longTermRoadmap.length - 1 && (
                                <div className="w-0.5 h-8 bg-purple-300 mt-2"></div>
                              )}
                            </div>
                            <div className="flex-1 pb-6">
                              <div className="p-4 bg-purple-50 rounded-xl border-l-4 border-purple-600">
                                <p className="text-gray-700">{milestone}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-6 bg-gray-50 rounded-xl text-center">
                        <Target className="mx-auto mb-3 text-gray-400" size={32} />
                        <p className="text-gray-600">Your long-term career roadmap will be developed based on your assessment results.</p>
                      </div>
                    )}
                  </div>
                }
              />
            </div>
          </div>
        );

      default:
        return <div className="text-center py-12">
          <p className="text-gray-600">Select a section to view your personalized insights.</p>
        </div>;
    }
  };

  // Loading State with enhanced animation
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-100/50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-6"></div>
            <div className="absolute inset-0 w-20 h-20 border-4 border-transparent border-r-purple-400 rounded-full animate-ping mx-auto"></div>
          </div>
          <div className="space-y-2">
            <p className="text-purple-600 font-semibold text-lg">Loading your dashboard...</p>
            <p className="text-gray-500 text-sm">Preparing your personalized insights</p>
          </div>
        </div>
      </div>
    );
  }

  // Guest State with enhanced design
  if (!user && isLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-100/50 py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-purple-100 rounded-full mb-6">
              <Compass className="text-purple-600" size={32} />
            </div>
            <h1 className="text-5xl sm:text-6xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent mb-6">
              Welcome, Guest!
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Unlock your career potential with our comprehensive assessment. 
              Sign in to save your results and track your professional journey.
            </p>
          </div>
          
          <div className="max-w-2xl mx-auto">
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-purple-100">
              <div className="text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-purple-700 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Target className="text-white" size={36} />
                </div>
                <h2 className="text-3xl font-bold text-gray-800 mb-4">Start Your Career Journey</h2>
                <p className="text-gray-600 mb-8 text-lg leading-relaxed">
                  Our AI-powered assessment analyzes your skills, interests, and preferences to provide 
                  personalized career recommendations and actionable growth strategies.
                </p>
                <div className="space-y-4">
                  <Link 
                    to="/sign-in" 
                    className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-purple-600 to-purple-700 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-purple-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    Sign In to Get Started
                    <ArrowRight className="ml-2" size={18} />
                  </Link>
                  <p className="text-sm text-gray-500">
                    No account? <Link to="/sign-up" className="text-purple-600 hover:text-purple-700 font-medium">Create one for free</Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <MobileNav />
      </div>
    );
  }

  // No Assessment Results State with enhanced CTAs
  if (!results || !results.analysis || !results.analysis.careerRecommendations || results.analysis.careerRecommendations.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-100/50 py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center justify-between mb-12">
            <div className="text-center lg:text-left mb-8 lg:mb-0">
              <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent mb-4">
                Welcome back, {user?.fullName || user?.username || "User"}!
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl">
                Ready to discover your ideal career path? Take our comprehensive assessment to unlock personalized insights.
              </p>
            </div>
            {user && (
              <div className="flex items-center space-x-4">
                <div 
                  className="w-16 h-16 rounded-full overflow-hidden cursor-pointer hover:ring-4 hover:ring-purple-200 transition-all duration-200 shadow-lg"
                  onClick={handleProfileClick}
                >
                  <img src={user.imageUrl || "/placeholder.svg"} alt="Profile" className="w-full h-full object-cover" />
                </div>
                <button
                  onClick={handleProfileClick}
                  className="p-3 bg-white/80 backdrop-blur-sm rounded-xl border border-purple-100 hover:bg-purple-50 transition-colors"
                >
                  <Settings size={20} className="text-purple-600" />
                </button>
              </div>
            )}
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-purple-100">
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-700 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Target className="text-white" size={32} />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Career Assessment</h2>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Discover your strengths, explore career options, and get a personalized roadmap for your professional growth.
                </p>
                <Link 
                  to="/assessment" 
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-purple-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  Start Assessment
                  <ArrowRight className="ml-2" size={16} />
                </Link>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-purple-100 shadow-lg">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Lightbulb className="text-blue-600" size={20} />
                  </div>
                  <h3 className="font-semibold text-gray-800">Personalized Insights</h3>
                </div>
                <p className="text-gray-600 text-sm">Get tailored career recommendations based on your unique profile.</p>
              </div>
              
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-purple-100 shadow-lg">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <Award className="text-green-600" size={20} />
                  </div>
                  <h3 className="font-semibold text-gray-800">Skills Analysis</h3>
                </div>
                <p className="text-gray-600 text-sm">Identify your strengths and areas for development with detailed analysis.</p>
              </div>
              
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-purple-100 shadow-lg">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                    <TrendingUp className="text-orange-600" size={20} />
                  </div>
                  <h3 className="font-semibold text-gray-800">Growth Roadmap</h3>
                </div>
                <p className="text-gray-600 text-sm">Receive actionable steps and long-term strategies for career advancement.</p>
              </div>
            </div>
          </div>
        </div>
        <MobileNav />
      </div>
    );
  }

  // Main Dashboard Content
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-100/50 pb-20 md:pb-8">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-8">
          <div className="mb-4 lg:mb-0">
            <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent mb-2">
              Career Dashboard
            </h1>
            <p className="text-gray-600 text-lg">
              Welcome back, {user?.fullName || user?.username || "User"}! Here's your personalized career insights.
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={handleTakeNewAssessment}
              className="px-4 py-2 bg-white/80 backdrop-blur-sm border border-purple-200 rounded-xl text-purple-600 hover:bg-purple-50 transition-colors font-medium"
            >
              Retake Assessment
            </button>
            {user && (
              <div 
                className="w-12 h-12 rounded-full overflow-hidden cursor-pointer hover:ring-4 hover:ring-purple-200 transition-all duration-200 shadow-lg"
                onClick={handleProfileClick}
              >
                <img src={user.imageUrl || "/placeholder.svg"} alt="Profile" className="w-full h-full object-cover" />
              </div>
            )}
          </div>
        </div>

        {/* Navigation Tabs */}
        <SectionTabs />

        {/* Content */}
        <div className="min-h-[60vh]">
          {renderSectionContent()}
        </div>
      </div>
      
      {/* Mobile Navigation */}
      <MobileNav />
    </div>
  );
};

export default CareerDashboard;