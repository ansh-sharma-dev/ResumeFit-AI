const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    title: {
        type: String,
        required: true
    },

    company: {
        type: String,
        required: true
    },

    location: {
        type: String,
        required: true
    },

    skills: {
        type: [String],
        default: []
    },

    description: {
        type: String,
        default: ""
    },

    salary: {
        type: Number,
        default: 0
    },

    jobAnalysis: {
        requiredSkills: {
            type: [String],
            default: []
        },
        preferredSkills: {
            type: [String],
            default: []
        },
        keywords: {
            type: [String],
            default: []
        },
        experience: {
            type: String,
            default: ""
        },
        education: {
            type: String,
            default: ""
        },
        responsibilities: {
            type: [String],
            default: []
        }
    }
});

const Job = mongoose.model("Job", jobSchema);

module.exports = Job;