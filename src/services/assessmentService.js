import schoolsData from "../data/schoolsData.js";

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;
const GROQ_MODEL = "llama-3.3-70b-versatile";

const mapAnswerToText = (value) => {
  const mappings = {
    not_at_all: "no interest in",
    slightly: "slight interest in",
    moderately: "moderate interest in",
    very_much: "strong interest in",
    extremely: "extreme passion for",
    novice: "beginner level in",
    beginner: "basic knowledge of",
    intermediate: "competent with",
    advanced: "advanced skills in",
    expert: "expert mastery of",
    strongly_disagree: "strongly disagrees with",
    disagree: "disagrees with",
    neutral: "neutral about",
    agree: "agrees with",
    strongly_agree: "strongly agrees with",
    never: "never engages in",
    rarely: "rarely engages in",
    sometimes: "sometimes engages in",
    often: "often engages in",
    always: "always engages in",
    yes: "confirms",
    no: "does not confirm",
    maybe: "is uncertain about",
  };
  return mappings[value] || value;
};

const schoolsSummary = schoolsData.map((school) => ({
  id: school.id,
  name: school.name,
  location: school.location,
  programs: (school.programs || []).map((p) => p.program || p.name || "").filter(Boolean),
}));

const createPrompt = (answers, categories) => {
  let prompt = `As a career development AI specialist, provide a comprehensive career analysis based on the following student assessment results:`;

  categories.forEach((category) => {
    prompt += `\n\n${category.title.toUpperCase()}:\n`;
    category.questions.forEach((question) => {
      const answer = answers[question.id];
      if (answer) {
        prompt += `- ${question.text}: ${mapAnswerToText(answer)}\n`;
      }
    });
  });

  prompt += `\n\nGenerate a JSON career analysis with this exact structure:
{
  "careerRecommendations": [{ "jobTitle": "...", "explanation": "...", "salaryRange": "..." }],
  "skillsAnalysis": { "strengths": [], "skillsToDevelop": [] },
  "actionPlans": { "immediateNextSteps": [], "shortTermGoals": [], "longTermRoadmap": [] },
  "potentialChallenges": { "challenges": [], "mitigationStrategies": [] },
  "growthOpportunities": { "sectors": [], "emergingRoles": [] },
  "personalInsights": { "keyTakeaways": [], "motivationalQuote": "" },
  "resources": {
    "recommendedCourses": [{ "title": "...", "platform": "Coursera|Udemy|YouTube|edX|LinkedIn Learning|freeCodeCamp|Khan Academy", "url": "https://...", "description": "..." }],
    "suggestedReadings": [{ "title": "...", "author": "...", "url": "https://..." }],
    "professionalTools": [{ "name": "...", "url": "https://...", "description": "..." }]
  },
  "recommendedSchools": [{ "id": "school_id_from_list", "identifiedRelevantPrograms": ["program name"], "reasonForRecommendation": "..." }]
}

Rules:
- careerRecommendations: 5 job titles with detailed explanation and salary range in XAF (FCFA) per month (e.g. "150,000 – 400,000 XAF/mo").
- skillsAnalysis: top 5 strengths, 3-5 skills to develop.
- recommendedSchools: pick 5-6 from the SCHOOLS LIST below using their exact id. IMPORTANT: select schools whose listed programs directly match the career fields in careerRecommendations. For each recommended career (e.g. Nursing, Medical Lab, Health Sciences), find schools that have matching programs. Include schools from different regions/cities so results are geographically diverse. Only include id, identifiedRelevantPrograms, and reasonForRecommendation — no other fields.

SCHOOLS LIST:
${JSON.stringify(schoolsSummary)}

Return valid JSON only. No markdown, no code blocks.`;

  return prompt;
};

const processResponse = (response) => {
  const text = response.replace(/```json|```/g, "").trim();

  const empty = {
    careerRecommendations: [],
    skillsAnalysis: { strengths: [], skillsToDevelop: [] },
    actionPlans: { immediateNextSteps: [], shortTermGoals: [], longTermRoadmap: [] },
    potentialChallenges: { challenges: [], mitigationStrategies: [] },
    growthOpportunities: { sectors: [], emergingRoles: [] },
    personalInsights: { keyTakeaways: [], motivationalQuote: "" },
    resources: { recommendedCourses: [], suggestedReadings: [], professionalTools: [] },
    recommendedSchools: [],
  };

  if (!text.startsWith("{") && !text.startsWith("[")) return empty;

  try {
    const p = JSON.parse(text);
    const validatedSchools = (Array.isArray(p.recommendedSchools)
      ? p.recommendedSchools.filter((s) => typeof s === "object" && s !== null)
      : []
    ).map((school) => ({
      ...school,
      identifiedRelevantPrograms: Array.isArray(school.identifiedRelevantPrograms)
        ? school.identifiedRelevantPrograms
        : [],
      reasonForRecommendation:
        typeof school.reasonForRecommendation === "string" ? school.reasonForRecommendation : "",
    }));

    return {
      careerRecommendations: p.careerRecommendations || [],
      skillsAnalysis: {
        strengths: p.skillsAnalysis?.strengths || [],
        skillsToDevelop: p.skillsAnalysis?.skillsToDevelop || [],
      },
      actionPlans: {
        immediateNextSteps: p.actionPlans?.immediateNextSteps || [],
        shortTermGoals: p.actionPlans?.shortTermGoals || [],
        longTermRoadmap: p.actionPlans?.longTermRoadmap || [],
      },
      potentialChallenges: {
        challenges: p.potentialChallenges?.challenges || [],
        mitigationStrategies: p.potentialChallenges?.mitigationStrategies || [],
      },
      growthOpportunities: {
        sectors: p.growthOpportunities?.sectors || [],
        emergingRoles: p.growthOpportunities?.emergingRoles || [],
      },
      personalInsights: {
        keyTakeaways: p.personalInsights?.keyTakeaways || [],
        motivationalQuote: p.personalInsights?.motivationalQuote || "",
      },
      resources: {
        recommendedCourses: p.resources?.recommendedCourses || [],
        suggestedReadings: p.resources?.suggestedReadings || [],
        professionalTools: p.resources?.professionalTools || [],
      },
      recommendedSchools: validatedSchools,
    };
  } catch {
    return empty;
  }
};

export const analyzeAssessment = async (answers, categories) => {
  const prompt = createPrompt(answers, categories);

  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: GROQ_MODEL,
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error?.message || `Groq API error: ${response.status}`);
  }

  const data = await response.json();
  const text = data.choices[0]?.message?.content || "";
  const processed = processResponse(text);

  const schoolIndex = Object.fromEntries(schoolsData.map((s) => [s.id, s]));
  const enrichedSchools = processed.recommendedSchools.map((aiSchool) => {
    const full = schoolIndex[aiSchool.id] || {};
    return {
      ...full,
      identifiedRelevantPrograms: aiSchool.identifiedRelevantPrograms || [],
      reasonForRecommendation: aiSchool.reasonForRecommendation || "",
    };
  });

  return {
    analysis: {
      careerRecommendations: processed.careerRecommendations,
      skillsAnalysis: processed.skillsAnalysis,
      actionPlan: processed.actionPlans,
      potentialChallenges: processed.potentialChallenges,
      growthOpportunities: processed.growthOpportunities,
      insights: {
        keyTakeaways: processed.personalInsights.keyTakeaways,
        motivationalQuote: processed.personalInsights.motivationalQuote,
      },
      resources: processed.resources,
      recommendedSchools: enrichedSchools,
    },
  };
};
