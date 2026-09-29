const normalizeSkill = (skill) => {

    const normalized = skill.toLowerCase().trim();

    const aliases = {

        "html5": "html",
        "css3": "css",

        "nodejs": "node.js",
        "node js": "node.js",

        "react.js": "react",
        "reactjs": "react",

        "js": "javascript",
        "ts": "typescript",

        "rest api": "rest",
        "rest apis": "rest",

        "front-end": "frontend",
        "back-end": "backend"

    };

    return aliases[normalized] || normalized;
};


const matchSkills = (

    resumeSkills = [],
    requiredSkills = [],
    resumeText = "",
    keywords = []

) => {

    const resumeSkillList = [

        ...new Set(
            resumeSkills.map(skill => normalizeSkill(skill))
        )

    ];

    const requiredSkillList = [

        ...new Set(
            requiredSkills.map(skill => normalizeSkill(skill))
        )

    ];

    const matchedSkills = requiredSkillList.filter(skill =>
        resumeSkillList.includes(skill)
    );

    const missingSkills = requiredSkillList.filter(skill =>
        !resumeSkillList.includes(skill)
    );


    const resumeTextLower = resumeText
        .toLowerCase()
        .replace(/node\.js|nodejs|node js/g, "nodejs");


    const keywordList = [

        ...new Set(
            keywords.map(keyword =>
                keyword.toLowerCase().trim()
            )
        )

    ];
    const normalizedResumeText = resumeTextLower

        .replace(/\bjs\b/g, "javascript")
        .replace(/html5/g, "html")
        .replace(/css3/g, "css")
        .replace(/node\.js|nodejs|node js/g, "nodejs")
        .replace(/react\.js|reactjs/g, "react")
        .replace(/front-end/g, "frontend")
        .replace(/back-end/g, "backend");

    const normalizedKeywordList = keywordList.map(keyword =>

        keyword
            .replace(/html5/g, "html")
            .replace(/css3/g, "css")
            .replace(/node\.js|nodejs|node js/g, "nodejs")
            .replace(/react\.js|reactjs/g, "react")
            .replace(/front-end/g, "frontend")
            .replace(/back-end/g, "backend")

    );


    console.log("Resume Text:", normalizedResumeText);
    console.log("Keywords:", normalizedKeywordList);

    const keywordMatches = normalizedKeywordList.filter(keyword =>
        normalizedResumeText.includes(keyword)
    );
    const missingKeywords = normalizedKeywordList.filter(keyword =>
        !normalizedResumeText.includes(keyword)
    );
    return {
        matchedSkills,
        missingSkills,
        keywordMatches,
        missingKeywords
    };
};
module.exports = matchSkills;