import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaBookOpen,
  FaBrain,
  FaBriefcase,
  FaHeart,
  FaCode,
  FaChartBar,
  FaUsers,
  FaMicroscope,
  FaPenAlt,
  FaGraduationCap
} from 'react-icons/fa';
import './CareerAssessment.css';
import { useUser } from '@clerk/clerk-react';
import { storeAssessmentResults } from '../../supabaseClient'; 

const categories = [
  {
    id: 'education',
    title: 'Educational Background',
    icon: FaBookOpen,
    questions: [
      {
        id: 'q1',
        text: 'What domain did you study in the Advanced Level?',
        subtext: 'Select the domain that best matches your studies',
        options: [
          { value: 'grammar', label: 'Grammar (Arts & Sciences)' },
          { value: 'technical', label: 'Technical' },
          { value: 'commercial', label: 'Commercial' },
          { value: 'industrial', label: 'Industrial' },
          { value: 'agricultural', label: 'Agricultural' }
          // { value: 'other', label: 'Other (Specify)' }
        ]
      },
      {
        id: 'q2',
        text: 'What subjects did you excel in the most? (Select up to 3)',
        subtext: 'Choose up to 3 subjects you were strongest in',
        options: [
          { value: 'mathematics', label: 'Mathematics' },
          { value: 'physics', label: 'Physics' },
          { value: 'chemistry', label: 'Chemistry' },
          { value: 'biology', label: 'Biology' },
          { value: 'economics', label: 'Economics' },
          { value: 'accounting', label: 'Accounting' },
          { value: 'geography', label: 'Geography' },
          { value: 'literature', label: 'Literature' },
          { value: 'history', label: 'History' },
          { value: 'computer_science', label: 'Computer Science' }
          // { value: 'other', label: 'Others (Specify)' }
        ],
        multiple: true // Allow multiple selections
      },
      // {
      //   id: 'q3',
      //   text: 'Did you take any professional training or certification courses outside of your school syllabus?',
      //   subtext: 'Select the most relevant option',
      //   options: [
      //     { value: 'yes', label: 'Yes' },
      //     { value: 'no', label: 'No' }
      //   ]
      // }
    ]
  },
  {
    id: 'interests',
    title: 'Interests & Passions',
    icon: FaHeart,
    questions: [
      {
        id: 'q4',
        text: 'Which of these areas interests you the most? (Choose up to 3)',
        subtext: 'Select up to 3 areas that interest you',
        options: [
          { value: 'technology', label: 'Technology & Coding' },
          { value: 'medicine', label: 'Medicine & Healthcare' },
          { value: 'business', label: 'Business & Entrepreneurship' },
          { value: 'teaching', label: 'Teaching & Education' },
          { value: 'arts', label: 'Arts & Creativity' },
          { value: 'politics', label: 'Politics & Law' },
          { value: 'agriculture', label: 'Agriculture & Environment' },
          { value: 'engineering', label: 'Engineering & Construction' },
          { value: 'communication', label: 'Communication & Media' },
          { value: 'finance', label: 'Finance & Banking' }
          // { value: 'other', label: 'Other (Specify)' }
        ],
        multiple: true // Allow multiple selections
      },
      {
        id: 'q5',
        text: 'What type of work environment do you prefer?',
        subtext: 'Select the work environment that suits you best',
        options: [
          { value: 'office', label: 'Working indoors in an office' },
          { value: 'outdoors', label: 'Working outdoors (e.g., farms, fieldwork)' },
          { value: 'mixed', label: 'A mix of indoor and outdoor work' },
          { value: 'remote', label: 'Remote/Freelance work' },
          { value: 'unsure', label: 'I’m not sure yet' }
        ]
      }
    ]
  },
  {
    id: 'skills',
    title: 'Skills & Strengths',
    icon: FaBrain,
    questions: [
      {
        id: 'q6',
        text: 'Which of these skills best describes you? (Choose up to 3)',
        subtext: 'Select up to 3 skills that best describe you',
        options: [
          { value: 'critical_thinking', label: 'Critical Thinking & Problem-Solving' },
          { value: 'communication', label: 'Communication & Public Speaking' },
          { value: 'leadership', label: 'Leadership & Teamwork' },
          { value: 'creativity', label: 'Creativity & Innovation' },
          { value: 'analytical', label: 'Analytical & Research Skills' },
          { value: 'technical', label: 'Technical & Hands-on Skills' },
          { value: 'business', label: 'Business & Negotiation Skills' },
          { value: 'empathy', label: 'Empathy & Helping Others' },
          { value: 'writing', label: 'Writing & Storytelling' },
          { value: 'programming', label: 'Programming & Software Development' }
        ],
        multiple: true // Allow multiple selections
      },
      {
        id: 'q7',
        text: 'Do you prefer working with people, data, or things?',
        subtext: 'Select the option that best describes your preference',
        options: [
          { value: 'people', label: 'People (e.g., Teaching, Healthcare, Customer Service)' },
          { value: 'data', label: 'Data (e.g., Analytics, Research, Finance)' },
          { value: 'things', label: 'Things (e.g., Engineering, Construction, Art & Craft)' },
          { value: 'mix', label: 'A mix of all' }
        ]
      },
      {
        id: 'q8',
        text: 'How comfortable are you with technology and digital tools?',
        subtext: 'Select the option that best describes your comfort level',
        options: [
          { value: 'very_comfortable', label: 'Very comfortable (I use tech often and can learn new tools easily)' },
          { value: 'somewhat_comfortable', label: 'Somewhat comfortable (I can use basic tools but need help with advanced ones)' },
          { value: 'not_comfortable', label: 'Not comfortable (I prefer manual or traditional ways of working)' }
        ]
      }
    ]
  },
  {
    id: 'personality',
    title: 'Personality & Work Style',
    icon: FaBriefcase,
    questions: [
      {
        id: 'q9',
        text: 'What describes your work style the best?',
        subtext: 'Select the option that best describes your work style',
        options: [
          { value: 'structured', label: 'I like structured and well-organized tasks' },
          { value: 'flexible', label: 'I prefer flexibility and creativity in my work' },
          { value: 'critical_thinking', label: 'I enjoy solving complex challenges and thinking critically' },
          { value: 'leadership', label: 'I work best when leading or managing a team' },
          { value: 'independent', label: 'I like working alone with minimal supervision' }
        ]
      },
      {
        id: 'q10',
        text: 'How do you approach problem-solving?',
        subtext: 'Select the option that best describes your approach',
        options: [
          { value: 'analyze', label: 'I analyze the situation carefully before acting' },
          { value: 'try_solutions', label: 'I try different solutions quickly to see what works' },
          { value: 'collaborate', label: 'I ask for guidance or collaborate with others' },
          { value: 'step_by_step', label: 'I follow step-by-step instructions' }
        ]
      }
    ]
  },
  {
    id: 'career_goals',
    title: 'Career Preferences & Goals',
    icon: FaChartBar,
    questions: [
      {
        id: 'q11',
        text: 'What is your main goal in choosing a career?',
        subtext: 'Select the option that best describes your goal',
        options: [
          { value: 'salary', label: 'High salary & financial stability' },
          { value: 'security', label: 'Job security & long-term stability' },
          { value: 'flexibility', label: 'Flexibility & work-life balance' },
          { value: 'passion', label: 'Passion & job satisfaction' },
          { value: 'impact', label: 'Helping others & making an impact' }
        ]
      },
      {
        id: 'q12',
        text: 'Are you open to entrepreneurship or starting your own business?',
        subtext: 'Select the option that best describes your interest',
        options: [
          { value: 'yes', label: 'Yes, I want to start my own business' },
          { value: 'maybe', label: 'Maybe, but I need guidance' },
          { value: 'no', label: 'No, I prefer a stable job' }
        ]
      },
      {
        id: 'q13',
        text: 'Would you consider studying further (university, technical training, or online courses) to enhance your career opportunities?',
        subtext: 'Select the option that best describes your intention',
        options: [
          { value: 'yes', label: 'Yes, I want to continue studying' },
          { value: 'maybe', label: 'Maybe, if it helps my career' },
          { value: 'no', label: 'No, I prefer to start working now' }
        ]
      },
      {
        id: 'q14',
        text: 'Are you open to working outside of Cameroon if opportunities arise?',
        subtext: 'Select the option that best describes your willingness',
        options: [
          { value: 'yes', label: 'Yes, I am open to international opportunities' },
          { value: 'no', label: 'No, I want to work within Cameroon' },
          { value: 'not_sure', label: 'Not sure yet' }
        ]
      }
    ]
  },
  {
    id: 'practical_constraints',
    title: 'Practical Constraints & Accessibility',
    icon: FaUsers,
    questions: [
      {
        id: 'q15',
        text: 'Do you have access to resources such as a computer, internet, or library for research and self-learning?',
        subtext: 'Select the option that best describes your access',
        options: [
          { value: 'yes', label: 'Yes, I have access to all' },
          { value: 'limited', label: 'Limited access (some but not all)' },
          { value: 'no', label: 'No access to these resources' }
        ]
      },
      {
        id: 'q16',
        text: 'Do you have financial constraints that may affect your career choices?',
        subtext: 'Select the option that best describes your situation',
        options: [
          { value: 'yes', label: 'Yes, I may need financial support or scholarships' },
          { value: 'no', label: 'No, I can support myself financially' },
          { value: 'not_sure', label: 'Not sure yet' }
        ]
      }
    ]
  }
];

