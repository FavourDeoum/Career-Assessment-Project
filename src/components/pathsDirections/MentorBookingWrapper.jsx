import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MentorBookingPage from './MentorBookingPage';

const mockMentors = [
  {
    id: '1',
    name: "Dr. Sarah Chen",
    title: "Senior Data Scientist at Google",
    experience: "8+ years",
    expertise: ["Machine Learning", "Big Data", "Python"],
    rating: 4.9,
    sessions: 150,
    price: "$120/hour",
    image: "https://images.unsplash.com/photo-1494790108755-2616c02a0e15?w=150&h=150&fit=crop&crop=face",
    bio: "Dr. Sarah Chen is a Senior Data Scientist at Google with over 8 years of experience in machine learning and big data analytics. She holds a PhD in Computer Science from MIT and has published numerous papers in top-tier conferences.",
    specializations: ["Deep Learning", "Natural Language Processing", "Computer Vision", "MLOps"],
    availability: ["Monday 9AM-5PM PST", "Wednesday 1PM-8PM PST", "Friday 10AM-6PM PST"],
    languages: ["English", "Mandarin"],
    sessionTypes: ["1-on-1 Mentoring", "Code Review", "Career Guidance", "Technical Interview Prep"],
  },
  // Add other mentors as needed

  {
        id: 2,
        name: "Michael Rodriguez",
        title: "Lead Data Engineer at Microsoft",
        experience: "10+ years",
        expertise: ["Data Engineering", "Cloud Computing", "SQL"],
        rating: 4.8,
        sessions: 200,
        price: "$100/hour",
        image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
        bio: "Michael Rodriguez is a Lead Data Engineer at Microsoft with extensive experience in building scalable data pipelines and cloud infrastructure. He specializes in Azure, AWS, and modern data stack technologies.",
        specializations: ["Data Pipeline Architecture", "Cloud Platforms", "ETL/ELT", "Data Warehousing"],
        availability: ["Tuesday 8AM-4PM PST", "Thursday 12PM-8PM PST", "Saturday 9AM-3PM PST"],
        languages: ["English", "Spanish"],
        sessionTypes: ["Architecture Review", "System Design", "Career Mentoring", "Technical Consultation"],
      },
      {
        id: 3,
        name: "Dr. Emily Watson",
        title: "AI Research Scientist at Meta",
        experience: "12+ years",
        expertise: ["Deep Learning", "NLP", "Computer Vision"],
        rating: 5.0,
        sessions: 95,
        price: "$150/hour",
        image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
        bio: "Dr. Emily Watson is an AI Research Scientist at Meta focusing on cutting-edge research in deep learning and computer vision. She has led multiple breakthrough projects and holds several patents in AI.",
        specializations: ["Research Methodology", "Paper Writing", "Conference Presentations", "AI Ethics"],
        availability: ["Monday 2PM-8PM EST", "Wednesday 10AM-4PM EST", "Friday 1PM-7PM EST"],
        languages: ["English", "French"],
        sessionTypes: ["Research Guidance", "Paper Review", "PhD Mentoring", "Industry Transition"],
      },
      {
        id: 4,
        name: "James Park",
        title: "VP of Analytics at Netflix",
        experience: "15+ years",
        expertise: ["Business Analytics", "Strategy", "Leadership"],
        rating: 4.9,
        sessions: 180,
        price: "$200/hour",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
        bio: "James Park is VP of Analytics at Netflix, leading data-driven decision making across the platform. He has extensive experience in scaling analytics teams and implementing data strategies at Fortune 500 companies.",
        specializations: ["Executive Leadership", "Team Building", "Data Strategy", "Business Intelligence"],
        availability: ["Tuesday 3PM-7PM PST", "Thursday 9AM-1PM PST", "Sunday 11AM-3PM PST"],
        languages: ["English", "Korean"],
        sessionTypes: ["Leadership Coaching", "Career Strategy", "Executive Mentoring", "Business Consultation"],
      },
      {
        id: 5,
        name: "Dr. Priya Sharma",
        title: "Principal Data Scientist at Amazon",
        experience: "9+ years",
        expertise: ["Statistics", "A/B Testing", "R"],
        rating: 4.7,
        sessions: 120,
        price: "$110/hour",
        image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face",
        bio: "Dr. Priya Sharma is a Principal Data Scientist at Amazon with deep expertise in statistical modeling and experimentation. She leads the A/B testing platform used across Amazon's e-commerce ecosystem.",
        specializations: ["Statistical Modeling", "Experimental Design", "Causal Inference", "Product Analytics"],
        availability: ["Monday 11AM-5PM EST", "Wednesday 2PM-8PM EST", "Friday 9AM-3PM EST"],
        languages: ["English", "Hindi"],
        sessionTypes: ["Statistical Consulting", "Experiment Design", "Data Analysis", "Academic Mentoring"],
      },
      {
        id: 6,
        name: "Alex Thompson",
        title: "Senior ML Engineer at Tesla",
        experience: "7+ years",
        expertise: ["MLOps", "AutoML", "Deployment"],
        rating: 4.8,
        sessions: 88,
        price: "$130/hour",
        image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
        bio: "Alex Thompson is a Senior ML Engineer at Tesla working on autonomous driving systems. He specializes in MLOps, model deployment, and building production-ready machine learning systems.",
        specializations: ["Model Deployment", "CI/CD for ML", "Monitoring & Observability", "Edge Computing"],
        availability: ["Tuesday 10AM-6PM PST", "Thursday 1PM-7PM PST", "Saturday 8AM-2PM PST"],
        languages: ["English"],
        sessionTypes: ["Technical Mentoring", "Code Review", "System Architecture", "Career Guidance"],
      }
];

const MentorBookingWrapper = () => {
  const { mentorId } = useParams();
  const navigate = useNavigate();

  // Ensure mentorId and mockMentors ids are strings for matching
  const mentor = mockMentors.find((m) => m.id === String(mentorId)) || {
    id: mentorId,
    sessionTypes: [],
  };

  const handleBack = () => {
    navigate('/explore');
  };

  return <MentorBookingPage mentor={mentor} onBack={handleBack} />;
};

export default MentorBookingWrapper;
