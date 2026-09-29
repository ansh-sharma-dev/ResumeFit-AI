# ResumeFit AI

> AI-powered ATS Resume & Job Matching platform built with React,
> Node.js, Express, MongoDB, and Google Gemini.

ResumeFit AI helps job seekers create, analyze, manage, and improve
resumes while comparing them against job descriptions. The application
combines traditional ATS scoring and rule-based matching with AI-powered
resume and job analysis.

## ✨ Key Features

### 👤 Authentication

-   User registration and login
-   JWT-based authentication
-   Protected API routes
-   Password hashing with bcrypt
-   Current-user authentication endpoint
-   Logout and protected dashboard flow

### 📄 Resume Management

-   Upload resumes in PDF format
-   PDF text extraction
-   Automatic technical skill extraction
-   Store resume information in MongoDB
-   Edit and update resume details
-   Delete resumes
-   Resume preview
-   A4 PDF export
-   Education, experience, projects, certifications, phone, location,
    GitHub, and LinkedIn fields

### 📊 ATS Resume Scoring

ResumeFit AI calculates an ATS score using: - Skills - Experience -
Projects - Education - Keywords - Completeness and formatting

The application also provides a score breakdown instead of only a single
percentage.

### 🤖 AI Resume Analysis

Google Gemini is used to analyze uploaded resume content and generate: -
Professional summary - Strengths - Weaknesses - Improvement
suggestions - AI-generated analysis when available

The backend includes retry and graceful fallback handling for temporary
AI service failures.

### 🧠 Automatic Skill Extraction

Relevant technical skills are extracted from resume text and used in the
ATS and matching workflow.

### 💼 Job Management

Users can: - Create jobs - View jobs - Update jobs - Delete jobs - Store
job descriptions - Store required skills - Store preferred skills -
Store keywords - Store experience requirements - Store
responsibilities - Store education requirements when provided

### 🔍 Job Description Analysis

Job descriptions can be analyzed to identify: - Required skills -
Preferred skills - Keywords - Experience requirements -
Responsibilities - Education requirements

### 🎯 Resume ↔ Job Matching

ResumeFit AI compares a resume with a selected job and provides: -
Overall match percentage - Matched skills - Missing skills - Matched
keywords - Missing keywords - Job-specific improvement suggestions

The matching engine combines skill matching and keyword matching to
calculate the displayed match percentage.

### ✏️ Resume Improvement

The application can generate job-specific resume improvement suggestions
using AI when the AI service is available. A controlled fallback
response is returned when the external AI service is temporarily
unavailable.

### 👀 Resume Preview

The editable resume information is presented in a structured preview
before export: - Name and contact information - LinkedIn and GitHub -
Education - Experience - Projects - Skills - Certifications

### 📥 PDF Export

The resume preview can be exported as an A4 PDF using `html2pdf.js`.

The current resume layout has been tested for one-page PDF export.

### 📱 Responsive UI

The application has been tested in desktop and mobile browser layouts,
including an iPhone 17 Pro-sized viewport.

------------------------------------------------------------------------

## 🔐 Security

Security was treated as a dedicated development phase.

### Authentication & Authorization

-   JWT authentication
-   Protected resume, job, matching, and AI routes
-   Password hashing with bcrypt
-   JWT secret validation during server startup
-   Invalid and expired JWTs are rejected
-   User ownership checks prevent cross-user resource access

### API Protection

-   Login rate limiting
-   General API rate limiting
-   Helmet security headers
-   Restricted CORS configuration
-   JSON request body size limit
-   Input validation
-   MongoDB ObjectId validation
-   Controlled error responses

### File Upload Protection

-   PDF-only resume uploads
-   Maximum upload size of 5 MB
-   Multer upload error handling
-   Uploaded files excluded from Git

### Secret & Data Protection

-   API secrets stored in environment variables
-   `.env` excluded from Git
-   `node_modules/` excluded from Git
-   `uploads/` excluded from Git
-   Personal/test PDF files excluded from Git
-   Sensitive full resume text removed from application logs
-   Internal error details are not exposed to API clients

### Security Testing

The following scenarios were tested: - Protected API request without a
token - Invalid JWT - Dashboard access after logout - Cross-user resume
access protection - Cross-user job ownership protection - Non-PDF upload
protection - PDF larger than 5 MB

------------------------------------------------------------------------

## 🛠️ Tech Stack

### Frontend

-   React
-   JavaScript
-   HTML5
-   CSS3
-   React Router
-   `html2pdf.js`

### Backend

-   Node.js
-   Express.js
-   MongoDB
-   Mongoose
-   JWT (`jsonwebtoken`)
-   bcrypt
-   Multer
-   Helmet
-   `express-rate-limit`

### AI & Processing

-   Google Gemini API
-   `@google/genai`
-   PDF text extraction
-   Custom ATS scoring utilities
-   Custom skill extraction
-   Custom job matching logic

### Development Tools

-   VS Code
-   Git
-   GitHub
-   MongoDB Atlas

------------------------------------------------------------------------

## 🏗️ Project Architecture

