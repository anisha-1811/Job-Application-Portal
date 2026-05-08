# 🎓 Career Portal — Job Application Portal

A full-stack web application that lets candidates fill out, submit, and track their job applications through a clean multi-step form. Built with React, Node.js, Firebase Auth, and MySQL.

🔗 **Live Demo:** [job-application-portal-alpha.vercel.app](https://job-application-portal-alpha.vercel.app/my-application)

---

## 📸 Features

- 🔐 **Firebase Authentication** — Google/email login with JWT session management
- 📋 **5-Step Application Form** — Personal info, Education, Experience, Documents, Review
- 💾 **Auto-save to MySQL** — All form data persisted to a cloud database (Railway)
- 📊 **My Application Page** — View your full submitted application anytime
- ✅ **Application Status Tracking** — Track status from Submitted → Under Review → Shortlisted → Selected
- 📱 **Responsive Design** — Works on desktop and mobile

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React 19 | UI framework |
| React Router DOM v7 | Client-side routing |
| Firebase v12 | Authentication (Google/Email) |
| Axios | HTTP requests to backend |
| React Hook Form | Form state management |
| Lucide React | Icons |
| Vercel | Deployment |

### Backend
| Technology | Purpose |
|---|---|
| Node.js + Express 5 | REST API server |
| MySQL2 | Database driver |
| JSON Web Token (JWT) | Session authentication |
| bcryptjs | Password hashing |
| dotenv | Environment variables |
| Railway | MySQL database hosting |
| Render | Backend deployment |

---

## 🗂️ Project Structure

```
Job-Application-Portal/          # Frontend (React)
├── src/
│   ├── components/
│   │   ├── auth/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   └── shared/
│   │       ├── Navbar.jsx
│   │       └── ProgressBar.jsx
│   ├── pages/
│   │   ├── HomePage.jsx
│   │   ├── ApplicationPage.jsx
│   │   ├── MyApplicationPage.jsx
│   │   └── SuccessPage.jsx
│   ├── context/
│   │   └── AuthContext.js        # Firebase + JWT auth state
│   ├── services/
│   │   └── api.js                # Axios API calls
│   └── firebase/
│       └── config.js             # Firebase config
│
job-portal-backend/              # Backend (Node.js)
├── controllers/
│   ├── authController.js         # Login/register logic
│   └── applicationController.js  # Save & get application
├── routes/
│   ├── auth.js
│   └── application.js
├── middleware/
│   └── verifyToken.js            # JWT verification
├── config/
│   └── db.js                     # MySQL connection pool
└── server.js                     # Express app entry point
```

---

## 🗄️ Database Schema

The MySQL database (`job_portal`) contains the following tables:

| Table | Description |
|---|---|
| `applicants` | Core user table — stores Firebase UID, email, applicant ID |
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

---

### 1. Clone the repositories

```bash
git clone https://github.com/anisha-1811/Job-Application-Portal.git
git clone https://github.com/anisha-1811/job-portal-backend.git
```

---

### 2. Backend Setup

```bash
cd job-portal-backend
npm install
```

Create a `.env` file in the root:

```env
DB_HOST=your_railway_mysql_host
DB_PORT=your_railway_mysql_port
DB_USER=your_db_username
DB_PASSWORD=your_db_password
DB_NAME=job_portal
JWT_SECRET=your_secret_key_here
PORT=5000
```

Start the server:

```bash
npm run dev       # development (nodemon)
npm start         # production
```

Server runs at `http://localhost:5000`

---

### 3. Frontend Setup

```bash
cd Job-Application-Portal
npm install
```

Create a `.env` file in the root:

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

---

### 4. Database Setup

Run this on your MySQL database to add the required column if it doesn't exist:

```sql
ALTER TABLE qualifications
ADD COLUMN degree_label VARCHAR(50) DEFAULT ''
AFTER qualification_type;
```

---

## 🌐 API Endpoints

### Auth
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/login` | Login or register via Firebase UID |

**Request body:**
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

---

### Application
All routes require `Authorization: Bearer <token>` header.

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/application/save` | Save/update full application |
| GET | `/api/application/get` | Fetch saved application data |

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

## ☁️ Deployment

### Frontend — Vercel
1. Push to GitHub
2. Import repo on [vercel.com](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Vercel auto-deploys on every `git push`

### Backend — Render
1. Push to GitHub
2. Create a new **Web Service** on [render.com](https://render.com)
3. Set build command: `npm install`
4. Set start command: `node server.js`
5. Add environment variables in Render dashboard

### Database — Railway
1. Create a new MySQL service on [railway.app](https://railway.app)
2. Copy connection credentials to backend `.env`
3. Run schema SQL to create all tables

---

## 📋 Application Status Flow

```
draft → submitted → under_review → shortlisted → selected
                                               → rejected
```

---

## 🔗 Repository Links

- **Frontend:** [github.com/anisha-1811/Job-Application-Portal](https://github.com/anisha-1811/Job-Application-Portal)
- **Backend:** [github.com/anisha-1811/job-portal-backend](https://github.com/anisha-1811/job-portal-backend)

---

## 👩‍💻 Author

**Anisha** — [anisha18112006@gmail.com](mailto:anisha18112006@gmail.com)

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
