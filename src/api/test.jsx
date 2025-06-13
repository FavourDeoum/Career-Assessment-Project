// At the top of your src/api/app-test.js (or .ts)
// ... other imports like GoogleGenerativeAI ...
import Cors from 'cors';

// Initialize CORS middleware (make sure your production URL is correct)
const corsInstance = Cors({
    origin: (origin, callback) => {
        const allowedOrigins = [
            'http://localhost:5173', // Your local dev frontend
            'https://career-assessment-project.vercel.app' // Your deployed frontend
            // Add any Vercel preview URLs if you use them often and want to be specific,
            // or rely on a broader check for *.vercel.app if necessary
        ];
        if (!origin || allowedOrigins.includes(origin) || (origin && origin.endsWith('.vercel.app'))) {
            // Allow requests with no origin (like curl, server-to-server)
            // Allow specific origins
            // Allow Vercel preview deployment origins (e.g., your-project-git-branch-org.vercel.app)
            callback(null, true);
        } else {
            console.warn(`CORS: Origin not allowed: ${origin}`);
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['POST', 'GET', 'OPTIONS'], // Crucial: OPTIONS must be here
    allowedHeaders: ['Content-Type', 'Authorization'], // Add any custom headers your frontend sends
    credentials: true,
});

// Helper to run middleware
function runMiddleware(req, res, fn) {
    return new Promise((resolve, reject) => {
        fn(req, res, (result) => {
            if (result instanceof Error) {
                console.error("Error in CORS middleware:", result); // Added logging
                return reject(result);
            }
            return resolve(result);
        });
    });
}

// ... (your API_KEY, genAIInstance, SCHOOLS_DATA_STRING, schoolsData, createPrompt, mapAnswerToText, processResponse functions remain the same) ...

// YOUR UPDATED HANDLER FUNCTION:
const handler = async (req, res) => {
    console.log(`[API /api/app-test] Received request. Method: ${req.method}`); // For debugging

    // Run the CORS middleware
    try {
        await runMiddleware(req, res, corsInstance);
        console.log("[API /api/app-test] CORS middleware processed."); // For debugging
    } catch (error) {
        // If CORS middleware itself throws an error (e.g., origin not allowed)
        if (error.message === 'Not allowed by CORS') {
            return res.status(403).json({ message: 'Not allowed by CORS policy.' });
        }
        // For other unexpected middleware errors
        return res.status(500).json({ message: 'CORS middleware error', error: error.toString() });
    }

    // Explicitly handle OPTIONS preflight requests AFTER CORS has set headers
    // The `cors` middleware should ideally send a 204 for OPTIONS,
    // but this is a safeguard.
    if (req.method === 'OPTIONS') {
        console.log("[API /api/app-test] Responding to OPTIONS request with 204.");
        // CORS headers should have been set by the `corsInstance` middleware already.
        // We just need to end the response.
        return res.status(204).end();
    }

    // API Key Check (remains the same)
    if (!API_KEY || API_KEY === "YOUR_GOOGLE_AI_API_KEY" || API_KEY === "AIzaSyBoDQH2qx788AF_QG5fMw737S7PBoaq_yg") {
        console.error('[API /api/app-test] Google AI API key not configured or is a placeholder/exposed key.');
        return res.status(500).json({ message: 'Server configuration error: API key issue' });
    }

    if (!genAIInstance && API_KEY) { // Initialize genAI if not already
        console.log("[API /api/app-test] Initializing GoogleGenerativeAI instance.");
        genAIInstance = new GoogleGenerativeAI(API_KEY);
    }
    if (!genAIInstance) {
         console.error('[API /api/app-test] Google AI SDK not initialized. API key might be missing.');
         return res.status(500).json({ message: 'Server configuration error: AI SDK initialization' });
    }

    // Main logic for POST requests
    if (req.method === 'POST') {
        console.log("[API /api/app-test] Processing POST request.");
        try {
            const { answers, categories } = req.body;

            if (!answers || Object.keys(answers).length === 0 || !categories || categories.length === 0) {
                console.warn("[API /api/app-test] Invalid request data for POST.");
                return res.status(400).json({ message: 'Invalid request data: Answers and categories are required' });
            }

            // ... (rest of your POST logic: createPrompt, model.generateContent, processResponse, etc.)
            // Make sure to use genAIInstance:
            const model = genAIInstance.getGenerativeModel({
                 model: "gemini-1.5-flash-latest",
                 safetySettings: [/* ... */],
                  generationConfig: { responseMimeType: "application/json" }
            });
            const prompt = createPrompt(answers, categories, schoolsData);
            const result = await model.generateContent(prompt);
            const llmResponseText = result.response.text();
            const processedResponse = processResponse(llmResponseText);

            const responseData = {
                analysis: {
                    careerRecommendations: processedResponse.careerRecommendations,
                    skillsAnalysis: processedResponse.skillsAnalysis,
                    actionPlan: processedResponse.actionPlans, // Ensure this matches your processResponse output
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
            console.log("[API /api/app-test] Successfully processed POST. Sending 200 OK.");
            return res.status(200).json(responseData);

        } catch (error) {
            console.error('[API /api/app-test] Error during POST processing:', error);
            // ... (your existing error handling for Gemini errors, etc.)
            if (error.message && error.message.includes("Candidate was blocked due to")) {
                return res.status(500).json({ message: 'AI response generation failed due to content safety filters.', error: error.toString() });
            }
            return res.status(500).json({ message: 'Error processing POST request', error: error.toString() });
        }
    } else {
        // Handle any other methods (like GET, PUT, DELETE) that are not OPTIONS or POST
        console.warn(`[API /api/app-test] Method ${req.method} not allowed. Expected POST or OPTIONS. Sending 405.`);
        res.setHeader('Allow', 'POST, OPTIONS, GET'); // Inform client which methods are generally allowed by CORS (GET is often included for health checks or other endpoints)
        return res.status(405).json({ message: `Method ${req.method} Not Allowed. Only POST and OPTIONS are actively handled by this endpoint.` });
    }
};

export default handler;