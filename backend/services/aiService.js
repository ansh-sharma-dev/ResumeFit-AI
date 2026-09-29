const { GoogleGenAI } = require("@google/genai");

const client = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

// ===============================
// TEST AI CONNECTION
// ===============================

const testAI = async () => {
    const response = await client.models.generateContent({
        model: "gemini-3.6-flash",
        contents: "Say hello in one sentence."
    });

    return response.text;
};

// ===============================
// ANALYZE RESUME
// ===============================

const analyzeResume = async (resumeText) => {

    const prompt = `
Analyze the following resume data for ATS and job readiness.

Resume Text:
${resumeText}

Return ONLY a valid JSON object.

The JSON must use exactly these keys:

{
  "professional_summary": "short professional summary",
  "strengths": [],
  "weaknesses": [],
  "improvement_suggestions": [],
  "atsScore": 0
}

Rules:
- professional_summary must be a string.
- strengths must be an array of strings.
- weaknesses must be an array of strings.
- improvement_suggestions must be an array of strings.
- atsScore must be a number between 0 and 100.
- Do not return markdown.
`;

    const maxRetries = 3;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {

        try {

            console.log(
                `AI resume analysis attempt ${attempt}/${maxRetries}`
            );

            const response = await client.models.generateContent({
                model: "gemini-3.8-flash",                contents: prompt,
                config: {
                    responseMimeType: "application/json"
                }
            });

            console.log("AI resume analysis successful");

            return JSON.parse(response.text);

        } catch (error) {

            console.error(
                `AI resume analysis attempt ${attempt} failed:`,
                error.message
            );

            const isTemporaryError =
                error.message?.includes("503") ||
                error.message?.includes("UNAVAILABLE") ||
                error.message?.includes("429");

                if (!isTemporaryError || attempt === maxRetries) {
                    return {
                        professional_summary:
                            "Resume analysis is temporarily unavailable. Please review the resume for ATS and job readiness.",
                        strengths: [
                            "Resume text was successfully extracted.",
                            "Skills were successfully identified from the resume."
                        ],
                        weaknesses: [
                            "AI analysis is currently unavailable."
                        ],
                        improvement_suggestions: [
                            "Add more relevant technical skills.",
                            "Add clear project descriptions and measurable achievements.",
                            "Keep experience and education details complete and well structured."
                        ],
                        atsScore: 0
                    };
                }

            const delay = 2000 * Math.pow(2, attempt - 1);

            console.log(
                `Retrying AI analysis in ${delay / 1000} seconds...`
            );

            await new Promise(resolve =>
                setTimeout(resolve, delay)
            );
        }
    }
};
// ===============================
// EXTRACT SKILLS
// ===============================

