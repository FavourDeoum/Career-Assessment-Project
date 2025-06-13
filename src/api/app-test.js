// /api/app-test.js

import { GoogleGenerativeAI } from "@google/generative-ai";
import Cors from 'cors';

// === STEP 1: USE ENVIRONMENT VARIABLES ===
// This is now secure and configured in your Vercel project settings.
const API_KEY = process.env.GOOGLE_AI_API_KEY;

if (!API_KEY) {
    throw new Error("GOOGLE_AI_API_KEY environment variable not set");
}

const genAI = new GoogleGenerativeAI(API_KEY);

// Initialize CORS middleware
const cors = Cors({
    // Your origin list is correct.
    origin: ['http://localhost:5173', 'https://career-assessment-project.vercel.app'],
    methods: ['POST', 'GET', 'OPTIONS'],
});

// Helper to run middleware
function runMiddleware(req, res, fn) {
    return new Promise((resolve, reject) => {
        fn(req, res, (result) => {
            if (result instanceof Error) {
                return reject(result);
            }
            return resolve(result);
        });
    });
}

// === STEP 3 (OPTIMIZATION): MOVE LARGE DATA OUTSIDE THE HANDLER ===
// This data is constant. Define it once at the top level.
// NOTE: I have truncated the data here for brevity, but you should use your full original data.

