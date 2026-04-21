import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  UserPlus,
  ClipboardEdit,
  SearchCheck,
  Rocket
} from "lucide-react";
import "./HomePage.css";

export default function HomePage() {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();

  const [scrolled, setScrolled] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 80);
    return () => clearTimeout(t);
  }, []);

  const steps = [
    {
      icon: <UserPlus className="how-svg" />,
      step: "01",
      title: "Create Account",
      desc: "Sign up with your Google account or email. Your identity is verified instantly.",
      accent: "#6366f1"
    },
    {
      icon: <ClipboardEdit className="how-svg" />,
      step: "02",
      title: "Fill Application",
      desc: "Complete 5 guided steps — personal info, education, experience, and documents.",
      accent: "#8b5cf6"
    },
    {
      icon: <SearchCheck className="how-svg" />,
      step: "03",
      title: "Review Details",
      desc: "See a complete summary table of your application before final submission.",
      accent: "#06b6d4"
    },
    {
      icon: <Rocket className="how-svg" />,
      step: "04",
      title: "Submit & Track",
      desc: "Submit securely and receive your unique Application ID for tracking.",
      accent: "#f59e0b"
    }
  ];

  return (
    <div className={`home-page ${visible ? "page-visible" : ""}`}>

      {/* ================= NAVBAR ================= */}
      <nav className={`home-nav ${scrolled ? "scrolled" : ""}`}>
        <div className="nav-brand" onClick={() => navigate("/")}>
          <span className="brand-icon">🎓</span>
          <span>Career Portal</span>
        </div>

        <div className="nav-links">
          {currentUser ? (
            <>
              <span className="nav-user">
                👤 {currentUser.displayName || currentUser.email}
              </span>

              <button
                onClick={async () => {
                  await logout();
                  navigate("/login");
                }}
                className="nav-btn-outline"
              >
                Logout
              </button>

              <button
                onClick={() => navigate("/apply")}
                className="nav-btn-filled"
              >
                My Application
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => navigate("/login")}
                className="nav-btn-outline"
              >
                Sign In
              </button>

              <button
                onClick={() => navigate("/register")}
                className="nav-btn-filled"
              >
                Apply Now
              </button>
            </>
          )}
        </div>
      </nav>

      {/* ================= HERO ================= */}
      <section className="hero-section">
        <div className="hero-noise" />
        <div className="hero-orb hero-orb-1" />
        <div className="hero-orb hero-orb-2" />
        <div className="hero-orb hero-orb-3" />

        <div className="hero-content">
          <div className="hero-badge">
            <span className="badge-dot" />
            🚀 Applications Open 2026
          </div>

          <h1 className="hero-title">
            Launch Your Career <br />
            <span className="hero-highlight">The Right Way</span>
          </h1>

          <p className="hero-subtitle">
            A streamlined, secure application portal for jobs and internships.
            Verified identity. Simple process. Fast results.
          </p>

          <div className="hero-buttons">
            <button
              onClick={() =>
                navigate(currentUser ? "/apply" : "/register")
              }
              className="btn-hero-primary"
            >
              Start Application
              <span className="btn-arrow">→</span>
            </button>

            <button
              onClick={() => navigate("/login")}
              className="btn-hero-secondary"
            >
              Already registered? Sign In
            </button>
          </div>

          {/* Stats */}
          <div className="stats-row">
            {[
              { number: "500+", label: "Positions Available" },
              { number: "50+", label: "Partner Companies" },
              { number: "2 min", label: "Avg. Apply Time" },
              { number: "100%", label: "Secure & Verified" }
            ].map((stat, i) => (
              <div
                className="stat-card"
                key={stat.label}
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className="stat-number">{stat.number}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= HOW IT WORKS ================= */}
      <section className="how-section">
        <div className="how-header">
          <span className="how-pill">How It Works</span>
          <h2>Four Steps to Your Future</h2>
          <p className="how-subtitle">
            Simple, guided, and secure from start to finish
          </p>
        </div>

        <div className="steps-grid">
          {steps.map((item, i) => (
            <div
              className="how-card"
              key={item.step}
              style={{
                "--card-accent": item.accent,
                animationDelay: `${i * 0.1}s`
              }}
            >
              <div className="how-card-inner">
                <div className="how-step-number">{item.step}</div>

                <div className="how-icon-wrap">
                  <div className="how-icon">{item.icon}</div>
                </div>

                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </div>

              <div className="how-card-glow" />
            </div>
          ))}
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="cta-strip">
        <div className="cta-noise" />
        <h2>Ready to take the leap?</h2>
        <p>
          Join thousands of applicants who found their opportunity here.
        </p>

        <button
          onClick={() =>
            navigate(currentUser ? "/apply" : "/register")
          }
          className="cta-btn"
        >
          Get Started Free →
        </button>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="home-footer">
        <div className="footer-brand">
          <span>🎓</span> Career Portal
        </div>
        <p>
          © 2026 Career Portal · All rights reserved · Built with React &amp;
          Firebase
        </p>
      </footer>
    </div>
  );
}