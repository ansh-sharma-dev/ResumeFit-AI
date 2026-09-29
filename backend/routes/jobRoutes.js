const protect = require("../middleware/authMiddleware");
const { getJobs, createJob, getJobById, deleteJob, updateJob, matchJobWithResume} = require("../controllers/jobController");

const express = require("express");

const router = express.Router();

router.use(protect);
router.get("/", getJobs);
router.post("/", createJob);
router.get("/:id", getJobById);
router.delete("/:id", deleteJob);
router.put("/:id", updateJob);
router.post("/match", matchJobWithResume);


module.exports = router;