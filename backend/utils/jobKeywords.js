const extractKeywords = (text = "") => {

    const stopWords = [
        "looking",
        "with",
        "this",
        "that",
        "from",
        "have",
        "your",
        "will",
        "for",
        "and",
        "the",
        "are",
        "our",
        "you",

        "developer",
        "developer's",
        "intern",
        "internship",
        "skills",
        "skill",
        "experience",
        "work",
        "working",
        "role",
        "team",
        "candidate",
        "required",
        "requirements"
    ];

    const aliases = {
        "html5": "html",
        "css3": "css",
        "node.js": "nodejs",
        "nodejs": "nodejs",
        "node js": "nodejs",
        "react.js": "react",
        "reactjs": "react",
        "front-end": "frontend",
        "back-end": "backend"
    };

    return [
        ...new Set(
            text
                .toLowerCase()
                .replace(/[.,!?]/g, "")
                .split(/\s+/)
                .map(word => aliases[word] || word)
                .filter(word => word.length > 3)
                .filter(word => !stopWords.includes(word))
        )
    ];
};

module.exports = extractKeywords;