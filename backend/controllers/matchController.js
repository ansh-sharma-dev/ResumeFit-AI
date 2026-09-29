const Resume = require("../models/resumeModel");
const Job = require("../models/jobModel");
const {
    matchResumeWithJob: aiMatchResumeWithJob,
    analyzeJobDescription,
    improveResumeForJob
} = require("../services/aiService");

const matchSkills = require("../utils/jobMatcher");

const normalizeSkill = (skill) => {
    const normalized = skill.toLowerCase().trim();

    if (normalized === "js") {
        return "javascript";
    }

    if (normalized === "node") {
        return "node.js";
    }

    if (normalized === "reactjs") {
        return "react";
    }

    return normalized;
};
const matchResumeWithJob = async (req, res) => {

    const { resumeId, jobId } = req.body;

    try {

        const resume = await Resume.findOne({
            _id: resumeId,
            userId: req.userId
        });
        const job = await Job.findOne({
            _id: jobId,
            userId: req.userId
        });
        if (!resume) {
            return res.status(404).json({
                message: "Resume not found"
            });
        }

        if (!job) {
            return res.status(404).json({
                message: "Job not found"
            });
        }
        //const jobAnalysis = await analyzeJobDescription(job.description);
        let jobAnalysis;

        try {
            jobAnalysis = await analyzeJobDescription(job.description);
        } catch (error) {
            console.log("AI job analysis unavailable, using job skills");

            jobAnalysis = {
                requiredSkills: job.skills || [],
                preferredSkills: [],
                keywords: [],
                experience: "",
                education: ""
            };
        }
        const resumeSkills = [...new Set(resume.skills.map(normalizeSkill))];
        const jobSkills = [
            ...new Set(jobAnalysis.requiredSkills.map(normalizeSkill))
        ];
        const matchingSkills = jobSkills.filter(jobSkill =>
            resumeSkills.includes(jobSkill)
        );
        const missingSkills = jobSkills.filter(jobSkill =>
            !resumeSkills.includes(jobSkill)
        );
        const matchScore = jobSkills.length === 0
            ? 0
            : Math.round((matchingSkills.length / jobSkills.length) * 100);
        const skillMatch = matchSkills(
            resume.skills || [],
            jobAnalysis.requiredSkills || [],
            `
                Name: ${resume.name}
                Skills: ${resume.skills
                ? resume.skills.join(", ")
                : ""}
                Education: ${resume.education || ""}
                Experience: ${resume.experience || ""}
                Projects: ${resume.projects || ""}
                Certifications: ${resume.certifications || ""}
                `,
            jobAnalysis.keywords || []
        );

        const missingKeywords = skillMatch.missingKeywords || [];
        let aiResult;

        try {
            console.log("STARTING AI MATCH...");
            
            aiResult = await aiMatchResumeWithJob(
                resumeSkills,
                jobAnalysis
            );
        } catch (error) {
            console.log("AI matching unavailable, using basic matching");

            aiResult = {
                matchScore,
                matchedSkills: matchingSkills,
                missingSkills,
                strengths: [],
                recommendations: ["AI analysis is temporarily unavailable."]
            };
        }


        // ===============================
        // RESUME IMPROVEMENT
        // ===============================

        let improvementResult;

        try {
            improvementResult = await improveResumeForJob(
                resume,
                jobAnalysis,
                missingSkills,
                missingKeywords
            );
        } catch (error) {
            console.log("AI resume improvement unavailable:", error.message);

            improvementResult = {
                suggestions: [
                    "AI improvement suggestions are temporarily unavailable."
                ]
            };
        }
        console.log("IMPROVEMENT RESULT:", improvementResult);
        res.json({
            matchingSkills,
            missingSkills,
            matchScore,
            totalRequiredSkills: jobSkills.length,
            matchedSkillsCount: matchingSkills.length,
            aiAnalysis: aiResult,
            improvementSuggestions: improvementResult.suggestions
        });

    } catch (error) {

        res.status(500).json({
            message: "Failed to match resume with job",
            error: error.message
        });

    }
};

module.exports = { matchResumeWithJob };