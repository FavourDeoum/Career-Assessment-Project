import { GoogleGenerativeAI } from "@google/generative-ai";
import Cors from 'cors';
const API_KEY = "AIzaSyBoDQH2qx788AF_QG5fMw737S7PBoaq_yg";

const genAI = new GoogleGenerativeAI(API_KEY);

// Initialize CORS middleware
const cors = Cors({
    origin: 'https://career-assessment-project.vercel.app/', //frontend URL
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

// Create a more detailed and structured prompt from the assessment answers
const createPrompt = (answers, categories) => {
    let prompt = `As a career development AI specialist, I need you to analyze this individual's career assessment results and provide highly specific career guidance.  The assessment covers multiple dimensions of career preferences and abilities:`;

    // Add each category and the user's answers
    categories.forEach(category => {
        prompt += `\n\n${category.title.toUpperCase()}:\n`;
        category.questions.forEach(question => {
            const answer = answers[question.id];
            if (answer) {
                prompt += `- ${question.text}: ${mapAnswerToText(answer)}\n`;
            }
        });
    });

    // Add specific instructions for the output format
    prompt += `\n\nBased on this assessment, please generate a personalized career analysis with the following sections:

1. CAREER RECOMMENDATIONS:
   - Provide 5 specific job titles that match this profile
   - For each job title, explain why it's a good match based on their assessment answers
   - Include typical salary ranges and growth outlook for each role

2. SKILLS ANALYSIS:
   - Identify 3-5 key strengths based on their responses
   - Suggest 3-5 skills they should develop to enhance career prospects

3. ACTION PLAN:
   - List 3 immediate next steps they should take
   - Recommend 3 medium-term goals (6-12 months)
   - Suggest 1-2 long-term career development strategies

4. POTENTIAL CHALLENGES:
   - Identify 2-3 obstacles they might face based on their profile
   - Provide specific strategies to overcome each challenge

5. GROWTH OPPORTUNITIES:
   - Suggest 2-3 industry sectors with strong potential for them
   - Identify emerging roles that might suit their profile in the next 3-5 years

6. RESOURCE RECOMMENDATIONS:
   - Recommend 3 online courses or certifications
    - Suggest 3 books or articles for further reading
    - Provide 3 tools or platforms for professional development
    from each of the above, give appropriate online links or sources for the individual to access.


Format your response in clean, conversational language with no asterisks or markdown symbols. Use clear headings and paragraph breaks for readability.`;

    return prompt;
};

// Better mapping function with more variations and context
const mapAnswerToText = (value) => {
    if (typeof value === 'object') {
        // Handle complex answer objects if any
        return JSON.stringify(value);
    }
    
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

// Process and enhance the LLM response
const processResponse = (llmResponse) => {
    // Remove any markdown formatting characters like asterisks
    let cleanResponse = llmResponse.replace(/\*/g, '');
    
    // Split the response into sections based on numbered headings
    const sectionMatches = cleanResponse.match(/\d+\.\s+[A-Z\s]+:[\s\S]*?(?=\d+\.\s+[A-Z\s]+:|$)/g) || [];
    
    // Initialize the structured response
    const structuredResponse = {
        timestamp: new Date().toISOString(),
        analysis: {
            careerRecommendations: "",
            skillsAnalysis: "",
            actionPlan: "",
            challenges: "",
            growthOpportunities: ""
        },
        metadata: {
            assessmentVersion: "2.0",
            analysisId: generateUniqueId()
        }
    };
    
    // Map sections to the appropriate fields
    sectionMatches.forEach(section => {
        if (section.match(/1\.\s+CAREER RECOMMENDATIONS/i)) {
            structuredResponse.analysis.careerRecommendations = cleanSectionText(section);
        } else if (section.match(/2\.\s+SKILLS ANALYSIS/i)) {
            structuredResponse.analysis.skillsAnalysis = cleanSectionText(section);
        } else if (section.match(/3\.\s+ACTION PLAN/i)) {
            structuredResponse.analysis.actionPlan = cleanSectionText(section);
        } else if (section.match(/4\.\s+POTENTIAL CHALLENGES/i)) {
            structuredResponse.analysis.challenges = cleanSectionText(section);
        } else if (section.match(/5\.\s+GROWTH OPPORTUNITIES/i)) {
            structuredResponse.analysis.growthOpportunities = cleanSectionText(section);
        }
    });
    
    // If structured parsing fails, use the whole text
    if (!Object.values(structuredResponse.analysis).some(value => value.length > 0)) {
        structuredResponse.analysis = {
            fullAnalysis: cleanResponse
        };
    }
    
    return structuredResponse;
};

// Helper to clean section text
const cleanSectionText = (text) => {
    // Remove the section header
    return text.replace(/^\d+\.\s+[A-Z\s]+:\s*/i, '').trim();
};

// Generate a unique ID
const generateUniqueId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substring(2, 9);
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

        // Log the received data at debug level
        console.log('Received assessment data', answers);

        // Create the prompt
        const prompt = createPrompt(answers, categories);
        console.log('Generated Prompt', prompt);
        
        // Get response from Gemini with more specific parameters
        const model = genAI.getGenerativeModel({ 
            model: "gemini-1.5-flash",
            generationConfig: {
                temperature: 0.7,
                topP: 0.9,
                topK: 40,
                maxOutputTokens: 2048,
            }
        });
        
        const result = await model.generateContent(prompt);
        const llmResponse = result.response.text();

        console.log('Raw LLM response:', llmResponse);

        // Process and structure the response
        const processedResponse = processResponse(llmResponse);
        console.log('Enhanced Response', processedResponse)
        
        // Add personalized resources based on assessment
        processedResponse.resources = generateResources(answers, categories);
        
        return res.status(200).json(processedResponse);
    } catch (error) {
        console.error('Error processing assessment:', error);
        return res.status(500).json({
            message: 'Error processing career assessment',
            error: error.message
        });
    }
};

// Generate personalized resources based on assessment answers
const generateResources = (answers, categories) => {
    // Basic implementation - in a real app, you'd use the answers to customize resources
    const resources = {
        recommendedCourses: [
            "Professional Development for Your Career Path",
            "Essential Skills Bootcamp",
            "Industry Certification Programs"
        ],
        suggestedReadings: [
            "Career Development in the Digital Economy",
            "Networking Strategies for Professionals",
            "Future-Proofing Your Career"
        ],
        usefulTools: [
            "LinkedIn Learning",
            "Coursera",
            "Industry-specific job boards"
        ]
    };
    
    return resources;
};

export default handler;