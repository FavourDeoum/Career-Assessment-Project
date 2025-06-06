import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import SchoolDetailsPage from './SchoolDetails';

const mockSchools = [
  {
    id: '1',
    name: "Stanford University",
    program: "MS in Data Science",
    location: "California, USA",
    duration: "2 Years",
    tuition: "$58,000/year",
    ranking: "#1",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1562774053-701939374585?w=300&h=200&fit=crop",
    description:
      "Stanford's Master of Science in Data Science is a rigorous program that combines statistical theory, computational methods, and real-world applications. Students work with world-renowned faculty and gain hands-on experience with cutting-edge technologies.",
    requirements: [
      "Bachelor's degree in Computer Science, Mathematics, Statistics, or related field",
      "GPA of 3.5 or higher",
      "GRE scores (minimum 320 combined)",
      "TOEFL/IELTS for international students",
      "3 letters of recommendation",
      "Statement of purpose",
      "Programming experience in Python/R",
    ],
    applicationProcess:
      "Applications are reviewed holistically. Submit all required documents through the Stanford Graduate Admissions portal. Early applications are encouraged as admission is highly competitive.",
  },
  // Add other schools as needed

  {
        id: 2,
        name: "MIT",
        program: "Master of Business Analytics",
        location: "Massachusetts, USA",
        duration: "12 Months",
        tuition: "$78,000",
        ranking: "#2",
        rating: 4.8,
        image: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=300&h=200&fit=crop",
        description:
          "MIT's Master of Business Analytics is an intensive 12-month program that prepares students to harness the power of data analytics to drive business decisions. The program combines technical rigor with business acumen.",
        requirements: [
          "Bachelor's degree from an accredited institution",
          "Strong quantitative background",
          "GMAT or GRE scores",
          "2+ years of work experience preferred",
          "English proficiency (TOEFL/IELTS)",
          "Essays and recommendations",
          "Interview (by invitation)",
        ],
        applicationProcess:
          "Submit application through MIT Sloan portal. Include all transcripts, test scores, essays, and recommendations. Interview invitations are extended to qualified candidates.",
      },
      {
        id: 3,
        name: "University of California, Berkeley",
        program: "Master of Information & Data Science",
        location: "California, USA",
        duration: "20 Months",
        tuition: "$70,000",
        ranking: "#3",
        rating: 4.7,
        image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=300&h=200&fit=crop",
        description:
          "UC Berkeley's MIDS program is designed for working professionals who want to advance their careers in data science. The program offers both online and on-campus options with flexible scheduling.",
        requirements: [
          "Bachelor's degree with minimum 3.0 GPA",
          "Statistics and programming coursework",
          "Professional work experience",
          "Statement of purpose",
          "Resume",
          "2 letters of recommendation",
          "No GRE required",
        ],
        applicationProcess:
          "Applications are submitted online through UC Berkeley's application system. Rolling admissions with multiple start dates throughout the year.",
      },
      {
        id: 4,
        name: "Carnegie Mellon University",
        program: "MS in Computational Data Science",
        location: "Pennsylvania, USA",
        duration: "2 Years",
        tuition: "$52,000/year",
        ranking: "#4",
        rating: 4.8,
        image: "https://images.unsplash.com/photo-1607237138185-eedd9c632b0b?w=300&h=200&fit=crop",
        description:
          "CMU's MS in Computational Data Science focuses on the computational and statistical foundations needed to work with large-scale data. Students learn from faculty across multiple departments.",
        requirements: [
          "Bachelor's degree in relevant field",
          "Strong mathematical background",
          "Programming experience",
          "GRE scores recommended",
          "3 letters of recommendation",
          "Personal statement",
          "Transcripts from all institutions",
        ],
        applicationProcess:
          "Submit application through CMU's online portal. Include all required documents and pay application fee. Decisions are made on a rolling basis.",
      },
      {
        id: 5,
        name: "Harvard University",
        program: "Data Science Master's",
        location: "Massachusetts, USA",
        duration: "2 Years",
        tuition: "$65,000/year",
        ranking: "#5",
        rating: 4.9,
        image: "https://images.unsplash.com/photo-1564981797816-1043664bf78d?w=300&h=200&fit=crop",
        description:
          "Harvard's Data Science Master's program combines rigorous training in statistical methods, computational techniques, and domain expertise. Students work on real-world projects with industry partners.",
        requirements: [
          "Bachelor's degree with strong academic record",
          "Mathematics and statistics background",
          "Programming proficiency",
          "GRE or GMAT scores",
          "TOEFL/IELTS for international students",
          "3 recommendation letters",
          "Research statement",
        ],
        applicationProcess:
          "Applications are submitted through Harvard's centralized application system. All materials must be received by the deadline. Interviews may be required for selected candidates.",
      },
      {
        id: 6,
        name: "University of Washington",
        program: "MS in Data Science",
        location: "Washington, USA",
        duration: "18 Months",
        tuition: "$45,000",
        ranking: "#6",
        rating: 4.6,
        image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=200&fit=crop",
        description:
          "UW's MS in Data Science is a professional master's program that emphasizes practical skills and real-world applications. The program includes a capstone project with industry partners.",
        requirements: [
          "Bachelor's degree from accredited institution",
          "Calculus and linear algebra coursework",
          "Programming experience (Python/R preferred)",
          "Minimum 3.0 GPA",
          "Statement of purpose",
          "Resume",
          "2 letters of recommendation",
        ],
        applicationProcess:
          "Submit application online with all supporting documents. Applications are reviewed in the order received. Early application is recommended due to limited enrollment.",
      }
];

const SchoolDetailsWrapper = () => {
  const { schoolId } = useParams();
  const navigate = useNavigate();

  const school = mockSchools.find((s) => s.id === schoolId) || { id: schoolId };

  const handleBack = () => {
    navigate('/explore');
  };

  const handleNavigateToApplication = (school) => {
    navigate(`/explore/school/${school.id}/apply`);
  };

  return (
    <SchoolDetailsPage
      school={school}
      onBack={handleBack}
      onNavigateToApplication={handleNavigateToApplication}
    />
  );
};

export default SchoolDetailsWrapper;
