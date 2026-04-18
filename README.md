<div align="center">

# 🎓 ApplyPortal — Job Application Portal

**A modern, full-stack job application platform built with React 19 and Firebase**

[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Firebase](https://img.shields.io/badge/Firebase-12-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com/)
[![React Router](https://img.shields.io/badge/React_Router-7-CA4245?style=for-the-badge&logo=react-router&logoColor=white)](https://reactrouter.com/)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

[Features](#-features) · [Tech Stack](#-tech-stack) · [Getting Started](#-getting-started) · [Project Structure](#-project-structure) · [Firebase Setup](#-firebase-setup) · [Screenshots](#-app-flow)

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

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Frontend Framework | React 19 |
| Routing | React Router DOM v7 |
| Authentication | Firebase Auth v12 (Email + Google OAuth) |
| Database | Cloud Firestore |
| Styling | Pure CSS (modular, per-component) |
| Forms | Controlled components with built-in HTML5 validation |
| Build Tool | Create React App (react-scripts 5) |

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
│   │   └── Auth.css            # Shared auth page styles
│   │
│   ├── shared/
│   │   ├── Navbar.jsx          # Sticky top navigation bar
│   │   ├── Navbar.css
│   │   ├── ProgressBar.jsx     # Step indicator component
│   │   ├── ProgressBar.css
│   │   └── StepForm.css        # Shared form styles used by all steps
│   │
│   └── steps/
│       ├── Step1Personal.jsx   # Name, DOB, gender, address
│       ├── Step2Education.jsx  # Degree, boards, CGPA
│       ├── Step3Experience.jsx # Skills, internships, projects
│       ├── Step4Documents.jsx  # Resume, photo, ID proof upload
│       └── Step5Review.jsx     # Full summary table + submit
│
├── context/
│   └── AuthContext.js          # Global auth state via React Context
│
├── firebase/
│   └── config.js               # Firebase app initialization & exports
│
├── pages/
│   ├── HomePage.jsx / .css     # Landing page with hero & how-it-works
│   ├── ApplicationPage.jsx / .css  # Hosts the 5-step form + progress bar
│   └── SuccessPage.jsx / .css  # Confirmation page with Application ID
│
├── App.jsx                     # Route definitions
└── index.js                    # React DOM entry point
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v16 or higher
- A [Firebase](https://console.firebase.google.com/) project (free Spark plan works)

### 1. Clone the repository

```bash
git clone https://github.com/anisha-1811/Job-Application-Portal.git
cd Job-Application-Portal
```

### 2. Install dependencies

> React 19 and react-scripts 5 have a peer dependency conflict — use the flag below:

```bash
npm install --legacy-peer-deps
```

### 3. Configure Firebase

Open `src/firebase/config.js` and replace the placeholder values with your real Firebase project credentials (see [Firebase Setup](#-firebase-setup) below):

```js
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

### 4. Start the development server

```bash
npm start
```

App will open at **http://localhost:3000** 🎉

---

## 🔥 Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/) and create a new project
2. In the left sidebar → **Authentication** → **Get started** → enable **Email/Password** and **Google** providers
3. In the left sidebar → **Firestore Database** → **Create database** → choose a region → start in test mode
4. Go to ⚙️ **Project Settings** → **Your apps** → click the `</>` web icon → register app → copy the config object into `src/firebase/config.js`

---

## 🗺 App Flow

```
/ (Home)
│
├── /register  →  Create account  ──┐
├── /login     →  Sign in         ──┤
│                                   ↓
└────────────────────────────── /apply (Protected)
                                     │
                                     ├── Step 1: Personal Info
                                     ├── Step 2: Education
                                     ├── Step 3: Skills & Experience
                                     ├── Step 4: Document Uploads
                                     └── Step 5: Review & Submit
                                                  │
                                                  ↓
                                             /success
                                      (Unique Application ID)
```

---

## 📄 Application Form — What's Collected

| Step | Section | Fields |
|------|---------|--------|
| 1 | Personal Info | First name, last name, DOB, gender, phone, address, city, state, PIN, nationality |
| 2 | Education | Degree, branch, institution, CGPA, passing year, 12th & 10th board & marks |
| 3 | Experience | Technical skills, work experience, internships, projects, achievements |
| 4 | Documents | Resume/CV, passport photo, ID proof (Aadhaar/PAN/Passport) |
| 5 | Review | Full summary table — verify everything before submitting |

---

## 🤝 Contributing

Contributions are welcome! Here's how:

```bash
# Fork the repo, then:
git checkout -b feature/your-feature-name
git commit -m "feat: describe your change"
git push origin feature/your-feature-name
# Open a Pull Request
```

Please keep commits descriptive and code clean.

---

## 📝 License

This project is licensed under the **MIT License** — feel free to use, modify, and distribute.

---

<div align="center">

Built with ❤️ by [Anisha](https://github.com/anisha-1811) &nbsp;·&nbsp; Powered by React & Firebase

⭐ If you found this useful, consider giving it a star!

</div>
