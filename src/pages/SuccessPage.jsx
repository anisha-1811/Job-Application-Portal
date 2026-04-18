import React from "react";
import { Link } from "react-router-dom";
import "./SuccessPage.css";

export default function SuccessPage() {
  const appId = "APP" + Date.now().toString().slice(-8);
  return (
    <div className="success-container">
      <div className="success-card">
        <div className="success-icon">✅</div>
        <h1>Application Submitted!</h1>
        <p>Your application has been received successfully.</p>
        <div className="app-id-box">
          Application ID: <strong>{appId}</strong>
        </div>
        <p className="note">Please save this ID for future reference. You will receive a confirmation email shortly.</p>
        <Link to="/" className="btn-home">← Back to Home</Link>
      </div>
    </div>
  );
}