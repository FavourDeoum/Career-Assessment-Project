// import { GoogleGenerativeAI } from "@google/generative-ai";
// import Cors from 'cors';

// const API_KEY = "AIzaSyBoDQH2qx788AF_QG5fMw737S7PBoaq_yg";
// const genAI = new GoogleGenerativeAI(API_KEY);

// // Initialize CORS middleware
// const cors = Cors({
//     origin: 'http://localhost:5173', // frontend URL
//     methods: ['POST', 'GET', 'OPTIONS'],
//     credentials: true,
// });

// // Helper to run middleware
// function runMiddleware(req, res, fn) {
//     return new Promise((resolve, reject) => {
//         fn(req, res, (result) => {
//             if (result instanceof Error) {
//                 return reject(result);
//             }
//             return resolve(result);
//         });
//     });
// }

// // Generate a more robust unique ID
// const generateUniqueId = () => {
//     const timestamp = Date.now().toString(36);
//     const randomPart = Math.random().toString(36).substring(2, 9);
//     const counter = (generateUniqueId.counter = (generateUniqueId.counter || 0) + 1);
    
//     return `${timestamp}-${randomPart}-${counter}`.substring(0, 36);
// };

// // Create a more detailed and structured prompt
// const createPrompt = (answers, categories) => {
//     let prompt = `As a career development AI specialist, provide a comprehensive career analysis based on the following assessment results:`;

//     categories.forEach(category => {
//         prompt += `\n\n${category.title.toUpperCase()}:\n`;
//         category.questions.forEach(question => {
//             const answer = answers[question.id];
//             if (answer) {
//                 prompt += `- ${question.text}: ${mapAnswerToText(answer)}\n`;
//             }
//         });
//     });

//     // Detailed output instructions
//     prompt += `\n\nGenerate a comprehensive career analysis with these specific requirements:

// 1. CAREER RECOMMENDATIONS:
//    - Provide 5 specific job titles exactly matching this profile
//    - Explain why each job is a perfect match
//    - Include precise salary ranges and growth projections
//    - Rank recommendations from most to least suitable

// 2. SKILLS ANALYSIS:
//    - Identify top 5 strengths with precise development strategies
//    - Recommend 3-5 critical skills to enhance career potential
//    - Provide specific learning paths for skill improvement

// 3. ACTION PLAN:
//    - Immediate next steps (3 actionable items)
//    - 6-12 month strategic goals
//    - Long-term career development roadmap
//    - Prioritize actions with estimated impact

// 4. POTENTIAL CHALLENGES:
//    - Identify top 3 career obstacles
//    - Develop targeted mitigation strategies
//    - Provide resilience-building recommendations

// 5. GROWTH OPPORTUNITIES:
//    - Highlight 3 high-potential industry sectors
//    - Identify emerging roles in next 3-5 years
//    - Recommend cutting-edge skill acquisitions

// Format response in clear, conversational language. Avoid technical jargon. Use concrete, actionable insights.`;

//     return prompt;
// };

// // Enhanced mapping function
// const mapAnswerToText = (value) => {
//     if (typeof value === 'object') {
//         return JSON.stringify(value);
//     }
    
//     const mappings = {
//         not_at_all: "no interest in",
//         slightly: "slight interest in",
//         moderately: "moderate interest in",
//         very_much: "strong interest in",
//         extremely: "extreme passion for",
        
//         novice: "beginner level skill",
//         beginner: "basic competency",
//         intermediate: "solid working knowledge",
//         advanced: "advanced professional skill",
//         expert: "expert-level mastery",
        
//         strongly_disagree: "strongly challenges",
//         disagree: "has reservations about",
//         neutral: "open-minded towards",
//         agree: "strongly supports",
//         strongly_agree: "deeply aligns with",
        
//         never: "does not engage",
//         rarely: "occasionally explores",
//         sometimes: "moderately interested in",
//         often: "consistently pursues",
//         always: "passionately committed to"
//     };
    
//     return mappings[value] || value;
// };

// // Comprehensive response processor
// const processResponse = (llmResponse) => {
//     const cleanResponse = llmResponse.replace(/\*/g, '');
    
//     return {
//         assessmentMetadata: {
//             analysisId: generateUniqueId(),
//             timestamp: new Date().toISOString(),
//             version: "3.0",
//             profileStrength: calculateProfileStrength(cleanResponse)
//         },
//         careerRecommendations: extractCareerRecommendations(cleanResponse),
//         skillsAnalysis: extractSkillsAnalysis(cleanResponse),
//         actionPlans: extractActionPlans(cleanResponse),
//         potentialChallenges: extractPotentialChallenges(cleanResponse),
//         growthOpportunities: extractGrowthOpportunities(cleanResponse),
//         personalInsights: {
//             keyTakeaways: extractKeyTakeaways(cleanResponse),
//             motivationalQuote: generateMotivationalQuote()
//         }
//     };
// };

