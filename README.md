# 🎓 Job Application Portal — AI-Powered Career Platform

A full-stack web application that helps candidates fill out, submit, and track job applications — enhanced with a suite of **AI-powered career tools** built on Google Gemini. From resume generation to mock interviews, the platform guides you through every step of the job hunt.

🔗 **Live Demo:** [job-application-portal-alpha.vercel.app](https://job-application-portal-alpha.vercel.app)

This is a **monorepo** — `frontend/` (React) and `backend/` (Node.js/Express) live side by side in this one repository.

```
job-application-portal/
├── frontend/     # React app — deployed to Vercel
├── backend/      # Express API — deployed to Render
└── README.md     # you are here
```

---

## ✨ Features

### 📋 Core Application
- 🔐 **Firebase Authentication** — Google/email login with JWT session management
- 📝 **5-Step Application Form** — Personal Info → Education → Experience → Documents → Review
- 💾 **Auto-save to MySQL** — All form data persisted to a cloud database (Railway)
- 📊 **My Application Page** — View your full submitted application anytime
- ✅ **Application Status Tracking** — `Submitted → Under Review → Shortlisted → Selected`
- 🖥️ **User Dashboard** — Profile completeness tracker & application overview

### 🤖 AI Career Tools (Powered by Gemini)
- 📄 **AI Resume Generator** — Generates a structured, ATS-friendly resume from your profile data
- 🎯 **ATS Score Checker** — Upload a PDF resume & job description to get a full compatibility report (with OCR fallback for scanned PDFs)
- 💼 **Job Listings + AI Job Matching** — Browse openings and get AI-powered match scores for each role
- 📬 **Cover Letter Generator** — Generates tailored cover letters in professional, friendly, or enthusiastic tones
- 🔍 **Skill Gap Analyzer** — Identifies missing skills for a target role and suggests a learning path
- 🎤 **Mock Interview Generator** — Produces role-specific interview questions with model answers and follow-ups

---

## 🛠️ Tech Stack

### Frontend (`frontend/`)
| Technology | Version | Purpose |
|---|---|---|
| React | 19 | UI framework |
| React Router DOM | v7 | Client-side routing |
| Firebase | v12 | Authentication (Google/Email) |
| Axios | latest | HTTP requests to backend |
| React Hook Form | v7 | Form state management |
| Tailwind CSS | v3 | Utility-first styling |
| jsPDF + html2canvas | latest | Client-side PDF export |
| Lucide React | latest | Icons |
| Vercel | — | Deployment |

### Backend (`backend/`)
| Technology | Version | Purpose |
|---|---|---|
| Node.js + Express | 5 | REST API server |
| MySQL2 | latest | Database driver |
| Google Generative AI (`gemini-3.6-flash`) | latest | Powers all AI features |
| JSON Web Token (JWT) | latest | Session authentication |
| bcryptjs | latest | Password hashing |
| multer | latest | PDF file uploads |
| pdf-parse | latest | Resume text extraction |
| helmet | latest | HTTP security headers |
| express-rate-limit | latest | API rate limiting |
| Railway | — | MySQL database hosting |
| Render | — | Backend deployment |

---

## 🗂️ Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── ats/
│   │   │   └── ATSScoreResult.jsx
│   │   ├── auth/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── resume/
│   │   │   └── ResumePreview.jsx
│   │   └── shared/
│   │       ├── Navbar.jsx
│   │       └── ProgressBar.jsx
│   ├── pages/
│   │   ├── HomePage.jsx
│   │   ├── ApplicationPage.jsx
│   │   ├── MyApplicationPage.jsx
│   │   ├── SuccessPage.jsx
│   │   ├── DashboardPage.jsx          # Profile completeness + tracker
│   │   ├── ResumeGenerator.jsx        # AI Resume Generator
│   │   ├── ATSScoreChecker.jsx        # ATS Score Checker
│   │   ├── JobListingsPage.jsx        # Job board + AI matching
│   │   ├── CoverLetterPage.jsx        # AI Cover Letter Generator
│   │   ├── SkillGapPage.jsx           # Skill Gap Analyzer
│   │   └── MockInterviewPage.jsx      # Mock Interview Generator
│   ├── context/
│   │   └── AuthContext.js             # Firebase + JWT auth state
│   ├── hooks/
│   │   └── useAI.js                   # Custom hooks for AI API calls
│   ├── services/
│   │   ├── api.js                     # Application API calls
│   │   ├── ai.js                      # AI feature API calls
│   │   └── jobs.js                    # Job listings API calls
│   ├── utils/
│   │   ├── aiHelpers.js
│   │   └── pdfExport.js
│   └── firebase/
│       └── config.js                  # Firebase config

backend/
├── controllers/
│   ├── authController.js              # Login/register logic
│   ├── applicationController.js       # Save & fetch application
│   ├── jobsController.js              # Job listings CRUD
│   └── uploadController.js            # Document upload handling
├── routes/
│   ├── auth.js
│   ├── application.js
│   ├── jobs.js
│   └── ai.js                          # All Gemini AI endpoints
├── middleware/
│   ├── verifyToken.js                 # JWT verification
│   └── upload.js                      # Multer file upload config
├── config/
│   └── db.js                          # MySQL connection pool
└── server.js                          # Express entry point
```

---

## 🗄️ Database Schema

The MySQL database (`job_portal`) contains the following tables:

| Table | Description |
|---|---|
| `applicants` | Core user table — Firebase UID, email, applicant ID |
| `personal_info` | Name, DOB, gender, phone, address |
| `qualifications` | Class X, XII, degrees with grades and years |
| `skills` | List of technical skills |
| `work_experience` | Company, role, dates, description |
| `internships` | Organisation, role, dates |
| `projects` | Title, URL, tech stack, description |
| `certificates` | Cert name, issuer, credential URL |
| `profile_links` | LinkedIn, GitHub, portfolio links |
| `documents` | Resume, photo, ID proof file links |
| `applications` | Application code, status, submission timestamp |

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- MySQL (local) or Railway MySQL account
- Firebase project with Authentication enabled
- Google Gemini API key (for AI features)

### 1. Clone the repo

```bash
git clone https://github.com/anisha-1811/Job-Application-Portal.git
cd Job-Application-Portal
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file inside `backend/`:

```env
DB_HOST=your_railway_mysql_host
DB_PORT=your_railway_mysql_port
DB_USER=your_db_username
DB_PASSWORD=your_db_password
DB_NAME=job_portal
JWT_SECRET=your_secret_key_here
GEMINI_API_KEY=your_gemini_api_key
FRONTEND_URL=http://localhost:3000
PORT=5000
```

Start the server:

```bash
npm run dev     # development (nodemon)
npm start       # production
```

Server runs at `http://localhost:5000`

### 3. Frontend Setup

```bash
cd ../frontend
npm install
```

Create a `.env` file inside `frontend/`:

```env
REACT_APP_API_URL=http://localhost:5000
REACT_APP_FIREBASE_API_KEY=your_firebase_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
```

Start the app:

```bash
npm start
```

App runs at `http://localhost:3000`

### 4. Database Setup

```bash
mysql -u root -p job_portal < backend/schema.sql
```

If upgrading from an earlier version, also run:

```sql
ALTER TABLE qualifications
ADD COLUMN degree_label VARCHAR(50) DEFAULT ''
AFTER qualification_type;
```

---

## 🌐 API Endpoints

### Auth
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/login` | None | Login/register via Firebase UID |
| POST | `/api/auth/login-by-id` | None | Login with applicant ID + password |

**Request body (`/login`):**
```json
{
  "firebase_uid": "abc123",
  "email": "user@example.com",
  "display_name": "Anisha"
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGc...",
  "applicant_id": "APP00000001",
  "email": "user@example.com"
}
```

### Application
All routes require `Authorization: Bearer <token>` header.

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/application/save` | Save / update full application |
| GET | `/api/application/get` | Fetch saved application data |
| POST | `/api/application/upload-documents` | Upload resume/photo/ID proof |
| GET | `/api/application/document/:filename` | Serve a stored document |

### Jobs
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/jobs` | List all jobs (supports filters) |
| GET | `/api/jobs/filters` | Return available filter options |
| GET | `/api/jobs/:id` | Get single job detail |

### AI (all require auth)
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/ai/generate-resume` | Generate ATS-friendly resume JSON from profile |
| POST | `/api/ai/ats-score` | Score a resume PDF against a job description (multipart) |
| POST | `/api/ai/job-match` | Score candidate profile against a list of job listings |
| POST | `/api/ai/cover-letter` | Generate a tailored cover letter |
| POST | `/api/ai/skill-gap` | Analyse skill gaps for a target role |
| POST | `/api/ai/mock-interview` | Generate interview questions with model answers |

---

## 🔐 Authentication Flow

```
User logs in via Firebase
        ↓
Frontend calls POST /api/auth/login with Firebase UID + email
        ↓
Backend creates/finds user in MySQL → issues JWT token
        ↓
JWT stored in localStorage as jp_token
        ↓
All subsequent API calls include JWT in Authorization header
        ↓
verifyToken middleware validates JWT on protected routes
```

---

## 📋 Application Status Flow

```
draft → submitted → under_review → shortlisted → selected
                                               → rejected
```

---

## 🛡️ Security & Performance

- **Helmet.js** — sets secure HTTP headers on every response
- **Rate limiting** — auth routes: 20 req/15 min · general API: 200 req/15 min · AI routes: 50 req/min
- **CORS whitelist** — only the deployed frontend and localhost are permitted
- **express-validator** — validates and sanitizes all incoming data
- **JWT** — tokens expire after 7 days; Firebase handles all password management, no passwords stored
- **Keep-alive ping** — backend self-pings every 14 minutes to prevent Render free-tier cold starts

---

## ☁️ Deployment

Both services deploy from this **same repo**, using each platform's root directory setting:

### Frontend — Vercel
1. Import this repo on [vercel.com](https://vercel.com)
2. Set **Root Directory** to `frontend`
3. Add all `REACT_APP_*` environment variables in the Vercel dashboard
4. Vercel auto-deploys on every `git push`

### Backend — Render
1. Import this repo as a new **Web Service** on [render.com](https://render.com)
2. Set **Root Directory** to `backend`
3. Build command: `npm install`
4. Start command: `npm start`
5. Add all backend environment variables (including `GEMINI_API_KEY`) in the Render dashboard

### Database — Railway
1. Create a new MySQL service on [railway.app](https://railway.app)
2. Copy the connection credentials into `backend/.env`
3. Run `backend/schema.sql` to create all tables and apply any migrations

---

## 👩‍💻 Author

**Anisha** — [anisha18112006@gmail.com](mailto:anisha18112006@gmail.com)

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).