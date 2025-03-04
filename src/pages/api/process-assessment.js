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

        // Initialize Gemini (ideally API key should be in environment variables)
        const API_KEY = process.env.GOOGLE_API_KEY || "AIzaSyCbyINErf8ybs1M0OzkDrmHCzPZlTetmHU";
        const genAI = new GoogleGenerativeAI(API_KEY);
        
        // Use gemini-1.5-flash if available for better recommendations,
        // fallback to gemini-pro if necessary
        const modelName = "gemini-1.5-flash";
        const model = genAI.getGenerativeModel({ 
            model: modelName,
            generationConfig: {
                temperature: 0.7,  // Balanced between creativity and consistency
                topP: 0.95,        // Slightly more diverse outputs
                maxOutputTokens: 2048,  // Allow for detailed responses
            }
        });

        // Create a more detailed structured prompt
        let prompt = `As a college and career advisor, analyze this student's assessment results to provide highly personalized recommendations. 

ASSESSMENT RESULTS:
`;

        // Add each category's responses with more context
        categories.forEach(category => {
            prompt += `\n${category.title.toUpperCase()}:\n`;
            category.questions.forEach(question => {
                const answer = answers[question.id];
                if (answer) {
                    const selectedOption = question.options.find(opt => opt.value === answer);
                    // Include both the question text and selected answer for context
                    prompt += `- ${question.text}: ${selectedOption?.label || answer}\n`;
                }
            });
        });

        // Request specific, actionable recommendations
        prompt += `\nBased on this comprehensive assessment, please provide a personalized college and career guidance report with the following sections:

1. COLLEGE RECOMMENDATION:
   - Top 5 specific college departments/majors that align with this student's profile
   - For each recommended major, provide:
     * Why it's a good match based on their assessment responses
     * 2-3 specific courses they might enjoy in this major
     * Typical career outcomes for graduates

2. CAREER PATHWAYS:
   - 3-5 specific job titles/career paths that align with their strengths and interests
   - For each career, briefly describe:
     * Day-to-day responsibilities
     * Required skills and qualifications
     * Growth potential and typical advancement opportunities

3. SKILL DEVELOPMENT PLAN:
   - 3-5 key skills they should focus on developing now
   - Specific suggestions for how to develop each skill (courses, activities, etc.)

4. EXTRACURRICULAR RECOMMENDATIONS:
   - 3-4 specific extracurricular activities or organizations that would:
     * Enhance their college applications
     * Help develop relevant skills
     * Align with their interests

5. NEXT STEPS:
   - 3 immediate actions they can take this semester
   - 2-3 medium-term goals for the next academic year

Format this as a conversational, encouraging report directly addressing the student. Use no markdown formatting, asterisks, or numbered lists (use paragraph breaks and dashes instead). Organize the information clearly with headings and short paragraphs for readability.`;

        // Get response from Gemini
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const rawRecommendation = response.text();

        // Process the response to ensure no asterisks or markdown formatting
        const cleanRecommendation = rawRecommendation
            .replace(/\*/g, '')  // Remove asterisks
            .replace(/#{1,6}\s/g, '')  // Remove markdown headings
            .replace(/\n\s*\d+\.\s+/g, '\n')  // Remove numbered lists
            .replace(/\n\s*-\s+/g, '\n- ')  // Standardize bullet points
            .trim();

        // Extract key sections for structured data
        const sections = extractSections(cleanRecommendation);
        console.log(sections)

        return new Response(
            JSON.stringify({
                success: true,
                recommendation: {
                    fullResponse: cleanRecommendation,
                    sections: sections,
                    timestamp: new Date().toISOString(),
                    metadata: {
                        model: modelName,
                        version: "2.0",
                        analysisId: Date.now().toString(36) + Math.random().toString(36).substring(2, 7)
                    }
                }
            }),
            {
                status: 200,
                headers: { 
                    'Content-Type': 'application/json',
                    'Cache-Control': 'no-cache, no-store, must-revalidate'
                },
            }
        );
    } catch (error) {
        console.error('Error processing assessment:', error);
        
        // Determine if this is an API key error or another type
        const errorMessage = error.message || 'Failed to process assessment';
        const isApiKeyError = errorMessage.includes('API key') || 
                              errorMessage.includes('authentication') || 
                              errorMessage.includes('authorize');
        
        return new Response(
            JSON.stringify({
                success: false,
                error: isApiKeyError ? 
                    'AI service authentication error. Please check your configuration.' : 
                    'Failed to process assessment. Please try again later.',
                details: process.env.NODE_ENV === 'development' ? errorMessage : undefined
            }),
            {
                status: isApiKeyError ? 403 : 500,
                headers: { 'Content-Type': 'application/json' },
            }
        );
    }
}

// Helper function to extract key sections from the response
function extractSections(text) {
    // Define the section titles to look for
    const sectionTitles = [
        'COLLEGE RECOMMENDATION',
        'CAREER PATHWAYS',
        'SKILL DEVELOPMENT PLAN',
        'EXTRACURRICULAR RECOMMENDATIONS',
        'NEXT STEPS'
    ];
    
    const sections = {};
    
    // Extract each section by finding its title and then extracting content until the next section title
    sectionTitles.forEach((title, index) => {
        const titleRegex = new RegExp(`${title}:?\\s*`, 'i');
        const titleMatch = text.match(titleRegex);
        
        if (titleMatch) {
            const startIndex = titleMatch.index + titleMatch[0].length;
            let endIndex;
            
            // Find the next section title, if any
            if (index < sectionTitles.length - 1) {
                const nextTitleRegex = new RegExp(`${sectionTitles[index + 1]}:?\\s*`, 'i');
                const nextTitleMatch = text.substr(startIndex).match(nextTitleRegex);
                endIndex = nextTitleMatch ? startIndex + nextTitleMatch.index : text.length;
            } else {
                endIndex = text.length;
            }
            
            // Extract and clean the section content
            let sectionContent = text.substring(startIndex, endIndex).trim();
            
            // Convert title to a key (lowercase, underscores)
            const key = title.toLowerCase().replace(/\s+/g, '_');
            sections[key] = sectionContent;
        }
    });
    
    return sections;
}