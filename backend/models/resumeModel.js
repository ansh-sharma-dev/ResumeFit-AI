const mongoose = require("mongoose");

const resumeSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    name: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true
    },

    skills: {
        type: [String],
        default: []
    },

    education: {
        type: String,
        default: ""
    },

    experience: {
        type: String,
        default: ""
    },

    projects: {
        type: String,
        default: ""
    },

    certifications: {
        type: String,
        default: ""
    },

    github: {
        type: String,
        default: ""
    },

    linkedin: {
        type: String,
        default: ""
    },

    phone: {
        type: String,
        default: ""
    },

    location: {
        type: String,
        default: ""
    },
    
    resumeText: {
        type: String,
        default: ""
    },
    resumeFile: {
        filename: {
            type: String,
            default: ""
        },

        path: {
            type: String,
            default: ""
        },

        mimetype: {
            type: String,
            default: ""
        },

        size: {
            type: Number,
            default: 0
        }
    },

    aiAnalysis: {
        professional_summary: {
            type: String,
            default: ""
        },

        strengths: {
            type: [String],
            default: []
        },

        weaknesses: {
            type: [String],
            default: []
        },

        improvement_suggestions: {
            type: [String],
            default: []
        },

        atsScore: {
            type: Number,
            default: 0
        },

        scoreBreakdown: {
            skills: {
                type: Number,
                default: 0
            },

            experience: {
                type: Number,
                default: 0
            },

            projects: {
                type: Number,
                default: 0
            },

            education: {
                type: Number,
                default: 0
            },

            keywords: {
                type: Number,
                default: 0
            },

            completenessAndFormatting: {
                type: Number,
                default: 0
            }
        }
    }
});

const Resume = mongoose.model("Resume", resumeSchema);

module.exports = Resume;