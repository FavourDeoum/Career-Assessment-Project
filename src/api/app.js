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

// Create a prompt for the AI
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

Make sure the response is always a valid JSON format. And then where we have the job title, it should always come along with the explanation only.`;

    return prompt;
};

// Map answers to text
const mapAnswerToText = (value) => {
    const mappings = {
        // Interest levels
        not_at_all: "no interest in",
        slightly: "slight interest in",
        moderately: "moderate interest in",
        very_much: "strong interest in",
        extremely: "extreme passion for",
        
        // Skill levels
        novice: "beginner level in",
        beginner: "basic knowledge of",
        intermediate: "competent with",
        advanced: "advanced skills in",
        expert: "expert mastery of",
        
        // Agreement levels
        strongly_disagree: "strongly disagrees with",
        disagree: "disagrees with",
        neutral: "neutral about",
        agree: "agrees with",
        strongly_agree: "strongly agrees with",
        
        // Frequency
        never: "never engages in",
        rarely: "rarely engages in",
        sometimes: "sometimes engages in",
        often: "often engages in",
        always: "always engages in",
        
        // Yes/No with context
        yes: "confirms",
        no: "does not confirm",
        maybe: "is uncertain about"
    };
    return mappings[value] || value;
};

// Generate resources based on answers and categories
const generateResources = (answers, categories) => ({
    recommendedCourses: [],
    suggestedReadings: [],
    professionalTools: []
});

// Process the AI response
const processResponse = (response) => {
    // Remove any leading/trailing backticks or extra formatting characters
    response = response.replace(/```json|```/g, '').trim();

    // Check if the response is valid JSON
    if (!response.startsWith('{') && !response.startsWith('[')) {
        console.error("Invalid JSON response from AI:", response);
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

        // Validate request data
        if (!answers || Object.keys(answers).length === 0 || !categories || categories.length === 0) {
            return res.status(400).json({ message: 'Invalid request data: Answers and categories are required' });
        }

        // Log incoming data
        console.log("Received Answers:", answers);
        console.log("Received Categories:", categories);

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

export default handler;