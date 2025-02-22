// /api/process-assessment.js
import { GoogleGenerativeAI } from "@google/generative-ai";
import Cors from 'cors';
const API_KEY = "GET GEMINI API KEY HERE"

const genAI = new GoogleGenerativeAI(API_KEY);

// Initialize CORS middleware
const cors = Cors({
    origin: 'http://localhost:5173', // Your frontend URL
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


// Create a structured prompt from the assessment answers
const createPrompt = (answers, categories) => {
    let prompt = `As a career development AI specialist, analyze the following detailed career assessment results and provide comprehensive career guidance. The assessment covers multiple dimensions of career preferences and abilities:

`;

    categories.forEach(category => {
        prompt += `\n${category.title}:\n`;
        category.questions.forEach(question => {
            const answer = answers[question.id];
            if (answer) {
                prompt += `- ${question.text}: ${mapAnswerToText(answer)}\n`;
            }
        });
    });

    prompt += `\nBased on this comprehensive assessment, please provide:
1. Top 3 recommended career paths with detailed explanations of alignment
2. Key strengths and areas for development
3. Suggested next steps for career development
4. Potential challenges and how to overcome them
5. Long-term career growth opportunities

Please structure the response in a clear, organized format with sections and bullet points where appropriate. Include specific action items and resources for further development.`;

    return prompt;
};
// Process and enhance the LLM response
const enhanceResponse = (llmResponse) => {
    // Parse the response and add additional structure
    const sections = llmResponse.split('\n\n');

    return {
        timestamp: new Date().toISOString(),
        analysis: {
            careerPaths: sections[0],
            strengths: sections[1],
            nextSteps: sections[2],
            challenges: sections[3],
            growthOpportunities: sections[4]
        },
        metadata: {
            confidenceScore: 0.85,
            assessmentVersion: "1.0",
            analysisId: Math.random().toString(36).substr(2, 9)
        },
        resources: {
            recommendedCourses: [
                "Professional Development 101",
                "Leadership Essentials",
                "Industry-Specific Training"
            ],
            suggestedReadings: [
                "Career Development in the Digital Age",
                "Professional Networking Strategies",
                "Industry Trends and Insights"
            ]
        }
    };
};


const mapAnswerToText = (value) => {
    const mappings = {
        not_at_all: "no interest in",
        slightly: "slight interest in",
        moderately: "moderate interest in",
        very_much: "strong interest in",
        extremely: "extreme passion for",
        // Add more mappings as needed
    };
    return mappings[value] || value;
};

const handler = async (req, res) => {
    // Run the CORS middleware
    await runMiddleware(req, res, cors);

    if (!API_KEY) {
        console.error('GOOGLE_API_KEY is not configured');
        return res.status(500).json({
            message: 'Server configuration error',
            error: 'API key not configured'
        });
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        const { answers, categories } = req.body;

        // Log the received data
        console.log('Received assessment answers:', answers);

        // Create the prompt
        const prompt = createPrompt(answers, categories);
        console.log('Generated prompt:', prompt);

        // Get response from Gemini
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent(prompt);
        const llmResponse = result.response.text();

        console.log('Raw LLM response:', llmResponse);

        // Enhance and structure the response
        const enhancedResponse = enhanceResponse(llmResponse);
        console.log('Enhanced response:', enhancedResponse);

        return res.status(200).json(enhancedResponse);
    } catch (error) {
        console.error('Error processing assessment:', error);
        return res.status(500).json({
            message: 'Error processing assessment',
            error: error.message
        });
    }
};

export default handler;
