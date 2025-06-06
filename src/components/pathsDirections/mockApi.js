const existingMockSchools = [
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
  {
        id: '2', // Make sure IDs are strings for consistency if the first one is
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
        id: '3',
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
        id: '4',
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
        id: '5',
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
        id: '6',
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

const cameroonianProgramData = {
  "programs": {
    "Nursing": [
      "Faculty of Health Science (UBa)",
      "Fotabe University",
      "Higher Institute of Health Sciences (BUST)",
      "Saint Louis Higher Institute of Health and Biomedical Services",
      "Catholic University of Cameroon (CATUC, Bamenda)",
      "St. Jude University Institute",
      "International University, Bamenda",
      "Taniform University Institute of Bamenda",
      "Ebenezer Higher Institute of Science and Technology (EHIST)",
      "Florence Nightingale Higher Institute of Health and Biomedical Science (FLENHIHBS)",
      "Training School For State Registered Nurses, Bamenda",
      "BIHS - Mbingo Baptist Hospital"
    ],
    "Civil Engineering": [
      "University of Bamenda (UBa) – NAHPI & COLTECH",
      "Catholic University of Cameroon (CATUC)",
      "National Polytechnic University Institute (NPUI) Bamenda",
      "Bamenda University of Science and Technology (BUST)",
      "International University, Bamenda"
    ],
    "Computer Engineering": [
      "University of Bamenda (UBa) – NAHPI & COLTECH",
      "Catholic University of Cameroon (CATUC)",
      "Taniform University Institute of Bamenda (TUIB)",
      "National Polytechnic University Institute (NPUI)"
    ],
    "Medicine and Surgery": [
      "Catholic University of Cameroon (CATUC)",
      "Faculty of Health Science (UBa)"
    ],
    "Law": [
      "Faculty of Law and Political Science (UBa)",
      "Taniform University Institute of Bamenda",
      "National Polytechnic University Institute (NPUI)"
    ],
    "Agricultural Business (Agri Business)": [
      "College of Technology (COLTECH, UBa)",
      "Catholic University of Cameroon (CATUC)",
      "Taniform University Institute of Bamenda",
      "National Polytechnic University Institute (NPUI)",
      "Bamenda University of Science and Technology (BUST)"
    ],
    "Accounting and Finance": [
      "Faculty of Economics and Management Science (FEMS, UBa)",
      "Higher Institute of Commerce and Management (HICM)",
      "Catholic University of Cameroon (CATUC)",
      "Taniform University Institute of Bamenda",
      "National Polytechnic University Institute (NPUI)",
      "Bamenda University of Science and Technology (BUST)",
      "FONAB Polytechnic University"
    ],
    "Architecture": [
      "National Higher Polytechnic Institute (NAHPI, UBa)"
    ],
    "Pharmacy": [
      "Catholic University of Cameroon (CATUC)",
      "St. Jude University Institute (Pharmacy Technology)",
      "Taniform University Institute of Bamenda (Pharmacy Technology)",
      "International University, Bamenda"
    ],
    "Electrical Engineering": [
      "University of Bamenda (UBa) – NAHPI & COLTECH",
      "Bamenda University of Science and Technology (BUST)",
      "International University, Bamenda",
      "Taniform University Institute of Bamenda"
    ],
    "Software Engineering": [
      "National Higher Polytechnic Institute (NAHPI, UBa)",
      "College of Technology (COLTECH, UBa)",
      "Catholic University of Cameroon (CATUC)",
      "National Polytechnic University Institute (NPUI)",
      "Taniform University Institute of Bamenda"
    ],
    "Mechanical Engineering": [
      "National Higher Polytechnic Institute (NAHPI, UBa)",
      "Catholic University of Cameroon (CATUC)",
      "National Polytechnic University Institute (NPUI)",
      "Taniform University Institute of Bamenda"
    ],
    "Environmental Science": [
      "University of Bamenda (UBa)",
      "Catholic University of Cameroon (CATUC)"
    ],
    "Journalism and Mass Communication": [
      "University of Bamenda (UBa)",
      "Catholic University of Cameroon (CATUC)",
      "National Polytechnic University Institute (NPUI)",
      "Taniform University Institute of Bamenda"
    ],
    "Public Health": [
      "Faculty of Health Science (UBa)",
      "Faculty of Science (UBa)",
      "Catholic University of Cameroon (CATUC)"
    ],
    "Business Administration": [
      "Catholic University of Cameroon (CATUC)",
      "National Polytechnic University Institute (NPUI)",
      "Taniform University Institute of Bamenda",
      "Faculty of Economics and Management Science (FEMS, UBa)",
      "Higher Institute of Commerce and Management (HICM)"
    ],
    "Teachers Training": [
      "Higher Technical Teachers Training College (HTTTC, UBa)",
      "Higher Teacher Training College (HTTC, UBa)",
      "Catholic University of Cameroon (CATUC)",
      "National Polytechnic University Institute (NPUI)",
      "Taniform University Institute of Bamenda"
    ],
    "Psychology": [
      "Faculty of Education (UBa)",
      "Catholic University of Cameroon (CATUC)",
      "National Polytechnic University Institute (NPUI)",
      "Taniform University Institute of Bamenda"
    ],
    "Information Technology (IT)": [
      "College of Technology (COLTECH, UBa)",
      "National Higher Polytechnic Institute (NAHPI, UBa)",
      "Catholic University of Cameroon (CATUC)",
      "National Polytechnic University Institute (NPUI)",
      "Taniform University Institute of Bamenda"
    ],
    "Management": [
      "Faculty of Economics and Management Science (FEMS, UBa)",
      "Higher Institute of Commerce and Management (HICM)",
      "Catholic University of Cameroon (CATUC)",
      "National Polytechnic University Institute (NPUI)",
      "Taniform University Institute of Bamenda"
    ],
    "Marketing and Sales": [
      "University of Bamenda (UBa)",
      "Catholic University of Cameroon (CATUC)",
      "National Polytechnic University Institute (NPUI)",
      "Taniform University Institute of Bamenda"
    ],
    "Other Fields": {
      "Law and Political Science": [
        "Faculty of Law and Political Science (UBa)",
        "Taniform University Institute of Bamenda",
        "National Polytechnic University Institute (NPUI)"
      ],
      "Agriculture and Rural Development": [
        "College of Technology (COLTECH, UBa)",
        "Catholic University of Cameroon (CATUC)",
        "Bamenda University of Science and Technology (BUST)",
        "National Polytechnic University Institute (NPUI)",
        "Taniform University Institute of Bamenda"
      ],
      "Economics": [
        "Faculty of Economics and Management Science (FEMS, UBa)",
        "Catholic University of Cameroon (CATUC)",
        "Taniform University Institute of Bamenda"
      ],
      "Linguistics and Language Studies": [
        "Faculty of Arts (UBa) – Linguistics & African Languages",
        "University of Bamenda Language Centre (UBALAC)",
        "Taniform University Institute of Bamenda"
      ]
    }
  }
};

const placeholderImages = [
  "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=300&h=200&fit=crop", // Generic campus
  "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=300&h=200&fit=crop", // University building
  "https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?w=300&h=200&fit=crop", // Library/study
  "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=300&h=200&fit=crop", // Classroom
  "https://images.unsplash.com/photo-1532649532796-1f5585305d40?w=300&h=200&fit=crop", // Students walking
  "https://images.unsplash.com/photo-1606761568499-6d2451b23c66?w=300&h=200&fit=crop", // Modern university building
];

let nextId = existingMockSchools.length + 1; // Start IDs after the existing ones
let imageIndex = 0;

const schoolProgramMap = new Map();

// Populate map with schools and their programs
for (const programName in cameroonianProgramData.programs) {
  if (programName === "Other Fields") {
    for (const subCategoryName in cameroonianProgramData.programs["Other Fields"]) {
      const schoolsInSubCategory = cameroonianProgramData.programs["Other Fields"][subCategoryName];
      schoolsInSubCategory.forEach(schoolName => {
        if (!schoolProgramMap.has(schoolName)) {
          schoolProgramMap.set(schoolName, new Set());
        }
        schoolProgramMap.get(schoolName).add(subCategoryName); // Use subCategory as program name
      });
    }
  } else {
    const schoolsInProgram = cameroonianProgramData.programs[programName];
    schoolsInProgram.forEach(schoolName => {
      if (!schoolProgramMap.has(schoolName)) {
        schoolProgramMap.set(schoolName, new Set());
      }
      schoolProgramMap.get(schoolName).add(programName);
    });
  }
}

const cameroonianSchoolsFormatted = [];

schoolProgramMap.forEach((programsSet, schoolName) => {
  const programsList = Array.from(programsSet);
  const primaryProgram = programsList[0] || "Various Programs"; // Take the first program or a fallback

  // Create a more diverse description
  let programMentions = "";
  if (programsList.length === 1) {
    programMentions = `specializing in fields like ${programsList[0]}`;
  } else if (programsList.length > 1) {
    const mentioned = programsList.slice(0, Math.min(3, programsList.length -1 )).join(', ');
    const andMore = programsList.length > 3 ? ` and ${programsList.length - 3} more` : (programsList.length > 1 ? ` and ${programsList[programsList.length -1]}` : '');
    programMentions = `offering a diverse range of studies including ${mentioned}${andMore}`;
  }


  cameroonianSchoolsFormatted.push({
    id: String(nextId++),
    name: schoolName.trim(), // Trim any leading/trailing whitespace
    program: primaryProgram, // For simplicity, we list the first associated program
    location: "Bamenda, Cameroon", // General location
    duration: "Varies (Contact School)", // Placeholder
    tuition: "Contact School for Fees", // Placeholder
    ranking: "N/A",
    rating: parseFloat((Math.random() * (4.6 - 3.7) + 3.7).toFixed(1)), // Random rating between 3.7 and 4.6
    image: placeholderImages[imageIndex % placeholderImages.length],
    description: `${schoolName.trim()} is a notable institution in Cameroon, ${programMentions}. It is committed to providing quality education and fostering skilled professionals for various sectors. Students benefit from a curriculum designed to meet regional and international standards.`,
    requirements: [
      "Completed Secondary Education (e.g., GCE A-Level or Baccalauréat)",
      "Official academic transcripts and certificates",
      "Completed application form and applicable fees",
      "National Identity Card or Passport",
      "Specific subject prerequisites may apply depending on the chosen program",
      "May require an entrance examination or interview for certain faculties",
    ],
    applicationProcess: `Prospective students should visit the official website of ${schoolName.trim()} or contact their admissions office directly for the most current information on application procedures, deadlines, required documents, and specific entry requirements for their desired program of study.`,
  });
  imageIndex++;
});

// Combine the existing mock schools with the newly formatted Cameroonian schools
export const allMockSchools = [...cameroonianSchoolsFormatted];

// console.log(JSON.stringify(allMockSchools, null, 2)); // For testing
// You can now use `allMockSchools` in your application