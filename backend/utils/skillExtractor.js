const extractSkills = (text = "") => {
    const skills = [
        "JavaScript",
        "TypeScript",
        "React",
        "Node.js",
        "Express",
        "MongoDB",
        "SQL",
        "HTML",
        "CSS",
        "Git",
        "GitHub",
        "Python",
        "Java",
        "C++",
        "Docker",
        "AWS",
        "REST API",
        "PostgreSQL",
        "Redis",
        "Linux"
    ];

    const textLower = text
    .toLowerCase()
    .replace(/\bjs\b/g, "javascript")
    .replace(/\bts\b/g, "typescript");
    
    return skills.filter(skill =>
        textLower.includes(skill.toLowerCase())
    );
};

module.exports = extractSkills;