const extractSkills = async (resumeText) => {

    const prompt = `
Extract all technical and professional skills from the following resume.

Resume:
${resumeText}

Return ONLY a valid JSON object in this format:

{
  "skills": [
    "JavaScript",
    "React",
    "Node.js"
  ]
}

Rules:
- Return only skills actually mentioned in the resume.
- Do not invent skills.
- Remove duplicate skills.
- Return skills as an array of strings.
- Do not return markdown.
`;

    const response = await client.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json"
        }
    });

    return JSON.parse(response.text);
};
const analyzeJobDescription = async (jobDescription) => {

    const prompt = `
Analyze the following job description.

Job Description:
${jobDescription}

Return ONLY a valid JSON object in this format:

{
  "requiredSkills": [],
  "preferredSkills": [],
  "keywords": [],
  "experience": "",
  "education": "",
  "responsibilities": []
}

Rules:
- Extract only information actually mentioned in the job description.
- Do not invent skills or requirements.
- requiredSkills = skills explicitly required.
- preferredSkills = skills mentioned as preferred, plus, nice-to-have, or similar.
- keywords = important technical and professional keywords from the job description.
- experience = required experience, if mentioned.
- education = required education, if mentioned.
- responsibilities = important responsibilities explicitly mentioned in the job description.
- Return arrays of strings.
- Do not return markdown.
- Each skill should be a separate item.
- Do not combine multiple skills into one string.
`;

    const maxRetries = 3;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {

        try {

            console.log(
                `AI job analysis attempt ${attempt}/${maxRetries}`
            );

            const response = await client.models.generateContent({
                model: "gemini-3.6-flash",
                contents: prompt,
                config: {
                    responseMimeType: "application/json"
                }
            });

            console.log("AI job analysis successful");

            return JSON.parse(response.text);

        } catch (error) {

            console.error(
                `AI job analysis attempt ${attempt} failed:`,
                error.message
            );

            const isTemporaryError =
                error.message?.includes("503") ||
                error.message?.includes("UNAVAILABLE") ||
                error.message?.includes("429");

            /*if (!isTemporaryError || attempt === maxRetries) {
                throw new Error(
                    "AI job analysis is temporarily unavailable"
                );
            }*/
            if (!isTemporaryError || attempt === maxRetries) {
                throw error;
            }

            const delay = 2000 * Math.pow(2, attempt - 1);

            console.log(
                `Retrying job analysis in ${delay / 1000} seconds...`
            );

            await new Promise(resolve =>
                setTimeout(resolve, delay)
            );
        }
    }
};
const extractResumeData = async (resumeText) => {

    const prompt = `
Extract structured resume information from the following resume text.

Resume:
${resumeText}

Return ONLY a valid JSON object in this format:

{
  "name": "",
  "email": "",
  "phone": "",
  "location": "",
  "skills": [],
  "education": "",
  "experience": "",
  "projects": "",
  "certifications": "",
  "github": "",
  "linkedin": ""
}

Rules:
- Extract only information actually present in the resume.
- Do not invent information.
- skills must be an array of strings.
- If a field is not present, return an empty string or empty array.
- Do not return markdown.
`;

    const response = await client.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json"
        }
    });

    return JSON.parse(response.text);
};
const matchResumeWithJob = async (resumeSkills, jobAnalysis) => {

    const prompt = `
Compare the candidate's resume skills with the job requirements.

Candidate Skills:
${resumeSkills.join(", ")}

Job Requirements:
Required Skills: ${jobAnalysis.requiredSkills.join(", ")}
Preferred Skills: ${jobAnalysis.preferredSkills.join(", ")}
Keywords: ${jobAnalysis.keywords.join(", ")}
Experience: ${jobAnalysis.experience}
Education: ${jobAnalysis.education}

Return ONLY a valid JSON object in this format:

{
  "matchScore": 0,
  "matchedSkills": [],
  "missingSkills": [],
  "strengths": [],
  "recommendations": []
}

Rules:
- matchScore must be a number between 0 and 100.
- matchedSkills must contain skills present in both the candidate skills and job requirements.
- missingSkills must contain required skills missing from the candidate skills.
- strengths must describe relevant matching strengths.
- recommendations must suggest useful improvements.
- Do not invent candidate skills.
- Return arrays of strings.
- Do not return markdown.
`;

    const response = await client.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json"
        }
    });

    return JSON.parse(response.text);
};
// ===============================
// IMPROVE RESUME FOR JOB
// ===============================

const improveResumeForJob = async (
    resumeData,
    jobAnalysis,
    missingSkills,
    missingKeywords
) => {

    const prompt = `
Suggest practical improvements for a candidate's resume based on a job description.

Candidate Resume:
${JSON.stringify(resumeData)}

Job Requirements:
Required Skills: ${jobAnalysis.requiredSkills.join(", ")}
Preferred Skills: ${jobAnalysis.preferredSkills.join(", ")}
Keywords: ${jobAnalysis.keywords.join(", ")}
Experience: ${jobAnalysis.experience}
Education: ${jobAnalysis.education}

Missing Skills:
${missingSkills.join(", ")}

Missing Keywords:
${missingKeywords.join(", ")}

Return ONLY a valid JSON object in this format:

{
  "suggestions": []
}

Rules:
- Suggest adding missing keywords only when they are relevant and truthful to the candidate's actual experience.
- suggestions must be an array of strings.
- Give practical resume improvement suggestions.
- Do not invent candidate experience or skills.
- Do not tell the candidate to add a skill if the resume does not show evidence of that skill.
- Focus on improving resume wording, projects, skills, keywords, and relevant experience.
- Keep suggestions specific to this job.
- Return 3 to 5 useful suggestions.
- Do not return markdown.
`;

    const response = await client.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json"
        }
    });

    return JSON.parse(response.text);
};

module.exports = {
    client,
    testAI,
    analyzeResume,
    extractSkills,
    analyzeJobDescription,
    matchResumeWithJob,
    extractResumeData,
    improveResumeForJob
};