const express = require("express");
const multer = require("multer");

const {
    createResume,
    getResumes,
    getResumeById,
    deleteResume,
    updateResume
} = require("../controllers/resumeController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

const upload = multer({
    dest: "uploads/",
    limits: {
        fileSize: 5 * 1024 * 1024
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype === "application/pdf") {
            cb(null, true);
        } else {
            cb(new Error("Only PDF files are allowed"));
        }
    }
});

router.use(protect);

router.post("/", upload.single("resume"), createResume);
router.get("/", getResumes);
router.get("/:id", getResumeById);
router.delete("/:id", deleteResume);
router.put("/:id", updateResume);

module.exports = router;