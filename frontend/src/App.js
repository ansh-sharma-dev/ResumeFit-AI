import { useEffect, useState } from "react";
import html2pdf from "html2pdf.js";
import "./App.css";
import Navbar from "./components/Navbar";

function App() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [education, setEducation] = useState("");
  const [experience, setExperience] = useState("");
  const [projects, setProjects] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [github, setGithub] = useState("");
  const [certifications, setCertifications] = useState("");
  const [editingResumeId, setEditingResumeId] = useState(null);
  const [previewResume, setPreviewResume] = useState(null);
  const [resume, setResume] = useState(null);
  const [atsResult, setAtsResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [matching, setMatching] = useState(false);
  const [savedResumes, setSavedResumes] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [selectedResumeId, setSelectedResumeId] = useState("");
  const [selectedJobId, setSelectedJobId] = useState("");
  const [jobMatchResult, setJobMatchResult] = useState(null);
  const [jobTitle, setJobTitle] = useState("");
  const [jobCompany, setJobCompany] = useState("");
  const [jobLocation, setJobLocation] = useState("");
  const [jobSkills, setJobSkills] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [jobSalary, setJobSalary] = useState("");
  const [creatingJob, setCreatingJob] = useState(false);
  function handleLogout() {
    localStorage.removeItem("token");
    window.location.href = "/login";
  }
  async function fetchSavedData() {
    try {
      const token = localStorage.getItem("token");

      const [resumeResponse, jobResponse] = await Promise.all([
        fetch("https://resumefit-ai-36t5.onrender.com/api/resumes", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }),

        fetch("https://resumefit-ai-36t5.onrender.com/api/jobs", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
      ]);

      const resumeData = await resumeResponse.json();
      const jobData = await jobResponse.json();

      if (resumeResponse.ok) {
        setSavedResumes(resumeData.resumes || []);
      }

      if (jobResponse.ok) {
        setJobs(jobData.jobs || []);
      }

    } catch (error) {
      console.error("Failed to fetch saved data:", error);
    }
  }
  useEffect(() => {
    if (localStorage.getItem("token")) {
      fetchSavedData();
    }
  }, []);
  function handleFileChange(e) {
    const selectedFile = e.target.files[0];

    if (selectedFile) {
      setResume(selectedFile);
    }
  }

  async function handleUpload() {
    setLoading(true);
    if (!name || !email || !resume) {
      alert("Please enter name, email and select a resume.");
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("education", education);
    formData.append("experience", experience);
    formData.append("projects", projects);
    formData.append("resume", resume);

    try {
      const response = await fetch(
        "https://resumefit-ai-36t5.onrender.com/api/resumes",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          },
          body: formData
        }
      );

      const data = await response.json();

      console.log(data);

      if (!response.ok) {
        alert(data.message || "Upload failed");
        return;
      }

      setAtsResult(data.resume.aiAnalysis);
      setLoading(false);

      alert("Resume uploaded successfully!");
    } catch (error) {
      console.error(error);
      setLoading(false);
      alert("Something went wrong while uploading.");
    }
  }
  function handleEditResume(resume) {
    setEditingResumeId(resume._id);
    setName(resume.name || "");
    setEmail(resume.email || "");
    setEducation(resume.education || "");
    setExperience(resume.experience || "");
    setProjects(resume.projects || "");
    setPhone(resume.phone || "");
    setLocation(resume.location || "");
    setLinkedin(resume.linkedin || "");
    setGithub(resume.github || "");
    setCertifications(resume.certifications || "");
  }
  async function handleUpdateResume() {
    if (!editingResumeId) {
      return;
    }

    try {
      const response = await fetch(
        `https://resumefit-ai-36t5.onrender.com/api/resumes/${editingResumeId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`
          },
          body: JSON.stringify({
            name,
            email,
            education,
            experience,
            projects,
            phone,
            location,
            linkedin,
            github,
            certifications
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Failed to update resume");
        return;
      }

      await fetchSavedData();

      setEditingResumeId(null);

      alert("Resume updated successfully!");
    } catch (error) {
      console.error("Resume update error:", error);
      alert("Something went wrong while updating resume.");
    }
  }
  function handleDownloadPDF() {
    const element = document.getElementById("resume-preview");

    if (!element) {
      alert("Please open Resume Preview first.");
      return;
    }

    const options = {
      margin: 0,
      filename: `${previewResume.name}-Resume.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        scrollX: 0,
        scrollY: 0
      },
      jsPDF: {
        unit: "mm",
        format: "a4",
        orientation: "portrait"
      }
    };

    element.style.minHeight = "0";
    element.style.height = "auto";

    html2pdf()
      .set(options)
      .from(element)
      .save()
      .then(() => {
        element.style.minHeight = "297mm";
        element.style.height = "";
      });
  }
  async function handleCreateJob() {
    setCreatingJob(true);

    if (!jobTitle || !jobCompany || !jobLocation) {
      setCreatingJob(false);
      alert("Please enter job title, company and location.");
      return;
    }

    try {
      const response = await fetch(
        "https://resumefit-ai-36t5.onrender.com/api/jobs",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`
          },
          body: JSON.stringify({
            title: jobTitle,
            company: jobCompany,
            location: jobLocation,
            skills: jobSkills
              .split(",")
              .map((skill) => skill.trim())
              .filter(Boolean),
            description: jobDescription,
            salary: jobSalary ? Number(jobSalary) : undefined
          })
        }
      );

      const data = await response.json();

      console.log("CREATE JOB RESULT:", data);

      if (!response.ok) {
        setCreatingJob(false);
        alert(data.message || "Failed to create job.");
        return;
      }

      await fetchSavedData();

      setJobTitle("");
      setJobCompany("");
      setJobLocation("");
      setJobSkills("");
      setJobDescription("");
      setJobSalary("");

      setCreatingJob(false);

      alert("Job created successfully!");
    } catch (error) {
      setCreatingJob(false);
      console.error("Job creation error:", error);
      alert("Something went wrong while creating the job.");
    }
  }
  async function handleJobMatch() {
    setMatching(true);
    if (!selectedResumeId || !selectedJobId) {
      alert("Please select a resume and a job.");
      return;
    }

    try {
      const response = await fetch(
        "https://resumefit-ai-36t5.onrender.com/api/jobs/match",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`
          },
          body: JSON.stringify({
            resumeId: selectedResumeId,
            jobId: selectedJobId
          })
        }
      );

      const data = await response.json();

      console.log("JOB MATCH RESULT:", data);

      if (!response.ok) {
        alert(data.message || "Job matching failed");
        return;
      }

      setJobMatchResult(data.match);
      setMatching(false);
    } catch (error) {
      setMatching(false);
      console.error("Job matching error:", error);
      alert("Something went wrong while matching the job.");
    }
  }
  return (

    <div>
      <Navbar
        title="ResumeFit AI"
        subtitle="AI-Powered Resume & Job Matching Platform"
        onLogout={handleLogout}
      />

      <main className="app-container">


        <section className="hero-section">

          <div className="hero-badge">
            AI-Powered Resume Analysis
          </div>

          <h1>
            Build a Resume That
            <span> Gets Noticed.</span>
          </h1>

          <p>
            Analyze your resume with AI, check your ATS score,
            identify missing skills, and improve your chances
            of matching the right jobs.
          </p>

        </section>
        {/* Dashboard Overview */}
        <div className="dashboard-overview">

          <div className="overview-card">
            <h3>Saved Resumes</h3>
            <p>{savedResumes.length}</p>

            <div>
              {savedResumes.slice(0, 19).map((resume) => (
                <div
                  key={resume._id}
                  onClick={() => setSelectedResumeId(resume._id)}
                  className={`saved-item ${selectedResumeId === resume._id ? "selected" : ""
                    }`}
                >
                  <strong>{resume.name}</strong>
                  <p>{resume.email}</p>

                  <button onClick={() => handleEditResume(resume)}>
                    Edit
                  </button>

                  <button onClick={() => setPreviewResume(resume)}>
                    Preview
                  </button>

                  {selectedResumeId === resume._id && (
                    <small>Selected Resume ✓</small>
                  )}
                </div>
              ))}

            </div>
          </div>
          {previewResume && (
            <div>
              <div id="resume-preview" className="resume-preview">

                <div className="resume-header">
                  <h1>{previewResume.name}</h1>

                  <p>
                    {previewResume.email}
                    {previewResume.phone && ` | ${previewResume.phone}`}
                    {previewResume.location && ` | ${previewResume.location}`}
                  </p>

                  {(previewResume.linkedin || previewResume.github) && (
                    <p>
                      {previewResume.linkedin && `LinkedIn: ${previewResume.linkedin}`}
                      {previewResume.linkedin && previewResume.github && " | "}
                      {previewResume.github && `GitHub: ${previewResume.github}`}
                    </p>
                  )}
                </div>

                <div className="resume-section">
                  <h2>Education</h2>
                  <p>{previewResume.education || "Not provided"}</p>
                </div>

                <div className="resume-section">
                  <h2>Experience</h2>
                  <p>{previewResume.experience || "Not provided"}</p>
                </div>

                <div className="resume-section">
                  <h2>Projects</h2>
                  <p>{previewResume.projects || "Not provided"}</p>
                </div>

                <div className="resume-section">
                  <h2>Skills</h2>
                  <p>
                    {previewResume.skills && previewResume.skills.length > 0
                      ? previewResume.skills.join(", ")
                      : "Not provided"}
                  </p>
                </div>

                <div className="resume-section">
                  <h2>Certifications</h2>
                  <p>{previewResume.certifications || "Not provided"}</p>
                </div>

              </div>

              <button onClick={handleDownloadPDF}>
                Download PDF
              </button>
            </div>
          )}
          <div className="overview-card">
            <h3>Saved Jobs</h3>
            <p>{jobs.length}</p>

            <div>
              {jobs.map((job) => (
                <div
                  key={job._id}
                  onClick={() => setSelectedJobId(job._id)}
                  className={`saved-item ${selectedJobId === job._id ? "selected" : ""
                    }`}
                >
                  <strong>{job.title}</strong>
                  <p>{job.company}</p>
                  <p>{job.location}</p>

                  {selectedJobId === job._id && (
                    <small>Selected Job ✓</small>
                  )}
                </div>
              ))}
            </div>
          </div>

        </div>
        {/* Resume Upload Section */}
        <div className="upload-card">

          <div className="upload-header">
            <h2>Upload Your Resume</h2>
            <p>Get your resume analyzed by AI</p>
          </div>

          <input
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="text"
            placeholder="Education"
            value={education}
            onChange={(e) => setEducation(e.target.value)}
          />

          <input
            type="text"
            placeholder="Experience"
            value={experience}
            onChange={(e) => setExperience(e.target.value)}
          />

          <input
            type="text"
            placeholder="Projects"
            value={projects}
            onChange={(e) => setProjects(e.target.value)}
          />
          <input
            type="text"
            placeholder="Phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <input
            type="text"
            placeholder="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
          <input
            type="text"
            placeholder="LinkedIn"
            value={linkedin}
            onChange={(e) => setLinkedin(e.target.value)}
          />
          <input
            type="text"
            placeholder="GitHub"
            value={github}
            onChange={(e) => setGithub(e.target.value)}
          />
          <input
            type="text"
            placeholder="Certifications"
            value={certifications}
            onChange={(e) => setCertifications(e.target.value)}
          />
          <label className={`file-upload-area ${resume ? "file-selected" : ""}`}>

            <div className="upload-icon">↑</div>

            <strong>
              {resume ? resume.name : "Choose your resume"}
            </strong>

            <span>
              {resume
                ? "PDF selected successfully"
                : "Click to browse • PDF only"}
            </span>

            <input
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
            />

          </label>

          <button
            onClick={editingResumeId ? handleUpdateResume : handleUpload}
            disabled={loading}
          >
            {editingResumeId
              ? "Save Changes"
              : loading
                ? "Analyzing Resume..."
                : "Analyze Resume"}
          </button>

        </div>
        {/* Add Job Section */}
        <div className="job-matching-card">

          <div className="upload-header">
            <h2>Add a Job</h2>
            <p>Save a job to match it with your resumes.</p>
          </div>

          <input
            type="text"
            placeholder="Job title"
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
          />

          <input
            type="text"
            placeholder="Company name"
            value={jobCompany}
            onChange={(e) => setJobCompany(e.target.value)}
          />

          <input
            type="text"
            placeholder="Location (e.g. Remote)"
            value={jobLocation}
            onChange={(e) => setJobLocation(e.target.value)}
          />

          <input
            type="text"
            placeholder="Skills (e.g. JavaScript, React, Git)"
            value={jobSkills}
            onChange={(e) => setJobSkills(e.target.value)}
          />

          <textarea
            placeholder="Job description"
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
          />

          <input
            type="number"
            placeholder="Salary"
            value={jobSalary}
            onChange={(e) => setJobSalary(e.target.value)}
          />

          <button onClick={handleCreateJob} disabled={creatingJob}>
            {creatingJob ? "Creating Job..." : "Create Job"}
          </button>

        </div>




        {/* Job Matching Section */}
        <div className="job-matching-card">

          <div className="upload-header">
            <h2>Match Resume With Job</h2>
            <p>Select a saved resume and a saved job to compare them.</p>
          </div>

          <select
            value={selectedResumeId}
            onChange={(e) => setSelectedResumeId(e.target.value)}
          >
            <option value="">Select Resume</option>

            {savedResumes.map((resume) => (
              <option key={resume._id} value={resume._id}>
                {resume.name} - {resume.email}
              </option>
            ))}
          </select>

          <select
            value={selectedJobId}
            onChange={(e) => setSelectedJobId(e.target.value)}
          >
            <option value="">Select Job</option>

            {jobs.map((job) => (
              <option key={job._id} value={job._id}>
                {job.title} - {job.company}
              </option>
            ))}
          </select>

          <button onClick={handleJobMatch} disabled={matching}>
            {matching ? "Matching..." : "Match Job"}
          </button>

        </div>
        {jobMatchResult && (
          <div className="job-match-result">
            <h2>Job Match Result</h2>

            <p className="matched-job-info">
              {jobMatchResult.jobTitle} · {jobMatchResult.company}
            </p>

            <div className="match-percentage">
              {jobMatchResult.matchPercentage}%
            </div>

            <div className="match-details-grid">

              <div className="match-detail-section">
                <h3>Matched Skills</h3>
                <div className="skill-tags">
                  {jobMatchResult.matchedSkills.length > 0 ? (
                    jobMatchResult.matchedSkills.map((skill, index) => (
                      <span className="skill-tag matched" key={index}>
                        {skill}
                      </span>
                    ))
                  ) : (
                    <span className="empty-match">No matched skills</span>
                  )}
                </div>
              </div>
              <div className="match-detail-section">
                <h3>Missing Skills</h3>
                <div className="skill-tags">
                  {jobMatchResult.missingSkills.length > 0 ? (
                    jobMatchResult.missingSkills.map((skill, index) => (
                      <span className="skill-tag missing" key={index}>
                        {skill}
                      </span>
                    ))
                  ) : (
                    <span className="empty-match">No missing skills</span>
                  )}
                </div>
              </div>
            </div>

            <div className="match-details-grid">
              <div className="match-detail-section">
                <h3>Matched Keywords</h3>

                <div className="skill-tags">
                  {jobMatchResult.keywordMatches.length > 0 ? (
                    jobMatchResult.keywordMatches.map((keyword, index) => (
                      <span className="skill-tag matched" key={index}>
                        {keyword}
                      </span>
                    ))
                  ) : (
                    <span className="empty-match">No matched keywords</span>
                  )}
                </div>
              </div>

              <div className="match-detail-section">
                <h3>Missing Keywords</h3>

                <div className="skill-tags">
                  {jobMatchResult.missingKeywords.length > 0 ? (
                    jobMatchResult.missingKeywords.map((keyword, index) => (
                      <span className="skill-tag missing" key={index}>
                        {keyword}
                      </span>
                    ))
                  ) : (
                    <span className="empty-match">No missing keywords</span>
                  )}
                </div>
              </div>
            </div>
            <div className="match-detail-section">
              <h3>Improvement Suggestions</h3>

              <ul>
                {jobMatchResult.improvementSuggestions &&
                  jobMatchResult.improvementSuggestions.length > 0 ? (
                  jobMatchResult.improvementSuggestions.map(
                    (suggestion, index) => (
                      <li key={index}>{suggestion}</li>
                    )
                  )
                ) : (
                  <li>No improvement suggestions available</li>
                )}
              </ul>
            </div>
          </div>
        )}

        {/* ATS Result Section */}
        {atsResult && (
          <div>
            <div className="ai-insights">

              <div className="insights-heading">
                <span className="section-label">AI ANALYSIS</span>
                <h2>Resume Insights</h2>
                <p>
                  Personalized insights generated from your resume.
                </p>
              </div>

              <div className="summary-section insight-card">
                <div className="insight-title">
                  <span className="insight-icon">✦</span>
                  <h3>Professional Summary</h3>
                </div>

                <p>{atsResult.professional_summary}</p>
              </div>

              <div className="insight-grid">

                <div className="strengths-section insight-card">
                  <div className="insight-title">
                    <span className="insight-icon">✓</span>
                    <h3>Strengths</h3>
                  </div>

                  <ul>
                    {atsResult.strengths.map((strength, index) => (
                      <li key={index}>{strength}</li>
                    ))}
                  </ul>
                </div>

                <div className="weaknesses-section insight-card">
                  <div className="insight-title">
                    <span className="insight-icon">!</span>
                    <h3>Weaknesses</h3>
                  </div>

                  <ul>
                    {atsResult.weaknesses.map((weakness, index) => (
                      <li key={index}>{weakness}</li>
                    ))}
                  </ul>
                </div>

              </div>

              <div className="suggestions-section insight-card">
                <div className="insight-title">
                  <span className="insight-icon">💡</span>
                  <h3>Improvement Suggestions</h3>
                </div>

                <ul>
                  {atsResult.improvement_suggestions.map(
                    (suggestion, index) => (
                      <li key={index}>{suggestion}</li>
                    )
                  )}
                </ul>
              </div>

            </div>
            {/* ATS Score */}
            <div className="ats-card">

              <div className="ats-header">
                <div>
                  <span className="section-label">RESUME ANALYSIS</span>
                  <h2>ATS Score</h2>
                </div>

                <div className="score-circle">
                  <span>{atsResult.atsScore}</span>
                  <small>/100</small>
                </div>
              </div>

              <div className="score-bar">
                <div
                  className="score-fill"
                  style={{ width: `${atsResult.atsScore}%` }}
                ></div>
              </div>

              <p className="score-description">
                Your resume has been analyzed based on skills,
                experience, projects, education, keywords,
                and overall completeness.
              </p>

              <div className="score-breakdown">

                <div className="score-item">
                  <span>Skills</span>
                  <strong>{atsResult.scoreBreakdown.skills}/20</strong>
                </div>

                <div className="score-item">
                  <span>Experience</span>
                  <strong>{atsResult.scoreBreakdown.experience}/20</strong>
                </div>

                <div className="score-item">
                  <span>Projects</span>
                  <strong>{atsResult.scoreBreakdown.projects}/20</strong>
                </div>

                <div className="score-item">
                  <span>Education</span>
                  <strong>{atsResult.scoreBreakdown.education}/15</strong>
                </div>

                <div className="score-item">
                  <span>Keywords</span>
                  <strong>{atsResult.scoreBreakdown.keywords}/15</strong>
                </div>

                <div className="score-item">
                  <span>Completeness & Formatting</span>
                  <strong>
                    {atsResult.scoreBreakdown.completenessAndFormatting}/10
                  </strong>
                </div>

              </div>
            </div>

          </div>
        )}

      </main>

    </div>
  );
}

export default App;