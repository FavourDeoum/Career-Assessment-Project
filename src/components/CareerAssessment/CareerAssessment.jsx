"use client"

import { useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { FaBookOpen, FaBrain, FaBriefcase, FaHeart, FaChartBar, FaUsers, FaGraduationCap, FaArrowLeft, FaArrowRight, FaCheckCircle } from "react-icons/fa"
import { useUser } from "@clerk/clerk-react"
import { storeAssessmentResults } from "../../supabaseClient"

const categories = [
  {
    id: "education",
    title: "Educational Background",
    icon: FaBookOpen,
    questions: [
      {
        id: "q1",
        text: "What domain did you study in the Advanced Level?",
        subtext: "Select the domain that best matches your studies",
        options: [
          { value: "grammar", label: "Grammar (Arts & Sciences)" },
          { value: "technical", label: "Technical" },
          { value: "commercial", label: "Commercial" },
          { value: "industrial", label: "Industrial" },
          { value: "agricultural", label: "Agricultural" },
        ],
      },
      {
        id: "q2",
        text: "What subjects did you excel in the most? (Select up to 3)",
        subtext: "Choose up to 3 subjects you were strongest in",
        options: [
          { value: "mathematics", label: "Mathematics" },
          { value: "physics", label: "Physics" },
          { value: "chemistry", label: "Chemistry" },
          { value: "biology", label: "Biology" },
          { value: "economics", label: "Economics" },
          { value: "accounting", label: "Accounting" },
          { value: "geography", label: "Geography" },
          { value: "literature", label: "Literature" },
          { value: "history", label: "History" },
          { value: "computer_science", label: "Computer Science" },
        ],
        multiple: true,
      },
    ],
  },
  {
    id: "interests",
    title: "Interests & Passions",
    icon: FaHeart,
    questions: [
      {
        id: "q4",
        text: "Which of these areas interests you the most? (Choose up to 3)",
        subtext: "Select up to 3 areas that interest you",
        options: [
          { value: "technology", label: "Technology & Coding" },
          { value: "medicine", label: "Medicine & Healthcare" },
          { value: "business", label: "Business & Entrepreneurship" },
          { value: "teaching", label: "Teaching & Education" },
          { value: "arts", label: "Arts & Creativity" },
          { value: "politics", label: "Politics & Law" },
          { value: "agriculture", label: "Agriculture & Environment" },
          { value: "engineering", label: "Engineering & Construction" },
          { value: "communication", label: "Communication & Media" },
          { value: "finance", label: "Finance & Banking" },
        ],
        multiple: true,
      },
      {
        id: "q5",
        text: "What type of work environment do you prefer?",
        subtext: "Select the work environment that suits you best",
        options: [
          { value: "office", label: "Working indoors in an office" },
          { value: "outdoors", label: "Working outdoors (e.g., farms, fieldwork)" },
          { value: "mixed", label: "A mix of indoor and outdoor work" },
          { value: "remote", label: "Remote/Freelance work" },
          { value: "unsure", label: "I'm not sure yet" },
        ],
      },
    ],
  },
  {
    id: "skills",
    title: "Skills & Strengths",
    icon: FaBrain,
    questions: [
      {
        id: "q6",
        text: "Which of these skills best describes you? (Choose up to 3)",
        subtext: "Select up to 3 skills that best describe you",
        options: [
          { value: "critical_thinking", label: "Critical Thinking & Problem-Solving" },
          { value: "communication", label: "Communication & Public Speaking" },
          { value: "leadership", label: "Leadership & Teamwork" },
          { value: "creativity", label: "Creativity & Innovation" },
          { value: "analytical", label: "Analytical & Research Skills" },
          { value: "technical", label: "Technical & Hands-on Skills" },
          { value: "business", label: "Business & Negotiation Skills" },
          { value: "empathy", label: "Empathy & Helping Others" },
          { value: "writing", label: "Writing & Storytelling" },
          { value: "programming", label: "Programming & Software Development" },
        ],
        multiple: true,
      },
      {
        id: "q7",
        text: "Do you prefer working with people, data, or things?",
        subtext: "Select the option that best describes your preference",
        options: [
          { value: "people", label: "People (e.g., Teaching, Healthcare, Customer Service)" },
          { value: "data", label: "Data (e.g., Analytics, Research, Finance)" },
          { value: "things", label: "Things (e.g., Engineering, Construction, Art & Craft)" },
          { value: "mix", label: "A mix of all" },
        ],
      },
      {
        id: "q8",
        text: "How comfortable are you with technology and digital tools?",
        subtext: "Select the option that best describes your comfort level",
        options: [
          { value: "very_comfortable", label: "Very comfortable (I use tech often and can learn new tools easily)" },
          {
            value: "somewhat_comfortable",
            label: "Somewhat comfortable (I can use basic tools but need help with advanced ones)",
          },
          { value: "not_comfortable", label: "Not comfortable (I prefer manual or traditional ways of working)" },
        ],
      },
    ],
  },
  {
    id: "personality",
    title: "Personality & Work Style",
    icon: FaBriefcase,
    questions: [
      {
        id: "q9",
        text: "What describes your work style the best?",
        subtext: "Select the option that best describes your work style",
        options: [
          { value: "structured", label: "I like structured and well-organized tasks" },
          { value: "flexible", label: "I prefer flexibility and creativity in my work" },
          { value: "critical_thinking", label: "I enjoy solving complex challenges and thinking critically" },
          { value: "leadership", label: "I work best when leading or managing a team" },
          { value: "independent", label: "I like working alone with minimal supervision" },
        ],
      },
      {
        id: "q10",
        text: "How do you approach problem-solving?",
        subtext: "Select the option that best describes your approach",
        options: [
          { value: "analyze", label: "I analyze the situation carefully before acting" },
          { value: "try_solutions", label: "I try different solutions quickly to see what works" },
          { value: "collaborate", label: "I ask for guidance or collaborate with others" },
          { value: "step_by_step", label: "I follow step-by-step instructions" },
        ],
      },
    ],
  },
  {
    id: "career_goals",
    title: "Career Preferences & Goals",
    icon: FaChartBar,
    questions: [
      {
        id: "q11",
        text: "What is your main goal in choosing a career?",
        subtext: "Select the option that best describes your goal",
        options: [
          { value: "salary", label: "High salary & financial stability" },
          { value: "security", label: "Job security & long-term stability" },
          { value: "flexibility", label: "Flexibility & work-life balance" },
          { value: "passion", label: "Passion & job satisfaction" },
          { value: "impact", label: "Helping others & making an impact" },
        ],
      },
      {
        id: "q12",
        text: "Are you open to entrepreneurship or starting your own business?",
        subtext: "Select the option that best describes your interest",
        options: [
          { value: "yes", label: "Yes, I want to start my own business" },
          { value: "maybe", label: "Maybe, but I need guidance" },
          { value: "no", label: "No, I prefer a stable job" },
        ],
      },
      {
        id: "q13",
        text: "Would you consider studying further (university, technical training, or online courses) to enhance your career opportunities?",
        subtext: "Select the option that best describes your intention",
        options: [
          { value: "yes", label: "Yes, I want to continue studying" },
          { value: "maybe", label: "Maybe, if it helps my career" },
          { value: "no", label: "No, I prefer to start working now" },
        ],
      },
      {
        id: "q14",
        text: "Are you open to working outside of Cameroon if opportunities arise?",
        subtext: "Select the option that best describes your willingness",
        options: [
          { value: "yes", label: "Yes, I am open to international opportunities" },
          { value: "no", label: "No, I want to work within Cameroon" },
          { value: "not_sure", label: "Not sure yet" },
        ],
      },
    ],
  },
  {
    id: "practical_constraints",
    title: "Practical Constraints & Accessibility",
    icon: FaUsers,
    questions: [
      {
        id: "q15",
        text: "Do you have access to resources such as a computer, internet, or library for research and self-learning?",
        subtext: "Select the option that best describes your access",
        options: [
          { value: "yes", label: "Yes, I have access to all" },
          { value: "limited", label: "Limited access (some but not all)" },
          { value: "no", label: "No access to these resources" },
        ],
      },
      {
        id: "q16",
        text: "Do you have financial constraints that may affect your career choices?",
        subtext: "Select the option that best describes your situation",
        options: [
          { value: "yes", label: "Yes, I may need financial support or scholarships" },
          { value: "no", label: "No, I can support myself financially" },
          { value: "not_sure", label: "Not sure yet" },
        ],
      },
    ],
  },
]

const LoadingSpinner = () => (
  <motion.div 
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
  >
    <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-purple-100 text-center">
      <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
      <p className="text-gray-700 font-medium">Analyzing your responses...</p>
    </div>
  </motion.div>
)

const CareerAssessment = () => {
  const [currentCategory, setCurrentCategory] = useState(0)
  const [answers, setAnswers] = useState({})
  const [showFeedback, setShowFeedback] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [validationError, setValidationError] = useState("")
  const { user } = useUser()

  const assessmentContainerRef = useRef(null)

  const scrollToTop = () => {
    if (assessmentContainerRef.current) {
      assessmentContainerRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
    } else {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      })
    }
  }

  const handleAnswer = (questionId, value, multiple = false) => {
    setAnswers((prev) => {
      if (multiple) {
        const currentAnswers = prev[questionId] || []
        const updatedAnswers = currentAnswers.includes(value)
          ? currentAnswers.filter((v) => v !== value)
          : [...currentAnswers, value]
        return { ...prev, [questionId]: updatedAnswers }
      } else {
        return { ...prev, [questionId]: value }
      }
    })
    setShowFeedback(true)
    setValidationError("")
    setTimeout(() => setShowFeedback(false), 1000)
  }

  const validateCategory = () => {
    const currentQuestions = categories[currentCategory].questions
    const answeredAll = currentQuestions.every((q) => {
      if (q.multiple) {
        return answers[q.id] && answers[q.id].length > 0
      } else {
        return answers[q.id]
      }
    })
    if (!answeredAll) {
      setValidationError("Please answer all questions before proceeding")
      return false
    }
    return true
  }

  const handleNext = async () => {
    if (!validateCategory()) return

    if (currentCategory < categories.length - 1) {
      setCurrentCategory((prev) => prev + 1)
      setTimeout(scrollToTop, 100)
    } else {
      setIsSubmitting(true)
      try {
        const response = await fetch("/api/app-test", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            answers,
            categories,
          }),
        })

        if (!response.ok) {
          throw new Error("Failed to process assessment")
        }

        const results = await response.json()
        console.log("results are-", results)

        if (user) {
          await storeAssessmentResults(user.id, {
            answers,
            categories,
            results,
          })
        } else {
          throw new Error("User must be authenticated to save assessment")
        }

        setShowResults(true)
        setTimeout(() => {
          window.location.href = "/cdashboard"
        }, 2000)
      } catch (error) {
        console.error("Error submitting assessment:", error)
        setValidationError(error.message || "There was an error processing your assessment. Please try again.")
      } finally {
        setIsSubmitting(false)
      }
    }
  }

  const handlePrevious = () => {
    if (currentCategory > 0) {
      setCurrentCategory((prev) => prev - 1)
      setTimeout(scrollToTop, 100)
    }
  }

  const CategoryIcon = categories[currentCategory].icon
  const progress = (Object.keys(answers).length / categories.reduce((acc, cat) => acc + cat.questions.length, 0)) * 100

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
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-100/50 py-8 px-4" ref={assessmentContainerRef}>
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-200/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-300/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <AnimatePresence>
        {isSubmitting && <LoadingSpinner />}
      </AnimatePresence>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible" 
        className="max-w-7xl mx-auto relative z-10"
      >
        {/* Header Section */}
        <motion.div variants={itemVariants} className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent mb-4">
            Career Assessment
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Discover your perfect career path through our comprehensive assessment designed for students in Cameroon
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Sidebar */}
          <motion.div variants={itemVariants} className="lg:col-span-1">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-purple-100 sticky top-8">
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-700 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <CategoryIcon className="text-3xl text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">{categories[currentCategory].title}</h3>
                <p className="text-gray-600">Step {currentCategory + 1} of {categories.length}</p>
              </div>

              {/* Progress Section */}
              <div className="mb-8">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">Progress</span>
                  <span className="text-sm font-bold text-purple-600">{Math.round(progress)}%</span>
                </div>
                <div className="w-full bg-purple-100 rounded-full h-3 overflow-hidden">
                  <motion.div 
                    className="h-full bg-gradient-to-r from-purple-500 to-purple-600 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                  />
                </div>
              </div>

              {/* Category Navigation */}
              <div className="space-y-3">
                {categories.map((category, index) => {
                  const Icon = category.icon
                  const isCompleted = index < currentCategory
                  const isCurrent = index === currentCategory
                  
                  return (
                    <div 
                      key={category.id}
                      className={`flex items-center space-x-3 p-3 rounded-xl transition-all ${
                        isCurrent 
                          ? 'bg-purple-100 border-2 border-purple-300' 
                          : isCompleted 
                            ? 'bg-green-50 border border-green-200' 
                            : 'bg-gray-50 border border-gray-200'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                        isCurrent 
                          ? 'bg-purple-500 text-white' 
                          : isCompleted 
                            ? 'bg-green-500 text-white' 
                            : 'bg-gray-300 text-gray-600'
                      }`}>
                        {isCompleted ? <FaCheckCircle /> : <Icon />}
                      </div>
                      <span className={`text-sm font-medium ${
                        isCurrent ? 'text-purple-700' : isCompleted ? 'text-green-700' : 'text-gray-600'
                      }`}>
                        {category.title}
                      </span>
                    </div>
                  )
                })}
              </div>

              {/* Motivational Section */}
              <div className="mt-8 bg-gradient-to-br from-purple-400 to-purple-600 rounded-3xl p-6 text-white text-center">
                <FaGraduationCap className="text-3xl mx-auto mb-3 opacity-90" />
                <h4 className="font-bold text-lg mb-2">Shape Your Future</h4>
                <p className="text-purple-100 text-sm">Your responses help us understand you better and recommend the perfect career path</p>
              </div>
            </div>
          </motion.div>

          {/* Main Content */}
          <motion.div variants={itemVariants} className="lg:col-span-2">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-purple-100">
              {/* Validation Error */}
              {validationError && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center space-x-3"
                >
                  <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-red-500 text-sm">!</span>
                  </div>
                  <p className="text-red-800 font-medium">{validationError}</p>
                </motion.div>
              )}

              {/* Questions */}
              <div className="space-y-8">
                {categories[currentCategory].questions.map((question, qIndex) => (
                  <motion.div
                    key={question.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: qIndex * 0.1 }}
                    className="bg-gradient-to-r from-purple-50/50 to-white/50 rounded-2xl p-6 border border-purple-100/50"
                  >
                    <div className="mb-6">
                      <h3 className="text-xl font-bold text-gray-800 mb-2">{question.text}</h3>
                      <p className="text-gray-600">{question.subtext}</p>
                    </div>

                    <div className="grid gap-3">
                      {question.options.map((option) => {
                        const isSelected = question.multiple 
                          ? answers[question.id]?.includes(option.value)
                          : answers[question.id] === option.value

                        return (
                          <motion.button
                            key={option.value}
                            whileHover={{ scale: 1.02, x: 4 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleAnswer(question.id, option.value, question.multiple)}
                            className={`p-4 rounded-xl border-2 text-left transition-all duration-200 ${
                              isSelected
                                ? 'border-purple-500 bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg'
                                : 'border-gray-200 bg-white/70 hover:border-purple-300 hover:bg-purple-50/50 text-gray-700'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-medium">{option.label}</span>
                              {isSelected && (
                                <FaCheckCircle className="text-white/90 flex-shrink-0 ml-3" />
                              )}
                            </div>
                          </motion.button>
                        )
                      })}
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Navigation */}
              <div className="flex justify-between items-center mt-12 pt-6 border-t border-purple-100">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handlePrevious}
                  disabled={currentCategory === 0}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold transition-all ${
                    currentCategory === 0
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-white border-2 border-purple-200 text-purple-600 hover:bg-purple-50 hover:border-purple-300 shadow-sm'
                  }`}
                >
                  <FaArrowLeft />
                  <span>Previous</span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleNext}
                  className="flex items-center space-x-2 px-8 py-3 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-xl"
                >
                  <span>{currentCategory === categories.length - 1 ? 'Complete Assessment' : 'Next'}</span>
                  <FaArrowRight />
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Footer */}
        <motion.div variants={itemVariants} className="text-center mt-12">
          <p className="text-gray-500 text-sm">
            Take your time and answer honestly. Your responses will help us provide the most accurate career recommendations.
          </p>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default CareerAssessment