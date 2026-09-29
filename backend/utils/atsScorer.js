const calculateATSScore = (resume, resumeText = "") => {
    // 1. SKILLS - 20
    let skills = 0;

    const skillKeywords = [
        "javascript",
        "typescript",
        "react",
        "node.js",
        "node",
        "express",
        "mongodb",
        "sql",
        "html",
        "css",
        "git",
        "github",
        "python",
        "java",
        "c++",
        "api",
        "rest",
        "frontend",
        "backend"
    ];

    const skillText = resumeText.toLowerCase();

    const matchedSkills = skillKeywords.filter(skill =>
        skillText.includes(skill)
    );

    const skillCount = matchedSkills.length;

    if (skillCount >= 8) {
        skills = 20;
    } else if (skillCount >= 6) {
        skills = 17;
    } else if (skillCount >= 4) {
        skills = 14;
    } else if (skillCount >= 2) {
        skills = 10;
    } else if (skillCount === 1) {
        skills = 5;
    }

    // 2. EXPERIENCE - 20

    let experience = 0;

    const experienceText = resumeText.toLowerCase();

    if (
        experienceText.includes("experience") ||
        experienceText.includes("work experience") ||
        experienceText.includes("employment")
    ) {
        const length = experienceText.length;

        if (length >= 1000) {
            experience = 20;
        } else if (length >= 700) {
            experience = 17;
        } else if (length >= 400) {
            experience = 14;
        } else if (length >= 200) {
            experience = 10;
        } else {
            experience = 6;
        }
    }

    // 3. PROJECTS - 20

    let projects = 0;

    const projectText = resumeText.toLowerCase();

    const projectKeywords = [
        "project",
        "projects",
        "developed",
        "built",
        "created",
        "application",
        "website",
        "web application",
        "e-commerce",
        "portfolio"
    ];

    const matchedProjectKeywords = projectKeywords.filter(keyword =>
        projectText.includes(keyword)
    );

    const projectKeywordCount = matchedProjectKeywords.length;

    if (projectKeywordCount >= 5) {
        projects = 20;
    } else if (projectKeywordCount >= 4) {
        projects = 17;
    } else if (projectKeywordCount >= 3) {
        projects = 14;
    } else if (projectKeywordCount >= 2) {
        projects = 10;
    } else if (projectKeywordCount === 1) {
        projects = 6;
    }

    // 4. EDUCATION - 15
    let education = 0;

    const educationText = resumeText.toLowerCase();

    if (
        educationText.includes("education") ||
        educationText.includes("bca") ||
        educationText.includes("b.tech") ||
        educationText.includes("btech") ||
        educationText.includes("b.sc") ||
        educationText.includes("bsc") ||
        educationText.includes("mca") ||
        educationText.includes("m.tech") ||
        educationText.includes("mba") ||
        educationText.includes("bachelor") ||
        educationText.includes("master") ||
        educationText.includes("degree")
    ) {
        const length = educationText.length;

        if (length >= 1000) {
            education = 15;
        } else if (length >= 700) {
            education = 13;
        } else if (length >= 400) {
            education = 10;
        } else {
            education = 7;
        }
    }

    // 5. KEYWORDS - 15

    let keywords = 0;

    const textForKeywords = resumeText.toLowerCase();

    const technicalKeywords = [
        "javascript",
        "typescript",
        "react",
        "node.js",
        "node",
        "express",
        "mongodb",
        "sql",
        "html",
        "css",
        "git",
        "github",
        "api",
        "rest",
        "python",
        "java",
        "c++",
        "database",
        "frontend",
        "backend",
        "full stack"
    ];

    const matchedKeywords = technicalKeywords.filter(keyword =>
        textForKeywords.includes(keyword)
    );

    const keywordCount = matchedKeywords.length;

    if (keywordCount >= 10) {
        keywords = 15;
    } else if (keywordCount >= 7) {
        keywords = 12;
    } else if (keywordCount >= 5) {
        keywords = 9;
    } else if (keywordCount >= 3) {
        keywords = 6;
    } else if (keywordCount >= 1) {
        keywords = 3;
    }

    // 6. COMPLETENESS - 10
    let completenessAndFormatting = 0;

    const completenessText = resumeText.toLowerCase();

    if (
        completenessText.includes("name") ||
        completenessText.length > 0
    ) {
        completenessAndFormatting += 2;
    }

    if (
        completenessText.includes("@") ||
        completenessText.includes("email")
    ) {
        completenessAndFormatting += 2;
    }

    if (
        completenessText.includes("phone") ||
        completenessText.includes("mobile") ||
        /\d{10}/.test(completenessText)
    ) {
        completenessAndFormatting += 1;
    }

    if (
        completenessText.includes("github")
    ) {
        completenessAndFormatting += 1;
    }

    if (
        completenessText.includes("linkedin")
    ) {
        completenessAndFormatting += 1;
    }

    if (
        completenessText.includes("education") ||
        completenessText.includes("bca") ||
        completenessText.includes("bachelor") ||
        completenessText.includes("degree")
    ) {
        completenessAndFormatting += 1;
    }

    if (
        completenessText.includes("experience") ||
        completenessText.includes("employment") ||
        completenessText.includes("work experience")
    ) {
        completenessAndFormatting += 1;
    }

    if (
        completenessText.includes("project") ||
        completenessText.includes("projects")
    ) {
        completenessAndFormatting += 1;
    }
    // =========================
    // FINAL SCORE
    // =========================

    const atsScore =
        skills +
        experience +
        projects +
        education +
        keywords +
        completenessAndFormatting;

    // SCORE BREAKDOWN
    return {
        atsScore: Math.min(atsScore, 100),

        scoreBreakdown: {
            skills,
            experience,
            projects,
            education,
            keywords,
            completenessAndFormatting
        }
    };
};


module.exports = calculateATSScore;