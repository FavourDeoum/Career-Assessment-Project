import React from 'react';
import { motion } from 'framer-motion';
import { Link } from "react-router-dom"
import { 
  FaGraduationCap, 
  FaChartLine, 
  FaHandshake, 
   
  FaUsers, 
  FaLightbulb,
  FaStar,
  FaHeart,
  FaRocket
} from 'react-icons/fa';
import { FaS } from 'react-icons/fa6';

const About = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.5 }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-100/50">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-200/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 -left-40 w-96 h-96 bg-purple-300/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute -bottom-40 right-1/4 w-64 h-64 bg-purple-400/20 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 py-16 px-4 sm:px-6 lg:px-8"
      >
        {/* Hero Section */}
        <motion.div variants={itemVariants} className="max-w-4xl mx-auto text-center mb-20">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-700 rounded-full mb-8 shadow-lg">
            <FaGraduationCap className="text-3xl text-white" />
          </div>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent mb-6">
            About EduVate
          </h1>
          <p className="text-xl sm:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Empowering the next generation of leaders in Cameroon through intelligent career guidance and personalized learning pathways.
          </p>
        </motion.div>

        {/* Stats Section */}
        <motion.div variants={itemVariants} className="max-w-6xl mx-auto mb-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaUsers className="text-2xl text-purple-600" />
              </div>
              <div className="text-3xl font-bold text-purple-700 mb-2">1000+</div>
              <div className="text-gray-600">Students Guided</div>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaStar className="text-2xl text-purple-600" />
              </div>
              <div className="text-3xl font-bold text-purple-700 mb-2">98%</div>
              <div className="text-gray-600">Success Rate</div>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaRocket className="text-2xl text-purple-600" />
              </div>
              <div className="text-3xl font-bold text-purple-700 mb-2">50+</div>
              <div className="text-gray-600">Career Paths</div>
            </div>
          </div>
        </motion.div>

        {/* Features Grid */}
        <motion.div variants={itemVariants} className="max-w-7xl mx-auto mb-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">What Makes Us Special</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover how we're revolutionizing career guidance for students across Cameroon
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<FaGraduationCap className="text-3xl" />}
              title="Empowering Students"
              description="We help Advanced Level students in Cameroon discover their potential and make informed career decisions through comprehensive assessments and guidance."
              gradient="from-purple-500 to-purple-700"
            />
            <FeatureCard
              icon={<FaChartLine className="text-3xl" />}
              title="Data-Driven Insights"
              description="Our assessments use advanced algorithms and analytics to match your unique skills and interests with the most suitable career paths."
              gradient="from-purple-600 to-purple-800"
            />
            <FeatureCard
              icon={<FaHandshake className="text-3xl" />}
              title="Personalized Guidance"
              description="We provide tailored resources, one-on-one consultations, and customized recommendations to support your individual career journey."
              gradient="from-purple-500 to-purple-700"
            />
            <FeatureCard
              icon={<FaS className="text-3xl" />}
              title="Goal-Oriented Approach"
              description="We help you set clear, achievable career goals and provide step-by-step roadmaps to reach your aspirations in the Cameroonian job market."
              gradient="from-purple-600 to-purple-800"
            />
            <FeatureCard
              icon={<FaLightbulb className="text-3xl" />}
              title="Innovation Focus"
              description="We continuously innovate our assessment tools and methodologies to stay ahead of changing career landscapes and market demands."
              gradient="from-purple-500 to-purple-700"
            />
            <FeatureCard
              icon={<FaHeart className="text-3xl" />}
              title="Student-Centered"
              description="Every decision we make is focused on student success and well-being, ensuring that each individual receives the support they deserve."
              gradient="from-purple-600 to-purple-800"
            />
          </div>
        </motion.div>

        {/* Mission Section */}
        <motion.div variants={itemVariants} className="max-w-6xl mx-auto">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 md:p-12 shadow-xl border border-purple-100">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-700 rounded-full mb-6">
                 
                </div>
                <h2 className="text-4xl font-bold text-gray-800 mb-6">Our Mission</h2>
                <p className="text-lg text-gray-600 leading-relaxed mb-6">
                  EduVate (Career Assessment Tool) is dedicated to empowering students in Cameroon with the knowledge and resources they need to make informed decisions about their future. We believe that every student has unique talents and potential, and our goal is to help them discover and nurture these abilities.
                </p>
                <p className="text-lg text-gray-600 leading-relaxed mb-8">
                  Through cutting-edge technology, personalized assessments, and expert guidance, we're bridging the gap between education and career success, ensuring that no student's potential goes unrealized.
                </p>
                <div className="flex flex-wrap gap-4">
                  <span className="px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                    Career Guidance
                  </span>
                  <span className="px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                    Skill Assessment
                  </span>
                  <span className="px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                    Future Planning
                  </span>
                </div>
              </div>
              
              {/* Mission Illustration */}
              <div className="relative">
                <div className="bg-gradient-to-br from-purple-400 to-purple-600 rounded-3xl p-8 text-white">
                  <div className="text-center">
                    <div className="grid grid-cols-3 gap-4 mb-6">
                      <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                        <FaGraduationCap className="text-xl" />
                      </div>
                      <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                        <FaChartLine className="text-xl" />
                      </div>
                      <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                        <FaHandshake className="text-xl" />
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold mb-4">Transforming Futures</h3>
                    <p className="text-purple-100 mb-6">
                      Every assessment, every recommendation, every success story brings us closer to our vision of an empowered Cameroon.
                    </p>
                    <div className="bg-white/10 rounded-xl p-4">
                      <div className="text-sm text-purple-100 mb-2">Our Impact</div>
                      <div className="text-2xl font-bold">Shaping Tomorrow's Leaders</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div variants={itemVariants} className="max-w-4xl mx-auto text-center mt-20">
          <div className="bg-gradient-to-r from-purple-600 to-purple-800 rounded-3xl p-8 md:p-12 text-white">
            <h3 className="text-3xl md:text-4xl font-bold mb-4">Ready to Discover Your Potential?</h3>
            <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
              Join thousands of students who have already transformed their futures with EduVate's personalized career guidance.
            </p>
            <Link to='/assessment'>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white text-purple-700 font-bold py-4 px-8 rounded-xl hover:bg-purple-50 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Start Your Assessment Today
            </motion.button>
            </Link>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

const FeatureCard = ({ icon, title, description, gradient }) => (
  <motion.div
    whileHover={{ scale: 1.05, y: -5 }}
    transition={{ duration: 0.3 }}
    className="group"
  >
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-purple-100 h-full hover:shadow-xl transition-all duration-300">
      <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br ${gradient} rounded-xl mb-6 text-white group-hover:scale-110 transition-transform duration-300`}>
        {icon}
      </div>
      <h3 className="text-xl font-bold text-gray-800 mb-4 group-hover:text-purple-700 transition-colors duration-300">
        {title}
      </h3>
      <p className="text-gray-600 leading-relaxed">
        {description}
      </p>
    </div>
  </motion.div>
);

export default About;