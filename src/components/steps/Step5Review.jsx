import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { submitApplication } from "../../services/api";
import "../shared/StepForm.css";
import "./Step5Review.css";

export default function Step5Review({ data, onBack }) {
  const [agreed,    setAgreed]    = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const navigate                  = useNavigate();
  const { currentUser }           = useAuth();

  // ── Submit handler ──────────────────────────────────────────────────────────
  const handleSubmit = async () => {
    if (!agreed) {
      alert("Please read and agree to the declaration before submitting.");
      return;
    }
    setSubmitted(true);
    try {
      const payload = {
        // Step 1
        firstName:       data.firstName   || "",
        lastName:        data.lastName    || "",
        dob:             data.dob         || "",
        gender:          data.gender      || "",
        phone:           data.phone       || "",
        address:         data.address     || "",
        city:            data.city        || "",
        state:           data.state       || "",
        pincode:         data.pincode     || "",
        nationality:     data.nationality || "",
        // Step 2
        degrees:         data.degrees         || [],
        twelthBoard:     data.twelthBoard     || "",
        twelthMarks:     data.twelthMarks     || "",
        twelthYear:      data.twelthYear      || "",
        tenthBoard:      data.tenthBoard      || "",
        tenthMarks:      data.tenthMarks      || "",
        tenthYear:       data.tenthYear       || "",
        schoolGapReason: data.schoolGapReason || "",
        // Step 3
        skillsList:      data.skillsList      || [],
        experiences:     data.experiences     || [],
        internshipsList: data.internshipsList || [],
        projectsList:    data.projectsList    || [],
        certsList:       data.certsList       || [],
        profileLinks:    data.profileLinks    || [],
        // Step 4
        resumeLink:      data.resumeLink      || "",
        photoLink:       data.photoLink       || "",
        idProofLink:     data.idProofLink     || "",
      };

      const result = await submitApplication(payload);

      if (result.success) {
        navigate("/success", {
          state: { applicationCode: result.application_code }
        });
      } else {
        alert("Submission failed: " + result.message);
        setSubmitted(false);
      }
    } catch (err) {
      console.error("Submit error:", err);
      alert("Something went wrong. Please check your connection and try again.");
      setSubmitted(false);
    }
  };

  // ── Helpers ─────────────────────────────────────────────────────────────────
  const val = (v) => v || "—";

  const degreeText = Array.isArray(data.degrees) && data.degrees.length > 0
    ? data.degrees.map((d, i) =>
        `${i + 1}. ${d.degree || d.degree_type || ""} in ${d.branch || ""} — ${d.institution || ""} (${d.cgpa || ""} | ${d.passingYear || ""})`
      ).join("\n")
    : "—";

  const skillsText = Array.isArray(data.skillsList) && data.skillsList.length > 0
    ? data.skillsList.join(", ")
    : "—";

  const expText = Array.isArray(data.experiences) && data.experiences.length > 0
    ? data.experiences.map(e =>
        `${e.company || ""} — ${e.role || ""} (${e.startDate || ""} to ${e.currentlyWorking ? "Present" : (e.endDate || "")})`
      ).join("\n")
    : "Fresher";

  const internText = Array.isArray(data.internshipsList) && data.internshipsList.length > 0
    ? data.internshipsList.map(i =>
        `${i.company || i.organisation || ""} — ${i.role || ""} (${i.startDate || ""} to ${i.currentlyWorking ? "Present" : (i.endDate || "")})`
      ).join("\n")
    : "—";

  const projectText = Array.isArray(data.projectsList) && data.projectsList.length > 0
    ? data.projectsList.map(p =>
        `${p.title || ""} ${p.url ? "| " + p.url : ""} ${p.ongoing ? "(Ongoing)" : ""}`
      ).join("\n")
    : "—";

  const certText = Array.isArray(data.certsList) && data.certsList.length > 0
    ? data.certsList.map(c =>
        `${c.name || ""} — ${c.issuer || ""}`
      ).join("\n")
    : "—";

  const linkText = Array.isArray(data.profileLinks) && data.profileLinks.length > 0
    ? data.profileLinks.map(l =>
        `${l.label || l.platform_name || ""}: ${l.url || l.profile_url || ""}`
      ).join("\n")
    : "—";

  // ── Review sections ─────────────────────────────────────────────────────────
  const sections = [
    {
      title: "👤 Personal Information",
      rows: [
        ["Full Name",    `${data.firstName || ""} ${data.lastName || ""}`.trim()],
        ["Date of Birth",data.dob        || "—"],
        ["Gender",       data.gender     || "—"],
        ["Phone",        data.phone      || "—"],
        ["Address",      [data.address, data.city, data.state, data.pincode].filter(Boolean).join(", ") || "—"],
        ["Nationality",  data.nationality|| "—"],
      ]
    },
    {
      title: "🎓 Educational Qualifications",
      rows: [
        ["Degrees",            degreeText],
        ["Class XII",          `${val(data.twelthBoard)} — ${val(data.twelthMarks)} (${val(data.twelthYear)})`],
        ["Class X",            `${val(data.tenthBoard)} — ${val(data.tenthMarks)} (${val(data.tenthYear)})`],
        ["School Gap Reason",  data.schoolGapReason || "None"],
      ]
    },
    {
      title: "💼 Skills & Experience",
      rows: [
        ["Technical Skills",   skillsText],
        ["Work Experience",    expText],
        ["Internships",        internText],
        ["Projects",           projectText],
        ["Certificates",       certText],
        ["Profile Links",      linkText],
      ]
    },
    {
      title: "📎 Documents",
      rows: [
        ["Resume Link",   data.resumeLink  || "—"],
        ["Photo Link",    data.photoLink   || "—"],
        ["ID Proof Link", data.idProofLink || "—"],
      ]
    },
  ];

  return (
    <div className="review-wrapper">

      <div className="step-badge">✅ Step 5 of 5</div>
      <h2>Review Your Application</h2>
      <p className="step-desc">
        Carefully verify all details below before final submission.
        You <strong>cannot edit</strong> after submitting.
      </p>

      {/* Applicant email */}
      {currentUser && (
        <div className="review-email-banner">
          <span>📧</span>
          <span>Submitting as: <strong>{currentUser.email}</strong></span>
        </div>
      )}

      {/* Review sections */}
      {sections.map(sec => (
        <div className="review-section" key={sec.title}>
          <div className="review-section-title">{sec.title}</div>
          <table className="review-table">
            <tbody>
              {sec.rows.map(([label, value]) => (
                <tr key={label}>
                  <td className="rt-label">{label}</td>
                  <td className="rt-value">
                    <span style={{ whiteSpace: "pre-wrap" }}>
                      {value || "—"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}

      {/* Declaration */}
      <div className="review-declaration">
        <label className="declaration-label">
          <input
            type="checkbox"
            checked={agreed}
            onChange={e => setAgreed(e.target.checked)}
          />
          <span>
            I hereby declare that all information provided above is true and
            correct to the best of my knowledge. I understand that any false or
            misleading information may result in disqualification of my application.
          </span>
        </label>
      </div>

      {/* Buttons */}
      <div className="step-buttons">
        <button
          type="button"
          onClick={onBack}
          className="btn-back"
          disabled={submitted}
        >
          ← Edit Details
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          className={`btn-submit ${submitted ? "submitted" : ""}`}
          disabled={submitted}
        >
          {submitted ? "Submitting… ✓" : "Submit Application ✅"}
        </button>
      </div>

    </div>
  );
}