const express = require("express");

const {
    analyzeResumeController,
    analyzeJobDescriptionController,
} = require("../controllers/aiController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/analyze-resume", protect, analyzeResumeController);

router.post("/analyze-job", protect, analyzeJobDescriptionController);

module.exports = router;