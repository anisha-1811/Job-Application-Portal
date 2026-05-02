import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./SuccessPage.css";

export default function SuccessPage() {
  const location   = useLocation();
  const { currentUser } = useAuth();

  // ── Get real Application ID ─────────────────────────────────────────────────
  // 1st priority: passed from Step5Review via navigate("/success", { state })
  // 2nd priority: saved in localStorage during Firebase login
  // 3rd priority: fallback generated ID
  const appId =
    location.state?.applicationCode ||
    localStorage.getItem("jp_applicant_id") ||
    "APP" + Date.now().toString().slice(-8);

  const [copied, setCopied] = useState(false);

  const copyId = () => {
    navigator.clipboard.writeText(appId).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  return (
    <div className="success-container">
      <div className="success-card">

        {/* Icon */}
        <div className="success-icon">✅</div>

        {/* Heading */}
        <h1>Application Submitted!</h1>
        <p className="success-sub">
          Your application has been received and saved successfully.
          Our team will review it and get back to you.
        </p>

        {/* Applicant email */}
        {currentUser && (
          <div className="success-email-badge">
            📧 Submitted as <strong>{currentUser.email}</strong>
          </div>
        )}

        {/* Application ID box */}
        <div className="app-id-box">
          <div className="app-id-label">Your Application ID</div>
          <div className="app-id-value">{appId}</div>
          <button className="app-id-copy" onClick={copyId}>
            {copied ? "✓ Copied!" : "📋 Copy ID"}
          </button>
        </div>

        {/* Next steps */}
        <div className="success-steps">
          <div className="ss-item">
            <span className="ss-icon">📧</span>
            <span>A confirmation has been linked to your registered email</span>
          </div>
          <div className="ss-item">
            <span className="ss-icon">🕐</span>
            <span>Review process takes 3–5 business days</span>
          </div>
          <div className="ss-item">
            <span className="ss-icon">💾</span>
            <span>Save your Application ID for future status tracking</span>
          </div>
          <div className="ss-item">
            <span className="ss-icon">📱</span>
            <span>You will be notified of next steps via email</span>
          </div>
        </div>

        <p className="note">
          Keep your Application ID safe — you will need it to track your status.
        </p>

        <Link to="/" className="btn-home">← Back to Home</Link>

      </div>
    </div>
  );
}