const SCHOOLS_DATA_STRING = `[
  {
    "id": "uba_coltech",
    "name": "College of Technology (COLTECH)",
    "programs": [
      {
      "program": "B.Tech in Computer Engineering",
      "duration": "4 Years",
      "tuition": "150,000 XAF/year",
      "description": "Focuses on imparting knowledge and problem-solving skills in Computer Engineering, preparing students to adapt to the evolving technological landscape.",
      "requirements": [
        "Advanced Level Certificate with at least two science subjects",
        "Baccalaureate or equivalent for Francophone students",
        "Pass UBa entrance examination",
        "Good knowledge of Mathematics and Physics",
        "English proficiency"
      ],
      "applicationProcess": "Submit online or paper application to UBa Admissions Office. Sit for competitive entrance exam. Admitted students must complete medical check-up and registration at the COLTECH registrar's office.",
      "availableTutors": [
          {
            "name": "Fien Dora",
            "role": "COO at SEED Inc.",
            "experience": "3+ years",
            "completedSessions": 50,
            "rating": 4.0,
            "expertise": ["Project Management", "Embedded Systems"],
            "phone": "+237680468606",
            "specialization": "Business Management & Technology Integration",
            "availability": "Weekdays 9AM-6PM, Weekends by appointment",
            "sessionTypes": ["One-on-one tutoring", "Group sessions", "Project consultation"],
            "languages": ["English", "French"],
            "hourlyRate": "15,000 XAF/hour",
            "packageDeals": {
              "5sessions": "70,000 XAF (Save 5,000 XAF)",
              "10sessions": "135,000 XAF (Save 15,000 XAF)"
            },
            "studentFeedback": "Excellent at explaining complex project management concepts with real-world examples",
            "image": "https://i.ibb.co/qFxfnpTr/Whats-App-Image-2025-06-08-at-17-08-24-332f52ec.jpg"
          }
        ]
    },
      {
        "program": "Agribusiness Technology - One Year Conversion",
        "duration": "1 Year",
        "tuition": "180,000 XAF/year",
        "description": "Conversion program for professionals seeking agribusiness management skills",
        "requirements": [
          "Bachelor's degree in Agriculture or related field",
          "Minimum 2 years work experience",
          "English proficiency"
        ],
        "applicationProcess": "Submit application through UBa portal with academic transcripts and motivation letter",
        "availableTutors": [
          {
            "name": "Fien Dora",
            "role": "COO at SEED Inc.",
            "experience": "3+ years",
            "completedSessions": 50,
            "rating": 4.0,
            "expertise": ["Project Management", "Embedded Systems"],
            "phone": "+237680468606",
            "specialization": "Business Management & Technology Integration",
            "availability": "Weekdays 9AM-6PM, Weekends by appointment",
            "sessionTypes": ["One-on-one tutoring", "Group sessions", "Project consultation"],
            "languages": ["English", "French"],
            "hourlyRate": "15,000 XAF/hour",
            "packageDeals": {
              "5sessions": "70,000 XAF (Save 5,000 XAF)",
              "10sessions": "135,000 XAF (Save 15,000 XAF)"
            },
            "studentFeedback": "Excellent at explaining complex project management concepts with real-world examples",
            "image": "https://i.ibb.co/qFxfnpTr/Whats-App-Image-2025-06-08-at-17-08-24-332f52ec.jpg"
          }
        ]
      },

      {
        "program": "MSc Agribusiness Marketing Management",
        "duration": "2 Years",
        "tuition": "250,000 XAF/year",
        "description": "Advanced study of marketing strategies in agricultural value chains",
        "requirements": [
          "Bachelor's degree in Agriculture, Business or Economics",
          "Minimum second-class lower division"
        ],
        "applicationProcess": "Online application with academic transcripts and research proposal",
        "availableTutors": [
          {
            "name": "Fien Dora",
            "role": "COO at SEED Inc.",
            "experience": "3+ years",
            "completedSessions": 50,
            "rating": 4.0,
            "expertise": ["Project Management", "Embedded Systems"],
            "phone": "+237680468606",
            "specialization": "Business Strategy & Marketing Analytics",
            "availability": "Weekdays 9AM-6PM, Weekends by appointment",
            "sessionTypes": ["Research guidance", "Thesis supervision", "Marketing strategy sessions"],
            "languages": ["English", "French"],
            "hourlyRate": "20,000 XAF/hour",
            "packageDeals": {
              "5sessions": "95,000 XAF (Save 5,000 XAF)",
              "10sessions": "180,000 XAF (Save 20,000 XAF)"
            },
            "studentFeedback": "Great mentor for graduate-level research and business applications",
            "image": "https://i.ibb.co/qFxfnpTr/Whats-App-Image-2025-06-08-at-17-08-24-332f52ec.jpg"
          }
        ]
      },

      {
      "program": "MSc Agribusiness Project Management",
      "duration": "2 Years",
      "tuition": "250,000 XAF/year",
      "description": "Focus on project planning and management in agribusiness contexts.",
      "requirements": [
        "Bachelor's degree in Agribusiness, Agriculture or related field",
        "Minimum second-class lower division"
      ],
      "applicationProcess": "Online application with transcripts and project plan",
      "availableTutors": [
          {
            "name": "Fien Dora",
            "role": "COO at SEED Inc.",
            "experience": "3+ years",
            "completedSessions": 50,
            "rating": 4.0,
            "expertise": ["Project Management", "Embedded Systems"],
            "phone": "+237680468606",
            "specialization": "Business Strategy & Marketing Analytics",
            "availability": "Weekdays 9AM-6PM, Weekends by appointment",
            "sessionTypes": ["Research guidance", "Thesis supervision", "Marketing strategy sessions"],
            "languages": ["English", "French"],
            "hourlyRate": "20,000 XAF/hour",
            "packageDeals": {
              "5sessions": "95,000 XAF (Save 5,000 XAF)",
              "10sessions": "180,000 XAF (Save 20,000 XAF)"
            },
            "studentFeedback": "Great mentor for graduate-level research and business applications",
            "image": "https://i.ibb.co/qFxfnpTr/Whats-App-Image-2025-06-08-at-17-08-24-332f52ec.jpg"
          }
        ]
    },
    {
      "program": "PhD Agribusiness Marketing Management",
      "duration": "3-5 Years",
      "tuition": "300,000 XAF/year",
      "description": "Doctoral research in marketing for agricultural sectors",
      "requirements": [
        "Master's degree in Agribusiness or related field",
        "Research proposal",
        "Publications in relevant field"
      ],
      "applicationProcess": "Submit research proposal to department head",
      "availableTutors": [
          {
            "name": "Fien Dora",
            "role": "COO at SEED Inc.",
            "experience": "3+ years",
            "completedSessions": 50,
            "rating": 4.0,
            "expertise": ["Project Management", "Embedded Systems"],
            "phone": "+237680468606",
            "specialization": "Business Strategy & Marketing Analytics",
            "availability": "Weekdays 9AM-6PM, Weekends by appointment",
            "sessionTypes": ["Research guidance", "Thesis supervision", "Marketing strategy sessions"],
            "languages": ["English", "French"],
            "hourlyRate": "20,000 XAF/hour",
            "packageDeals": {
              "5sessions": "95,000 XAF (Save 5,000 XAF)",
              "10sessions": "180,000 XAF (Save 20,000 XAF)"
            },
            "studentFeedback": "Great mentor for graduate-level research and business applications",
            "image": "https://i.ibb.co/qFxfnpTr/Whats-App-Image-2025-06-08-at-17-08-24-332f52ec.jpg"
          }
        ]
    },
    {
      "program": "PhD Agribusiness Project Management",
      "duration": "3-5 Years",
      "tuition": "300,000 XAF/year",
      "description": "Advanced research in project design and implementation in agribusiness",
      "requirements": [
        "Master's degree in Agribusiness or Project Management",
        "Research proposal",
        "Relevant publications"
      ],
      "applicationProcess": "Submit documents to postgraduate school office",
      "availableTutors": [
          {
            "name": "Fien Dora",
            "role": "COO at SEED Inc.",
            "experience": "3+ years",
            "completedSessions": 50,
            "rating": 4.0,
            "expertise": ["Project Management", "Embedded Systems"],
            "phone": "+237680468606",
            "specialization": "Business Strategy & Marketing Analytics",
            "availability": "Weekdays 9AM-6PM, Weekends by appointment",
            "sessionTypes": ["Research guidance", "Thesis supervision", "Marketing strategy sessions"],
            "languages": ["English", "French"],
            "hourlyRate": "20,000 XAF/hour",
            "packageDeals": {
              "5sessions": "95,000 XAF (Save 5,000 XAF)",
              "10sessions": "180,000 XAF (Save 20,000 XAF)"
            },
            "studentFeedback": "Great mentor for graduate-level research and business applications",
            "image": "https://i.ibb.co/qFxfnpTr/Whats-App-Image-2025-06-08-at-17-08-24-332f52ec.jpg"
          }
        ]
    },
    {
      "program": "MSc Water Resource Engineering",
      "duration": "2 Years",
      "tuition": "280,000 XAF/year",
      "description": "Specialized training in hydrology, irrigation, and sustainable water management",
      "requirements": [
        "Bachelor’s degree in Environmental or Agricultural Engineering",
        "Second-class lower or better"
      ],
      "applicationProcess": "Apply online with transcripts and recommendation letters",
      "availableTutors": [
          {
            "name": "Fien Dora",
            "role": "COO at SEED Inc.",
            "experience": "3+ years",
            "completedSessions": 50,
            "rating": 4.0,
            "expertise": ["Project Management", "Embedded Systems"],
            "phone": "+237680468606",
            "specialization": "Business Strategy & Marketing Analytics",
            "availability": "Weekdays 9AM-6PM, Weekends by appointment",
            "sessionTypes": ["Research guidance", "Thesis supervision", "Marketing strategy sessions"],
            "languages": ["English", "French"],
            "hourlyRate": "20,000 XAF/hour",
            "packageDeals": {
              "5sessions": "95,000 XAF (Save 5,000 XAF)",
              "10sessions": "180,000 XAF (Save 20,000 XAF)"
            },
            "studentFeedback": "Great mentor for graduate-level research and business applications",
            "image": "https://i.ibb.co/qFxfnpTr/Whats-App-Image-2025-06-08-at-17-08-24-332f52ec.jpg"
          }
        ]
    },
    {
      "program": "PhD Water Resource Engineering",
      "duration": "3-5 Years",
      "tuition": "300,000 XAF/year",
      "description": "Advanced studies in water resource planning and policy",
      "requirements": [
        "Master's in Water Resource Engineering or related field",
        "Research proposal",
        "At least 1 journal publication"
      ],
      "applicationProcess": "Submit research documentation to the faculty research committee",
      "availableTutors": [
          {
            "name": "Fien Dora",
            "role": "COO at SEED Inc.",
            "experience": "3+ years",
            "completedSessions": 50,
            "rating": 4.0,
            "expertise": ["Project Management", "Embedded Systems"],
            "phone": "+237680468606",
            "specialization": "Business Strategy & Marketing Analytics",
            "availability": "Weekdays 9AM-6PM, Weekends by appointment",
            "sessionTypes": ["Research guidance", "Thesis supervision", "Marketing strategy sessions"],
            "languages": ["English", "French"],
            "hourlyRate": "20,000 XAF/hour",
            "packageDeals": {
              "5sessions": "95,000 XAF (Save 5,000 XAF)",
              "10sessions": "180,000 XAF (Save 20,000 XAF)"
            },
            "studentFeedback": "Great mentor for graduate-level research and business applications",
            "image": "https://i.ibb.co/qFxfnpTr/Whats-App-Image-2025-06-08-at-17-08-24-332f52ec.jpg"
          }
        ]
    }
    
    ],
    "location": "Bambili, Bamenda, Cameroon (UBa Campus)",
    "ranking": "N/A",
    "rating": 4.6,
    "image": "https://i.postimg.cc/mrVYyYtq/Whats-App-Image-2025-06-11-at-15-44-47-efedb86d.jpg",
    "description": "Premier technology school offering engineering, agriculture, and computer science programs with industry-focused training."
  },
  {
    "id": "uba_fs",
    "name": "Faculty of Science (FS)",
    "location": "Bambili, Bamenda, Cameroon (UBa Campus)",
    "ranking": "N/A",
    "rating": 4.5,
    "image": "https://i.postimg.cc/zXwq5vJH/Whats-App-Image-2025-06-11-at-15-44-47-edbc6100.jpg",
    "description": "Offers programs in biological, physical, and mathematical sciences.",
    "programs": [
      {
        "program": "BSc. Applied Zoology (Minor Medical Laboratory Technology)",
        "duration": "3 Years",
        "tuition": "150,000 XAF/year",
        "description": "Training in animal biology with applications in medical laboratory techniques.",
        "requirements": [
          "Advanced Level in Biology and Chemistry",
          "Pass in English Language"
        ],
        "applicationProcess": "Submit application through UBa portal with transcripts and motivation letter",
        "availableTutors": [
          {
            "name": "Emily Ponce",
            "role": "Industry Expert",
            "experience": "7+ years",
            "completedSessions": 169,
            "rating": 3.8,
            "expertise": [
              "Environmental Policy",
              "Project Management"
            ],
            "phone": "(774)949-5191",
            "specialization": "Software Engineering",
            "availability": "Weekdays 9AM-6PM, Weekends by appointment",
            "sessionTypes": [
              "Exam preparation",
              "Practical labs",
              "Exam preparation"
            ],
            "languages": [
              "English",
              "French"
            ],
            "hourlyRate": "16472 XAF/hour",
            "packageDeals": {
              "5sessions": "77,360 XAF (Save 5,000 XAF)",
              "10sessions": "149,720 XAF (Save 15,000 XAF)"
            },
            "studentFeedback": "Very engaging tutor with practical insights and academic depth.",
            "image": "https://i.ibb.co/j9MbGfTm/IMG-20250426-WA0033.jpg"
          },
          {
            "name": "Lauren Adams",
            "role": "Lecturer",
            "experience": "3+ years",
            "completedSessions": 192,
            "rating": 3.9,
            "expertise": [
              "Engineering Design",
              "Business Analytics"
            ],
            "phone": "+1-179-364-1295x1685",
            "specialization": "Web Development",
            "availability": "Weekdays 9AM-6PM, Weekends by appointment",
            "sessionTypes": [
              "Thesis supervision",
              "Thesis supervision",
              "Capstone project support"
            ],
            "languages": [
              "English",
              "French"
            ],
            "hourlyRate": "14687 XAF/hour",
            "packageDeals": {
              "5sessions": "68,435 XAF (Save 5,000 XAF)",
              "10sessions": "131,870 XAF (Save 15,000 XAF)"
            },
            "studentFeedback": "Very engaging tutor with practical insights and academic depth.",
            "image": "https://i.ibb.co/j9MbGfTm/IMG-20250426-WA0033.jpg"
          },
          {
            "name": "Donna Thompson DDS",
            "role": "Tutor",
            "experience": "6+ years",
            "completedSessions": 200,
            "rating": 5.0,
            "expertise": [
              "AI & Machine Learning",
              "Finance"
            ],
            "phone": "(135)130-5602x037",
            "specialization": "Educational Psychology",
            "availability": "Weekdays 9AM-6PM, Weekends by appointment",
            "sessionTypes": [
              "Thesis supervision",
              "Research guidance",
              "Group sessions"
            ],
            "languages": [
              "English",
              "French"
            ],
            "hourlyRate": "18798 XAF/hour",
            "packageDeals": {
              "5sessions": "88,990 XAF (Save 5,000 XAF)",
              "10sessions": "172,980 XAF (Save 15,000 XAF)"
            },
            "studentFeedback": "Very engaging tutor with practical insights and academic depth.",
            "image": "https://i.ibb.co/VYM8xLp0/Whats-App-Image-2025-06-12-at-16-39-52-eb802d2b.jpg"
          }
        ]
      },
      {
        "program": "M.Sc. in Biochemistry",
        "duration": "2 Years",
        "tuition": "200,000 XAF/year",
        "description": "Advanced coursework and research in biochemical processes.",
        "requirements": [
          "BSc in Biochemistry or related field",
          "Minimum second-class lower division"
        ],
        "applicationProcess": "Apply online with research proposal and academic documents",
        "availableTutors": [
          {
            "name": "Debra Chaney",
            "role": "Lecturer",
            "experience": "10+ years",
            "completedSessions": 205,
            "rating": 4.8,
            "expertise": [
              "Software Engineering",
              "Business Analytics"
            ],
            "phone": "617-439-9708x9627",
            "specialization": "Educational Psychology",
            "availability": "Weekdays 9AM-6PM, Weekends by appointment",
            "sessionTypes": [
              "Group sessions",
              "Group sessions",
              "Thesis supervision"
            ],
            "languages": [
              "English",
              "French"
            ],
            "hourlyRate": "16002 XAF/hour",
            "packageDeals": {
              "5sessions": "75,010 XAF (Save 5,000 XAF)",
              "10sessions": "145,020 XAF (Save 15,000 XAF)"
            },
            "studentFeedback": "Very engaging tutor with practical insights and academic depth.",
            "image": "https://i.ibb.co/j9MbGfTm/IMG-20250426-WA0033.jpg"
          },
          {
            "name": "Stuart Bush DDS",
            "role": "Lecturer",
            "experience": "3+ years",
            "completedSessions": 195,
            "rating": 4.6,
            "expertise": [
              "Educational Psychology",
              "Public Health"
            ],
            "phone": "1558218071",
            "specialization": "Business Analytics",
            "availability": "Weekdays 9AM-6PM, Weekends by appointment",
            "sessionTypes": [
              "Practical labs",
              "Thesis supervision",
              "Exam preparation"
            ],
            "languages": [
              "English",
              "French"
            ],
            "hourlyRate": "12746 XAF/hour",
            "packageDeals": {
              "5sessions": "58,730 XAF (Save 5,000 XAF)",
              "10sessions": "112,460 XAF (Save 15,000 XAF)"
            },
            "studentFeedback": "Very engaging tutor with practical insights and academic depth.",
            "image": "https://i.ibb.co/VYM8xLp0/Whats-App-Image-2025-06-12-at-16-39-52-eb802d2b.jpg"
          },
          {
            "name": "Brianna Hernandez",
            "role": "Research Assistant",
            "experience": "3+ years",
            "completedSessions": 197,
            "rating": 4.2,
            "expertise": [
              "AI & Machine Learning",
              "Business Analytics"
            ],
            "phone": "001-152-306-2843",
            "specialization": "Environmental Policy",
            "availability": "Weekdays 9AM-6PM, Weekends by appointment",
            "sessionTypes": [
              "Capstone project support",
              "One-on-one tutoring",
              "Exam preparation"
            ],
            "languages": [
              "English",
              "French"
            ],
            "hourlyRate": "14039 XAF/hour",
            "packageDeals": {
              "5sessions": "65,195 XAF (Save 5,000 XAF)",
              "10sessions": "125,390 XAF (Save 15,000 XAF)"
            },
            "studentFeedback": "Very engaging tutor with practical insights and academic depth.",
            "image": "https://i.ibb.co/VYM8xLp0/Whats-App-Image-2025-06-12-at-16-39-52-eb802d2b.jpg"
          }
        ]
      },
      {
        "program": "PhD in Applied Zoology",
        "duration": "3-5 Years",
        "tuition": "300,000 XAF/year",
        "description": "Research-based doctoral program in zoological sciences.",
        "requirements": [
          "M.Sc. in Zoology or related discipline",
          "Research proposal",
          "At least one publication"
        ],
        "applicationProcess": "Submit research proposal to the faculty graduate committee",
        "availableTutors": [
          {
            "name": "Ashley Berry",
            "role": "Industry Expert",
            "experience": "8+ years",
            "completedSessions": 284,
            "rating": 4.2,
            "expertise": [
              "Finance",
              "Web Development"
            ],
            "phone": "649.165.8066x51737",
            "specialization": "Public Health",
            "availability": "Weekdays 9AM-6PM, Weekends by appointment",
            "sessionTypes": [
              "Research guidance",
              "Research guidance",
              "Exam preparation"
            ],
            "languages": [
              "English",
              "French"
            ],
            "hourlyRate": "23768 XAF/hour",
            "packageDeals": {
              "5sessions": "113,840 XAF (Save 5,000 XAF)",
              "10sessions": "222,680 XAF (Save 15,000 XAF)"
            },
            "studentFeedback": "Very engaging tutor with practical insights and academic depth.",
            "image": "https://i.ibb.co/j9MbGfTm/IMG-20250426-WA0033.jpg"
          },
          {
            "name": "Steven Parker",
            "role": "Industry Expert",
            "experience": "8+ years",
            "completedSessions": 185,
            "rating": 4.0,
            "expertise": [
              "Business Analytics",
              "AI & Machine Learning"
            ],
            "phone": "745.228.8772x00793",
            "specialization": "Educational Psychology",
            "availability": "Weekdays 9AM-6PM, Weekends by appointment",
            "sessionTypes": [
              "Group sessions",
              "Group sessions",
              "Capstone project support"
            ],
            "languages": [
              "English",
              "French"
            ],
            "hourlyRate": "14825 XAF/hour",
            "packageDeals": {
              "5sessions": "69,125 XAF (Save 5,000 XAF)",
              "10sessions": "133,250 XAF (Save 15,000 XAF)"
            },
            "studentFeedback": "Very engaging tutor with practical insights and academic depth.",
            "image": "https://i.ibb.co/VYM8xLp0/Whats-App-Image-2025-06-12-at-16-39-52-eb802d2b.jpg"
          },
          {
            "name": "Kimberly Salas",
            "role": "Research Assistant",
            "experience": "8+ years",
            "completedSessions": 93,
            "rating": 4.9,
            "expertise": [
              "Educational Psychology",
              "Web Development"
            ],
            "phone": "(537)866-5467x8909",
            "specialization": "Educational Psychology",
            "availability": "Weekdays 9AM-6PM, Weekends by appointment",
            "sessionTypes": [
              "Exam preparation",
              "Thesis supervision",
              "Group sessions"
            ],
            "languages": [
              "English",
              "French"
            ],
            "hourlyRate": "15629 XAF/hour",
            "packageDeals": {
              "5sessions": "73,145 XAF (Save 5,000 XAF)",
              "10sessions": "141,290 XAF (Save 15,000 XAF)"
            },
            "studentFeedback": "Very engaging tutor with practical insights and academic depth.",
            "image": "https://i.ibb.co/V0FBjbpv/Whats-App-Image-2025-06-11-at-14-03-48-6ac66adc.jpg"
          }
        ]
      }
    ]
  },
  {
    "id": "uba_fa",
    "name": "Faculty of Arts (FA)",
    "programs": [
      {
        "program": "B.Sc. Communication and Development Studies",
        "duration": "3 Years",
        "tuition": "150,000 XAF/year",
        "description": "Integrates communication theory with development practices",
        "requirements": [
          "Advanced Level Certificate",
          "Pass in English and Social Sciences"
        ],
        "applicationProcess": "Direct application through faculty office",
        "availableTutors": [
          {
            "name": "Fonyuy Gita",
            "role": "CTO at SEED Inc.",
            "experience": "5+ years",
            "completedSessions": 200,
            "rating": 4.8,
            "expertise": ["Full Stack Web Development", "Machine Learning", "Prompt Engineering"],
            "phone": "+237672792563",
            "specialization": "Digital Communication & Media Technology",
            "availability": "Flexible schedule, 7 days a week",
            "sessionTypes": ["Communication theory", "Digital media projects", "Research methodology"],
            "languages": ["English", "French"],
            "hourlyRate": "18,000 XAF/hour",
            "packageDeals": {
              "5sessions": "85,000 XAF (Save 5,000 XAF)",
              "10sessions": "160,000 XAF (Save 20,000 XAF)"
            },
            "studentFeedback": "Outstanding tutor with deep knowledge of both traditional and digital communication",
            "image": "https://i.ibb.co/VYM8xLp0/Whats-App-Image-2025-06-12-at-16-39-52-eb802d2b.jpg"
          }
        ]
      },
      {
        "program": "PhD in Communication",
        "duration": "3-5 Years",
        "tuition": "300,000 XAF/year",
        "description": "Advanced research in communication theories and development communication",
        "requirements": [
          "Master's degree in Communication or related field",
          "Research proposal",
          "Publications in relevant field"
        ],
        "applicationProcess": "Submit research proposal to department for evaluation",
        "availableTutors": [
          {
            "name": "Fonyuy Gita",
            "role": "CTO at SEED Inc.",
            "experience": "5+ years",
            "completedSessions": 200,
            "rating": 4.8,
            "expertise": ["Full Stack Web Development", "Machine Learning", "Prompt Engineering"],
            "phone": "+237672792563",
            "specialization": "Advanced Research Methods & AI in Communication",
            "availability": "Flexible schedule, 7 days a week",
            "sessionTypes": ["Dissertation guidance", "Research methodology", "Publication support", "Conference preparation"],
            "languages": ["English", "French"],
            "hourlyRate": "25,000 XAF/hour",
            "packageDeals": {
              "5sessions": "120,000 XAF (Save 5,000 XAF)",
              "10sessions": "230,000 XAF (Save 20,000 XAF)"
            },
            "studentFeedback": "Exceptional guidance for PhD students, especially in integrating technology with communication research",
            "image": "https://i.ibb.co/ZpW9TQv4/Whats-App-Image-2025-06-08-at-17-24-19-e7c168f6.jpg"
          }
        ]
      }
    ],
    "location": "Bambili, Bamenda, Cameroon (UBa Campus)",
    "ranking": "N/A",
    "rating": 4.4,
    "image": "https://i.postimg.cc/zXwq5vJH/Whats-App-Image-2025-06-11-at-15-44-47-edbc6100.jpg",
    "description": "Offers humanities programs focusing on languages, communication, history, and cultural studies."
  },
  {
    "id": "uba_fhs",
    "name": "Faculty of Health Sciences (FHS)",
    "location": "Bambili, Bamenda, Cameroon (UBa Campus)",
    "ranking": "N/A",
    "rating": 4.7,
    "image": "https://i.postimg.cc/zXwq5vJH/Whats-App-Image-2025-06-11-at-15-44-47-edbc6100.jpg",
    "description": "Training healthcare professionals in nursing, biomedical sciences, and public health.",
    "programs": [
      {
        "program": "BSc in Biomedical Sciences",
        "duration": "4 Years",
        "tuition": "300,000 XAF/year",
        "description": "Comprehensive training in biomedical science for clinical and research careers.",
        "requirements": [
          "Advanced Level in Biology and Chemistry",
          "English Language proficiency"
        ],
        "applicationProcess": "Submit documents online via UBa application portal",
        "availableTutors": [
          {
            "name": "Judith Franklin",
            "role": "Lecturer",
            "experience": "4+ years",
            "completedSessions": 78,
            "rating": 4.5,
            "expertise": [
              "Environmental Policy",
              "Educational Psychology"
            ],
            "phone": "001-640-002-5671x71086",
            "specialization": "Software Engineering",
            "availability": "Weekdays 9AM-6PM, Weekends by appointment",
            "sessionTypes": [
              "Capstone project support",
              "Exam preparation",
              "Presentation coaching"
            ],
            "languages": [
              "English",
              "French"
            ],
            "hourlyRate": "19316 XAF/hour",
            "packageDeals": {
              "5sessions": "91,580 XAF (Save 5,000 XAF)",
              "10sessions": "178,160 XAF (Save 15,000 XAF)"
            },
            "studentFeedback": "Very engaging tutor with practical insights and academic depth.",
            "image": "https://i.ibb.co/V0FBjbpv/Whats-App-Image-2025-06-11-at-14-03-48-6ac66adc.jpg"
          },
          {
            "name": "Kenneth Lewis",
            "role": "Research Assistant",
            "experience": "6+ years",
            "completedSessions": 222,
            "rating": 4.6,
            "expertise": [
              "Educational Psychology",
              "Research Methods"
            ],
            "phone": "001-111-005-7026x90721",
            "specialization": "Educational Psychology",
            "availability": "Weekdays 9AM-6PM, Weekends by appointment",
            "sessionTypes": [
              "Exam preparation",
              "Research guidance",
              "Research guidance"
            ],
            "languages": [
              "English",
              "French"
            ],
            "hourlyRate": "22123 XAF/hour",
            "packageDeals": {
              "5sessions": "105,615 XAF (Save 5,000 XAF)",
              "10sessions": "206,230 XAF (Save 15,000 XAF)"
            },
            "studentFeedback": "Very engaging tutor with practical insights and academic depth.",
            "image": "https://i.ibb.co/ZpW9TQv4/Whats-App-Image-2025-06-08-at-17-24-19-e7c168f6.jpg"
          }
        ]
      },
      {
        "program": "PhD in Public Health (Specialisation: Public Health Policy and Administration)",
        "duration": "3-5 Years",
        "tuition": "350,000 XAF/year",
        "description": "Doctoral research in public health systems and policy development.",
        "requirements": [
          "Master's in Public Health or related field",
          "Research proposal",
          "At least one publication"
        ],
        "applicationProcess": "Apply through postgraduate directorate with full proposal",
        "availableTutors": [
          {
            "name": "Brittany Rogers",
            "role": "Industry Expert",
            "experience": "7+ years",
            "completedSessions": 80,
            "rating": 3.8,
            "expertise": [
              "Public Health",
              "AI & Machine Learning"
            ],
            "phone": "(812)986-6797x418",
            "specialization": "Research Methods",
            "availability": "Weekdays 9AM-6PM, Weekends by appointment",
            "sessionTypes": [
              "One-on-one tutoring",
              "Practical labs",
              "Group sessions"
            ],
            "languages": [
              "English",
              "French"
            ],
            "hourlyRate": "19341 XAF/hour",
            "packageDeals": {
              "5sessions": "91,705 XAF (Save 5,000 XAF)",
              "10sessions": "178,410 XAF (Save 15,000 XAF)"
            },
            "studentFeedback": "Very engaging tutor with practical insights and academic depth.",
            "image": "https://i.ibb.co/ZpW9TQv4/Whats-App-Image-2025-06-08-at-17-24-19-e7c168f6.jpg"
          },
          {
            "name": "Lisa Russell",
            "role": "Lecturer",
            "experience": "2+ years",
            "completedSessions": 148,
            "rating": 4.3,
            "expertise": [
              "AI & Machine Learning",
              "AI & Machine Learning"
            ],
            "phone": "297.462.2644x8588",
            "specialization": "Business Analytics",
            "availability": "Weekdays 9AM-6PM, Weekends by appointment",
            "sessionTypes": [
              "Thesis supervision",
              "Thesis supervision",
              "Exam preparation"
            ],
            "languages": [
              "English",
              "French"
            ],
            "hourlyRate": "19058 XAF/hour",
            "packageDeals": {
              "5sessions": "90,290 XAF (Save 5,000 XAF)",
              "10sessions": "175,580 XAF (Save 15,000 XAF)"
            },
            "studentFeedback": "Very engaging tutor with practical insights and academic depth.",
            "image": "https://i.ibb.co/V0FBjbpv/Whats-App-Image-2025-06-11-at-14-03-48-6ac66adc.jpg"
          }
        ]
      }
    ]
  },
  {
  "id": "uba_flps",
  "name": "Faculty of Law and Political Science (FLPS)",
  "programs": [
    {
        "program": "LLM in Business Law",
        "duration": "2 Years",
        "tuition": "280,000 XAF/year",
        "description": "In-depth legal training in corporate and business law principles.",
        "requirements": [
          "Bachelor\u2019s degree in Law",
          "English proficiency",
          "Motivation letter"
        ],
        "applicationProcess": "Submit documents to FLPS admission office",
        "availableTutors": [
          {
            "name": "Julia Cummings",
            "role": "Industry Expert",
            "experience": "4+ years",
            "completedSessions": 27,
            "rating": 3.9,
            "expertise": [
              "Software Engineering",
              "Public Health"
            ],
            "phone": "+1-651-344-2390x774",
            "specialization": "Software Engineering",
            "availability": "Weekdays 9AM-6PM, Weekends by appointment",
            "sessionTypes": [
              "Presentation coaching",
              "Practical labs",
              "Practical labs"
            ],
            "languages": [
              "English",
              "French"
            ],
            "hourlyRate": "17425 XAF/hour",
            "packageDeals": {
              "5sessions": "82,125 XAF (Save 5,000 XAF)",
              "10sessions": "159,250 XAF (Save 15,000 XAF)"
            },
            "studentFeedback": "Very engaging tutor with practical insights and academic depth.",
            "image": "https://i.ibb.co/V0FBjbpv/Whats-App-Image-2025-06-11-at-14-03-48-6ac66adc.jpg"
          },
          {
            "name": "Daniel Hernandez",
            "role": "Tutor",
            "experience": "10+ years",
            "completedSessions": 52,
            "rating": 4.2,
            "expertise": [
              "Public Health",
              "Project Management"
            ],
            "phone": "001-815-116-0347",
            "specialization": "Research Methods",
            "availability": "Weekdays 9AM-6PM, Weekends by appointment",
            "sessionTypes": [
              "One-on-one tutoring",
              "Capstone project support",
              "Practical labs"
            ],
            "languages": [
              "English",
              "French"
            ],
            "hourlyRate": "15970 XAF/hour",
            "packageDeals": {
              "5sessions": "74,850 XAF (Save 5,000 XAF)",
              "10sessions": "144,700 XAF (Save 15,000 XAF)"
            },
            "studentFeedback": "Very engaging tutor with practical insights and academic depth.",
            "image": "https://i.ibb.co/ZpW9TQv4/Whats-App-Image-2025-06-08-at-17-24-19-e7c168f6.jpg"
          }
        ]
      },
      {
        "program": "PhD in Political Science",
        "duration": "3-5 Years",
        "tuition": "300,000 XAF/year",
        "description": "Doctorate in political theory, policy analysis, and international affairs.",
        "requirements": [
          "Master\u2019s in Political Science",
          "Research proposal",
          "Academic references"
        ],
        "applicationProcess": "Submit application with proposal and academic CV",
        "availableTutors": [
          {
            "name": "Elizabeth Smith",
            "role": "Research Assistant",
            "experience": "8+ years",
            "completedSessions": 83,
            "rating": 4.7,
            "expertise": [
              "Software Engineering",
              "Embedded Systems"
            ],
            "phone": "+1-335-487-2842x6471",
            "specialization": "Public Health",
            "availability": "Weekdays 9AM-6PM, Weekends by appointment",
            "sessionTypes": [
              "Capstone project support",
              "Research guidance",
              "Practical labs"
            ],
            "languages": [
              "English",
              "French"
            ],
            "hourlyRate": "15263 XAF/hour",
            "packageDeals": {
              "5sessions": "71,315 XAF (Save 5,000 XAF)",
              "10sessions": "137,630 XAF (Save 15,000 XAF)"
            },
            "studentFeedback": "Very engaging tutor with practical insights and academic depth.",
            "image": "https://i.ibb.co/XxbBHnX4/Whats-App-Image-2025-06-08-at-17-24-24-e4f793ed.jpg"
          },
          {
            "name": "Lindsay Warner",
            "role": "Research Assistant",
            "experience": "4+ years",
            "completedSessions": 254,
            "rating": 4.0,
            "expertise": [
              "AI & Machine Learning",
              "Web Development"
            ],
            "phone": "(117)260-4373x99501",
            "specialization": "Communication",
            "availability": "Weekdays 9AM-6PM, Weekends by appointment",
            "sessionTypes": [
              "Exam preparation",
              "Thesis supervision",
              "One-on-one tutoring"
            ],
            "languages": [
              "English",
              "French"
            ],
            "hourlyRate": "19389 XAF/hour",
            "packageDeals": {
              "5sessions": "91,945 XAF (Save 5,000 XAF)",
              "10sessions": "178,890 XAF (Save 15,000 XAF)"
            },
            "studentFeedback": "Very engaging tutor with practical insights and academic depth.",
            "image": "https://i.ibb.co/XxbBHnX4/Whats-App-Image-2025-06-08-at-17-24-24-e4f793ed.jpg"
          }
        ]
      },
    {
      "program": "Bachelor of Laws (LLB) in English Private Law",
      "duration": "3 Years",
      "tuition": "150,000 XAF/year",
      "description": "Provides comprehensive training in English private law, preparing students for legal practice and further studies.",
      "requirements": [
        "GCE O-Level with at least 5 subjects including English Language",
        "GCE A-Level with at least 2 subjects excluding Religious Studies"
      ],
      "applicationProcess": "Submit application through UBa Admissions portal; selection based on academic qualifications.",
       "availableTutors": [
          {
            "name": "Julia Cummings",
            "role": "Industry Expert",
            "experience": "4+ years",
            "completedSessions": 27,
            "rating": 3.9,
            "expertise": [
              "Software Engineering",
              "Public Health"
            ],
            "phone": "+1-651-344-2390x774",
            "specialization": "Software Engineering",
            "availability": "Weekdays 9AM-6PM, Weekends by appointment",
            "sessionTypes": [
              "Presentation coaching",
              "Practical labs",
              "Practical labs"
            ],
            "languages": [
              "English",
              "French"
            ],
            "hourlyRate": "17425 XAF/hour",
            "packageDeals": {
              "5sessions": "82,125 XAF (Save 5,000 XAF)",
              "10sessions": "159,250 XAF (Save 15,000 XAF)"
            },
            "studentFeedback": "Very engaging tutor with practical insights and academic depth.",
            "image": "https://i.ibb.co/XxbBHnX4/Whats-App-Image-2025-06-08-at-17-24-24-e4f793ed.jpg"
          },
          {
            "name": "Daniel Hernandez",
            "role": "Tutor",
            "experience": "10+ years",
            "completedSessions": 52,
            "rating": 4.2,
            "expertise": [
              "Public Health",
              "Project Management"
            ],
            "phone": "001-815-116-0347",
            "specialization": "Research Methods",
            "availability": "Weekdays 9AM-6PM, Weekends by appointment",
            "sessionTypes": [
              "One-on-one tutoring",
              "Capstone project support",
              "Practical labs"
            ],
            "languages": [
              "English",
              "French"
            ],
            "hourlyRate": "15970 XAF/hour",
            "packageDeals": {
              "5sessions": "74,850 XAF (Save 5,000 XAF)",
              "10sessions": "144,700 XAF (Save 15,000 XAF)"
            },
            "studentFeedback": "Very engaging tutor with practical insights and academic depth.",
            "image": "https://i.ibb.co/ZpW9TQv4/Whats-App-Image-2025-06-08-at-17-24-19-e7c168f6.jpg"
          }
        ]
    },
    {
      "program": "Bachelor of Laws (LLB) in French Private Law",
      "duration": "3 Years",
      "tuition": "150,000 XAF/year",
      "description": "Offers in-depth knowledge of French private law, suitable for careers in legal professions within civil law jurisdictions.",
      "requirements": [
        "Baccalaureate or equivalent qualification"
      ],
      "applicationProcess": "Submit application through UBa Admissions portal; selection based on academic qualifications.",
       "availableTutors": [
          {
            "name": "Julia Cummings",
            "role": "Industry Expert",
            "experience": "4+ years",
            "completedSessions": 27,
            "rating": 3.9,
            "expertise": [
              "Software Engineering",
              "Public Health"
            ],
            "phone": "+1-651-344-2390x774",
            "specialization": "Software Engineering",
            "availability": "Weekdays 9AM-6PM, Weekends by appointment",
            "sessionTypes": [
              "Presentation coaching",
              "Practical labs",
              "Practical labs"
            ],
            "languages": [
              "English",
              "French"
            ],
            "hourlyRate": "17425 XAF/hour",
            "packageDeals": {
              "5sessions": "82,125 XAF (Save 5,000 XAF)",
              "10sessions": "159,250 XAF (Save 15,000 XAF)"
            },
            "studentFeedback": "Very engaging tutor with practical insights and academic depth.",
            "image": "https://i.ibb.co/8L3kkC4f/Whats-App-Image-2025-06-09-at-08-13-08-070c5c42.jpg"
          },
          {
            "name": "Daniel Hernandez",
            "role": "Tutor",
            "experience": "10+ years",
            "completedSessions": 52,
            "rating": 4.2,
            "expertise": [
              "Public Health",
              "Project Management"
            ],
            "phone": "001-815-116-0347",
            "specialization": "Research Methods",
            "availability": "Weekdays 9AM-6PM, Weekends by appointment",
            "sessionTypes": [
              "One-on-one tutoring",
              "Capstone project support",
              "Practical labs"
            ],
            "languages": [
              "English",
              "French"
            ],
            "hourlyRate": "15970 XAF/hour",
            "packageDeals": {
              "5sessions": "74,850 XAF (Save 5,000 XAF)",
              "10sessions": "144,700 XAF (Save 15,000 XAF)"
            },
            "studentFeedback": "Very engaging tutor with practical insights and academic depth.",
            "image": "https://i.ibb.co/ZpW9TQv4/Whats-App-Image-2025-06-08-at-17-24-19-e7c168f6.jpg"
          }
        ]
    },
    {
      "program": "Bachelor of Laws (LLB) in Public Law",
      "duration": "3 Years",
      "tuition": "150,000 XAF/year",
      "description": "Focuses on the principles and structures of public law, including constitutional and administrative law.",
      "requirements": [
        "GCE O-Level with at least 5 subjects including English Language",
        "GCE A-Level with at least 2 subjects excluding Religious Studies"
      ],
      "applicationProcess": "Submit application through UBa Admissions portal; selection based on academic qualifications.",
       "availableTutors": [
          {
            "name": "Julia Cummings",
            "role": "Industry Expert",
            "experience": "4+ years",
            "completedSessions": 27,
            "rating": 3.9,
            "expertise": [
              "Software Engineering",
              "Public Health"
            ],
            "phone": "+1-651-344-2390x774",
            "specialization": "Software Engineering",
            "availability": "Weekdays 9AM-6PM, Weekends by appointment",
            "sessionTypes": [
              "Presentation coaching",
              "Practical labs",
              "Practical labs"
            ],
            "languages": [
              "English",
              "French"
            ],
            "hourlyRate": "17425 XAF/hour",
            "packageDeals": {
              "5sessions": "82,125 XAF (Save 5,000 XAF)",
              "10sessions": "159,250 XAF (Save 15,000 XAF)"
            },
            "studentFeedback": "Very engaging tutor with practical insights and academic depth.",
            "image": "https://i.ibb.co/8L3kkC4f/Whats-App-Image-2025-06-09-at-08-13-08-070c5c42.jpg"
          },
          {
            "name": "Daniel Hernandez",
            "role": "Tutor",
            "experience": "10+ years",
            "completedSessions": 52,
            "rating": 4.2,
            "expertise": [
              "Public Health",
              "Project Management"
            ],
            "phone": "001-815-116-0347",
            "specialization": "Research Methods",
            "availability": "Weekdays 9AM-6PM, Weekends by appointment",
            "sessionTypes": [
              "One-on-one tutoring",
              "Capstone project support",
              "Practical labs"
            ],
            "languages": [
              "English",
              "French"
            ],
            "hourlyRate": "15970 XAF/hour",
            "packageDeals": {
              "5sessions": "74,850 XAF (Save 5,000 XAF)",
              "10sessions": "144,700 XAF (Save 15,000 XAF)"
            },
            "studentFeedback": "Very engaging tutor with practical insights and academic depth.",
            "image": "https://i.ibb.co/hRPQtqhf/Whats-App-Image-2025-06-08-at-17-24-24-34013b89.jpg"
          }
        ]
    },
    {
      "program": "Bachelor of Science (BSc) in Political Science",
      "duration": "3 Years",
      "tuition": "150,000 XAF/year",
      "description": "Explores political systems, theories, and practices, preparing students for roles in governance, policy analysis, and international relations.",
      "requirements": [
        "GCE O-Level with at least 5 subjects including English Language",
        "GCE A-Level with at least 2 subjects excluding Religious Studies"
      ],
      "applicationProcess": "Submit application through UBa Admissions portal; selection based on academic qualifications.",
       "availableTutors": [
          {
            "name": "Julia Cummings",
            "role": "Industry Expert",
            "experience": "4+ years",
            "completedSessions": 27,
            "rating": 3.9,
            "expertise": [
              "Software Engineering",
              "Public Health"
            ],
            "phone": "+1-651-344-2390x774",
            "specialization": "Software Engineering",
            "availability": "Weekdays 9AM-6PM, Weekends by appointment",
            "sessionTypes": [
              "Presentation coaching",
              "Practical labs",
              "Practical labs"
            ],
            "languages": [
              "English",
              "French"
            ],
            "hourlyRate": "17425 XAF/hour",
            "packageDeals": {
              "5sessions": "82,125 XAF (Save 5,000 XAF)",
              "10sessions": "159,250 XAF (Save 15,000 XAF)"
            },
            "studentFeedback": "Very engaging tutor with practical insights and academic depth.",
            "image": "https://i.ibb.co/8L3kkC4f/Whats-App-Image-2025-06-09-at-08-13-08-070c5c42.jpg"
          },
          {
            "name": "Daniel Hernandez",
            "role": "Tutor",
            "experience": "10+ years",
            "completedSessions": 52,
            "rating": 4.2,
            "expertise": [
              "Public Health",
              "Project Management"
            ],
            "phone": "001-815-116-0347",
            "specialization": "Research Methods",
            "availability": "Weekdays 9AM-6PM, Weekends by appointment",
            "sessionTypes": [
              "One-on-one tutoring",
              "Capstone project support",
              "Practical labs"
            ],
            "languages": [
              "English",
              "French"
            ],
            "hourlyRate": "15970 XAF/hour",
            "packageDeals": {
              "5sessions": "74,850 XAF (Save 5,000 XAF)",
              "10sessions": "144,700 XAF (Save 15,000 XAF)"
            },
            "studentFeedback": "Very engaging tutor with practical insights and academic depth.",
            "image": "https://i.ibb.co/hRPQtqhf/Whats-App-Image-2025-06-08-at-17-24-24-34013b89.jpg"
          }
        ]
    },
    {
      "program": "Master of Laws (LLM) in English Private Law",
      "duration": "2 Years",
      "tuition": "200,000 XAF/year",
      "description": "Advanced study in English private law, enhancing legal expertise for professional practice or academic careers.",
      "requirements": [
        "Bachelor of Laws (LLB) or equivalent degree in Law"
      ],
      "applicationProcess": "Submit application through UBa Admissions portal; selection based on academic qualifications.",
       "availableTutors": [
          {
            "name": "Julia Cummings",
            "role": "Industry Expert",
            "experience": "4+ years",
            "completedSessions": 27,
            "rating": 3.9,
            "expertise": [
              "Software Engineering",
              "Public Health"
            ],
            "phone": "+1-651-344-2390x774",
            "specialization": "Software Engineering",
            "availability": "Weekdays 9AM-6PM, Weekends by appointment",
            "sessionTypes": [
              "Presentation coaching",
              "Practical labs",
              "Practical labs"
            ],
            "languages": [
              "English",
              "French"
            ],
            "hourlyRate": "17425 XAF/hour",
            "packageDeals": {
              "5sessions": "82,125 XAF (Save 5,000 XAF)",
              "10sessions": "159,250 XAF (Save 15,000 XAF)"
            },
            "studentFeedback": "Very engaging tutor with practical insights and academic depth.",
            "image": "https://i.ibb.co/XxbBHnX4/Whats-App-Image-2025-06-08-at-17-24-24-e4f793ed.jpg"
          },
          {
            "name": "Daniel Hernandez",
            "role": "Tutor",
            "experience": "10+ years",
            "completedSessions": 52,
            "rating": 4.2,
            "expertise": [
              "Public Health",
              "Project Management"
            ],
            "phone": "001-815-116-0347",
            "specialization": "Research Methods",
            "availability": "Weekdays 9AM-6PM, Weekends by appointment",
            "sessionTypes": [
              "One-on-one tutoring",
              "Capstone project support",
              "Practical labs"
            ],
            "languages": [
              "English",
              "French"
            ],
            "hourlyRate": "15970 XAF/hour",
            "packageDeals": {
              "5sessions": "74,850 XAF (Save 5,000 XAF)",
              "10sessions": "144,700 XAF (Save 15,000 XAF)"
            },
            "studentFeedback": "Very engaging tutor with practical insights and academic depth.",
            "image": "https://i.ibb.co/hRPQtqhf/Whats-App-Image-2025-06-08-at-17-24-24-34013b89.jpg"
          }
        ]
    },
    {
      "program": "Master of Laws (LLM) in Public Law",
      "duration": "2 Years",
      "tuition": "200,000 XAF/year",
      "description": "Provides specialized knowledge in public law, focusing on constitutional, administrative, and international public law.",
      "requirements": [
        "Bachelor of Laws (LLB) or equivalent degree in Law"
      ],
      "applicationProcess": "Submit application through UBa Admissions portal; selection based on academic qualifications.",
      "availableTutors": [
          {
            "name": "Elizabeth Smith",
            "role": "Research Assistant",
            "experience": "8+ years",
            "completedSessions": 83,
            "rating": 4.7,
            "expertise": [
              "Software Engineering",
              "Embedded Systems"
            ],
            "phone": "+1-335-487-2842x6471",
            "specialization": "Public Health",
            "availability": "Weekdays 9AM-6PM, Weekends by appointment",
            "sessionTypes": [
              "Capstone project support",
              "Research guidance",
              "Practical labs"
            ],
            "languages": [
              "English",
              "French"
            ],
            "hourlyRate": "15263 XAF/hour",
            "packageDeals": {
              "5sessions": "71,315 XAF (Save 5,000 XAF)",
              "10sessions": "137,630 XAF (Save 15,000 XAF)"
            },
            "studentFeedback": "Very engaging tutor with practical insights and academic depth.",
            "image": "https://i.ibb.co/XxbBHnX4/Whats-App-Image-2025-06-08-at-17-24-24-e4f793ed.jpg"
          },
          {
            "name": "Lindsay Warner",
            "role": "Research Assistant",
            "experience": "4+ years",
            "completedSessions": 254,
            "rating": 4.0,
            "expertise": [
              "AI & Machine Learning",
              "Web Development"
            ],
            "phone": "(117)260-4373x99501",
            "specialization": "Communication",
            "availability": "Weekdays 9AM-6PM, Weekends by appointment",
            "sessionTypes": [
              "Exam preparation",
              "Thesis supervision",
              "One-on-one tutoring"
            ],
            "languages": [
              "English",
              "French"
            ],
            "hourlyRate": "19389 XAF/hour",
            "packageDeals": {
              "5sessions": "91,945 XAF (Save 5,000 XAF)",
              "10sessions": "178,890 XAF (Save 15,000 XAF)"
            },
            "studentFeedback": "Very engaging tutor with practical insights and academic depth.",
            "image": "https://i.ibb.co/vvmwHDSg/Whats-App-Image-2025-06-08-at-17-24-20-4beb0571.jpg"
          }
        ]
    },
    {
      "program": "Master of Science (MSc) in Comparative Politics",
      "duration": "2 Years",
      "tuition": "200,000 XAF/year",
      "description": "Analyzes political systems and behaviors across different countries, fostering comparative analytical skills.",
      "requirements": [
        "Bachelor of Science (BSc) in Political Science or related field"
      ],
      "applicationProcess": "Submit application through UBa Admissions portal; selection based on academic qualifications.",
       "availableTutors": [
          {
            "name": "Julia Cummings",
            "role": "Industry Expert",
            "experience": "4+ years",
            "completedSessions": 27,
            "rating": 3.9,
            "expertise": [
              "Software Engineering",
              "Public Health"
            ],
            "phone": "+1-651-344-2390x774",
            "specialization": "Software Engineering",
            "availability": "Weekdays 9AM-6PM, Weekends by appointment",
            "sessionTypes": [
              "Presentation coaching",
              "Practical labs",
              "Practical labs"
            ],
            "languages": [
              "English",
              "French"
            ],
            "hourlyRate": "17425 XAF/hour",
            "packageDeals": {
              "5sessions": "82,125 XAF (Save 5,000 XAF)",
              "10sessions": "159,250 XAF (Save 15,000 XAF)"
            },
            "studentFeedback": "Very engaging tutor with practical insights and academic depth.",
            "image": "https://i.ibb.co/vvmwHDSg/Whats-App-Image-2025-06-08-at-17-24-20-4beb0571.jpg"
          },
          {
            "name": "Daniel Hernandez",
            "role": "Tutor",
            "experience": "10+ years",
            "completedSessions": 52,
            "rating": 4.2,
            "expertise": [
              "Public Health",
              "Project Management"
            ],
            "phone": "001-815-116-0347",
            "specialization": "Research Methods",
            "availability": "Weekdays 9AM-6PM, Weekends by appointment",
            "sessionTypes": [
              "One-on-one tutoring",
              "Capstone project support",
              "Practical labs"
            ],
            "languages": [
              "English",
              "French"
            ],
            "hourlyRate": "15970 XAF/hour",
            "packageDeals": {
              "5sessions": "74,850 XAF (Save 5,000 XAF)",
              "10sessions": "144,700 XAF (Save 15,000 XAF)"
            },
            "studentFeedback": "Very engaging tutor with practical insights and academic depth.",
            "image": "https://ibb.co/7xym44YRhttps://i.ibb.co/Txwqrz5C/Whats-App-Image-2025-06-08-at-17-24-21-15d2bf3a.jpg"
          }
        ]
    },
    {
      "program": "Master of Science (MSc) in Public Administration and Public Policy",
      "duration": "2 Years",
      "tuition": "200,000 XAF/year",
      "description": "Focuses on the principles and practices of public administration and policy-making processes.",
      "requirements": [
        "Bachelor of Science (BSc) in Political Science or related field"
      ],
      "applicationProcess": "Submit application through UBa Admissions portal; selection based on academic qualifications.",
      "availableTutors": [
          {
            "name": "Elizabeth Smith",
            "role": "Research Assistant",
            "experience": "8+ years",
            "completedSessions": 83,
            "rating": 4.7,
            "expertise": [
              "Software Engineering",
              "Embedded Systems"
            ],
            "phone": "+1-335-487-2842x6471",
            "specialization": "Public Health",
            "availability": "Weekdays 9AM-6PM, Weekends by appointment",
            "sessionTypes": [
              "Capstone project support",
              "Research guidance",
              "Practical labs"
            ],
            "languages": [
              "English",
              "French"
            ],
            "hourlyRate": "15263 XAF/hour",
            "packageDeals": {
              "5sessions": "71,315 XAF (Save 5,000 XAF)",
              "10sessions": "137,630 XAF (Save 15,000 XAF)"
            },
            "studentFeedback": "Very engaging tutor with practical insights and academic depth.",
            "image": "https://i.ibb.co/vvmwHDSg/Whats-App-Image-2025-06-08-at-17-24-20-4beb0571.jpg"
          },
          {
            "name": "Lindsay Warner",
            "role": "Research Assistant",
            "experience": "4+ years",
            "completedSessions": 254,
            "rating": 4.0,
            "expertise": [
              "AI & Machine Learning",
              "Web Development"
            ],
            "phone": "(117)260-4373x99501",
            "specialization": "Communication",
            "availability": "Weekdays 9AM-6PM, Weekends by appointment",
            "sessionTypes": [
              "Exam preparation",
              "Thesis supervision",
              "One-on-one tutoring"
            ],
            "languages": [
              "English",
              "French"
            ],
            "hourlyRate": "19389 XAF/hour",
            "packageDeals": {
              "5sessions": "91,945 XAF (Save 5,000 XAF)",
              "10sessions": "178,890 XAF (Save 15,000 XAF)"
            },
            "studentFeedback": "Very engaging tutor with practical insights and academic depth.",
            "image": "https://i.ibb.co/1Yms3BZW/Whats-App-Image-2025-06-11-at-14-06-04-4123d34e.jpg"
          }
        ]
    },
    {
      "program": "Master of Science (MSc) in International Relations and Strategic Studies",
      "duration": "2 Years",
      "tuition": "200,000 XAF/year",
      "description": "Examines global political dynamics, diplomacy, and strategic decision-making processes.",
      "requirements": [
        "Bachelor of Science (BSc) in Political Science or related field"
      ],
      "applicationProcess": "Submit application through UBa Admissions portal; selection based on academic qualifications.",
      "availableTutors": [
          {
            "name": "Elizabeth Smith",
            "role": "Research Assistant",
            "experience": "8+ years",
            "completedSessions": 83,
            "rating": 4.7,
            "expertise": [
              "Software Engineering",
              "Embedded Systems"
            ],
            "phone": "+1-335-487-2842x6471",
            "specialization": "Public Health",
            "availability": "Weekdays 9AM-6PM, Weekends by appointment",
            "sessionTypes": [
              "Capstone project support",
              "Research guidance",
              "Practical labs"
            ],
            "languages": [
              "English",
              "French"
            ],
            "hourlyRate": "15263 XAF/hour",
            "packageDeals": {
              "5sessions": "71,315 XAF (Save 5,000 XAF)",
              "10sessions": "137,630 XAF (Save 15,000 XAF)"
            },
            "studentFeedback": "Very engaging tutor with practical insights and academic depth.",
            "image": "https://i.ibb.co/1Yms3BZW/Whats-App-Image-2025-06-11-at-14-06-04-4123d34e.jpg"
          },
          {
            "name": "Lindsay Warner",
            "role": "Research Assistant",
            "experience": "4+ years",
            "completedSessions": 254,
            "rating": 4.0,
            "expertise": [
              "AI & Machine Learning",
              "Web Development"
            ],
            "phone": "(117)260-4373x99501",
            "specialization": "Communication",
            "availability": "Weekdays 9AM-6PM, Weekends by appointment",
            "sessionTypes": [
              "Exam preparation",
              "Thesis supervision",
              "One-on-one tutoring"
            ],
            "languages": [
              "English",
              "French"
            ],
            "hourlyRate": "19389 XAF/hour",
            "packageDeals": {
              "5sessions": "91,945 XAF (Save 5,000 XAF)",
              "10sessions": "178,890 XAF (Save 15,000 XAF)"
            },
            "studentFeedback": "Very engaging tutor with practical insights and academic depth.",
            "image": "https://i.ibb.co/1Yms3BZW/Whats-App-Image-2025-06-11-at-14-06-04-4123d34e.jpg"
          }
        ]
    },
    {
      "program": "Professional Master in Public Policy and Public Administration",
      "duration": "2 Years",
      "tuition": "250,000 XAF/year",
      "description": "Designed for professionals aiming to enhance their skills in policy analysis and public sector management.",
      "requirements": [
        "Bachelor’s Degree in any relevant field"
      ],
      "applicationProcess": "Submit application through UBa Admissions portal; selection based on academic qualifications.",
       "availableTutors": [
          {
            "name": "Julia Cummings",
            "role": "Industry Expert",
            "experience": "4+ years",
            "completedSessions": 27,
            "rating": 3.9,
            "expertise": [
              "Software Engineering",
              "Public Health"
            ],
            "phone": "+1-651-344-2390x774",
            "specialization": "Software Engineering",
            "availability": "Weekdays 9AM-6PM, Weekends by appointment",
            "sessionTypes": [
              "Presentation coaching",
              "Practical labs",
              "Practical labs"
            ],
            "languages": [
              "English",
              "French"
            ],
            "hourlyRate": "17425 XAF/hour",
            "packageDeals": {
              "5sessions": "82,125 XAF (Save 5,000 XAF)",
              "10sessions": "159,250 XAF (Save 15,000 XAF)"
            },
            "studentFeedback": "Very engaging tutor with practical insights and academic depth.",
            "image": "https://i.ibb.co/1Yms3BZW/Whats-App-Image-2025-06-11-at-14-06-04-4123d34e.jpg"
          },
          {
            "name": "Daniel Hernandez",
            "role": "Tutor",
            "experience": "10+ years",
            "completedSessions": 52,
            "rating": 4.2,
            "expertise": [
              "Public Health",
              "Project Management"
            ],
            "phone": "001-815-116-0347",
            "specialization": "Research Methods",
            "availability": "Weekdays 9AM-6PM, Weekends by appointment",
            "sessionTypes": [
              "One-on-one tutoring",
              "Capstone project support",
              "Practical labs"
            ],
            "languages": [
              "English",
              "French"
            ],
            "hourlyRate": "15970 XAF/hour",
            "packageDeals": {
              "5sessions": "74,850 XAF (Save 5,000 XAF)",
              "10sessions": "144,700 XAF (Save 15,000 XAF)"
            },
            "studentFeedback": "Very engaging tutor with practical insights and academic depth.",
            "image": "https://i.ibb.co/Txwqrz5C/Whats-App-Image-2025-06-08-at-17-24-21-15d2bf3a.jpg"
          }
        ]
    },
    {
      "program": "Professional Master in Negotiation, Mediation and Peace Building",
      "duration": "2 Years",
      "tuition": "250,000 XAF/year",
      "description": "Equips students with skills in conflict resolution, negotiation, and peacebuilding strategies.",
      "requirements": [
        "Bachelor’s Degree in any relevant field"
      ],
      "applicationProcess": "Submit application through UBa Admissions portal; selection based on academic qualifications.",
      "availableTutors": [
          {
            "name": "Elizabeth Smith",
            "role": "Research Assistant",
            "experience": "8+ years",
            "completedSessions": 83,
            "rating": 4.7,
            "expertise": [
              "Software Engineering",
              "Embedded Systems"
            ],
            "phone": "+1-335-487-2842x6471",
            "specialization": "Public Health",
            "availability": "Weekdays 9AM-6PM, Weekends by appointment",
            "sessionTypes": [
              "Capstone project support",
              "Research guidance",
              "Practical labs"
            ],
            "languages": [
              "English",
              "French"
            ],
            "hourlyRate": "15263 XAF/hour",
            "packageDeals": {
              "5sessions": "71,315 XAF (Save 5,000 XAF)",
              "10sessions": "137,630 XAF (Save 15,000 XAF)"
            },
            "studentFeedback": "Very engaging tutor with practical insights and academic depth.",
            "image": "https://i.ibb.co/yFQtgVpT/Whats-App-Image-2025-06-08-at-17-24-17-5881b625.jpg"
          },
          {
            "name": "Lindsay Warner",
            "role": "Research Assistant",
            "experience": "4+ years",
            "completedSessions": 254,
            "rating": 4.0,
            "expertise": [
              "AI & Machine Learning",
              "Web Development"
            ],
            "phone": "(117)260-4373x99501",
            "specialization": "Communication",
            "availability": "Weekdays 9AM-6PM, Weekends by appointment",
            "sessionTypes": [
              "Exam preparation",
              "Thesis supervision",
              "One-on-one tutoring"
            ],
            "languages": [
              "English",
              "French"
            ],
            "hourlyRate": "19389 XAF/hour",
            "packageDeals": {
              "5sessions": "91,945 XAF (Save 5,000 XAF)",
              "10sessions": "178,890 XAF (Save 15,000 XAF)"
            },
            "studentFeedback": "Very engaging tutor with practical insights and academic depth.",
            "image": "https://i.ibb.co/yFQtgVpT/Whats-App-Image-2025-06-08-at-17-24-17-5881b625.jpg"
          }
        ]
    },
    {
      "program": "Conversion Master in English Private Law",
      "duration": "1 Year",
      "tuition": "200,000 XAF/year",
      "description": "For professionals seeking to transition into English private law, providing foundational legal knowledge.",
      "requirements": [
        "Professional Master Degree in Law or equivalent qualification"
      ],
      "applicationProcess": "Submit application through UBa Admissions portal; selection based on academic qualifications.",
       "availableTutors": [
          {
            "name": "Julia Cummings",
            "role": "Industry Expert",
            "experience": "4+ years",
            "completedSessions": 27,
            "rating": 3.9,
            "expertise": [
              "Software Engineering",
              "Public Health"
            ],
            "phone": "+1-651-344-2390x774",
            "specialization": "Software Engineering",
            "availability": "Weekdays 9AM-6PM, Weekends by appointment",
            "sessionTypes": [
              "Presentation coaching",
              "Practical labs",
              "Practical labs"
            ],
            "languages": [
              "English",
              "French"
            ],
            "hourlyRate": "17425 XAF/hour",
            "packageDeals": {
              "5sessions": "82,125 XAF (Save 5,000 XAF)",
              "10sessions": "159,250 XAF (Save 15,000 XAF)"
            },
            "studentFeedback": "Very engaging tutor with practical insights and academic depth.",
            "image": "https://i.ibb.co/yFQtgVpT/Whats-App-Image-2025-06-08-at-17-24-17-5881b625.jpg"
          },
          {
            "name": "Daniel Hernandez",
            "role": "Tutor",
            "experience": "10+ years",
            "completedSessions": 52,
            "rating": 4.2,
            "expertise": [
              "Public Health",
              "Project Management"
            ],
            "phone": "001-815-116-0347",
            "specialization": "Research Methods",
            "availability": "Weekdays 9AM-6PM, Weekends by appointment",
            "sessionTypes": [
              "One-on-one tutoring",
              "Capstone project support",
              "Practical labs"
            ],
            "languages": [
              "English",
              "French"
            ],
            "hourlyRate": "15970 XAF/hour",
            "packageDeals": {
              "5sessions": "74,850 XAF (Save 5,000 XAF)",
              "10sessions": "144,700 XAF (Save 15,000 XAF)"
            },
            "studentFeedback": "Very engaging tutor with practical insights and academic depth.",
            "image": "https://i.ibb.co/gLVyVPbg/Whats-App-Image-2025-06-08-at-17-24-19-5a0a7d49.jpg"
          }
        ]
    },
    {
      "program": "Conversion Master in Public Law",
      "duration": "1 Year",
      "tuition": "200,000 XAF/year",
      "description": "For professionals seeking to transition into public law, covering key aspects of the field.",
      "requirements": [
        "Professional Master Degree in Law or equivalent qualification"
      ],
      "applicationProcess": "Submit application through UBa Admissions portal; selection based on academic qualifications."
    }
  ],
  "location": "Bambili, Bamenda, Cameroon (UBa Campus)",
  "ranking": "N/A",
  "rating": 4.5,
  "image": "https://i.postimg.cc/zXwq5vJH/Whats-App-Image-2025-06-11-at-15-44-47-edbc6100.jpg",
  "description": "The Faculty of Law and Political Science (FLPS) offers comprehensive programs in law and political science, aiming to produce graduates grounded in legal knowledge and professionalism."
},
  {
    "id": "uba_fems",
    "name": "Faculty of Economics and Management Sciences (FEMS)",
    "programs": [
      {
        "program": "B.Tech in Accounting",
        "duration": "4 Years",
        "tuition": "200,000 XAF/year",
        "description": "Professional accounting program with technical training",
        "requirements": [
          "Advanced Level in Economics/Accounting",
          "Mathematics proficiency"
        ],
        "applicationProcess": "Competitive entrance exam after application submission",
        "availableTutors": [
          {
            "name": "Fien Dora",
            "role": "COO at SEED Inc.",
            "experience": "3+ years",
            "completedSessions": 50,
            "rating": 4.0,
            "expertise": ["Project Management", "Embedded Systems"],
            "phone": "+237680468606",
            "specialization": "Financial Management & Business Analytics",
            "availability": "Weekdays 9AM-6PM, Weekends by appointment",
            "sessionTypes": ["Accounting principles", "Financial analysis", "Business case studies"],
            "languages": ["English", "French"],
            "hourlyRate": "16,000 XAF/hour",
            "packageDeals": {
              "5sessions": "75,000 XAF (Save 5,000 XAF)",
              "10sessions": "145,000 XAF (Save 15,000 XAF)"
            },
            "studentFeedback": "Excellent at breaking down complex accounting concepts into understandable parts",
            "image": "https://i.ibb.co/qFxfnpTr/Whats-App-Image-2025-06-08-at-17-08-24-332f52ec.jpg"
          },
          {
            "name": "Tayuh Favour",
            "role": "PA at SEED Inc.",
            "experience": "1+ year",
            "completedSessions": 20,
            "rating": 3.0,
            "expertise": ["Full Stack Web Development"],
            "phone": "+237681600069",
            "specialization": "Digital Accounting Systems & Technology",
            "availability": "Evenings and weekends",
            "sessionTypes": ["Accounting software training", "Basic accounting concepts", "Study groups"],
            "languages": ["English", "French"],
            "hourlyRate": "10,000 XAF/hour",
            "packageDeals": {
              "5sessions": "45,000 XAF (Save 5,000 XAF)",
              "10sessions": "85,000 XAF (Save 15,000 XAF)"
            },
            "studentFeedback": "Good for beginners, patient and understanding approach",
            "image": "https://i.ibb.co/j9MbGfTm/IMG-20250426-WA0033.jpg"
          }
        ]
      }
    ],
    "location": "Bambili, Bamenda, Cameroon (UBa Campus)",
    "ranking": "N/A",
    "rating": 4.7,
    "image": "https://i.postimg.cc/zXwq5vJH/Whats-App-Image-2025-06-11-at-15-44-47-edbc6100.jpg",
    "description": "Training ground for business leaders offering accounting, finance, economics and management programs."
  },
  {
  "id": "uba_hitl",
  "name": "Higher Institute of Transport and Logistics (HITL)",
  "programs": [
    {
      "program": "Bachelor of Science (BSc) in Maritime Transport",
      "duration": "3 Years",
      "tuition": "200,000 XAF/year",
      "description": "Focuses on maritime operations, shipping management, and port logistics.",
      "requirements": [
        "GCE O-Level with at least 5 subjects including English and Mathematics",
        "GCE A-Level with at least 2 subjects excluding Religious Studies"
      ],
      "applicationProcess": "Submit application through UBa Admissions portal; selection based on academic qualifications.",

      "availableTutors": [
          {
            "name": "Fien Dora",
            "role": "COO at SEED Inc.",
            "experience": "3+ years",
            "completedSessions": 50,
            "rating": 4.0,
            "expertise": ["Project Management", "Embedded Systems"],
            "phone": "+237680468606",
            "specialization": "Business Management & Technology Integration",
            "availability": "Weekdays 9AM-6PM, Weekends by appointment",
            "sessionTypes": ["One-on-one tutoring", "Group sessions", "Project consultation"],
            "languages": ["English", "French"],
            "hourlyRate": "15,000 XAF/hour",
            "packageDeals": {
              "5sessions": "70,000 XAF (Save 5,000 XAF)",
              "10sessions": "135,000 XAF (Save 15,000 XAF)"
            },
            "studentFeedback": "Excellent at explaining complex project management concepts with real-world examples",
            "image": "https://i.ibb.co/qFxfnpTr/Whats-App-Image-2025-06-08-at-17-08-24-332f52ec.jpg"
          }
        ]
    },
    {
      "program": "Bachelor of Science (BSc) in Land Transport",
      "duration": "3 Years",
      "tuition": "200,000 XAF/year",
      "description": "Covers road transport systems, infrastructure planning, and traffic management.",
      "requirements": [
        "GCE O-Level with at least 5 subjects including English and Mathematics",
        "GCE A-Level with at least 2 subjects excluding Religious Studies"
      ],
      "applicationProcess": "Submit application through UBa Admissions portal; selection based on academic qualifications.",
      "availableTutors": [
          {
            "name": "Fien Dora",
            "role": "COO at SEED Inc.",
            "experience": "3+ years",
            "completedSessions": 50,
            "rating": 4.0,
            "expertise": ["Project Management", "Embedded Systems"],
            "phone": "+237680468606",
            "specialization": "Business Management & Technology Integration",
            "availability": "Weekdays 9AM-6PM, Weekends by appointment",
            "sessionTypes": ["One-on-one tutoring", "Group sessions", "Project consultation"],
            "languages": ["English", "French"],
            "hourlyRate": "15,000 XAF/hour",
            "packageDeals": {
              "5sessions": "70,000 XAF (Save 5,000 XAF)",
              "10sessions": "135,000 XAF (Save 15,000 XAF)"
            },
            "studentFeedback": "Excellent at explaining complex project management concepts with real-world examples",
            "image": "https://i.ibb.co/qFxfnpTr/Whats-App-Image-2025-06-08-at-17-08-24-332f52ec.jpg"
          }
        ]
    },
    {
      "program": "Bachelor of Science (BSc) in Transit and Logistics",
      "duration": "3 Years",
      "tuition": "200,000 XAF/year",
      "description": "Provides knowledge in supply chain management, logistics operations, and customs procedures.",
      "requirements": [
        "GCE O-Level with at least 5 subjects including English and Mathematics",
        "GCE A-Level with at least 2 subjects excluding Religious Studies"
      ],
      "applicationProcess": "Submit application through UBa Admissions portal; selection based on academic qualifications.",
      "availableTutors": [
          {
            "name": "Fien Dora",
            "role": "COO at SEED Inc.",
            "experience": "3+ years",
            "completedSessions": 50,
            "rating": 4.0,
            "expertise": ["Project Management", "Embedded Systems"],
            "phone": "+237680468606",
            "specialization": "Business Management & Technology Integration",
            "availability": "Weekdays 9AM-6PM, Weekends by appointment",
            "sessionTypes": ["One-on-one tutoring", "Group sessions", "Project consultation"],
            "languages": ["English", "French"],
            "hourlyRate": "15,000 XAF/hour",
            "packageDeals": {
              "5sessions": "70,000 XAF (Save 5,000 XAF)",
              "10sessions": "135,000 XAF (Save 15,000 XAF)"
            },
            "studentFeedback": "Excellent at explaining complex project management concepts with real-world examples",
            "image": "https://i.ibb.co/qFxfnpTr/Whats-App-Image-2025-06-08-at-17-08-24-332f52ec.jpg"
          }
        ]
    },
    {
      "program": "Bachelor of Science (BSc) in Tourism and Hospitality Management",
      "duration": "3 Years",
      "tuition": "200,000 XAF/year",
      "description": "Prepares students for careers in tourism development, hotel management, and travel services.",
      "requirements": [
        "GCE O-Level with at least 5 subjects including English and Mathematics",
        "GCE A-Level with at least 2 subjects excluding Religious Studies"
      ],
      "applicationProcess": "Submit application through UBa Admissions portal; selection based on academic qualifications.",
      "availableTutors": [
          {
            "name": "Fien Dora",
            "role": "COO at SEED Inc.",
            "experience": "3+ years",
            "completedSessions": 50,
            "rating": 4.0,
            "expertise": ["Project Management", "Embedded Systems"],
            "phone": "+237680468606",
            "specialization": "Business Management & Technology Integration",
            "availability": "Weekdays 9AM-6PM, Weekends by appointment",
            "sessionTypes": ["One-on-one tutoring", "Group sessions", "Project consultation"],
            "languages": ["English", "French"],
            "hourlyRate": "15,000 XAF/hour",
            "packageDeals": {
              "5sessions": "70,000 XAF (Save 5,000 XAF)",
              "10sessions": "135,000 XAF (Save 15,000 XAF)"
            },
            "studentFeedback": "Excellent at explaining complex project management concepts with real-world examples",
            "image": "https://i.ibb.co/qFxfnpTr/Whats-App-Image-2025-06-08-at-17-08-24-332f52ec.jpg"
          }
        ]
    },
    {
      "program": "Master of Science (MSc) in Maritime Transport",
      "duration": "2 Years",
      "tuition": "250,000 XAF/year",
      "description": "Advanced study in maritime logistics, shipping policies, and international maritime law.",
      "requirements": [
        "Bachelor's degree in Maritime Transport or related field"
      ],
      "applicationProcess": "Submit application through UBa Admissions portal; selection based on academic qualifications.",
      "availableTutors": [
          {
            "name": "Fien Dora",
            "role": "COO at SEED Inc.",
            "experience": "3+ years",
            "completedSessions": 50,
            "rating": 4.0,
            "expertise": ["Project Management", "Embedded Systems"],
            "phone": "+237680468606",
            "specialization": "Business Management & Technology Integration",
            "availability": "Weekdays 9AM-6PM, Weekends by appointment",
            "sessionTypes": ["One-on-one tutoring", "Group sessions", "Project consultation"],
            "languages": ["English", "French"],
            "hourlyRate": "15,000 XAF/hour",
            "packageDeals": {
              "5sessions": "70,000 XAF (Save 5,000 XAF)",
              "10sessions": "135,000 XAF (Save 15,000 XAF)"
            },
            "studentFeedback": "Excellent at explaining complex project management concepts with real-world examples",
            "image": "https://i.ibb.co/qFxfnpTr/Whats-App-Image-2025-06-08-at-17-08-24-332f52ec.jpg"
          }
        ]
    },
    {
      "program": "Master of Science (MSc) in Land Transport",
      "duration": "2 Years",
      "tuition": "250,000 XAF/year",
      "description": "In-depth knowledge of land transport systems, infrastructure development, and policy planning.",
      "requirements": [
        "Bachelor's degree in Land Transport or related field"
      ],
      "applicationProcess": "Submit application through UBa Admissions portal; selection based on academic qualifications.",
      "availableTutors": [
          {
            "name": "Fien Dora",
            "role": "COO at SEED Inc.",
            "experience": "3+ years",
            "completedSessions": 50,
            "rating": 4.0,
            "expertise": ["Project Management", "Embedded Systems"],
            "phone": "+237680468606",
            "specialization": "Business Management & Technology Integration",
            "availability": "Weekdays 9AM-6PM, Weekends by appointment",
            "sessionTypes": ["One-on-one tutoring", "Group sessions", "Project consultation"],
            "languages": ["English", "French"],
            "hourlyRate": "15,000 XAF/hour",
            "packageDeals": {
              "5sessions": "70,000 XAF (Save 5,000 XAF)",
              "10sessions": "135,000 XAF (Save 15,000 XAF)"
            },
            "studentFeedback": "Excellent at explaining complex project management concepts with real-world examples",
            "image": "https://i.ibb.co/qFxfnpTr/Whats-App-Image-2025-06-08-at-17-08-24-332f52ec.jpg"
          }
        ]
    }],
    "location": "Bambili, Bamenda, Cameroon (UBa Campus)",
    "ranking": "N/A",
    "rating": 4.7,
    "image": "https://i.postimg.cc/zXwq5vJH/Whats-App-Image-2025-06-11-at-15-44-47-edbc6100.jpg",
    "description": "Training ground for business leaders offering accounting, finance, economics and management programs."
  },
  {
    "id": "uba_nahpi",
    "name": "National Higher Polytechnic Institute (NAHPI)",
    "programs": [
      {
        "program": "B.Eng. in Biotechnology and Food Process Engineering",
        "duration": "5 Years",
        "tuition": "350,000 XAF/year",
        "description": "Engineering approaches to food processing and bioprocessing",
        "requirements": [
          "Advanced Level in Science subjects",
          "Pass in Mathematics and Chemistry"
        ],
        "applicationProcess": "National competitive entrance examination",
        "availableTutors": [
          {
            "name": "Fien Dora",
            "role": "COO at SEED Inc.",
            "experience": "3+ years",
            "completedSessions": 50,
            "rating": 4.0,
            "expertise": ["Project Management", "Embedded Systems"],
            "phone": "+237680468606",
            "specialization": "Process Engineering & Systems Integration",
            "availability": "Weekdays 9AM-6PM, Weekends by appointment",
            "sessionTypes": ["Engineering fundamentals", "Process design", "System integration"],
            "languages": ["English", "French"],
            "hourlyRate": "20,000 XAF/hour",
            "packageDeals": {
              "5sessions": "95,000 XAF (Save 5,000 XAF)",
              "10sessions": "180,000 XAF (Save 20,000 XAF)"
            },
            "studentFeedback": "Strong background in systems thinking, great for engineering students",
            "image": "https://i.ibb.co/qFxfnpTr/Whats-App-Image-2025-06-08-at-17-08-24-332f52ec.jpg"
          },
          {
            "name": "John Brindi",
            "role": "MIA tutor, Developer at SEED Inc",
            "experience": "2+ years",
            "completedSessions": 40,
            "rating": 3.8,
            "expertise": ["Cyber Security", "Full Stack Web Development"],
            "phone": "+237651145874",
            "specialization": "Engineering Security & Process Automation",
            "availability": "Flexible evening hours",
            "sessionTypes": ["Security in engineering systems", "Automation programming", "Technical problem-solving"],
            "languages": ["English", "French"],
            "hourlyRate": "14,000 XAF/hour",
            "packageDeals": {
              "5sessions": "65,000 XAF (Save 5,000 XAF)",
              "10sessions": "125,000 XAF (Save 15,000 XAF)"
            },
            "studentFeedback": "Good technical knowledge, especially helpful for security aspects of engineering",
            "image": "https://i.ibb.co/gLVyVPbg/Whats-App-Image-2025-06-08-at-17-24-19-5a0a7d49.jpg"
          }
        ]
      },
      {
        "program": "Computer Engineering",
        "duration": "5 Years",
        "tuition": "350,000 XAF/year",
        "description": "Comprehensive computer engineering program covering hardware and software",
        "requirements": [
          "Advanced Level in Science subjects",
          "Strong Mathematics background"
        ],
        "applicationProcess": "National competitive entrance examination",
        "availableTutors": [
          {
            "name": "Fonyuy Gita",
            "role": "CTO at SEED Inc.",
            "experience": "5+ years",
            "completedSessions": 200,
            "rating": 4.8,
            "expertise": ["Full Stack Web Development", "Machine Learning", "Prompt Engineering"],
            "phone": "+237672792563",
            "specialization": "Advanced Computer Systems & AI",
            "availability": "Flexible schedule, 7 days a week",
            "sessionTypes": ["Programming", "System design", "AI/ML projects", "Capstone project guidance"],
            "languages": ["English", "French"],
            "hourlyRate": "22,000 XAF/hour",
            "packageDeals": {
              "5sessions": "105,000 XAF (Save 5,000 XAF)",
              "10sessions": "200,000 XAF (Save 20,000 XAF)"
            },
            "studentFeedback": "Top-tier expertise in computer engineering, excellent for advanced topics",
            "image": "https://i.ibb.co/ZpW9TQv4/Whats-App-Image-2025-06-08-at-17-24-19-e7c168f6.jpg"
          },
          {
            "name": "NchanJi Faithfull",
            "role": "MIA tutor, Developer at SEED Inc.",
            "experience": "4+ years",
            "completedSessions": 200,
            "rating": 4.0,
            "expertise": ["Mobile App Development"],
            "phone": "+237654105087",
            "specialization": "Mobile Computing & App Development",
            "availability": "Weekdays and weekends",
            "sessionTypes": ["Mobile development", "App design", "User interface programming"],
            "languages": ["English", "French"],
            "hourlyRate": "18,000 XAF/hour",
            "packageDeals": {
              "5sessions": "85,000 XAF (Save 5,000 XAF)",
              "10sessions": "160,000 XAF (Save 20,000 XAF)"
            },
            "studentFeedback": "Excellent mobile development mentor with practical industry experience",
            "image": "https://i.ibb.co/gLVyVPbg/Whats-App-Image-2025-06-08-at-17-24-19-5a0a7d49.jpg"
          },
          {
            "name": "Tracy Jessy",
            "role": "Developer at SEED Inc.",
            "experience": "1+ year",
            "completedSessions": 20,
            "rating": 3.0,
            "expertise": ["Full Stack Web Development"],
            "phone": "+237653283254",
            "specialization": "Web Technologies & Frontend Development",
            "availability": "Evenings and weekends",
            "sessionTypes": ["Web development basics", "Programming fundamentals", "Study support"],
            "languages": ["English", "French"],
            "hourlyRate": "12,000 XAF/hour",
            "packageDeals": {
              "5sessions": "55,000 XAF (Save 5,000 XAF)",
              "10sessions": "105,000 XAF (Save 15,000 XAF)"
            },
            "studentFeedback": "Good for foundational concepts, patient with beginners",
            "image": "https://i.ibb.co/8L3kkC4f/Whats-App-Image-2025-06-09-at-08-13-08-070c5c42.jpg"
          },
          {
            "name": "Abdul Fadiga",
            "role": "Developer at SEED Inc.",
            "experience": "3+ years",
            "completedSessions": 20,
            "rating": 3.8,
            "expertise": ["Full Stack Web Development"],
            "phone": "+237683532083",
            "specialization": "Full Stack Development & System Architecture",
            "availability": "Flexible hours",
            "sessionTypes": ["Full stack development", "System architecture", "Backend programming"],
            "languages": ["English", "French"],
            "hourlyRate": "16,000 XAF/hour",
            "packageDeals": {
              "5sessions": "75,000 XAF (Save 5,000 XAF)",
              "10sessions": "145,000 XAF (Save 15,000 XAF)"
            },
            "studentFeedback": "Solid technical knowledge with good practical examples",
            "image":"https://i.ibb.co/VYM8xLp0/Whats-App-Image-2025-06-12-at-16-39-52-eb802d2b.jpg"
          },
          {
            "name": "Ntunui Serge",
            "role": "Developer at SEED Inc.",
            "experience": "4+ years",
            "completedSessions": 150,
            "rating": 4.0,
            "expertise": ["Frontend Developer", "Video Editing"],
            "phone": "+237651000536",
            "specialization": "Frontend Development & Multimedia Systems",
            "availability": "Weekdays and weekends",
            "sessionTypes": ["Frontend development", "UI/UX design", "Multimedia programming"],
            "languages": ["English", "French"],
            "hourlyRate": "17,000 XAF/hour",
            "packageDeals": {
              "5sessions": "80,000 XAF (Save 5,000 XAF)",
              "10sessions": "155,000 XAF (Save 15,000 XAF)"
            },
            "studentFeedback": "Great for visual programming and multimedia applications",
            "image":"https://i.ibb.co/whsG7VB6/Whats-App-Image-2025-06-08-at-17-24-18-c3d3fba0.jpg"
          },
          {
            "name": "James Nelien",
            "role": "Developer at SEED Inc.",
            "experience": "3+ years",
            "completedSessions": 100,
            "rating": 3.5,
            "expertise": ["Mobile App Developer"],
            "phone": "+237",
            "specialization": "Mobile Application Development",
            "availability": "Contact for scheduling",
            "sessionTypes": ["Mobile app development", "Cross-platform development", "App deployment"],
            "languages": ["English", "French"],
            "hourlyRate": "15,000 XAF/hour",
            "packageDeals": {
              "5sessions": "70,000 XAF (Save 5,000 XAF)",
              "10sessions": "135,000 XAF (Save 15,000 XAF)"
            },
            "studentFeedback": "Experienced in mobile development with good project guidance",
            "image": "https://i.ibb.co/whsG7VB6/Whats-App-Image-2025-06-08-at-17-24-18-c3d3fba0.jpg"
          }
        ]
      }
    ],
    "location": "Bambili, Bamenda, Cameroon (UBa Campus)",
    "ranking": "N/A",
    "rating": 4.8,
    "image": "https://i.postimg.cc/zXwq5vJH/Whats-App-Image-2025-06-11-at-15-44-47-edbc6100.jpg",
    "description": "Premier engineering school offering accredited programs in civil, computer, electrical, and petroleum engineering."
  },
  {
  "id": "saint_louis_001",
  "name": "Saint Louis Higher Institute of Health and Biomedical Sciences",
  "programs": [
    {
      "program": "HND in Nursing",
      "duration": "3 Years",
      "tuition": "400,000 XAF/year",
      "description": "Professional nursing program with clinical training components",
      "requirements": [
        "Advanced Level Certificate with Biology",
        "Medical fitness certificate",
        "Proof of fee payment",
        "Health and Life Insurance",
        "Photographs (passport size)",
        "Medical Certificate",
        "Motivation Letter",
        "Application fee"
      ],
      "applicationProcess": "Submit online application with required documents. Selected candidates will be invited for interview and medical screening.",
      "availableTutors": [
        {
          "name": "Dr. Alice Ngu",
          "role": "Head of Nursing Department",
          "experience": "10+ years",
          "completedSessions": 100,
          "rating": 4.8,
          "expertise": ["Nursing Education", "Clinical Practice"],
          "phone": "+237650123456",
          "specialization": "Nursing and Healthcare Management",
          "availability": "Weekdays 8AM-5PM, Weekends by appointment",
          "sessionTypes": ["One-on-one tutoring", "Group sessions", "Clinical supervision"],
          "languages": ["English", "Pidgin"],
          "hourlyRate": "20,000 XAF/hour",
          "packageDeals": {
            "5sessions": "90,000 XAF (Save 10,000 XAF)",
            "10sessions": "170,000 XAF (Save 30,000 XAF)"
          },
          "studentFeedback": "Incredibly knowledgeable and supportive, with a passion for teaching.",
          "image": "https://i.ibb.co/j9MbGfTm/IMG-20250426-WA0033.jpg"
        }
      ]
    },
    {
      "program": "HPD in Medical Laboratory Sciences",
      "duration": "2 Years",
      "tuition": "400,000 XAF/year",
      "description": "Training program for medical laboratory technicians",
      "requirements": [
        "Advanced Level in Biology and Chemistry",
        "Proof of fee payment",
        "Health and Life Insurance",
        "Photographs",
        "Medical Certificate",
        "Application fee"
      ],
      "applicationProcess": "Direct application to institute's admissions office with required documents",
      "availableTutors": [
        {
          "name": "Mr. Paul Tchouang",
          "role": "Senior Lab Technician",
          "experience": "7+ years",
          "completedSessions": 80,
          "rating": 4.6,
          "expertise": ["Clinical Laboratory Techniques", "Quality Control"],
          "phone": "+237670987654",
          "specialization": "Medical Laboratory Science",
          "availability": "Weekdays 9AM-4PM, Weekends by appointment",
          "sessionTypes": ["One-on-one tutoring", "Group sessions", "Practical workshops"],
          "languages": ["English", "French"],
          "hourlyRate": "18,000 XAF/hour",
          "packageDeals": {
            "5sessions": "85,000 XAF (Save 5,000 XAF)",
            "10sessions": "160,000 XAF (Save 40,000 XAF)"
          },
          "studentFeedback": "Very practical and hands-on approach to teaching laboratory skills.",
          "image": "https://i.ibb.co/TDh3LLvb/Whats-App-Image-2025-06-08-at-17-24-24-fa6c719c.jpg"
        }
      ]
    },
    {
      "program": "Professional Bachelor's in Physiotherapy",
      "duration": "5 Years",
      "tuition": "400,000 XAF/year",
      "description": "Comprehensive physiotherapy degree program with clinical rotations",
      "requirements": [
        "Advanced Level Certificate with Biology",
        "IELTS/TOEFL Certificate (for international students)",
        "Letters of recommendation",
        "Proof of fee payment",
        "Health and Life Insurance",
        "Photographs",
        "Medical Certificate",
        "Motivation Letter",
        "Application fee"
      ],
      "applicationProcess": "Competitive admission based on academic records and entrance examination",
      "availableTutors": [
        {
          "name": "Dr. Sarah Mbanga",
          "role": "Physiotherapy Program Coordinator",
          "experience": "8+ years",
          "completedSessions": 120,
          "rating": 4.9,
          "expertise": ["Physiotherapy Techniques", "Rehabilitation"],
          "phone": "+237680123789",
          "specialization": "Physiotherapy and Rehabilitation Sciences",
          "availability": "Weekdays 10AM-6PM, Weekends by appointment",
          "sessionTypes": ["One-on-one tutoring", "Group sessions", "Clinical practice"],
          "languages": ["English", "French"],
          "hourlyRate": "22,000 XAF/hour",
          "packageDeals": {
            "5sessions": "100,000 XAF (Save 10,000 XAF)",
            "10sessions": "190,000 XAF (Save 50,000 XAF)"
          },
          "studentFeedback": "Exceptional at guiding students through complex rehabilitation processes.",
          "image": "https://i.ibb.co/j9MbGfTm/IMG-20250426-WA0033.jpg"
        }
      ]
    }
  ],
  "location": "Mile 3 Nkwen, Bamenda, Cameroon",
  "ranking": "#105",
  "rating": 0.0,
  "image": "https://i.postimg.cc/7L2Z9Ds2/Whats-App-Image-2025-06-12-at-03-03-30-5f1ca820.jpg",
  "description": "Saint Louis Higher Institute of Health and Biomedical Sciences in Bamenda, Cameroon, is a specialized institute focused on health and biomedical sciences. Founded in 2002, it has around 880 students across six departments: Nursing, Physiotherapy, Dental Therapy, Radiology, Medical Lab Sciences, and Pharmacy Technology. The institute offers programs leading to Higher Professional Diplomas (HPD) and Bachelor of Health degrees with strong emphasis on practical clinical training.",
  "applicationProcess": "Prospective students must prepare all required documents including academic certificates, medical reports, and application fee payment. International students should verify visa requirements. Contact the admissions office via live chat for country-specific document requirements."
},
 {
  "id": "uba_fed",
  "name": "Faculty of Education (FED)",
  "programs": [
    {
      "program": "MEd, Curriculum Planning and Design",
      "duration": "2 Years",
      "tuition": "220,000 XAF/year",
      "description": "Advanced training in educational curriculum development",
      "requirements": [
        "Bachelor's in Education or related field",
        "Teaching experience"
      ],
      "applicationProcess": "Departmental review with interview",
      "availableTutors": [
        {
          "name": "Prof. Linda Njeuma",
          "role": "Professor of Education",
          "experience": "15+ years",
          "completedSessions": 200,
          "rating": 4.7,
          "expertise": ["Curriculum Development", "Educational Leadership"],
          "phone": "+237650987654",
          "specialization": "Curriculum Studies and Instructional Design",
          "availability": "Weekdays 9AM-5PM, Weekends by appointment",
          "sessionTypes": ["One-on-one tutoring", "Group sessions", "Workshops"],
          "languages": ["English", "French"],
          "hourlyRate": "25,000 XAF/hour",
          "packageDeals": {
            "5sessions": "110,000 XAF (Save 15,000 XAF)",
            "10sessions": "210,000 XAF (Save 40,000 XAF)"
          },
          "studentFeedback": "Incredibly insightful and provides practical strategies for curriculum design.",
          "image": "https://i.ibb.co/V0FBjbpv/Whats-App-Image-2025-06-11-at-14-03-48-6ac66adc.jpg"
        }
      ]
    }
  ],
  "location": "Bambili, Bamenda, Cameroon (UBa Campus)",
  "ranking": "N/A",
  "rating": 4.5,
  "image": "https://i.postimg.cc/zXwq5vJH/Whats-App-Image-2025-06-11-at-15-44-47-edbc6100.jpg",
  "description": "Trains educators and education specialists with programs covering teaching methodologies, counseling, and educational leadership."
},
 {
  "id": "uba_hicm",
  "name": "Higher Institute of Commerce and Management (HICM)",
  "programs": [
    {
      "program": "BBA in Accounting and Finance",
      "duration": "3 Years",
      "tuition": "220,000 XAF/year",
      "description": "Business administration program with accounting specialization",
      "requirements": [
        "Advanced Level in Commerce/Accounting",
        "Mathematics proficiency"
      ],
      "applicationProcess": "Direct application with academic transcripts",
      "availableTutors": [
        {
          "name": "Mr. Samuel Ndong",
          "role": "Senior Lecturer in Accounting",
          "experience": "12+ years",
          "completedSessions": 150,
          "rating": 4.6,
          "expertise": ["Financial Accounting", "Management Accounting"],
          "phone": "+237670123456",
          "specialization": "Accounting and Financial Management",
          "availability": "Weekdays 10AM-6PM, Weekends by appointment",
          "sessionTypes": ["One-on-one tutoring", "Group sessions", "Exam preparation"],
          "languages": ["English", "French"],
          "hourlyRate": "20,000 XAF/hour",
          "packageDeals": {
            "5sessions": "90,000 XAF (Save 10,000 XAF)",
            "10sessions": "170,000 XAF (Save 30,000 XAF)"
          },
          "studentFeedback": "Very thorough and provides real-world examples that enhance understanding.",
          "image": "https://i.ibb.co/Txwqrz5C/Whats-App-Image-2025-06-08-at-17-24-21-15d2bf3a.jpg"
        }
      ]
    }
  ],
  "location": "Bambili, Bamenda, Cameroon (UBa Campus)",
  "ranking": "N/A",
  "rating": 4.7,
  "image": "https://i.postimg.cc/zXwq5vJH/Whats-App-Image-2025-06-11-at-15-44-47-edbc6100.jpg",
  "description": "Professional business school offering management, finance, and marketing programs."
},
 {
  "id": "uba_httc",
  "name": "Higher Teacher Training College (HTTC)",
  "programs": [
    {
      "program": "DIPES I in Biology",
      "duration": "3 Years",
      "tuition": "150,000 XAF/year",
      "description": "Teacher training program for secondary school education",
      "requirements": [
        "Advanced Level in Biology",
        "Pass in education aptitude test"
      ],
      "applicationProcess": "Competitive national entrance examination",
      "availableTutors": [
        {
          "name": "Dr. Grace Nguem",
          "role": "Senior Lecturer in Biology Education",
          "experience": "10+ years",
          "completedSessions": 180,
          "rating": 4.8,
          "expertise": ["Biology Education", "Pedagogical Methods"],
          "phone": "+237650456789",
          "specialization": "Biology and Science Education",
          "availability": "Weekdays 9AM-5PM, Weekends by appointment",
          "sessionTypes": ["One-on-one tutoring", "Group sessions", "Teaching practice supervision"],
          "languages": ["English", "French"],
          "hourlyRate": "22,000 XAF/hour",
          "packageDeals": {
            "5sessions": "100,000 XAF (Save 10,000 XAF)",
            "10sessions": "190,000 XAF (Save 50,000 XAF)"
          },
          "studentFeedback": "Passionate about teaching and provides excellent support for student teachers.",
          "image": "https://i.ibb.co/yFQtgVpT/Whats-App-Image-2025-06-08-at-17-24-17-5881b625.jpg"
        }
      ]
    }
  ],
  "location": "Bambili, Bamenda, Cameroon (UBa Campus)",
  "ranking": "N/A",
  "rating": 4.4,
  "image": "https://ibb.co/hRd1hxkJ",
  "description": "Trains secondary school teachers with subject-specific pedagogical training."
},
  {
  "id": "uba_htttc",
  "name": "Higher Technical Teacher Training College (HTTTC)",
  "programs": [
    {
      "program": "DIPET II in Computer Science",
      "duration": "3 Years",
      "tuition": "200,000 XAF/year",
      "description": "Technical teacher training in computer science education",
      "requirements": [
        "Advanced technical certificate",
        "Teaching aptitude test"
      ],
      "applicationProcess": "National competitive examination",
      "availableTutors": [
        {
          "name": "Mr. Eric Tchoua",
          "role": "Lecturer in Computer Science Education",
          "experience": "8+ years",
          "completedSessions": 160,
          "rating": 4.6,
          "expertise": ["Computer Science Education", "Software Development"],
          "phone": "+237670987890",
          "specialization": "Information Technology and Pedagogy",
          "availability": "Weekdays 10AM-6PM, Weekends by appointment",
          "sessionTypes": ["One-on-one tutoring", "Group sessions", "Practical workshops"],
          "languages": ["English", "French"],
          "hourlyRate": "20,000 XAF/hour",
          "packageDeals": {
            "5sessions": "90,000 XAF (Save 10,000 XAF)",
            "10sessions": "170,000 XAF (Save 30,000 XAF)"
          },
          "studentFeedback": "Very engaging and knowledgeable, with a focus on practical applications.",
          "image": "https://i.ibb.co/whsG7VB6/Whats-App-Image-2025-06-08-at-17-24-18-c3d3fba0.jpg"
        }
      ]
    }
  ],
  "location": "Bambili, Bamenda, Cameroon (UBa Campus)",
  "ranking": "N/A",
  "rating": 4.5,
  "image": "https://i.postimg.cc/zXwq5vJH/Whats-App-Image-2025-06-11-at-15-44-47-edbc6100.jpg",
  "description": "Prepares technical teachers for vocational and technical education institutions."
},
   {
  "id": "uba_ubalac",
  "name": "University of Bamenda Language Center (UBALAC)",
  "programs": [
    {
      "program": "BA in Translation and Interpretation",
      "duration": "3 Years",
      "tuition": "180,000 XAF/year",
      "description": "Professional training in translation and interpretation techniques",
      "requirements": [
        "Advanced Level Certificate",
        "Proficiency in at least two languages"
      ],
      "applicationProcess": "Language proficiency testing and interview",
      "availableTutors": [
        {
          "name": "Ms. Clara Mbewe",
          "role": "Senior Lecturer in Translation Studies",
          "experience": "10+ years",
          "completedSessions": 140,
          "rating": 4.7,
          "expertise": ["Translation Techniques", "Intercultural Communication"],
          "phone": "+237670456123",
          "specialization": "Translation and Interpretation",
          "availability": "Weekdays 9AM-5PM, Weekends by appointment",
          "sessionTypes": ["One-on-one tutoring", "Group sessions", "Practical workshops"],
          "languages": ["English", "French", "Spanish"],
          "hourlyRate": "25,000 XAF/hour",
          "packageDeals": {
            "5sessions": "110,000 XAF (Save 15,000 XAF)",
            "10sessions": "210,000 XAF (Save 40,000 XAF)"
          },
          "studentFeedback": "Highly knowledgeable and provides excellent insights into translation practices.",
          "image": "https://i.ibb.co/XxbBHnX4/Whats-App-Image-2025-06-08-at-17-24-24-e4f793ed.jpg"
        }
      ]
    }
  ],
  "location": "Bambili, Bamenda, Cameroon (UBa Campus)",
  "ranking": "N/A",
  "rating": 4.3,
  "image": "https://i.postimg.cc/zXwq5vJH/Whats-App-Image-2025-06-11-at-15-44-47-edbc6100.jpg",
  "description": "Center for multilingual education offering programs in translation, interpretation, and intercultural communication."
},
  {
  "id": "uba_hnd",
  "name": "HND/HPD/B.TECH Academic Organ",
  "programs": [
    {
      "program": "B.Tech in Medical Laboratory Science",
      "duration": "3 Years",
      "tuition": "280,000 XAF/year",
      "description": "Technical program for medical laboratory professionals",
      "requirements": [
        "HND in Medical Laboratory Science",
        "Professional certification"
      ],
      "applicationProcess": "Direct application with professional portfolio",
      "availableTutors": [
        {
          "name": "Dr. Michael Ngu",
          "role": "Senior Lecturer in Medical Laboratory Science",
          "experience": "12+ years",
          "completedSessions": 150,
          "rating": 4.5,
          "expertise": ["Clinical Laboratory Techniques", "Quality Assurance"],
          "phone": "+237670987654",
          "specialization": "Medical Laboratory Science and Technology",
          "availability": "Weekdays 10AM-6PM, Weekends by appointment",
          "sessionTypes": ["One-on-one tutoring", "Group sessions", "Practical training"],
          "languages": ["English", "French"],
          "hourlyRate": "22,000 XAF/hour",
          "packageDeals": {
            "5sessions": "100,000 XAF (Save 10,000 XAF)",
            "10sessions": "190,000 XAF (Save 50,000 XAF)"
          },
          "studentFeedback": "Very experienced and provides practical insights into laboratory practices.",
          "image": "https://i.ibb.co/whsG7VB6/Whats-App-Image-2025-06-08-at-17-24-18-c3d3fba0.jpg"
        }
      ]
    }
  ],
  "location": "Bambili, Bamenda, Cameroon (UBa Campus)",
  "ranking": "N/A",
  "rating": 4.4,
  "image": "https://i.postimg.cc/zXwq5vJH/Whats-App-Image-2025-06-11-at-15-44-47-edbc6100.jpg",
  "description": "Offers higher national diploma and technical programs across various professional fields."
},
{
  "id": "catuc",
  "name": "The Catholic University of Cameroon",
  "programs": [
    {
      "program": "Undergraduate Programs",
      "duration": "3 Years",
      "tuition": "600,000-1,200,000 FCFA/year",
      "description": "Various undergraduate programs including:",
      "details": [
        "BSc Accounting",
        "BSc Banking and Finance",
        "BSc Economics",
        "BSc Economics and Management",
        "BSc in various other fields: Including Business, Health Sciences, and Engineering."
      ],
      "requirements": [
        "A pass in the GCE Ordinary Level or Probatoire",
        "A pass in English Language at the GCE Ordinary Level or proof of Proficiency in the English Language from an accredited Language Learning Centre or the University Intensive English Language Course.",
        "A pass in the GCE Advanced Level subjects or a pass in BAC",
        "A photocopy of birth Certificate.",
        "A photocopy of 'O' Level and 'A' Level certificates or slips",
        "A receipt of registration of 15,000frs",
        "1,000frs for a passport picture (Taken on campus).",
        "Students with foreign certificates will be assisted to obtain equivalents to their certificates from MINESUP, Yaounde.",
        "Students applying for philosophy shall certify all their documents and slips."
      ],
      "applicationProcess": "Pay a Registration Fee of 15,000 CFAF into any of our Bank Accounts in Cameroon and collect a receipt of payment. Present the Bank Receipt at the Registry and collect an Application Form A1 or Entrance Form. Fill the form and submit it with the required documents.",
      "availableTutors": [
        {
          "name": "Dr. Emmanuel Tchinda",
          "role": "Senior Lecturer in Business Administration",
          "experience": "15+ years",
          "completedSessions": 220,
          "rating": 4.9,
          "expertise": ["Accounting", "Finance", "Economics"],
          "phone": "+237690123456",
          "specialization": "Business and Financial Management",
          "availability": "Weekdays 9AM-5PM",
          "sessionTypes": ["One-on-one tutoring", "Group sessions"],
          "languages": ["English", "French"],
          "hourlyRate": "25,000 XAF/hour",
          "packageDeals": {
            "5sessions": "115,000 XAF (Save 10,000 XAF)",
            "10sessions": "220,000 XAF (Save 30,000 XAF)"
          },
          "studentFeedback": "Exceptional at explaining complex financial concepts in an accessible manner.",
          "image": "https://i.ibb.co/VYM8xLp0/Whats-App-Image-2025-06-12-at-16-39-52-eb802d2b.jpg"
        }
      ]
    },
    {
      "program": "HND Programs",
      "duration": "2 - 3 Years",
      "tuition": "600,000-1,200,000 FCFA/year",
      "description": "HND programs in various fields including:",
      "details": [
        "Accountancy",
        "Banking & Finance",
        "Human Resource Management",
        "Logistics & Transport Management",
        "Hotel Management & Catering"
      ],
      "availableTutors": [
        {
          "name": "Ms. Rose Nkwenti",
          "role": "HND Program Coordinator",
          "experience": "10+ years",
          "completedSessions": 180,
          "rating": 4.7,
          "expertise": ["Accountancy", "Business Management"],
          "phone": "+237670987654",
          "specialization": "Business and Logistics Management",
          "availability": "Weekdays 10AM-4PM",
          "sessionTypes": ["One-on-one tutoring", "Workshops"],
          "languages": ["English", "French"],
          "hourlyRate": "20,000 XAF/hour",
          "packageDeals": {
            "5sessions": "90,000 XAF (Save 10,000 XAF)",
            "10sessions": "170,000 XAF (Save 30,000 XAF)"
          },
          "studentFeedback": "Provides practical, real-world learning experiences in management.",
          "image": "https://i.ibb.co/1Yms3BZW/Whats-App-Image-2025-06-11-at-14-06-04-4123d34e.jpg"
        }
      ]
    },
    {
      "program": "Graduate Programs",
      "duration": "2 - 7 Years",
      "tuition": "600,000-1,200,000 FCFA/year",
      "description": "Graduate programs including:",
      "details": [
        "MBA in Human Resource Management and Development, Project Management, Design and Implementation, Banking, Tax Administration, and Financial Services.",
        "MSc in Health Economics, Policy, and Management.",
        "MA in Philosophy and Anthropology.",
        "PhD in Health Economics, Philosophy, and Anthropology."
      ],
      "availableTutors": [
        {
          "name": "Prof. Jeanette Mbua",
          "role": "Professor of Philosophy and Anthropology",
          "experience": "20+ years",
          "completedSessions": 300,
          "rating": 5.0,
          "expertise": ["Philosophy", "Anthropology", "Research Methodologies"],
          "phone": "+2376805551212",
          "specialization": "Interdisciplinary Humanities",
          "availability": "Weekdays 9AM-6PM",
          "sessionTypes": ["One-on-one tutoring", "Research consultation"],
          "languages": ["English", "French"],
          "hourlyRate": "30,000 XAF/hour",
          "packageDeals": {
            "5sessions": "145,000 XAF (Save 5,000 XAF)",
            "10sessions": "280,000 XAF (Save 20,000 XAF)"
          },
          "studentFeedback": "Deeply insightful with a strong emphasis on critical thinking and research.",
          "image": "https://i.ibb.co/1Yms3BZW/Whats-App-Image-2025-06-11-at-14-06-04-4123d34e.jpg"
        },
        {
          "name": "Dr. Felix Abanda",
          "role": "Lecturer in Health Economics",
          "experience": "12+ years",
          "completedSessions": 180,
          "rating": 4.8,
          "expertise": ["Health Economics", "Project Management"],
          "phone": "+237690666123",
          "specialization": "Health Policy and Finance",
          "availability": "Weekdays 10AM-5PM",
          "sessionTypes": ["One-on-one tutoring", "Seminars", "Group discussions"],
          "languages": ["English", "French"],
          "hourlyRate": "28,000 XAF/hour",
          "packageDeals": {
            "5sessions": "130,000 XAF (Save 10,000 XAF)",
            "10sessions": "250,000 XAF (Save 30,000 XAF)"
          },
          "studentFeedback": "Excellent at bridging theory with practice in health economics.",
          "image": "https://i.ibb.co/TDh3LLvb/Whats-App-Image-2025-06-08-at-17-24-24-fa6c719c.jpg"
        }
      ]
    }
  ],
  "location": "Big Mankon, Bamenda, Cameroon",
  "ranking": "3rd in Cameroon and 21402nd in the world",
  "rating": 4.9,
  "image": "https://i.postimg.cc/zXZ6HNWQ/Whats-App-Image-2025-06-12-at-03-03-30-983b376c.jpg",
  "description": "The Catholic University of Cameroon (CATUC) in Bamenda was established in 2010 by the Bishops of the Bamenda Ecclesiastical Province with the goal of providing high-quality, holistic, and Christian-based education. It aims to be a center of learning where revealed and human truths are explored in depth, relevant to the Cameroon experience."
}
]`;
const schoolsData = JSON.parse(SCHOOLS_DATA_STRING);
// Create a fast-lookup map for schools by their ID
const schoolsDataMap = new Map(schoolsData.map(school => [school.id, school]));


