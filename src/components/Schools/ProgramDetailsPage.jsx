import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useResults } from '../../contexts/ResultsContext';
import {
  ArrowLeft, Clock, GraduationCap, FileText, CheckCircle, ExternalLink,
  DollarSign, Briefcase, BookOpen, Info, ListChecks, FileSignature, Users
} from 'lucide-react';

// Import the slugify function
import { slugify } from '../../utils/slugify';
import TutorCard from './TutorCard';

// Helper function to find school by slug
const findSchoolBySlug = (schools, slug) => {
  return schools.find(s => s.id === slug || slugify(s.name) === slug);
};

const ProgramDetailsPage = () => {
  const { schoolId: schoolSlug, programId: programSlug } = useParams();
  const { results, isLoading: resultsLoading } = useResults();
  const [programData, setProgramData] = useState(null);
  const [school, setSchool] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState("overview");
  const navigate = useNavigate();

  useEffect(() => {
    if (!resultsLoading && results?.analysis?.recommendedSchools) {
      const foundSchool = findSchoolBySlug(results.analysis.recommendedSchools, schoolSlug);
      
      if (foundSchool) {
        setSchool(foundSchool);
        // Find the program by comparing the slug from the URL with the slugified program name
        const foundProgram = foundSchool.programs?.find(
          p => slugify(p.program) === programSlug
        );
        setProgramData(foundProgram);
      }
    }
    setLoading(resultsLoading);
  }, [results, resultsLoading, schoolSlug, programSlug]);

  const handleBack = () => {
    navigate(`/school/${schoolSlug}`);
  };

  const handleNavigateToApplication = (program) => {
    // Note: Your data does not have an 'applicationLink' field.
    // This button will only show if you add it to your database.
    if (program.applicationLink) {
      window.open(program.applicationLink, '_blank');
    } else {
      alert(`Application link for ${program.program} is not available.`);
    }
  };

  const SectionButton = ({ id, label, icon, isActive, onClick }) => (
    <button 
      onClick={() => onClick(id)} 
      className={`group flex items-center space-x-3 px-6 py-4 rounded-xl font-medium transition-all duration-300 shadow-sm hover:shadow-md ${
        isActive 
          ? "bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-lg" 
          : "bg-white/70 backdrop-blur-sm text-gray-700 hover:text-purple-700 hover:bg-white/90 border border-purple-100"
      }`}
    >
      <span className={`transition-colors duration-300 ${isActive ? 'text-white' : 'text-purple-600 group-hover:text-purple-700'}`}>
        {icon}
      </span>
      <span className="font-semibold">{label}</span>
    </button>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-100/50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-purple-600 rounded-full animate-pulse mx-auto mb-4"></div>
          <p className="text-xl text-gray-600">Loading program details...</p>
        </div>
      </div>
    );
  }

  if (!programData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-100/50 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <FileText className="w-12 h-12 text-red-500" />
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Program Not Found</h2>
          <p className="text-gray-600 mb-8">
            The program details you are looking for do not exist or could not be loaded for {school?.name || 'this school'}.
          </p>
          <button 
            onClick={handleBack} 
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white px-6 py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-purple-800 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <ArrowLeft size={18} />
            <span>Back to School Profile</span>
          </button>
        </div>
      </div>
    );
  }

  // Destructure using the actual field names from your database
  const {
    program,
    duration,
    tuition,
    description,
    requirements = [],
    applicationProcess,
    availableTutors = [],
    // These fields are not in your data, but are kept for future expansion
    degreeLevel, 
    department, 
    curriculumHighlights = [],
    careerOutcomes = [],
    applicationLink
  } = programData;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-100/50">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-200/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-300/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-sm border-b border-purple-100 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <button 
              className="inline-flex items-center space-x-3 text-purple-700 hover:text-purple-800 font-medium transition-colors duration-200 text-lg" 
              onClick={handleBack}
            >
              <ArrowLeft size={20} />
              <span>Back to {school?.name || "School Profile"}</span>
            </button>
          </div>
        </div>

        {/* Hero Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 lg:p-12 shadow-xl border border-purple-100 mb-8">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between space-y-6 lg:space-y-0">
              <div className="flex items-start space-x-6 flex-1">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-purple-700 rounded-2xl flex items-center justify-center shadow-lg">
                  <GraduationCap size={40} className="text-white"/>
                </div>
                <div className="flex-1">
                  <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent mb-2">
                    {program}
                  </h1>
                  <h2 className="text-xl lg:text-2xl text-gray-600 mb-6">
                    {department ? `${department} at ` : ''}{school?.name}
                  </h2>
                  <div className="flex flex-wrap gap-4">
                    {degreeLevel && (
                      <div className="flex items-center space-x-2 bg-purple-100 px-4 py-2 rounded-full">
                        <GraduationCap className="text-purple-600" size={18} />
                        <span className="text-purple-800 font-medium">{degreeLevel}</span>
                      </div>
                    )}
                    {duration && (
                      <div className="flex items-center space-x-2 bg-purple-100 px-4 py-2 rounded-full">
                        <Clock className="text-purple-600" size={18} />
                        <span className="text-purple-800 font-medium">{duration}</span>
                      </div>
                    )}
                    {tuition && (
                      <div className="flex items-center space-x-2 bg-purple-100 px-4 py-2 rounded-full">
                        <DollarSign className="text-purple-600" size={18} />
                        <span className="text-purple-800 font-medium">{tuition}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              {applicationLink && (
                <div className="lg:ml-6">
                  <button 
                    className="inline-flex items-center space-x-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white px-8 py-4 rounded-xl font-semibold hover:from-purple-700 hover:to-purple-800 transition-all duration-200 shadow-lg hover:shadow-xl text-lg"
                    onClick={() => handleNavigateToApplication(programData)}
                  >
                    <ExternalLink size={20} />
                    <span>Apply Now</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Navigation */}
          <div className="mb-8">
            <div className="flex flex-wrap gap-3">
              <SectionButton 
                id="overview" 
                label="Overview" 
                icon={<Info size={18} />} 
                isActive={activeSection === "overview"} 
                onClick={setActiveSection} 
              />
              {curriculumHighlights.length > 0 && (
                <SectionButton 
                  id="curriculum" 
                  label="Curriculum" 
                  icon={<BookOpen size={18} />} 
                  isActive={activeSection === "curriculum"} 
                  onClick={setActiveSection} 
                />
              )}
              {requirements.length > 0 && (
                <SectionButton 
                  id="requirements" 
                  label="Admissions" 
                  icon={<ListChecks size={18} />} 
                  isActive={activeSection === "requirements"} 
                  onClick={setActiveSection} 
                />
              )}
              {applicationProcess && (
                <SectionButton 
                  id="application" 
                  label="Application" 
                  icon={<FileSignature size={18} />} 
                  isActive={activeSection === "application"} 
                  onClick={setActiveSection} 
                />
              )}
              {careerOutcomes.length > 0 && (
                <SectionButton 
                  id="outcomes" 
                  label="Career Outcomes" 
                  icon={<Briefcase size={18} />} 
                  isActive={activeSection === "outcomes"} 
                  onClick={setActiveSection} 
                />
              )}
              {availableTutors.length > 0 && (
                <SectionButton 
                  id="tutors" 
                  label="Tutors" 
                  icon={<Users size={18} />} 
                  isActive={activeSection === "tutors"} 
                  onClick={setActiveSection} 
                />
              )}
            </div>
          </div>

          {/* Content Sections */}
          <div className="space-y-8">
            {activeSection === "overview" && (
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-purple-100">
                <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center space-x-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Info className="text-purple-600" size={18} />
                  </div>
                  <span>Program Overview</span>
                </h3>
                <p className="text-gray-700 text-lg leading-relaxed">
                  {description || "Detailed overview not available."}
                </p>
              </div>
            )}
            
            {activeSection === "curriculum" && curriculumHighlights.length > 0 && (
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-purple-100">
                <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center space-x-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                    <BookOpen className="text-purple-600" size={18} />
                  </div>
                  <span>Curriculum Highlights</span>
                </h3>
                <div className="space-y-4">
                  {curriculumHighlights.map((highlight, index) => (
                    <div key={index} className="flex items-start space-x-4 p-4 bg-purple-50/50 rounded-xl border border-purple-100">
                      <CheckCircle className="text-purple-600 mt-0.5 flex-shrink-0" size={20}/>
                      <span className="text-gray-700 text-lg">{highlight}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeSection === "requirements" && requirements.length > 0 && (
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-purple-100">
                <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center space-x-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                    <ListChecks className="text-purple-600" size={18} />
                  </div>
                  <span>Admission Requirements</span>
                </h3>
                <div className="space-y-4">
                  {requirements.map((req, index) => (
                    <div key={index} className="flex items-start space-x-4 p-4 bg-purple-50/50 rounded-xl border border-purple-100">
                      <FileText className="text-purple-600 mt-0.5 flex-shrink-0" size={20}/>
                      <span className="text-gray-700 text-lg">{req}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeSection === "application" && applicationProcess && (
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-purple-100">
                <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center space-x-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                    <FileSignature className="text-purple-600" size={18} />
                  </div>
                  <span>Application Process</span>
                </h3>
                <p className="text-gray-700 text-lg leading-relaxed">{applicationProcess}</p>
              </div>
            )}

            {activeSection === "outcomes" && careerOutcomes.length > 0 && (
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-purple-100">
                <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center space-x-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Briefcase className="text-purple-600" size={18} />
                  </div>
                  <span>Potential Career Outcomes</span>
                </h3>
                <div className="space-y-4">
                  {careerOutcomes.map((outcome, index) => (
                    <div key={index} className="flex items-start space-x-4 p-4 bg-purple-50/50 rounded-xl border border-purple-100">
                      <Briefcase className="text-purple-600 mt-0.5 flex-shrink-0" size={20}/>
                      <span className="text-gray-700 text-lg">{outcome}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {activeSection === "tutors" && availableTutors.length > 0 && (
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-purple-100">
                <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center space-x-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Users className="text-purple-600" size={18} />
                  </div>
                  <span>Available Tutors</span>
                </h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {availableTutors.map((tutor, index) => (
                    <TutorCard key={index} tutor={tutor} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgramDetailsPage;