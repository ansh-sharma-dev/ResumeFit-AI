const calculateATSScore = (resume,resumeText = "",jobDescription = "")=>{    
    // =========================
    // 1. SKILLS - 20
    // =========================
    let skills = 0;

    if (resume.skills && Array.isArray(resume.skills)) {
        const validSkills = resume.skills
            .filter(skill => typeof skill === "string")
            .map(skill => skill.trim())
            .filter(skill => skill !== "");

        const uniqueSkills = [
            ...new Set(
                validSkills.map(skill => skill.toLowerCase())
            )
        ];

        const count = uniqueSkills.length;

        if (count >= 8) {
            skills = 20;
        } else if (count >= 6) {
            skills = 17;
        } else if (count >= 4) {
            skills = 14;
        } else if (count >= 2) {
            skills = 10;
        } else if (count === 1) {
            skills = 5;
        }
    }
    // =========================
    // 2. EXPERIENCE - 20
    // =========================

    let experience = 0;

    if (resume.experience && resume.experience.trim() !== "") {

        const experienceText = resume.experience.trim();
        const lowerExperience = experienceText.toLowerCase();

        // 1. Experience is present - 5 marks
        experience += 5;

        // 2. Check for role / job title information - 5 marks
        const roleKeywords = [
            "developer",
            "engineer",
            "intern",
            "manager",
            "analyst",
            "designer",
            "associate",
            "executive",
            "specialist",
            "consultant",
            "administrator",
            "trainee"
        ];

        const hasRole = roleKeywords.some(keyword =>
            lowerExperience.includes(keyword)
        );

        if (hasRole) {
            experience += 5;
        }

        // 3. Check for responsibilities / action words - 5 marks
        const actionWords = [
            "developed",
            "built",
            "created",
            "designed",
            "implemented",
            "managed",
            "analyzed",
            "tested",
            "maintained",
            "optimized",
            "improved",
            "developed",
            "worked",
            "handled",
            "led",
            "assisted"
        ];

        const actionWordCount = actionWords.filter(word =>
            lowerExperience.includes(word)
        ).length;

        if (actionWordCount >= 3) {
            experience += 5;
        } else if (actionWordCount >= 2) {
            experience += 4;
        } else if (actionWordCount >= 1) {
            experience += 2;
        }

        // 4. Check for meaningful detail - 5 marks
        const length = experienceText.length;

        if (length >= 300) {
            experience += 5;
        } else if (length >= 200) {
            experience += 4;
        } else if (length >= 100) {
            experience += 3;
        } else if (length >= 50) {
            experience += 2;
        }
    }


    // =========================
    // 3. PROJECTS - 20
    // =========================

    let projects = 0;

    if (resume.projects && resume.projects.trim() !== "") {

        const text = resume.projects.trim();
        const lowerText = text.toLowerCase();

        // 1. Projects are present - 5 marks
        projects += 5;

        // 2. Project count - 5 marks
        const projectCount = text
            .split(/;|\n/)
            .filter(item => item.trim() !== "")
            .length;

        if (projectCount >= 2) {
            projects += 5;
        } else if (projectCount === 1) {
            projects += 3;
        }

        // 3. Check for technologies - 5 marks
        const technologyKeywords = [
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
            "python",
            "java",
            "c++",
            "git",
            "github",
            "api",
            "rest"
        ];

        const matchedTechnologies = technologyKeywords.filter(technology =>
            lowerText.includes(technology)
        );

        if (matchedTechnologies.length >= 4) {
            projects += 5;
        } else if (matchedTechnologies.length >= 2) {
            projects += 4;
        } else if (matchedTechnologies.length === 1) {
            projects += 2;
        }

        // 4. Check for project details / contribution - 5 marks
        const actionWords = [
            "built",
            "developed",
            "created",
            "designed",
            "implemented",
            "integrated",
            "added",
            "developed",
            "used",
            "implemented",
            "optimized",
            "deployed",
            "tested"
        ];

        const actionWordCount = actionWords.filter(word =>
            lowerText.includes(word)
        ).length;

        if (actionWordCount >= 3 && text.length >= 200) {
            projects += 5;
        } else if (actionWordCount >= 2 && text.length >= 100) {
            projects += 4;
        } else if (actionWordCount >= 1) {
            projects += 2;
        }
    }
    // =========================
    // 4. EDUCATION - 15
    // =========================
    let education = 0;
    
    if (resume.education && resume.education.trim() !== "") {
    
        const text = resume.education.trim();
        const lowerEducation = text.toLowerCase();
    
        // 1. Education is present - 3 marks
        education += 3;
    
        // 2. Degree / qualification - 4 marks
        const degreeKeywords = [
            "bca",
            "b.tech",
            "btech",
            "b.sc",
            "bsc",
            "b.com",
            "bcom",
            "ba",
            "mca",
            "m.tech",
            "mtech",
            "m.sc",
            "msc",
            "mba",
            "ma",
            "bachelor",
            "master",
            "diploma",
            "degree"
        ];
    
        const hasDegree = degreeKeywords.some(keyword =>
            lowerEducation.includes(keyword)
        );
    
        if (hasDegree) {
            education += 4;
        }
    
        // 3. Institution information - 3 marks
        const institutionKeywords = [
            "college",
            "university",
            "institute",
            "school"
        ];
    
        const hasInstitution = institutionKeywords.some(keyword =>
            lowerEducation.includes(keyword)
        );
    
        if (hasInstitution) {
            education += 3;
        }
    
        // 4. Year / duration information - 2 marks
        const hasYear = /\b(19|20)\d{2}\b/.test(text);
    
        if (hasYear) {
            education += 2;
        }
    
        // 5. Academic detail - 3 marks
        const academicKeywords = [
            "cgpa",
            "percentage",
            "%",
            "grade",
            "marks"
        ];
    
        const hasAcademicDetail = academicKeywords.some(keyword =>
            lowerEducation.includes(keyword)
        );
    
        if (hasAcademicDetail) {
            education += 3;
        }
    }
    // =========================
    // 5. KEYWORDS - 16
    // =========================

    let keywords = 0;

    const textForKeywords = resumeText.toLowerCase();
    const textForJobDescription = jobDescription.toLowerCase();

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

    const matchedJobKeywords = technicalKeywords.filter(keyword =>
        textForJobDescription.includes(keyword)
    );
    
    const matchedResumeKeywords = matchedJobKeywords.filter(keyword =>
        textForKeywords.includes(keyword)
    );
    
    if (matchedJobKeywords.length > 0) {
        const matchPercentage =
            matchedResumeKeywords.length / matchedJobKeywords.length;
    
        keywords = Math.round(matchPercentage * 15);
    }
    // =========================
    // 6. COMPLETENESS - 10
    // =========================

    let completenessAndFormatting = 0;

    if (resume.name && resume.name.trim() !== "") {
        completenessAndFormatting += 2;
    }

    if (resume.email && resume.email.trim() !== "") {
        completenessAndFormatting += 2;
    }

    if (resume.phone && resume.phone.trim() !== "") {
        completenessAndFormatting += 1;
    }

    if (resume.github && resume.github.trim() !== "") {
        completenessAndFormatting += 1;
    }

    if (resume.linkedin && resume.linkedin.trim() !== "") {
        completenessAndFormatting += 1;
    }

    if (resume.education && resume.education.trim() !== "") {
        completenessAndFormatting += 1;
    }

    if (resume.experience && resume.experience.trim() !== "") {
        completenessAndFormatting += 1;
    }

    if (resume.projects && resume.projects.trim() !== "") {
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


    // =========================
    // SCORE BREAKDOWN
    // =========================

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


module.exports = {
    calculateATSScore
};