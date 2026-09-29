require("dotenv").config();
if (!process.env.JWT_SECRET) {
    console.error("JWT_SECRET is missing in .env");
    process.exit(1);
}
const multer = require("multer");
const helmet = require("helmet");
const authRoutes = require("./routes/authRoutes");
const { testAI } = require("./services/aiService");
const apiLimiter = require("./middleware/apiRateLimiter");

const express = require("express");
const cors = require("cors");

const aiRoutes = require("./routes/aiRoutes");
const jobRoutes = require("./routes/jobRoutes");
const matchRoutes = require("./routes/matchRoutes");
const resumeRoutes = require("./routes/resumeRoutes");
const connectDB = require("./config/db");

const app = express();
app.use(helmet());
app.use(cors({
    origin: "http://localhost:3000"
}));
app.use(express.json({ limit: "1mb" }));
app.use(apiLimiter);
app.use("/api/resumes", resumeRoutes);
app.use("/api/match", matchRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/ai", aiRoutes);

const PORT = 5050;

connectDB();

app.get("/api/test-ai", async (req, res) => {
    try {
        const result = await testAI();

        res.json({
            message: result
        });

    } catch (error) {
        console.error("AI TEST ERROR:", error);
    
        res.status(500).json({
            message: "AI test failed"
        });
    }
});

app.get("/api/health", (req, res) => {
    res.json({
        message: "ResumeFit AI API is working"
    });
});

app.use((err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        if (err.code === "LIMIT_FILE_SIZE") {
            return res.status(400).json({
                message: "File size must be 5 MB or less"
            });
        }

        return res.status(400).json({
            message: "File upload failed"
        });
    }

    if (err.message === "Only PDF files are allowed") {
        return res.status(400).json({
            message: "Only PDF files are allowed"
        });
    }

    console.error("GLOBAL ERROR:", err);

    res.status(500).json({
        message: "Internal server error"
    });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});