// // Helper functions for extraction (placeholders - to be implemented with regex)
// const extractCareerRecommendations = (response) => {
//     const recommendationSection = response.match(/CAREER RECOMMENDATIONS:([\s\S]*?)(?=\d+\.)/i);
//     return recommendationSection ? parseRecommendedRoles(recommendationSection[1]) : [];
// };

// const parseRecommendedRoles = (section) => {
//     const roles = section.split('\n')
//         .filter(line => line.trim().startsWith('-'))
//         .map(line => ({
//             title: line.replace(/^-\s*/, '').split(':')[0].trim(),
//             matchReasons: line.split(':')[1] ? line.split(':')[1].trim().split('\n') : []
//         }));
    
//     return roles;
// };

// const extractSkillsAnalysis = (response) => {
//     const skillsSection = response.match(/SKILLS ANALYSIS:([\s\S]*?)(?=\d+\.)/i);
//     return skillsSection ? processSkillsSection(skillsSection[1]) : {};
// };

// const processSkillsSection = (section) => ({
//     strengths: section.split('\n')
//         .filter(line => line.trim().startsWith('-'))
//         .map(line => line.replace(/^-\s*/, '').trim())
// });

// // Placeholder extraction functions for other sections
// const extractActionPlans = (response) => ({});
// const extractPotentialChallenges = (response) => ({});
// const extractGrowthOpportunities = (response) => ({});
// const extractKeyTakeaways = (response) => [];

// const calculateProfileStrength = (response) => ({
//     compatibilityScore: Math.min(90, (response.match(/strong/gi) || []).length * 15),
//     matchConfidence: determineConfidenceLevel(response)
// });

// const determineConfidenceLevel = (response) => {
//     const confidenceLevels = ['Low', 'Medium', 'High', 'Very High'];
//     const score = (response.match(/strong/gi) || []).length * 15;
    
//     if (score < 30) return 'Low';
//     if (score < 60) return 'Medium';
//     if (score < 85) return 'High';
//     return 'Very High';
// };

// const generateMotivationalQuote = () => {
//     const quotes = [
//         "Your career is a journey of continuous growth and discovery.",
//         "Embrace challenges as opportunities for personal development.",
//         "Success is not a destination, but a continuous evolution."
//     ];
//     return quotes[Math.floor(Math.random() * quotes.length)];
// };

// const generateResources = (answers, categories) => ({
//     recommendedCourses: [
//         // "Professional Development Masterclass",
//         // "Advanced Career Strategy Workshop",
//         // "Industry-Specific Skill Bootcamp"
//     ],
//     suggestedReadings: [
//         // "Navigating Your Career Trajectory",
//         // "Strategic Professional Growth",
//         // "Innovative Career Development"
//     ],
//     professionalTools: [
//         // "LinkedIn Learning",
//         // "Coursera Career Track",
//         // "Professional Networking Platforms"
//     ]
// });

// const handler = async (req, res) => {
//     await runMiddleware(req, res, cors);

//     if (!API_KEY) {
//         return res.status(500).json({
//             message: 'Server configuration error',
//             error: 'API key not configured'
//         });
//     }

//     if (req.method !== 'POST') {
//         return res.status(405).json({ message: 'Method not allowed' });
//     }

//     try {
//         const { answers, categories } = req.body;

//         const prompt = createPrompt(answers, categories);
        
//         const model = genAI.getGenerativeModel({ 
//             model: "gemini-1.5-flash",
//             generationConfig: {
//                 temperature: 0.7,
//                 topP: 0.9,
//                 topK: 40,
//                 maxOutputTokens: 2048,
//             }
//         });
        
//         const result = await model.generateContent(prompt);
//         const llmResponse = result.response.text();

//         console.log(llmResponse);

//         const processedResponse = processResponse(llmResponse);
//         console.log(processedResponse);

//         processedResponse.resources = generateResources(answers, categories);
        
//         return res.status(200).json(processedResponse);
//     } catch (error) {
//         console.error('Error processing assessment:', error);
//         return res.status(500).json({
//             message: 'Error processing career assessment',
//             error: error.message
//         });
//     }
// };

// export default handler;


































import { GoogleGenerativeAI } from "@google/generative-ai";
import Cors from 'cors';

const API_KEY = "AIzaSyBoDQH2qx788AF_QG5fMw737S7PBoaq_yg";
const genAI = new GoogleGenerativeAI(API_KEY);

