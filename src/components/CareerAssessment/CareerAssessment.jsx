"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { FaBookOpen, FaBrain, FaBriefcase, FaHeart, FaChartBar, FaUsers, FaArrowLeft, FaArrowRight, FaCheckCircle } from "react-icons/fa"
import { useUser } from "@clerk/clerk-react"
import { useNavigate } from "react-router-dom"
import { storeAssessmentResults } from "../../supabaseClient"
import { analyzeAssessment } from "../../services/assessmentService"

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

const LoadingSpinner = ({ showSuccess }) => {
  const [step, setStep] = useState(0)
  const steps = [
    "Analyzing your responses...",
    "Generating career recommendations...",
    "Building your personalized roadmap...",
  ]

  useEffect(() => {
    if (showSuccess) return
    const interval = setInterval(() => setStep(s => (s + 1) % steps.length), 2500)
    return () => clearInterval(interval)
  }, [showSuccess])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
    >
      <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-purple-100 text-center max-w-sm mx-4">
        {showSuccess ? (
          <>
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-gray-800 font-semibold text-lg mb-1">Assessment complete!</p>
            <p className="text-gray-500 text-sm">Taking you to your results...</p>
          </>
        ) : (
          <>
            <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-700 font-medium mb-1">{steps[step]}</p>
            <div className="flex justify-center space-x-1 mt-3">
              {steps.map((_, i) => (
                <div key={i} className={`w-2 h-2 rounded-full transition-colors duration-300 ${i === step ? 'bg-purple-600' : 'bg-purple-200'}`} />
              ))}
            </div>
          </>
        )}
      </div>
    </motion.div>
  )
}

