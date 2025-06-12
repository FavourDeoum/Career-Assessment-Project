import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useResults } from '../../contexts/ResultsContext';
import ProgramCard from './ProgramCard';
import { ArrowLeft, MapPin, Globe, BookCheck, Users, Building, Lightbulb, Star, GraduationCap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const slugify = (text) => (text || '').toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]+/g, '');

const SchoolProfilePage = () => {
  const { schoolId: schoolSlugFromParams } = useParams();
  const { results, isLoading: resultsLoading } = useResults();
  const [schoolData, setSchoolData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!resultsLoading && results?.analysis?.recommendedSchools) {
      const foundSchool = results.analysis.recommendedSchools.find(
        s => s.id === schoolSlugFromParams || slugify(s.name) === schoolSlugFromParams
      );
      setSchoolData(foundSchool);
    }
  }, [results, resultsLoading, schoolSlugFromParams]);

  const handleBack = () => navigate(-1);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.4 }
    }
  };

  if (resultsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-100/50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-purple-200 rounded-full animate-pulse mx-auto mb-4"></div>
          <p className="text-lg text-purple-600 font-medium">Loading school profile...</p>
        </div>
      </div>
    );
  }

  if (!schoolData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-100/50 flex items-center justify-center px-4">
        <div className="text-center max-w-md mx-auto">
          <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <GraduationCap className="text-purple-600 text-3xl" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">School Not Found</h2>
          <p className="text-gray-600 mb-6">The profile you are looking for does not exist or could not be loaded.</p>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleBack} 
            className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 flex items-center space-x-2 mx-auto shadow-lg hover:shadow-xl"
          >
            <ArrowLeft size={18} />
            <span>Go Back</span>
          </motion.button>
        </div>
      </div>
    );
  }

  const {
    name, image, location, description, ranking, website,
    generalAdmissionsInfo, campusLife, programs = [],
    reasonForRecommendation
  } = schoolData;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-100/50">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-200/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-300/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10">
        {/* Header with Back Button */}
        <div className="px-4 sm:px-6 lg:px-8 pt-8">
          <Link to='/schools/all'>
            <motion.button 
              whileHover={{ scale: 1.05, x: -5 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white/80 backdrop-blur-sm hover:bg-white/90 text-purple-700 font-semibold py-3 px-6 rounded-xl transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl border border-purple-100"
            >
              <ArrowLeft size={20} />
              <span>Back to All Schools</span>
            </motion.button>
          </Link>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
        >
          {/* School Header */}
          <motion.header variants={itemVariants} className="mb-12">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-purple-100">
              <div className="flex flex-col lg:flex-row items-start lg:items-center space-y-6 lg:space-y-0 lg:space-x-8">
                <div className="relative">
                  <div className="w-32 h-32 lg:w-40 lg:h-40 rounded-2xl overflow-hidden shadow-lg">
                    <img 
                      src={image || '/placeholder.svg'} 
                      alt={`${name} campus`} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {ranking && ranking !== "N/A" && (
                    <div className="absolute -top-3 -right-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg flex items-center space-x-1">
                      <Star size={14} fill="currentColor" />
                      <span>{ranking}</span>
                    </div>
                  )}
                </div>
                
                <div className="flex-1">
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent mb-4">
                    {name}
                  </h1>
                  
                  {location && (
                    <div className="flex items-center space-x-2 text-gray-600 mb-4">
                      <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                        <MapPin size={16} className="text-purple-600" />
                      </div>
                      <span className="text-lg">{location}</span>
                    </div>
                  )}
                  
                  {website && (
                    <motion.a 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      href={website} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="inline-flex items-center space-x-3 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
                    >
                      <Globe size={18} />
                      <span>Visit School Website</span>
                    </motion.a>
                  )}
                </div>
              </div>
            </div>
          </motion.header>

          {/* School Details Section */}
          <motion.section variants={itemVariants} className="mb-12">
            <div className="grid gap-6 md:grid-cols-2">
              {/* Recommendation Reason Card */}
              {reasonForRecommendation && (
                <motion.div 
                  variants={cardVariants}
                  whileHover={{ y: -5 }}
                  className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-3xl p-8 shadow-xl col-span-full"
                >
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <Lightbulb size={24} />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold mb-3">Why We Recommend This School</h3>
                      <p className="text-purple-100 leading-relaxed text-lg">{reasonForRecommendation}</p>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* About the School */}
              <motion.div 
                variants={cardVariants}
                whileHover={{ y: -5 }}
                className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-purple-100"
              >
                <div className="flex items-start space-x-4 mb-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Building size={24} className="text-purple-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800">About the School</h3>
                </div>
                <p className="text-gray-600 leading-relaxed">{description || "No detailed description available."}</p>
              </motion.div>

              {/* General Admissions */}
              {generalAdmissionsInfo && (
                <motion.div 
                  variants={cardVariants}
                  whileHover={{ y: -5 }}
                  className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-purple-100"
                >
                  <div className="flex items-start space-x-4 mb-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <BookCheck size={24} className="text-purple-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800">General Admissions</h3>
                  </div>
                  <p className="text-gray-600 leading-relaxed">{generalAdmissionsInfo}</p>
                </motion.div>
              )}

              {/* Campus Life */}
              {campusLife && (
                <motion.div 
                  variants={cardVariants}
                  whileHover={{ y: -5 }}
                  className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-purple-100 md:col-span-2"
                >
                  <div className="flex items-start space-x-4 mb-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Users size={24} className="text-purple-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800">Campus Life & Facilities</h3>
                  </div>
                  <p className="text-gray-600 leading-relaxed">{campusLife}</p>
                </motion.div>
              )}
            </div>
          </motion.section>

          {/* Programs Section */}
          <motion.section variants={itemVariants}>
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-purple-100">
              <div className="text-center mb-8">
                <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent mb-4">
                  Recommended Programs at {name}
                </h2>
                <div className="w-24 h-1 bg-gradient-to-r from-purple-600 to-purple-700 rounded-full mx-auto"></div>
              </div>
              
              {programs.length > 0 ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {programs.map((program, index) => (
                    <motion.div
                      key={program.program || index}
                      variants={cardVariants}
                      whileHover={{ y: -5, scale: 1.02 }}
                      className="transform transition-all duration-200"
                    >
                      <ProgramCard
                        program={program}
                        schoolId={schoolSlugFromParams}
                      />
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <GraduationCap className="text-purple-600 text-2xl" />
                  </div>
                  <p className="text-gray-600 text-lg">
                    No specific programs were identified for this school based on your assessment.
                  </p>
                </div>
              )}
            </div>
          </motion.section>
        </motion.div>
      </div>
    </div>
  );
};

export default SchoolProfilePage;