// Initialize CORS middleware
const cors = Cors({
    origin: 'http://localhost:5173', // Allow only your frontend URL
    methods: ['POST', 'GET', 'OPTIONS'],
    credentials: true,
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

// Generate a unique ID
const generateUniqueId = () => {
    const timestamp = Date.now().toString(36);
    const randomPart = Math.random().toString(36).substring(2, 9);
    const counter = (generateUniqueId.counter = (generateUniqueId.counter || 0) + 1);
    return `${timestamp}-${randomPart}-${counter}`.substring(0, 36);
};

const createPrompt = (answers, categories) => {
    let prompt = `As a career development AI specialist, provide a comprehensive career analysis based on the following assessment results:`;

    categories.forEach(category => {
        prompt += `\n\n${category.title.toUpperCase()}:\n`;
        category.questions.forEach(question => {
            const answer = answers[question.id];
            if (answer) {
                prompt += `- ${question.text}: ${mapAnswerToText(answer)}\n`;
            }
        });
    });

    prompt += `\n\nGenerate a comprehensive career analysis with these specific requirements:
1. CAREER RECOMMENDATIONS: Provide 5 specific job titles, explain why each is a match, and include salary ranges.
2. SKILLS ANALYSIS: Identify top 5 strengths and recommend 3-5 critical skills to develop.
3. ACTION PLAN: Provide immediate next steps, 6-12 month goals, and a long-term roadmap.
4. POTENTIAL CHALLENGES: Identify top 3 obstacles and mitigation strategies.
5. GROWTH OPPORTUNITIES: Highlight 3 high-potential industry sectors and emerging roles.
6. RESOURCES: Recommend courses, readings, and tools for professional development.

Please provide a structured JSON response based on the following details:
{
    "careerRecommendations": [],
    "skillsAnalysis": {
        "strengths": [],
        "skillsToDevelop": []
    },
    "actionPlans": {
        "immediateNextSteps": [],
        "shortTermGoals": [],
        "longTermRoadmap": []
    },
    "potentialChallenges": {
        "challenges": [],
        "mitigationStrategies": []
    },
    "growthOpportunities": {
        "sectors": [],
        "emergingRoles": []
    },
    "personalInsights": {
        "keyTakeaways": [],
        "motivationalQuote": ""
    },
    "resources": {
        "recommendedCourses": [],
        "suggestedReadings": [],
        "professionalTools": []
    }
}

User Data:
${JSON.stringify(answers, null, 2)}

Make sure the response is always a valid JSON format.`;

    return prompt;
};

// Map answers to text
const mapAnswerToText = (value) => {
    const mappings = {
        not_at_all: "no interest in",
        slightly: "slight interest in",
        moderately: "moderate interest in",
        very_much: "strong interest in",
        extremely: "extreme passion for",
        novice: "beginner level skill",
        beginner: "basic competency",
        intermediate: "solid working knowledge",
        advanced: "advanced professional skill",
        expert: "expert-level mastery",
        strongly_disagree: "strongly challenges",
        disagree: "has reservations about",
        neutral: "open-minded towards",
        agree: "strongly supports",
        strongly_agree: "deeply aligns with",
        never: "does not engage",
        rarely: "occasionally explores",
        sometimes: "moderately interested in",
        often: "consistently pursues",
        always: "passionately committed to"
    };
    return mappings[value] || value;
};

// Process the LLM response


// Helper functions for extraction
const extractCareerRecommendations = (response) => {
    const recommendationSection = response.match(/CAREER RECOMMENDATIONS:([\s\S]*?)(?=\d+\.)/i);
    return recommendationSection ? parseRecommendedRoles(recommendationSection[1]) : [];
};

const parseRecommendedRoles = (section) => {
    return section.split('\n')
        .filter(line => line.trim().startsWith('-'))
        .map(line => ({
            title: line.replace(/^-\s*/, '').split(':')[0].trim(),
            matchReasons: line.split(':')[1] ? line.split(':')[1].trim().split('\n') : []
        }));
};

const extractSkillsAnalysis = (response) => {
    const skillsSection = response.match(/SKILLS ANALYSIS:([\s\S]*?)(?=\d+\.)/i);
    return skillsSection ? processSkillsSection(skillsSection[1]) : {};
};

const processSkillsSection = (section) => ({
    strengths: section.split('\n')
        .filter(line => line.trim().startsWith('-'))
        .map(line => line.replace(/^-\s*/, '').trim())
});

// Placeholder extraction functions
const extractActionPlans = (response) => ({});
const extractPotentialChallenges = (response) => ({});
const extractGrowthOpportunities = (response) => ({});
const extractKeyTakeaways = (response) => [];

const calculateProfileStrength = (response) => ({
    compatibilityScore: Math.min(90, (response.match(/strong/gi) || []).length * 15),
    matchConfidence: determineConfidenceLevel(response)
});

const determineConfidenceLevel = (response) => {
    const score = (response.match(/strong/gi) || []).length * 15;
    if (score < 30) return 'Low';
    if (score < 60) return 'Medium';
    if (score < 85) return 'High';
    return 'Very High';
};

const generateMotivationalQuote = () => {
    const quotes = [
        "Your career is a journey of continuous growth and discovery.",
        "Embrace challenges as opportunities for personal development.",
        "Success is not a destination, but a continuous evolution."
    ];
    return quotes[Math.floor(Math.random() * quotes.length)];
};

const generateResources = (answers, categories) => ({
    recommendedCourses: [],
    suggestedReadings: [],
    professionalTools: []
});

// Handler function
const handler = async (req, res) => {
    await runMiddleware(req, res, cors);

    if (!API_KEY) {
        return res.status(500).json({ message: 'Server configuration error', error: 'API key not configured' });
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        const { answers, categories } = req.body;

        // Log incoming data
        console.log("Received Answers:", answers);
        console.log("Received Categories:", categories);

        if (!answers || !categories) {
            return res.status(400).json({ message: 'Invalid request data' });
        }

        const prompt = createPrompt(answers, categories);
        console.log("Generated Prompt:", prompt);

        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
        const result = await model.generateContent(prompt);
        const llmResponse = result.response.text();
        console.log("LLM Response:", llmResponse);

        // Process the AI model's response
        const processedResponse = processResponse(llmResponse);
        console.log("Processed Response:", processedResponse);

        // Generate resources based on answers and categories
        processedResponse.resources = generateResources(answers, categories);

        const responseData = {
            analysis: {
                careerRecommendations: processedResponse.careerRecommendations || [],
                skillsAnalysis: processedResponse.skillsAnalysis || {},
                actionPlan: processedResponse.actionPlans || {},
                potentialChallenges: processedResponse.potentialChallenges || {},
                growthOpportunities: processedResponse.growthOpportunities || {},
                insights: {
                    keyTakeaways: processedResponse.personalInsights?.keyTakeaways || [],
                    motivationalQuote: processedResponse.personalInsights?.motivationalQuote || "",
                },
                resources: processedResponse.resources || {}
            }
        };

        return res.status(200).json(responseData);
    } catch (error) {
        console.error('Error processing assessment:', error);
        return res.status(500).json({ message: 'Error processing career assessment', error: error.message });
    }
};

// Updated processResponse function
const processResponse = (response) => {
    // Remove any leading/trailing backticks or extra formatting characters
    response = response.replace(/```json|```/g, '').trim();

    try {
        const parsedResponse = JSON.parse(response);

        return {
            careerRecommendations: parsedResponse.careerRecommendations || [],
            skillsAnalysis: {
                strengths: parsedResponse.skillsAnalysis?.strengths || [],
                skillsToDevelop: parsedResponse.skillsAnalysis?.skillsToDevelop || []
            },
            actionPlans: {
                immediateNextSteps: parsedResponse.actionPlans?.immediateNextSteps || [],
                shortTermGoals: parsedResponse.actionPlans?.shortTermGoals || [],
                longTermRoadmap: parsedResponse.actionPlans?.longTermRoadmap || []
            },
            potentialChallenges: {
                challenges: parsedResponse.potentialChallenges?.challenges || [],
                mitigationStrategies: parsedResponse.potentialChallenges?.mitigationStrategies || []
            },
            growthOpportunities: {
                sectors: parsedResponse.growthOpportunities?.sectors || [],
                emergingRoles: parsedResponse.growthOpportunities?.emergingRoles || []
            },
            personalInsights: {
                keyTakeaways: parsedResponse.personalInsights?.keyTakeaways || [],
                motivationalQuote: parsedResponse.personalInsights?.motivationalQuote || ""
            },
            resources: {
                recommendedCourses: parsedResponse.resources?.recommendedCourses || [],
                suggestedReadings: parsedResponse.resources?.suggestedReadings || [],
                professionalTools: parsedResponse.resources?.professionalTools || []
            }
        };
    } catch (error) {
        console.error("Error parsing response:", error);
        return {
            careerRecommendations: [],
            skillsAnalysis: {},
            actionPlans: {},
            potentialChallenges: {},
            growthOpportunities: {},
            personalInsights: {
                keyTakeaways: [],
                motivationalQuote: ""
            },
            resources: {
                recommendedCourses: [],
                suggestedReadings: [],
                professionalTools: []
            }
        };
    }
};

export default handler;


