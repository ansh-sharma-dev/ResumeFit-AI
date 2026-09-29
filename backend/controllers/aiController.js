const mongoose = require("mongoose");
const Resume = require("../models/resumeModel");
const {
    analyzeResume,
    analyzeJobDescription
} = require("../services/aiService");

const calculateATSScore = require("../utils/atsScorer");
const matchSkills = require("../utils/jobMatcher");


const analyzeResumeController = async (req, res) => {

    const { resumeId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(resumeId)) {
        return res.status(400).json({
            message: "Invalid resume ID"
        });
    }


    try {

        // 1. MongoDB se resume find karo
        const resume = await Resume.findOne({
            _id: resumeId,
            userId: req.userId
        });

        if (!resume) {
            return res.status(404).json({
                message: "Resume not found"
            });
        }

        // 2. Resume ka text prepare karo
        const resumeText = `
Name: ${resume.name}
Email: ${resume.email}
Phone: ${resume.phone}
Location: ${resume.location}

Skills:
${resume.skills ? resume.skills.join(", ") : ""}

Education:
${resume.education || ""}

Experience:
${resume.experience || ""}

Projects:
${resume.projects || ""}

Certifications:
${resume.certifications || ""}

GitHub:
${resume.github || ""}

LinkedIn:
${resume.linkedin || ""}
`;

        let analysis;

        try {

            analysis = await analyzeResume(resumeText);

        } catch (error) {

            console.log("AI unavailable, using ATS fallback");

            const atsResult = calculateATSScore(resume);

            return res.json({
                message: "Resume analyzed with ATS fallback",
                analysis: {
                    professional_summary:
                        "AI analysis is temporarily unavailable.",
                    strengths: [],
                    weaknesses: [],
                    improvement_suggestions: [
                        "Please try AI analysis again later."
                    ],
                    atsScore: atsResult.atsScore,
                    scoreBreakdown: atsResult.scoreBreakdown
                }
            });
        }

        // 3. Backend ATS score calculate karega
        const atsResult = calculateATSScore(resume);

        // 4. Backend score + breakdown final result me add karo
        analysis.atsScore = atsResult.atsScore;
        analysis.scoreBreakdown = atsResult.scoreBreakdown;

        // 5. Final response
        res.json({
            message: "ATS analysis completed successfully",
            analysis: {
                atsScore: analysis.atsScore,
                scoreBreakdown: analysis.scoreBreakdown,

                professionalSummary: analysis.professional_summary || "",

                strengths: analysis.strengths || [],

                weaknesses: analysis.weaknesses || [],

                improvementSuggestions:
                    analysis.improvement_suggestions || []
            }
        });

    } catch (error) {

        console.error("RESUME ANALYSIS ERROR:", error);
    
        res.status(500).json({
            message: "Failed to analyze resume"
        });
    }
};


const analyzeJobDescriptionController = async (req, res) => {

    const { jobDescription, resumeId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(resumeId)) {
        return res.status(400).json({
            message: "Invalid resume ID"
        });
    }
    
    try {

        // 1. JD validation
        if (!jobDescription || jobDescription.trim() === "") {
            return res.status(400).json({
                message: "Job description is required"
            });
        }

        // 2. Resume find karo
        const resume = await Resume.findOne({
            _id: resumeId,
            userId: req.userId
        });

        if (!resume) {
            return res.status(404).json({
                message: "Resume not found"
            });
        }

        console.log("MONGODB RESUME SKILLS:", resume.skills);

        let analysis;

        try {

            // 3. AI se JD analyze karo
            analysis = await analyzeJobDescription(jobDescription);

        } catch (error) {

            console.log("AI unavailable, using fallback job analysis");

            // 4. Fallback skill list
            const skillKeywords = [
                "JavaScript",
                "TypeScript",
                "React",
                "Node.js",
                "MongoDB",
                "Express",
                "SQL",
                "HTML",
                "CSS",
                "Git",
                "GitHub",
                "Python",
                "Java",
                "C++",
                "REST APIs"
            ];

            const jdText = jobDescription.toLowerCase();

            const requiredSkills = skillKeywords.filter(skill =>
                jdText.includes(skill.toLowerCase())
            );

            const analysis = {
                requiredSkills,
                preferredSkills: [],
                keywords: requiredSkills,
                experience: "",
                education: ""
            };

            console.log(
                "FALLBACK REQUIRED SKILLS:",
                requiredSkills
            );

            // 5. Resume skills + JD skills match
            const skillMatch = matchSkills(
                resume.skills || [],
                requiredSkills,
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
                analysis.keywords || []
            );

            return res.json({
                message: "ATS job analysis completed successfully",

                analysis: {
                    requiredSkills: analysis.requiredSkills || [],
                    preferredSkills: analysis.preferredSkills || [],
                    keywords: analysis.keywords || [],
                    experience: analysis.experience || "",
                    education: analysis.education || ""
                },

                skillMatch: {
                    matchedSkills: skillMatch.matchedSkills || [],
                    missingSkills: skillMatch.missingSkills || [],
                    matchedKeywords: skillMatch.keywordMatches || [],
                    missingKeywords: skillMatch.missingKeywords || []
                }
            });
        }

        console.log("RESUME SKILLS:", resume.skills);
        console.log(
            "REQUIRED SKILLS:",
            analysis.requiredSkills
        );

        // 6. AI analysis ke required skills use karo
        const skillMatch = matchSkills(
            resume.skills || [],
            analysis.requiredSkills || [],
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
            analysis.keywords || []
        );

        // 7. Final response
        res.json({
            message: "ATS job analysis completed successfully",

            analysis: {
                requiredSkills: analysis.requiredSkills || [],
                preferredSkills: analysis.preferredSkills || [],
                keywords: analysis.keywords || [],
                experience: analysis.experience || "",
                education: analysis.education || ""
            },

            skillMatch: {
                matchedSkills: skillMatch.matchedSkills || [],
                missingSkills: skillMatch.missingSkills || [],
                matchedKeywords: skillMatch.keywordMatches || [],
                missingKeywords: skillMatch.missingKeywords || []
            }
        });

    } catch (error) {

        console.error(
            "JOB DESCRIPTION ANALYSIS ERROR:",
            error
        );
    
        res.status(500).json({
            message: "Failed to analyze job description"
        });
    }
};


module.exports = {
    analyzeResumeController,
    analyzeJobDescriptionController
};