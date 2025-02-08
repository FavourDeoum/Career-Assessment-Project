import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaArrowRight, FaArrowLeft } from 'react-icons/fa';
import './CareerAssessment.css';

const questions = [
  {
    category: 'Skills',
    questions: [
      { id: 's1', text: 'I enjoy solving complex problems.' },
      { id: 's2', text: 'I am good at organizing and managing tasks.' },
      { id: 's3', text: 'I have strong communication skills.' },
    ],
  },
  {
    category: 'Interests',
    questions: [
      { id: 'i1', text: 'I like working with computers and technology.' },
      { id: 'i2', text: 'I enjoy helping others and making a difference.' },
      { id: 'i3', text: 'I am interested in science and research.' },
    ],
  },
  {
    category: 'Personality Traits',
    questions: [
      { id: 'p1', text: 'I prefer working in teams rather than alone.' },
      { id: 'p2', text: 'I am comfortable taking risks and trying new things.' },
      { id: 'p3', text: 'I pay attention to details and strive for accuracy.' },
    ],
  },
];

const CareerAssessment = () => {
  const [currentCategory, setCurrentCategory] = useState(0);
  const [answers, setAnswers] = useState({});

  const handleAnswer = (questionId, value) => {
    setAnswers({ ...answers, [questionId]: value });
  };

  const handleNext = () => {
    if (currentCategory < questions.length - 1) {
      setCurrentCategory(currentCategory + 1);
    } else {
      // Submit assessment
      console.log('Assessment completed:', answers);
      // Here you would typically send the answers to your backend
    }
  };

  const handlePrevious = () => {
    if (currentCategory > 0) {
      setCurrentCategory(currentCategory - 1);
    }
  };

  const progress = ((currentCategory + 1) / questions.length) * 100;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="assessment-page"
    >
      <div className="assessment-container">
        <h1 className="assessment-title">Career Assessment</h1>
        <div className="assessment-card">
          <h2 className="category-title">{questions[currentCategory].category}</h2>
          {questions[currentCategory].questions.map((question) => (
            <div key={question.id} className="question-container">
              <p className="question-text">{question.text}</p>
              <div className="answer-options">
                {[1, 2, 3, 4, 5].map((value) => (
                  <button
                    key={value}
                    onClick={() => handleAnswer(question.id, value)}
                    className={`answer-button ${
                      answers[question.id] === value ? 'selected' : ''
                    }`}
                  >
                    {value}
                  </button>
                ))}
              </div>
            </div>
          ))}
          <div className="navigation-buttons">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handlePrevious}
              disabled={currentCategory === 0}
              className={`nav-button ${
                currentCategory === 0 ? 'disabled' : ''
              }`}
            >
              <FaArrowLeft className="button-icon" /> Previous
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleNext}
              className="nav-button"
            >
              {currentCategory === questions.length - 1 ? 'Submit' : 'Next'} <FaArrowRight className="button-icon" />
            </motion.button>
          </div>
        </div>
        <div className="progress-container">
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="progress-text">
            {currentCategory + 1} of {questions.length} sections completed
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default CareerAssessment;

