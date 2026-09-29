require("dotenv").config();

const {
    extractSkills,
    analyzeResume,
    analyzeJobDescription,
    matchResumeWithJob
} = require("./services/aiService");

const { extractTextFromPDF } = require("./services/resumeParser");

const test = async () => {
    try {
        const text = await extractTextFromPDF("./uploads/pratham sharma.pdf");

        console.log("Extracted Resume Text:");
        console.log(text);

        const resumeAnalysis = await analyzeResume(text);

        console.log("AI Resume Analysis:");
        console.log(resumeAnalysis);
        
        const skills = await extractSkills(text);

        console.log("AI Extracted Skills:");
        console.log(skills);

        const jobDescription = `
We are looking for a Junior Software Developer.

Requirements:
- Strong knowledge of JavaScript
- Basic knowledge of React
- Knowledge of Node.js and Express
- Understanding of MongoDB
- Good problem solving skills
- Bachelor's degree in Computer Science or related field

Preferred:
- Git and GitHub
- REST API experience
- 0-1 year experience
`;

        const jobAnalysis = await analyzeJobDescription(jobDescription);

        console.log("AI Job Analysis:");
        console.log(jobAnalysis);

        const matching = await matchResumeWithJob(
            skills.skills,
            jobAnalysis
        );

        console.log("AI Resume-Job Matching:");
        console.log(matching);

    } catch (error) {
        console.log("Error:", error.message);
    }
};

test();