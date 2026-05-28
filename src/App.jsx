import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";

import HomePage from "./pages/HomePage";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import ApplicationPage from "./pages/ApplicationPage";
import SuccessPage from "./pages/SuccessPage";
import MyApplicationPage from "./pages/MyApplicationPage";
import ResumeGenerator from "./pages/ResumeGenerator";
import ATSScoreChecker from "./pages/ATSScoreChecker";
import JobListingsPage from "./pages/JobListingsPage";
import DashboardPage from "./pages/DashboardPage";
import CoverLetterPage from "./pages/CoverLetterPage";
import SkillGapPage from "./pages/SkillGapPage";
import MockInterviewPage from "./pages/MockInterviewPage";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected routes */}
          <Route
            path="/apply"
            element={
              <ProtectedRoute>
                <ApplicationPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/my-application"
            element={
              <ProtectedRoute>
                <MyApplicationPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/success"
            element={
              <ProtectedRoute>
                <SuccessPage />
              </ProtectedRoute>
            }
          />

          {/* ✅ NEW — AI Resume Generator (Phase 2) */}
          <Route
            path="/resume-generator"
            element={
              <ProtectedRoute>
                <ResumeGenerator />
              </ProtectedRoute>
            }
          />

          <Route
            path="/ats-checker"
            element={
              <ProtectedRoute>
                <ATSScoreChecker />
              </ProtectedRoute>
            }
          />
          <Route
  path="/jobs"
  element={
    <ProtectedRoute>
      <JobListingsPage />
    </ProtectedRoute>
  }
/>

          {/* ✅ Phase 5 — Dashboard */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />

          {/* ✅ Phase 6 — AI Tools */}
          <Route
            path="/cover-letter"
            element={
              <ProtectedRoute>
                <CoverLetterPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/skill-gap"
            element={
              <ProtectedRoute>
                <SkillGapPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/mock-interview"
            element={
              <ProtectedRoute>
                <MockInterviewPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;