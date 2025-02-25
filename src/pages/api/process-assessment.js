// pages/api/process-assessment.js
import { GoogleGenerativeAI } from '@google/generative-ai';

export const config = {
    runtime: 'edge',
};

export default async function handler(req) {
    if (req.method !== 'POST') {
        return new Response(
            JSON.stringify({ success: false, error: 'Method not allowed' }),
            {
                status: 405,
                headers: { 'Content-Type': 'application/json' },
            }
        );
    }

    try {
        const { answers, categories } = await req.json();

        // Initialize Gemini (API key stored in Vercel environment variables)
        const genAI = new GoogleGenerativeAI("AIzaSyCbyINErf8ybs1M0OzkDrmHCzPZlTetmHU");
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        // Create a structured prompt from the assessment data
        let prompt = `Based on the following career assessment responses, please provide detailed recommendations for college departments and potential career paths:\n\n`;

        // Add each category's responses to the prompt
        categories.forEach(category => {
            prompt += `${category.title}:\n`;
            category.questions.forEach(question => {
                const answer = answers[question.id];
                if (answer) {
                    const selectedOption = question.options.find(opt => opt.value === answer);
                    prompt += `- ${question.text}: ${selectedOption?.label}\n`;
                }
            });
            prompt += '\n';
        });

        // Add specific requests for recommendations
        prompt += `Please provide:\n`;
        prompt += `1. Top 3 recommended college departments/majors with explanations\n`;
        prompt += `2. Potential career paths within each department\n`;
        prompt += `3. Key skills to develop\n`;
        prompt += `4. Recommended extracurricular activities\n`;
        prompt += `5. Long-term career growth opportunities\n`;

        // Get response from Gemini
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const recommendation = response.text();

        return new Response(
            JSON.stringify({
                success: true,
                recommendation: {
                    fullResponse: recommendation,
                    timestamp: new Date().toISOString(),
                }
            }),
            {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
            }
        );
    } catch (error) {
        console.error('Error processing assessment:', error);
        return new Response(
            JSON.stringify({
                success: false,
                error: 'Failed to process assessment'
            }),
            {
                status: 500,
                headers: { 'Content-Type': 'application/json' },
            }
        );
    }
}