const LoadingSpinner = () => (
  <div className="loading-spinner">
    <div className="spinner"></div>
    <p>Analyzing your responses...</p>
  </div>
);

const CareerAssessment = () => {
  const [currentCategory, setCurrentCategory] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showFeedback, setShowFeedback] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [validationError, setValidationError] = useState('');
  const { user } = useUser();

  const handleAnswer = (questionId, value, multiple = false) => {
    setAnswers(prev => {
      if (multiple) {
        const currentAnswers = prev[questionId] || [];
        const updatedAnswers = currentAnswers.includes(value)
          ? currentAnswers.filter(v => v !== value) // Deselect if already selected
          : [...currentAnswers, value]; // Add to selection
        return { ...prev, [questionId]: updatedAnswers };
      } else {
        return { ...prev, [questionId]: value };
      }
    });
    setShowFeedback(true);
    setValidationError('');
    setTimeout(() => setShowFeedback(false), 1000);
  };

  const validateCategory = () => {
    const currentQuestions = categories[currentCategory].questions;
    const answeredAll = currentQuestions.every(q => {
      if (q.multiple) {
        return answers[q.id] && answers[q.id].length > 0; // Ensure at least one selection for multiple-choice questions
      } else {
        return answers[q.id]; // Ensure a single selection for single-choice questions
      }
    });
    if (!answeredAll) {
      setValidationError('Please answer all questions before proceeding');
      return false;
    }
    return true;
  };

  const handleNext = async () => {
    if (!validateCategory()) return;

    if (currentCategory < categories.length - 1) {
      setCurrentCategory(prev => prev + 1);
    } else {
      setIsSubmitting(true);
      try {
        // Process assessment with your API
        const response = await fetch('http://localhost:3000/api/app', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            answers,
            categories
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to process assessment');
        }

        const results = await response.json();

        // Store in Supabase using service role
        if (user) {
          await storeAssessmentResults(user.id, {
            answers,
            categories,
            results
          });
        } else {
          throw new Error('User must be authenticated to save assessment');
        }

        setShowResults(true);
        setTimeout(() => {
          window.location.href = '/cdashboard';
        }, 2000);

      } catch (error) {
        console.error('Error submitting assessment:', error);
        setValidationError(error.message || 'There was an error processing your assessment. Please try again.');
      } finally {
        setIsSubmitting(false);
      }
    }
  };



  const handlePrevious = () => {
    if (currentCategory > 0) {
      setCurrentCategory(prev => prev - 1);
    }
  };

  if (showResults) {
    return (
      <div className="results-page">
        <h1>Welcome to Your Career Dashboard!</h1>
        <p>Your personalized career insights are being prepared...</p>
      </div>
    );
  }

  const CategoryIcon = categories[currentCategory].icon;
  const progress = (Object.keys(answers).length / (categories.reduce((acc, cat) => acc + cat.questions.length, 0))) * 100;

  return (
    <div className="assessment-page">
      <AnimatePresence>
        {isSubmitting && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="loading-overlay"
          >
            <LoadingSpinner />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="assessment-container">
        <div className="assessment-content">
          <div className="assessment-sidebar">
            <div className="icon-container">
              <CategoryIcon className="category-icon" />
            </div>
            <h3 className="sidebar-title">
              {categories[currentCategory].title}
            </h3>
            <div className="progress-section">
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="progress-text">{Math.round(progress)}% Complete</p>
            </div>
            <div className="student-image">
              <FaGraduationCap className="student-icon" />
              <p>Shape Your Future</p>
            </div>
          </div>

          <div className="questions-section">
            {validationError && (
              <div className="error-message">{validationError}</div>
            )}

            <div className="questions-container">
              {categories[currentCategory].questions.map((question) => (
                <motion.div
                  key={question.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="question-card"
                >
                  <p className="question-text">{question.text}</p>
                  <p className="question-subtext">{question.subtext}</p>
                  <div className="answer-options">
                    {question.options.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => handleAnswer(question.id, option.value, question.multiple)}
                        className={`answer-button ${question.multiple && answers[question.id]?.includes(option.value) ? 'selected' : answers[question.id] === option.value ? 'selected' : ''}`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="navigation-buttons">
              <button
                onClick={handlePrevious}
                disabled={currentCategory === 0}
                className={`nav-button ${currentCategory === 0 ? 'disabled' : ''}`}
              >
                Previous
              </button>
              <button onClick={handleNext} className="nav-button">
                {currentCategory === categories.length - 1 ? 'Complete' : 'Next'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CareerAssessment;