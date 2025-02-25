

// /api/process-assessment.js
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini AI

// // Check if API key exists
// if (!process.env.GOOGLE_API_KEY) {
//     throw new Error('GOOGLE_API_KEY is not defined in environment variables');
// }

// // Initialize Gemini AI
// const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

// Helper function to map answer values to more descriptive text

  



export default async function handler(req, res) {
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
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
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
}