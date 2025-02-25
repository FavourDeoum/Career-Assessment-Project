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
    FaGraduationCap,
    FaPalette,
    FaTools,
    FaGlobe,
    FaLeaf
} from 'react-icons/fa';

const categories = [
    {
        id: 'interests',
        title: 'Interests & Passions',
        icon: FaHeart,
        questions: [
            {
                id: 'i1',
                text: 'How much do you enjoy solving puzzles and brain teasers?',
                subtext: 'This helps identify analytical thinking preferences',
                options: [
                    { value: 'not_at_all', label: 'Not at all' },
                    { value: 'slightly', label: 'Slightly' },
                    { value: 'moderately', label: 'Moderately' },
                    { value: 'very_much', label: 'Very much' },
                    { value: 'extremely', label: 'Extremely' }
                ]
            },
            {
                id: 'i2',
                text: 'How interested are you in helping others learn and grow?',
                subtext: 'This indicates teaching and mentoring inclinations',
                options: [
                    { value: 'not_interested', label: 'Not interested' },
                    { value: 'somewhat_interested', label: 'Somewhat interested' },
                    { value: 'interested', label: 'Interested' },
                    { value: 'very_interested', label: 'Very interested' },
                    { value: 'passionate', label: 'Passionate' }
                ]
            },
            {
                id: 'i3',
                text: 'How much do you enjoy creative activities?',
                subtext: 'This suggests artistic and design tendencies',
                options: [
                    { value: 'rarely', label: 'Rarely engage in creative activities' },
                    { value: 'occasionally', label: 'Occasionally enjoy being creative' },
                    { value: 'regularly', label: 'Regularly seek creative outlets' },
                    { value: 'frequently', label: 'Frequently pursue creative projects' },
                    { value: 'always', label: 'Always looking for creative expression' }
                ]
            },
            {
                id: 'i4',
                text: 'How interested are you in technology and digital tools?',
                subtext: 'This indicates technical and digital inclinations',
                options: [
                    { value: 'minimal', label: 'Minimal interest' },
                    { value: 'basic', label: 'Basic interest' },
                    { value: 'moderate', label: 'Moderate interest' },
                    { value: 'strong', label: 'Strong interest' },
                    { value: 'passionate', label: 'Passionate about technology' }
                ]
            }
        ]
    },
    {
        id: 'skills',
        title: 'Skills & Abilities',
        icon: FaBrain,
        questions: [
            {
                id: 's1',
                text: 'How would you rate your communication skills?',
                subtext: 'Both written and verbal communication abilities',
                options: [
                    { value: 'basic', label: 'Basic communication skills' },
                    { value: 'developing', label: 'Developing communicator' },
                    { value: 'competent', label: 'Competent communicator' },
                    { value: 'advanced', label: 'Advanced communicator' },
                    { value: 'expert', label: 'Expert communicator' }
                ]
            },
            {
                id: 's2',
                text: 'How comfortable are you with data and numbers?',
                subtext: 'Mathematical and analytical capabilities',
                options: [
                    { value: 'uncomfortable', label: 'Uncomfortable with numbers' },
                    { value: 'somewhat_comfortable', label: 'Somewhat comfortable' },
                    { value: 'comfortable', label: 'Comfortable' },
                    { value: 'very_comfortable', label: 'Very comfortable' },
                    { value: 'expert', label: 'Expert with data/numbers' }
                ]
            },
            {
                id: 's3',
                text: 'How would you rate your problem-solving abilities?',
                subtext: 'Ability to find solutions to complex challenges',
                options: [
                    { value: 'basic', label: 'Basic problem-solving' },
                    { value: 'developing', label: 'Developing problem-solver' },
                    { value: 'competent', label: 'Competent problem-solver' },
                    { value: 'advanced', label: 'Advanced problem-solver' },
                    { value: 'expert', label: 'Expert problem-solver' }
                ]
            },
            {
                id: 's4',
                text: 'How proficient are you with digital technologies?',
                subtext: 'Technical and digital tool proficiency',
                options: [
                    { value: 'basic', label: 'Basic digital skills' },
                    { value: 'intermediate', label: 'Intermediate' },
                    { value: 'proficient', label: 'Proficient' },
                    { value: 'advanced', label: 'Advanced' },
                    { value: 'expert', label: 'Expert' }
                ]
            }
        ]
    },
    {
        id: 'environment',
        title: 'Work Environment',
        icon: FaBriefcase,
        questions: [
            {
                id: 'e1',
                text: 'What type of work environment do you prefer?',
                subtext: 'Physical work setting preferences',
                options: [
                    { value: 'remote', label: 'Fully remote' },
                    { value: 'hybrid', label: 'Hybrid' },
                    { value: 'office', label: 'Traditional office' },
                    { value: 'field', label: 'Field work' },
                    { value: 'flexible', label: 'Flexible environment' }
                ]
            },
            {
                id: 'e2',
                text: 'How do you prefer to work with others?',
                subtext: 'Team dynamics and collaboration style',
                options: [
                    { value: 'independent', label: 'Mostly independent' },
                    { value: 'small_team', label: 'Small team' },
                    { value: 'large_team', label: 'Large team' },
                    { value: 'mixed', label: 'Mix of solo and team' },
                    { value: 'leadership', label: 'Leading teams' }
                ]
            },
            {
                id: 'e3',
                text: 'What pace of work do you prefer?',
                subtext: 'Work rhythm and deadline preferences',
                options: [
                    { value: 'steady', label: 'Steady and predictable' },
                    { value: 'structured', label: 'Structured with deadlines' },
                    { value: 'dynamic', label: 'Dynamic and varied' },
                    { value: 'fast', label: 'Fast-paced' },
                    { value: 'project', label: 'Project-based sprints' }
                ]
            },
            {
                id: 'e4',
                text: 'What type of organizational culture do you prefer?',
                subtext: 'Company culture and values alignment',
                options: [
                    { value: 'traditional', label: 'Traditional/Corporate' },
                    { value: 'startup', label: 'Startup/Innovative' },
                    { value: 'creative', label: 'Creative/Artistic' },
                    { value: 'impact', label: 'Social Impact/Mission-driven' },
                    { value: 'academic', label: 'Academic/Research' }
                ]
            }
        ]
    },
    {
        id: 'goals',
        title: 'Career Goals',
        icon: FaChartBar,
        questions: [
            {
                id: 'g1',
                text: 'What are your primary career motivators?',
                subtext: 'What drives your career choices',
                options: [
                    { value: 'financial', label: 'Financial success' },
                    { value: 'impact', label: 'Making an impact' },
                    { value: 'growth', label: 'Personal growth' },
                    { value: 'balance', label: 'Work-life balance' },
                    { value: 'innovation', label: 'Innovation/Creation' }
                ]
            },
            {
                id: 'g2',
                text: 'What type of career growth do you seek?',
                subtext: 'Professional development preferences',
                options: [
                    { value: 'specialist', label: 'Technical specialist' },
                    { value: 'management', label: 'Management track' },
                    { value: 'entrepreneur', label: 'Entrepreneurial' },
                    { value: 'consultant', label: 'Consulting/Advisory' },
                    { value: 'research', label: 'Research/Academic' }
                ]
            },
            {
                id: 'g3',
                text: 'What is your preferred work-life balance?',
                subtext: 'Time and energy investment preferences',
                options: [
                    { value: 'strict', label: 'Strict 9-5' },
                    { value: 'flexible', label: 'Flexible hours' },
                    { value: 'results', label: 'Results-focused' },
                    { value: 'intensive', label: 'Intensive periods' },
                    { value: 'balanced', label: 'Equal work-life split' }
                ]
            },
            {
                id: 'g4',
                text: 'What are your long-term career aspirations?',
                subtext: 'Where you see yourself in the future',
                options: [
                    { value: 'leader', label: 'Industry leader' },
                    { value: 'expert', label: 'Subject matter expert' },
                    { value: 'founder', label: 'Business owner' },
                    { value: 'mentor', label: 'Teacher/Mentor' },
                    { value: 'innovator', label: 'Innovator/Pioneer' }
                ]
            }
        ]
    },
    {
        id: 'industry',
        title: 'Industry Preferences',
        icon: FaGlobe,
        questions: [
            {
                id: 'ind1',
                text: 'Which industry sectors interest you most?',
                subtext: 'Primary field of work preference',
                options: [
                    { value: 'tech', label: 'Technology' },
                    { value: 'healthcare', label: 'Healthcare' },
                    { value: 'finance', label: 'Finance' },
                    { value: 'education', label: 'Education' },
                    { value: 'creative', label: 'Creative Industries' }
                ]
            },
            {
                id: 'ind2',
                text: 'What type of organization size do you prefer?',
                subtext: 'Company size preference',
                options: [
                    { value: 'startup', label: 'Startup (1-50)' },
                    { value: 'small', label: 'Small (51-200)' },
                    { value: 'medium', label: 'Medium (201-1000)' },
                    { value: 'large', label: 'Large (1000+)' },
                    { value: 'enterprise', label: 'Enterprise (10000+)' }
                ]
            },
            {
                id: 'ind3',
                text: 'What type of impact do you want to make?',
                subtext: 'Desired contribution to society',
                options: [
                    { value: 'social', label: 'Social impact' },
                    { value: 'environmental', label: 'Environmental' },
                    { value: 'economic', label: 'Economic growth' },
                    { value: 'innovation', label: 'Technological innovation' },
                    { value: 'education', label: 'Educational advancement' }
                ]
            },
            {
                id: 'ind4',
                text: 'What geographical scope interests you?',
                subtext: 'Preferred business reach',
                options: [
                    { value: 'local', label: 'Local community' },
                    { value: 'regional', label: 'Regional' },
                    { value: 'national', label: 'National' },
                    { value: 'international', label: 'International' },
                    { value: 'global', label: 'Global' }
                ]
            }
        ]
    }
];

// Rest of the component code remains the same