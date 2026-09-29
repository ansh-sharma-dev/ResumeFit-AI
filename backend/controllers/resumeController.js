const Resume = require("../models/resumeModel");
const { PDFParse } = require("pdf-parse");
const { analyzeResume } = require("../services/aiService");
const extractSkills = require("../utils/skillExtractor");
const calculateATSScore = require("../utils/atsScorer");
const mongoose = require("mongoose");

const createResume = async (req, res) => {

    const { name, email, skills, education, experience, projects, certifications, github, linkedin, phone, location } = req.body;
    let parsedSkills = skills;

    if (typeof skills === "string") {
        try {
            parsedSkills = JSON.parse(skills);
        } catch (error) {
            return res.status(400).json({
                message: "Invalid skills format"
            });
        }
    }
    console.log("RECEIVED SKILLS:", skills);

    if (!name || !email) {
        return res.status(400).json({
            message: "Name and email are required"
        });
    }

    if (!email.includes("@")) {
        return res.status(400).json({
            message: "Invalid email address"
        });
    }

    if (parsedSkills && !Array.isArray(parsedSkills)) {
        return res.status(400).json({
            message: "Skills must be an array"
        });
    }

    try {
        let aiAnalysis = null;
        let atsResult = null;
        let resumeText = "";
        let extractedSkills = [];


        if (req.file && req.file.mimetype === "application/pdf") {
            const parser = new PDFParse({
                url: req.file.path
            });

            const result = await parser.getText();

            resumeText = result.text;
            extractedSkills = extractSkills(resumeText);
            console.log("Extracted skills:", extractedSkills);

            await parser.destroy();

            try {
                aiAnalysis = await analyzeResume(resumeText);
            } catch (error) {
                console.log("AI analysis unavailable:", error.message);
                aiAnalysis = null;
            }
            atsResult = calculateATSScore(
                {
                    skills: skills || [],
                    experience: experience || "",
                    projects: projects || "",
                    education: education || "",
                    certifications: certifications || ""
                },
                resumeText
            );

            console.log("AI ANALYSIS TYPE:", typeof aiAnalysis);
            console.log("AI ANALYSIS JSON:", JSON.stringify(aiAnalysis, null, 2));

            console.log("AI ANALYSIS RESULT:");
            console.log(aiAnalysis);

            console.log("ATS RESULT:");
            console.log(atsResult);
        }
        console.log("Saving resume to MongoDB...");

        const resume = await Resume.create({
            userId: req.userId,
            name,
            email,
            skills: extractedSkills,
            experience,
            projects,
            certifications,
            github,
            linkedin,
            phone,
            location,
            resumeText: resumeText,
            aiAnalysis: {
                ...aiAnalysis,
                atsScore: atsResult ? atsResult.atsScore : 0,
                scoreBreakdown: atsResult ? atsResult.scoreBreakdown : {}
            },

            resumeFile: req.file
                ? {
                    filename: req.file.filename,
                    path: req.file.path,
                    mimetype: req.file.mimetype,
                    size: req.file.size
                }
                : undefined
        });

        console.log("Resume saved to MongoDB:", resume._id);

        res.status(201).json({
            message: "Resume saved successfully",
            resume
        });
    } catch (error) {
        console.error("RESUME SAVE ERROR:", error);

        res.status(500).json({
            message: "Failed to save resume"
        });
    }
};
const getResumes = async (req, res) => {
    try {
        const resumes = await Resume.find({ userId: req.userId });

        res.json({
            resumes
        });
    } catch (error) {
        console.error("GET RESUMES ERROR:", error);
    
        res.status(500).json({
            message: "Failed to fetch resumes"
        });
    }
};
const getResumeById = async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({
            message: "Invalid resume ID"
        });
    }
    try {
        const resume = await Resume.findOne({
            _id: req.params.id,
            userId: req.userId
        });

        if (!resume) {
            return res.status(404).json({
                message: "Resume not found"
            });
        }

        res.json({
            resume
        });

    } catch (error) {
        console.error("GET RESUME ERROR:", error);
        res.status(500).json({
            message: "Failed to fetch resumes"
        });
    }
};
const deleteResume = async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({
            message: "Invalid resume ID"
        });
    }
    try {
        const resume = await Resume.findOneAndDelete({
            _id: req.params.id,
            userId: req.userId
        });

        if (!resume) {
            return res.status(404).json({
                message: "Resume not found"
            });
        }

        res.json({
            message: "Resume deleted successfully"
        });

    } catch (error) {
        console.error("DELETE RESUME ERROR:", error);
    
        res.status(500).json({
            message: "Failed to delete resume"
        });
    }
};
const updateResume = async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({
            message: "Invalid resume ID"
        });
    }

    try {
        const {
            name,
            email,
            education,
            experience,
            projects,
            phone,
            location,
            linkedin,
            github,
            certifications
        } = req.body;

        const resume = await Resume.findOneAndUpdate(
            {
                _id: req.params.id,
                userId: req.userId
            },
            {
                name,
                email,
                education,
                experience,
                projects,
                phone,
                location,
                linkedin,
                github,
                certifications
            },
            {
                new: true,
                runValidators: true
            }
        );

        if (!resume) {
            return res.status(404).json({
                message: "Resume not found"
            });
        }

        res.json({
            message: "Resume updated successfully",
            resume
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to update resume"
        });
    }
};
module.exports = { createResume, getResumes, getResumeById, deleteResume, updateResume, calculateATSScore };