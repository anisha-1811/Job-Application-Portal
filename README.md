<div align="center">

# 🎓 ApplyPortal — Job Application Portal

**A modern, full-stack job application platform built with React 19 and Firebase**

[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Firebase](https://img.shields.io/badge/Firebase-12-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com/)
[![React Router](https://img.shields.io/badge/React_Router-7-CA4245?style=for-the-badge&logo=react-router&logoColor=white)](https://reactrouter.com/)
[![Vercel](https://img.shields.io/badge/Deployed_on-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](YOUR_VERCEL_URL_HERE)

### 🌐 [Live Demo →](https://job-application-portal-alpha.vercel.app)

[Features](#-features) · [Tech Stack](#-tech-stack) · [Getting Started](#-getting-started) · [Project Structure](#-project-structure) · [Deploy](#️-deployment) · [Firebase Setup](#-firebase-setup)

</div>

---

## ✨ Features

- 🔐 **Authentication** — Email/password login and one-click Google Sign-In via Firebase Auth
- 🛡️ **Protected Routes** — Unauthenticated users are automatically redirected to login
- 📋 **5-Step Application Form** — Guided multi-step flow covering every section of a job application
- 📊 **Visual Progress Bar** — Step indicator so applicants always know where they are
- 👁️ **Review Before Submit** — Full summary table of all entries before final submission
- 🎫 **Unique Application ID** — Every submission generates a unique tracking ID
- 📱 **Responsive Design** — Works cleanly across desktop and mobile screens
- 🎨 **Polished UI** — Custom CSS with consistent design tokens, smooth transitions, and hover effects
- 🔒 **Secure Config** — Firebase credentials managed via environment variables, never hardcoded

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Frontend Framework | React 19 |
| Routing | React Router DOM v7 |
| Authentication | Firebase Auth v12 (Email + Google OAuth) |
| Database | Cloud Firestore |
| Styling | Pure CSS (modular, per-component) |
| Forms | Controlled components with HTML5 validation |
| Build Tool | Create React App (react-scripts 5) |
| Deployment | Vercel |

---

## 📁 Project Structure

```
src/
│
├── components/
│   ├── auth/
│   │   ├── Login.jsx           # Email & Google login form
│   │   ├── Register.jsx        # New user registration
│   │   ├── ProtectedRoute.jsx  # Auth guard for private routes
│   │   └── Auth.css
│   │
│   ├── shared/
│   │   ├── Navbar.jsx          # Sticky top navigation bar
│   │   ├── ProgressBar.jsx     # 5-step visual indicator
│   │   └── StepForm.css        # Shared form styles across all steps
│   │
│   └── steps/
│       ├── Step1Personal.jsx   # Name, DOB, gender, address
│       ├── Step2Education.jsx  # Degree, boards, CGPA
│       ├── Step3Experience.jsx # Skills, internships, projects
│       ├── Step4Documents.jsx  # Resume, photo, ID proof upload
│       └── Step5Review.jsx     # Full summary table + submit
│
├── context/
│   └── AuthContext.js          # Global auth state (React Context API)
│
├── firebase/
│   └── config.js               # Firebase init using env variables
│
├── pages/
│   ├── HomePage.jsx            # Landing page with hero & how-it-works
│   ├── ApplicationPage.jsx     # Hosts the 5-step form + progress bar
│   └── SuccessPage.jsx         # Confirmation page with Application ID
│
├── App.jsx                     # All route definitions
└── index.js                    # React DOM entry point
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v16 or higher
- A [Firebase](https://console.firebase.google.com/) project (free Spark plan works)

### 1. Clone the repo

```bash
git clone https://github.com/anisha-1811/Job-Application-Portal.git
cd Job-Application-Portal
```

### 2. Install dependencies

> React 19 and react-scripts 5 have a known peer dependency conflict — the flag below handles it:

```bash
npm install --legacy-peer-deps
```

### 3. Set up environment variables

```bash
cp .env.example .env
```

Open `.env` and fill in your Firebase credentials (see [Firebase Setup](#-firebase-setup)):

```env
REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
```

### 4. Run locally

```bash
npm start
```

App opens at **http://localhost:3000** 🎉

---

## 🔥 Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/) → **Create a project**
2. **Authentication** → Get started → Enable **Email/Password** and **Google** providers
3. **Firestore Database** → Create database → choose region → start in **test mode**
4. ⚙️ **Project Settings** → Your apps → click `</>` → Register app → copy the config values into your `.env` file

---

## ☁️ Deployment

### Deploy to Vercel (Recommended — free & fast)

**1.** Push your code to GitHub (`.env` is already gitignored by Create React App — your keys stay safe)

**2.** Go to [vercel.com](https://vercel.com) → **Sign in with GitHub** → **Add New Project** → import this repo

**3.** In Vercel's project settings, open **Environment Variables** and add all 6 Firebase keys from your `.env` file

**4.** Set the **Build Command** to:
```
npm install --legacy-peer-deps && npm run build
```

**5.** Click **Deploy** — Vercel gives you a live URL instantly

**6.** Copy your Vercel URL and replace both `YOUR_VERCEL_URL_HERE` placeholders at the top of this README, then push

### Deploy to Firebase Hosting (Alternative)

```bash
npm install -g firebase-tools
firebase login
firebase init hosting
npm run build
firebase deploy
```

---

## 🗺 App Flow

```
/ (Home Page)
│
├── /register  ──→  Create account
├── /login     ──→  Sign in
│                       │
│                       ↓
└──────────────── /apply  (Protected — login required)
                      │
                      ├── Step 1 · Personal Info
                      ├── Step 2 · Education
                      ├── Step 3 · Skills & Experience
                      ├── Step 4 · Document Uploads
                      └── Step 5 · Review & Submit
                                      │
                                      ↓
                                 /success
                          (Unique Application ID)
```

---

## 📄 What the Form Collects

| Step | Section | Fields |
|------|---------|--------|
| 1 | Personal Info | First name, last name, DOB, gender, phone, address, city, state, PIN, nationality |
| 2 | Education | Degree, branch, institution, CGPA, passing year, 12th & 10th board & marks |
| 3 | Experience | Technical skills, work experience, internships, projects, achievements |
| 4 | Documents | Resume/CV, passport photo, ID proof (Aadhaar / PAN / Passport) |
| 5 | Review | Complete summary — verify all fields before final submission |

---

## 🤝 Contributing

Contributions are welcome!

```bash
git checkout -b feature/your-feature-name
git commit -m "feat: describe your change"
git push origin feature/your-feature-name
# Open a Pull Request
```

---

## 📝 License

This project is licensed under the **MIT License** — feel free to use, modify, and distribute.

---

<div align="center">

Built with ❤️ by [Anisha](https://github.com/anisha-1811) &nbsp;·&nbsp; Powered by React & Firebase

⭐ If this helped you, give it a star — it means a lot!

</div>