// === STEP 3 (OPTIMIZATION): CREATE A LEANER, FASTER PROMPT ===
// We no longer send the giant school database to the AI.
const createOptimizedPrompt = (answers, categories) => {
    let prompt = `As a career development AI specialist, provide a comprehensive career analysis based on the following student assessment results:`;

    // This part remains the same
    categories.forEach(category => {
        prompt += `\n\n${category.title.toUpperCase()}:\n`;
        category.questions.forEach(question => {
            const answer = answers[question.id];
            if (answer) {
                prompt += `- ${question.text}: ${mapAnswerToText(answer)}\n`;
            }
        });
    });

    // We get the program list from our own data to help the AI.
    const allPrograms = schoolsData.flatMap(school => school.programs.map(p => p.program));
    const uniquePrograms = [...new Set(allPrograms)];

    prompt += `\n\nBased on this student profile, generate a comprehensive career analysis with these specific requirements in a valid JSON format:
1.  CAREER RECOMMENDATIONS: Provide 5 specific job titles. For each, explain detailly what the field is all about and why it's a match for the student and include typical salary ranges (e.g., in XAF or USD, specify which).
2.  SKILLS ANALYSIS: Identify the student's top 5 strengths. Recommend 3-5 critical skills they should develop.
3.  ACTION PLAN: Provide immediate, short-term, and long-term goals.
4.  POTENTIAL CHALLENGES: Identify 2-3 potential obstacles and suggest mitigation strategies.
5.  GROWTH OPPORTUNITIES: Highlight 2-3 high-potential industry sectors and emerging roles.
6.  RESOURCES: Recommend 2-3 online courses, 2-3 books/articles, and 2-3 professional tools.
7.  RECOMMENDED SCHOOLS:
    -   Based on your career recommendations, identify which of the programs from the 'AVAILABLE PROGRAMS LIST' below would be most suitable.
    -   For each suitable program, find the schools that offer it from the 'AVAILABLE PROGRAMS LIST'.
    -   Return an array of school recommendations. Each object in the array MUST contain ONLY the following keys:
        - "id": The string ID of the school (e.g., "uba_coltech").
        - "identifiedRelevantPrograms": An array of 1-3 specific program names (strings) that you recommend from that school.
        - "reasonForRecommendation": A concise string explaining why this school and its programs fit the student.

The final JSON structure MUST be:
{
    "careerRecommendations": [...],
    "skillsAnalysis": {...},
    "actionPlans": {...},
    "potentialChallenges": {...},
    "growthOpportunities": {...},
    "personalInsights": {...},
    "resources": {...},
    "recommendedSchools": [
        {
            "id": "school_id_from_data",
            "identifiedRelevantPrograms": ["Program Name 1", "Program Name 2"],
            "reasonForRecommendation": "Your concise reason here."
        }
    ]
}

USER ASSESSMENT DATA:
${JSON.stringify(answers, null, 2)}

AVAILABLE PROGRAMS LIST (Use this to find relevant programs and their associated school IDs):
${JSON.stringify(schoolsData.map(s => ({ id: s.id, name: s.name, programs: s.programs.map(p => p.program) })), null, 2)}

Ensure the entire response is a single, valid JSON object.
`;

    return prompt;
};

