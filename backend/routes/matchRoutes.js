const express = require("express");

const {
    matchResumeWithJob
} = require("../controllers/matchController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, matchResumeWithJob);

module.exports = router;