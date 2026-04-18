import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./HomePage.css";

export default function HomePage() {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();

  return (
    <div className="home-page">
      {/* Navbar */}
      <nav className="home-nav">
        <div className="nav-brand">
          <span className="brand-icon">🎓</span>
          <span>Career Portal</span>
        </div>
        <div className="nav-links">
          {currentUser ? (
            <>
              <span className="nav-user">👤 {currentUser.displayName || currentUser.email}</span>
              <button onClick={() => { logout(); navigate("/login"); }} className="nav-btn-outline">Logout</button>
              <button onClick={() => navigate("/apply")} className="nav-btn-filled">My Application</button>
            </>
          ) : (
            <>
              <button onClick={() => navigate("/login")} className="nav-btn-outline">Sign In</button>
              <button onClick={() => navigate("/register")} className="nav-btn-filled">Apply Now</button>
            </>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-badge">🚀 Applications Open 2026</div>
        <h1 className="hero-title">
          Launch Your Career<br />
          <span className="hero-highlight">The Right Way</span>
        </h1>
        <p className="hero-subtitle">
          A streamlined, secure application portal for jobs and internships.
          Verified identity. Simple process. Fast results.
        </p>
        <div className="hero-buttons">
          <button onClick={() => navigate(currentUser ? "/apply" : "/register")} className="btn-hero-primary">
            Start Application →
          </button>
          <button onClick={() => navigate("/login")} className="btn-hero-secondary">
            Already registered? Sign In
          </button>
        </div>

        {/* Stats Row */}
        <div className="stats-row">
          {[
            { number: "500+", label: "Positions Available" },
            { number: "50+", label: "Partner Companies" },
            { number: "2 min", label: "Avg. Apply Time" },
            { number: "100%", label: "Secure & Verified" },
          ].map(stat => (
            <div className="stat-card" key={stat.label}>
              <div className="stat-number">{stat.number}</div>
              <div className="stat-label">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="how-section">
        <h2>How It Works</h2>
        <p className="how-subtitle">Four simple steps to submit your application</p>
        <div className="steps-grid">
          {[
            { icon: "🔐", step: "01", title: "Create Account", desc: "Sign up with your Google account or email. Your identity is verified instantly." },
            { icon: "📝", step: "02", title: "Fill Application", desc: "Complete 5 guided steps — personal info, education, experience, and documents." },
            { icon: "👁️", step: "03", title: "Review Details", desc: "See a complete summary table of your application before final submission." },
            { icon: "✅", step: "04", title: "Submit & Track", desc: "Submit securely and receive your unique Application ID for tracking." },
          ].map(item => (
            <div className="how-card" key={item.step}>
              <div className="how-icon">{item.icon}</div>
              <div className="how-step-number">{item.step}</div>
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="home-footer">
        <p>© 2025 ApplyPortal · All rights reserved · Built with React & Firebase</p>
      </footer>
    </div>
  );
}