const CareerAssessment = () => {
  const [currentCategory, setCurrentCategory] = useState(0)
  const [answers, setAnswers] = useState({})
  const [showFeedback, setShowFeedback] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [validationError, setValidationError] = useState("")
  const [submitError, setSubmitError] = useState("")
  const { user } = useUser()
  const navigate = useNavigate()

  const assessmentContainerRef = useRef(null)

  useEffect(() => {
    if (!showResults) return
    const timer = setTimeout(() => navigate("/dashboard"), 1500)
    return () => clearTimeout(timer)
  }, [showResults])

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
        if (!currentAnswers.includes(value) && currentAnswers.length >= 3) return prev
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
    setSubmitError("")
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
        const results = await analyzeAssessment(answers, categories)
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
      } catch (error) {
        console.error("Error submitting assessment:", error)
        setSubmitError(error.message || "There was an error processing your assessment. Please try again.")
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

  const totalQuestions = categories.reduce((acc, cat) => acc + cat.questions.length, 0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-100/50 py-6 sm:py-8 px-3 sm:px-4" ref={assessmentContainerRef}>
      {/* Static background — no animation to avoid constant GPU usage */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-200/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-300/15 rounded-full blur-3xl" />
      </div>

      <AnimatePresence>
        {(isSubmitting || showResults) && <LoadingSpinner showSuccess={showResults} />}
      </AnimatePresence>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-6xl mx-auto relative z-10"
      >
        {/* Compact header — reduced size so content is above the fold */}
        <motion.div variants={itemVariants} className="text-center mb-7">
          <div className="flex items-center justify-center gap-2 mb-3">
            <span className="text-xs font-semibold px-3 py-1.5 bg-purple-100 text-purple-700 rounded-full tracking-wide">
              ~5 min
            </span>
            <span className="text-xs font-semibold px-3 py-1.5 bg-purple-100 text-purple-700 rounded-full tracking-wide">
              {categories.length} sections
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent mb-2">
            Career Assessment
          </h1>
          <p className="text-sm sm:text-base text-gray-500 max-w-xl mx-auto">
            Discover your perfect career path — designed for students in Cameroon
          </p>
        </motion.div>

        {/* Mobile step progress strip — replaces sidebar on small screens */}
        <motion.div variants={itemVariants} className="mb-5 lg:hidden">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl px-5 py-4 shadow-sm border border-purple-100">
            <div className="flex justify-between items-center mb-2.5">
              <span className="text-sm font-semibold text-gray-700 min-w-0 truncate pr-2">{categories[currentCategory].title}</span>
              <span className="text-xs text-purple-600 font-semibold flex-shrink-0">
                Step {currentCategory + 1} of {categories.length}
              </span>
            </div>
            <div className="flex gap-1.5">
              {categories.map((_, idx) => (
                <div
                  key={idx}
                  className={`flex-1 h-1.5 rounded-full transition-all duration-300 ${
                    idx < currentCategory ? 'bg-purple-500' :
                    idx === currentCategory ? 'bg-purple-400' : 'bg-purple-100'
                  }`}
                />
              ))}
            </div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Sidebar — desktop only, simplified to reduce visual noise */}
          <motion.div variants={itemVariants} className="lg:col-span-1 hidden lg:block">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-purple-100 sticky top-8">

              {/* Overall progress */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-semibold text-gray-700">Overall Progress</span>
                  <span className="text-sm font-bold text-purple-600">{Math.round(progress)}%</span>
                </div>
                <div className="w-full bg-purple-100 rounded-full h-2 overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-purple-500 to-purple-600 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                  />
                </div>
                <p className="text-xs text-gray-400 mt-1.5">
                  {Object.keys(answers).length} of {totalQuestions} questions answered
                </p>
              </div>

              {/* Section navigation — completed steps are clickable to go back */}
              <div className="space-y-1.5">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Sections</p>
                {categories.map((category, index) => {
                  const Icon = category.icon
                  const isCompleted = index < currentCategory
                  const isCurrent = index === currentCategory

                  return (
                    <button
                      key={category.id}
                      onClick={() => isCompleted && setCurrentCategory(index)}
                      disabled={!isCompleted && !isCurrent}
                      className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all text-left ${
                        isCurrent
                          ? 'bg-purple-50 border-2 border-purple-200'
                          : isCompleted
                            ? 'bg-green-50 border border-green-200 cursor-pointer hover:bg-green-100'
                            : 'bg-gray-50 border border-gray-100 opacity-50 cursor-default'
                      }`}
                    >
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${
                        isCurrent ? 'bg-purple-500 text-white' :
                        isCompleted ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'
                      }`}>
                        {isCompleted ? <FaCheckCircle className="text-xs" /> : <Icon className="text-xs" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className={`text-sm font-medium block truncate ${
                          isCurrent ? 'text-purple-700' : isCompleted ? 'text-green-700' : 'text-gray-500'
                        }`}>
                          {category.title}
                        </span>
                        <span className="text-xs text-gray-400">
                          {category.questions.length} question{category.questions.length > 1 ? 's' : ''}
                        </span>
                      </div>
                      {isCurrent && <div className="w-1.5 h-1.5 rounded-full bg-purple-500 flex-shrink-0" />}
                    </button>
                  )
                })}
              </div>

              <div className="mt-6 pt-5 border-t border-purple-50">
                <p className="text-xs text-gray-400 text-center leading-relaxed">
                  Answer honestly — there are no right or wrong answers.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Main content */}
          <motion.div variants={itemVariants} className="lg:col-span-2">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-purple-100 overflow-hidden">

              {/* Section header bar */}
              <div className="flex items-center gap-3 px-4 sm:px-7 py-4 border-b border-purple-50 bg-purple-50/40">
                <div className="w-9 h-9 bg-gradient-to-br from-purple-500 to-purple-700 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
                  <CategoryIcon className="text-base text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-base font-bold text-gray-800">{categories[currentCategory].title}</h2>
                  <p className="text-xs text-gray-500">
                    Step {currentCategory + 1} of {categories.length} &middot; {categories[currentCategory].questions.length} question{categories[currentCategory].questions.length > 1 ? 's' : ''} in this section
                  </p>
                </div>
                {/* Hidden on mobile — mobile strip above already shows progress */}
                <div className="hidden sm:flex items-center gap-1.5 bg-white rounded-full px-3 py-1.5 border border-purple-100 flex-shrink-0">
                  <div className="w-2 h-2 rounded-full bg-purple-400" />
                  <span className="text-xs font-semibold text-purple-700">{Math.round(progress)}% done</span>
                </div>
              </div>

              <div className="p-4 sm:p-5 lg:p-7">
                {/* Validation error */}
                {validationError && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3"
                  >
                    <div className="w-7 h-7 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-red-500 text-sm font-bold">!</span>
                    </div>
                    <p className="text-red-800 font-medium text-sm">{validationError}</p>
                  </motion.div>
                )}

                {/* Submit error */}
                {submitError && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mb-6 p-4 bg-orange-50 border border-orange-200 rounded-xl flex items-start gap-3"
                  >
                    <div className="w-7 h-7 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-orange-500 text-sm font-bold">!</span>
                    </div>
                    <div>
                      <p className="text-orange-800 font-semibold text-sm mb-1">Something went wrong</p>
                      <p className="text-orange-700 text-sm">{submitError}</p>
                      <button
                        type="button"
                        onClick={handleNext}
                        className="mt-2 text-orange-600 hover:text-orange-700 text-sm font-medium underline"
                      >
                        Try again
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* Questions */}
                <div className="space-y-5 sm:space-y-7">
                  {categories[currentCategory].questions.map((question, qIndex) => (
                    <motion.div
                      key={question.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: qIndex * 0.1 }}
                    >
                      {/* Question header with multi-select counter badge */}
                      <div className="flex items-start justify-between gap-3 mb-4">
                        <div>
                          <h3 className="text-base sm:text-lg font-bold text-gray-800">{question.text}</h3>
                          <p className="text-sm text-gray-500 mt-0.5">{question.subtext}</p>
                        </div>
                        {question.multiple && (
                          <span className={`flex-shrink-0 text-xs font-bold px-2.5 py-1 rounded-full mt-0.5 ${
                            (answers[question.id]?.length || 0) >= 3
                              ? 'bg-purple-100 text-purple-700'
                              : 'bg-gray-100 text-gray-500'
                          }`}>
                            {answers[question.id]?.length || 0}/3
                          </span>
                        )}
                      </div>

                      {/* Options with radio/checkbox indicator on the left */}
                      <div className="space-y-2.5">
                        {question.options.map((option) => {
                          const isSelected = question.multiple
                            ? answers[question.id]?.includes(option.value)
                            : answers[question.id] === option.value
                          const atLimit = question.multiple && (answers[question.id]?.length || 0) >= 3 && !isSelected

                          return (
                            <motion.button
                              key={option.value}
                              whileHover={atLimit ? {} : { x: 3 }}
                              whileTap={atLimit ? {} : { scale: 0.99 }}
                              onClick={() => handleAnswer(question.id, option.value, question.multiple)}
                              disabled={atLimit}
                              className={`w-full p-4 rounded-xl border-2 text-left transition-all duration-200 flex items-center gap-3.5 group ${
                                isSelected
                                  ? 'border-purple-500 bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-md'
                                  : atLimit
                                    ? 'border-gray-100 bg-gray-50 text-gray-300 cursor-not-allowed'
                                    : 'border-gray-200 bg-white hover:border-purple-300 hover:bg-purple-50/40 text-gray-700'
                              }`}
                            >
                              {/* Radio/checkbox indicator — visible affordance even for color-blind users */}
                              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                                isSelected
                                  ? 'border-white/60 bg-white/20'
                                  : atLimit
                                    ? 'border-gray-200'
                                    : 'border-gray-300 group-hover:border-purple-400'
                              }`}>
                                {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                              </div>
                              <span className="font-medium text-sm flex-1 leading-snug">{option.label}</span>
                              {isSelected && (
                                <FaCheckCircle className="text-white/80 flex-shrink-0 text-sm" />
                              )}
                            </motion.button>
                          )
                        })}
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Navigation — Previous is invisible on step 1 to keep layout stable */}
                <div className="flex justify-between items-center mt-7 sm:mt-10 pt-5 sm:pt-6 border-t border-gray-100">
                  <motion.button
                    whileHover={currentCategory === 0 ? {} : { scale: 1.02 }}
                    whileTap={currentCategory === 0 ? {} : { scale: 0.98 }}
                    onClick={handlePrevious}
                    aria-hidden={currentCategory === 0}
                    className={`flex items-center gap-2 px-3 sm:px-5 py-2.5 rounded-xl font-semibold transition-all text-sm ${
                      currentCategory === 0
                        ? 'invisible'
                        : 'bg-white border-2 border-purple-200 text-purple-600 hover:bg-purple-50 hover:border-purple-300 shadow-sm'
                    }`}
                  >
                    <FaArrowLeft className="text-xs" />
                    <span>Previous</span>
                  </motion.button>

                  <span className="text-xs text-gray-400 font-medium hidden sm:block">
                    {currentCategory + 1} of {categories.length} sections
                  </span>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleNext}
                    className="flex items-center gap-2 px-4 sm:px-7 py-2.5 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-xl text-sm"
                  >
                    {currentCategory === categories.length - 1 ? (
                      <>
                        {/* Short label on mobile to avoid overflow */}
                        <span className="sm:hidden">Complete</span>
                        <span className="hidden sm:inline">Complete Assessment</span>
                      </>
                    ) : (
                      <span>Continue</span>
                    )}
                    <FaArrowRight className="text-xs" />
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div variants={itemVariants} className="text-center mt-8">
          <p className="text-gray-400 text-xs">
            Take your time and answer honestly. Your responses are private and secure.
          </p>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default CareerAssessment