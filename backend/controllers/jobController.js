const mongoose = require("mongoose");
const Job = require("../models/jobModel");
const Resume = require("../models/resumeModel");
const matchSkills = require("../utils/jobMatcher");
const extractKeywords = require("../utils/jobKeywords");
const { analyzeJobDescription, improveResumeForJob } = require("../services/aiService");
const createJob = async (req, res) => {
    try {
        const {
            title,
            company,
            location,
            skills,
            description,
            salary
        } = req.body;

        if (!title || !company || !location) {
            return res.status(400).json({
                message: "Title, company and location are required"
            });
        }

        if (skills && !Array.isArray(skills)) {
            return res.status(400).json({
                message: "Skills must be an array"
            });
        }

        let jobAnalysis = {};

        if (description) {
            try {
                jobAnalysis = await analyzeJobDescription(description);
            } catch (error) {
                console.error("AI job analysis unavailable:", error.message);

                jobAnalysis = {};
            }
        }

        const job = await Job.create({
            userId: req.userId,
            title,
            company,
            location,
            skills,
            description,
            salary,
            jobAnalysis
        });
        console.log("Job created successfully:", job._id);

        res.status(201).json({
            message: "Job created successfully",
            job
        });

    } catch (error) {
        console.error("CREATE JOB ERROR:", error);

        res.status(500).json({
            message: "Failed to create job"
        });
    }
};
const getJobs = async (req, res) => {
    const { skill, search } = req.query;

    try {
        let filter = {};

        if (skill) {
            filter.skills = {
                $regex: skill,
                $options: "i"
            };
        }

        if (search) {
            filter.$or = [
                { title: { $regex: search, $options: "i" } },
                { company: { $regex: search, $options: "i" } },
                { description: { $regex: search, $options: "i" } }
            ];
        }

        const jobs = await Job.find({
            userId: req.userId,
            ...filter
        });

        res.json({
            jobs
        });

    } catch (error) {
        console.error("GET JOBS ERROR:", error);

        res.status(500).json({
            message: "Failed to fetch jobs"
        });
    }
};
const getJobById = async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({
            message: "Invalid job ID"
        });
    }
    try {
        const job = await Job.findOne({
            _id: req.params.id,
            userId: req.userId
        });

        if (!job) {
            return res.status(404).json({
                message: "Job not found"
            });
        }

        res.json({
            job
        });

    } catch (error) {
        console.error("GET JOB ERROR:", error);

        res.status(500).json({
            message: "Failed to fetch job"
        });
    }
};
const deleteJob = async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({
            message: "Invalid job ID"
        });
    }

    try {
        const job = await Job.findOneAndDelete({
            _id: req.params.id,
            userId: req.userId
        });

        if (!job) {
            return res.status(404).json({
                message: "Job not found"
            });
        }

        res.json({
            message: "Job deleted successfully"
        });

    } catch (error) {
        console.error("DELETE JOB ERROR:", error);

        res.status(500).json({
            message: "Failed to delete job"
        });
    }
};
const updateJob = async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({
            message: "Invalid job ID"
        });
    }

    try {
        const {
            title,
            company,
            location,
            skills,
            description,
            salary
        } = req.body;

        if (skills && !Array.isArray(skills)) {
            return res.status(400).json({
                message: "Skills must be an array"
            });
        }

        const job = await Job.findOneAndUpdate(
            {
                _id: req.params.id,
                userId: req.userId
            },
            {
                title,
                company,
                location,
                skills,
                description,
                salary
            },
            {
                new: true,
                runValidators: true
            }
        );

        if (!job) {
            return res.status(404).json({
                message: "Job not found"
            });
        }

        res.json({
            message: "Job updated successfully",
            job
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to update job"
        });
    }
};
const matchJobWithResume = async (req, res) => {

    const { resumeId, jobId } = req.body;
    if (
        !mongoose.Types.ObjectId.isValid(resumeId) ||
        !mongoose.Types.ObjectId.isValid(jobId)
    ) {
        return res.status(400).json({
            message: "Invalid resume or job ID"
        });
    }
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
        const keywords = extractKeywords(job.description);

        const result = matchSkills(
            resume.skills || [],
            job.skills || [],
            resume.resumeText || "",
            keywords
        );

        const totalSkills = (job.skills || []).length;
        const matchedSkills = result.matchedSkills.length;

        const skillPercentage = totalSkills === 0
            ? 0
            : (matchedSkills / totalSkills) * 100;

        const totalKeywords = keywords.length;
        const matchedKeywords = result.keywordMatches.length;

        const keywordPercentage = totalKeywords === 0
            ? 0
            : (matchedKeywords / totalKeywords) * 100;

        const matchPercentage = Math.round(
            (skillPercentage * 0.7) +
            (keywordPercentage * 0.3)
        );
        let improvementResult;

        try {
            improvementResult = await improveResumeForJob(
                resume,
                {
                    requiredSkills: job.skills || [],
                    preferredSkills: [],
                    keywords: keywords,
                    experience: "",
                    education: ""
                },
                result.missingSkills,
                result.missingKeywords
            );
        } catch (error) {
            console.log("AI resume improvement unavailable:", error.message);

            improvementResult = {
                suggestions: [
                    "AI improvement suggestions are temporarily unavailable."
                ]
            };
        }
        console.log("FINAL MATCH RESULT:", {
            keywordMatches: result.keywordMatches,
            missingKeywords: result.missingKeywords
        });
        return res.json({
            message: "Job matching completed successfully",
            match: {
                jobTitle: job.title,
                company: job.company,
                matchPercentage,
                matchedSkills: result.matchedSkills,
                missingSkills: result.missingSkills,
                keywordMatches: result.keywordMatches,
                missingKeywords: result.missingKeywords,
                improvementSuggestions: improvementResult.suggestions
            }
        });

    } catch(error){
        console.error("JOB MATCHING ERROR:", error);
    
        res.status(500).json({
            message:"Failed to match job"
        });
    }
};
module.exports = { getJobs, createJob, getJobById, deleteJob, updateJob, matchJobWithResume };