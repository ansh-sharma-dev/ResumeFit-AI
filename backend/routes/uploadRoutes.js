const protect = require("../middleware/authMiddleware");
const Resume = require("../models/resumeModel");
const express = require("express");
const multer = require("multer");

const { extractTextFromPDF } = require("../services/resumeParser");
const { extractResumeData } = require("../services/aiService");

const router = express.Router();

const upload = multer({
    dest: "uploads/"
});

router.post("/resume", protect, upload.single("resume"), async (req, res) => {
    console.log("Uploaded file:", req.file);
    if (!req.file) {
        return res.status(400).json({
            message: "No file uploaded"
        });
    }
    try {
        const resumeText = await extractTextFromPDF(req.file.path);

        const structuredData = await extractResumeData(resumeText);
        
        const resume = await Resume.create({
            userId: req.userId,
            ...structuredData
        });

        console.log("Extracted Resume Text:");
        console.log(resumeText);

        res.json({
            message: "Resume uploaded and analyzed successfully",
            text: resumeText,
            structuredData
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to extract resume text",
            error: error.message
        });
    }
});

module.exports = router;