// Map answers to text (no changes needed here)
const mapAnswerToText = (value) => {
    // ... same as your original function
    const mappings = { not_at_all: "no interest in", slightly: "slight interest in", moderately: "moderate interest in", very_much: "strong interest in", extremely: "extreme passion for", novice: "beginner level in", beginner: "basic knowledge of", intermediate: "competent with", advanced: "advanced skills in", expert: "expert mastery of", strongly_disagree: "strongly disagrees with", disagree: "disagrees with", neutral: "neutral about", agree: "agrees with", strongly_agree: "strongly agrees with", never: "never engages in", rarely: "rarely engages in", sometimes: "sometimes engages in", often: "often engages in", always: "always engages in", yes: "confirms", no: "does not confirm", maybe: "is uncertain about" };
    return mappings[value] || value;
};


// === STEP 3 (OPTIMIZATION): PROCESS THE LEAN AI RESPONSE AND MERGE WITH FULL DATA ===
const processAndMergeResponse = (responseText) => {
    try {
        const aiResponse = JSON.parse(responseText.replace(/```json|```/g, '').trim());

        const mergedSchools = (aiResponse.recommendedSchools || []).map(rec => {
            // Find the full school object from our local data using the ID from the AI
            const fullSchoolData = schoolsDataMap.get(rec.id);

            if (!fullSchoolData) {
                return null; // or a default object if the ID is invalid
            }

            // Combine the full data with the AI's specific recommendations
            return {
                ...fullSchoolData, // All the original school data
                identifiedRelevantPrograms: rec.identifiedRelevantPrograms || [],
                reasonForRecommendation: rec.reasonForRecommendation || "No reason provided."
            };
        }).filter(Boolean); // Filter out any nulls if an ID wasn't found

        // Return the full, structured response
        return {
            careerRecommendations: aiResponse.careerRecommendations || [],
            skillsAnalysis: aiResponse.skillsAnalysis || { strengths: [], skillsToDevelop: [] },
            actionPlans: aiResponse.actionPlans || { immediateNextSteps: [], shortTermGoals: [], longTermRoadmap: [] },
            potentialChallenges: aiResponse.potentialChallenges || { challenges: [], mitigationStrategies: [] },
            growthOpportunities: aiResponse.growthOpportunities || { sectors: [], emergingRoles: [] },
            personalInsights: aiResponse.personalInsights || { keyTakeaways: [], motivationalQuote: "" },
            resources: aiResponse.resources || { recommendedCourses: [], suggestedReadings: [], professionalTools: [] },
            recommendedSchools: mergedSchools
        };
    } catch (error) {
        console.error("Error parsing or merging AI response:", error);
        console.error("Problematic AI Response causing error:", responseText);
        // Return a default error structure
        return { error: true, message: "Failed to process AI response." };
    }
};