``` text
ResumeFit-AI/
│
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── aiController.js
│   │   ├── authController.js
│   │   ├── jobController.js
│   │   ├── matchController.js
│   │   └── resumeController.js
│   ├── middleware/
│   │   ├── apiRateLimiter.js
│   │   ├── authMiddleware.js
│   │   └── authRateLimiter.js
│   ├── models/
│   │   ├── jobModel.js
│   │   ├── resumeModel.js
│   │   └── userModel.js
│   ├── routes/
│   │   ├── aiRoutes.js
│   │   ├── authRoutes.js
│   │   ├── jobRoutes.js
│   │   ├── matchRoutes.js
│   │   ├── resumeRoutes.js
│   │   └── uploadRoutes.js
│   ├── services/
│   │   ├── aiService.js
│   │   ├── atsScorer.js
│   │   └── resumeParser.js
│   ├── utils/
│   │   ├── atsScorer.js
│   │   ├── jobKeywords.js
│   │   ├── jobMatcher.js
│   │   └── skillExtractor.js
│   ├── package.json
│   └── server.js
│
└── frontend/
    ├── public/
    ├── src/
    │   ├── components/
    │   ├── App.js
    │   ├── AppRouter.js
    │   ├── Home.js
    │   ├── Login.js
    │   └── Register.js
    └── package.json
```

------------------------------------------------------------------------

## 🔄 Application Flow

``` text
User
  │
  ├── Register / Login
  │        │
  │        └── JWT Authentication
  │
  ├── Upload Resume PDF
  │        │
  │        ├── PDF Validation
  │        ├── Text Extraction
  │        ├── Skill Extraction
  │        ├── ATS Scoring
  │        └── Gemini Resume Analysis
  │
  ├── Manage Resume
  │        ├── Edit / Update
  │        ├── Preview
  │        └── Export PDF
  │
  └── Manage Jobs
           │
           ├── Create Job
           ├── Analyze Job Description
           └── Match Resume with Job
                    │
                    ├── Matched Skills
                    ├── Missing Skills
                    ├── Matched Keywords
                    ├── Missing Keywords
                    └── Improvement Suggestions
```

------------------------------------------------------------------------

## 📦 Local Setup

### 1. Clone the repository

``` bash
git clone https://github.com/ansh-sharma-dev/ResumeFit-AI.git
cd ResumeFit-AI
```

### 2. Install backend dependencies

``` bash
cd backend
npm install
```

### 3. Install frontend dependencies

``` bash
cd frontend
npm install
```

### 4. Configure environment variables

Create `backend/.env`:

``` env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_gemini_api_key
```

**Never commit `.env` to GitHub.**

### 5. Start the backend

``` bash
cd backend
node server.js
```

Development backend:

``` text
http://localhost:5050
```

### 6. Start the frontend

``` bash
cd frontend
npm start
```

Development frontend:

``` text
http://localhost:3000
```

------------------------------------------------------------------------

## 🔑 Environment Variables

  Variable           Purpose
  ------------------ -------------------------------------
  `MONGO_URI`        MongoDB Atlas connection string
  `JWT_SECRET`       Secret used to sign and verify JWTs
  `GEMINI_API_KEY`   Google Gemini API authentication

Keep these values private. During deployment, configure them through the
hosting provider's environment-variable system.

------------------------------------------------------------------------

## 🌐 API Overview

### Authentication

``` text
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me
```

### Resumes

``` text
POST   /api/resumes
GET    /api/resumes
GET    /api/resumes/:id
PUT    /api/resumes/:id
DELETE /api/resumes/:id
```

### Jobs

``` text
POST   /api/jobs
GET    /api/jobs
GET    /api/jobs/:id
PUT    /api/jobs/:id
DELETE /api/jobs/:id
```

### Matching

``` text
POST /api/match/...
```

### AI

AI functionality is exposed through protected backend routes and
services. The Gemini API key remains on the backend.

### Health Check

``` text
GET /api/health
```

------------------------------------------------------------------------

## 🧪 Testing

### Functional Testing

-   Registration
-   Login / Logout / Re-login
-   Resume upload and storage
-   ATS scoring
-   AI fallback handling
-   Resume edit/update
-   Resume preview
-   One-page PDF export
-   Job creation
-   Job matching

### Security Testing

-   Missing authentication token
-   Invalid JWT
-   Post-logout protected access
-   Cross-user resume access
-   Cross-user job ownership
-   Non-PDF upload
-   PDF larger than 5 MB

### Responsive Testing

-   Desktop browser
-   Mobile viewport
-   iPhone 17 Pro viewport emulation

------------------------------------------------------------------------

## 🤖 AI Reliability

ResumeFit AI depends on an external Gemini service for some AI-powered
features. External AI services can temporarily return capacity or
availability errors.

The backend therefore uses retry and fallback behavior for relevant AI
operations. When AI analysis is temporarily unavailable, the application
returns a controlled fallback response instead of crashing the complete
resume workflow.

------------------------------------------------------------------------

## 🚀 Deployment

The project is structured for separate frontend and backend deployment.

Production deployment will include: 1. Deploy the Node.js/Express
backend 2. Configure production environment variables 3. Verify MongoDB
Atlas connectivity 4. Verify the backend health endpoint 5. Connect the
React frontend to the production API URL 6. Deploy the React frontend 7.
Run end-to-end production tests

Secrets are configured through the hosting provider rather than
committed to GitHub.

------------------------------------------------------------------------

## 📸 Screenshots

Recommended screenshots for this section: - Login / Registration -
Dashboard - Resume Analysis - ATS Score - Job Creation - Job Matching -
Resume Preview - PDF Export - Mobile Responsive UI

------------------------------------------------------------------------

## 🔮 Future Improvements

-   More advanced AI resume recommendations
-   Additional resume templates
-   More export formats
-   Advanced job search and filtering
-   Improved semantic resume-job matching
-   Production monitoring and analytics
-   Additional automated tests

------------------------------------------------------------------------

## 👨‍💻 Author

**Ansh Sharma**\
BCA Student \| Frontend Developer \| JavaScript \| React

-   GitHub: https://github.com/ansh-sharma-dev
-   Portfolio: https://ansh-sharma-dev.github.io/ansh-sharma-dev/

------------------------------------------------------------------------

## 📄 License

This project is currently maintained as a personal portfolio and
learning project.