// The main handler function
const handler = async (req, res) => {
    await runMiddleware(req, res, cors);

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    try {
        const { answers, categories } = req.body;
        if (!answers || !categories) {
            return res.status(400).json({ message: 'Invalid request: Answers and categories are required.' });
        }

        const prompt = createOptimizedPrompt(answers, categories);

        const model = genAI.getGenerativeModel({
            model: "gemini-1.5-flash-latest",
            generationConfig: {
                responseMimeType: "application/json",
            },
            // Your safety settings are good
            safetySettings: [
                { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
                { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
                { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
                { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
            ],
        });

        const result = await model.generateContent(prompt);
        const llmResponseText = result.response.text();

        const processedResponse = processAndMergeResponse(llmResponseText);

        if (processedResponse.error) {
            return res.status(500).json({ message: processedResponse.message });
        }

        // Structure the final response exactly as your frontend expects it
        const responseData = {
            analysis: {
                careerRecommendations: processedResponse.careerRecommendations,
                skillsAnalysis: processedResponse.skillsAnalysis,
                actionPlan: processedResponse.actionPlans,
                potentialChallenges: processedResponse.potentialChallenges,
                growthOpportunities: processedResponse.growthOpportunities,
                insights: {
                    keyTakeaways: processedResponse.personalInsights.keyTakeaways,
                    motivationalQuote: processedResponse.personalInsights.motivationalQuote,
                },
                resources: processedResponse.resources,
                recommendedSchools: processedResponse.recommendedSchools
            }
        };

        return res.status(200).json(responseData);

    } catch (error) {
        console.error('Error in handler:', error);
        // Provide a more specific error message if the AI blocked the request
        if (error.message && error.message.includes("Candidate was blocked due to")) {
            return res.status(500).json({ message: 'AI response failed due to content safety filters. Please adjust your input.', error: error.toString() });
        }
        return res.status(500).json({ message: 'An internal server error occurred.', error: error.toString() });
    }
};

export default handler;