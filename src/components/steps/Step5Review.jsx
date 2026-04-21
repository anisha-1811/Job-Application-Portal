import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../shared/StepForm.css";

export default function Step5Review({ data, onBack }) {
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = () => {
    setSubmitted(true);
    setTimeout(() => navigate("/success"), 1500);
  };

  const rows = [
    ["Full Name",              `${data.firstName} ${data.lastName}`],
    ["Date of Birth",          data.dob],
    ["Gender",                 data.gender],
    ["Phone",                  data.phone],
    ["Address",                [data.address, data.city, data.state, data.pincode].filter(Boolean).join(", ")],
    ["Nationality",            data.nationality],
    ["Degree",                 data.degree],
    ["Branch / Specialization",data.branch],
    ["Institution",            data.institution],
    ["CGPA / Percentage",      data.cgpa],
    ["Passing Year",           data.passingYear],
    ["12th Board & Marks",     `${data.twelthBoard} — ${data.twelthMarks}`],
    ["10th Board & Marks",     `${data.tenthBoard} — ${data.tenthMarks}`],
    ["Technical Skills",       data.skills],
    ["Work Experience",        data.experience   || "—"],
    ["Internships",            data.internships  || "—"],
    ["Projects",               data.projects],
    ["Achievements",           data.achievements || "—"],
    ["Resume",                 data.resume?.name   || "Not uploaded"],
    ["Photo",                  data.photo?.name    || "Not uploaded"],
    ["ID Proof",               data.idProof?.name  || "Not uploaded"],
  ];

  return (
    <div className="review-container">
      <h2>Step 5: Review Your Application</h2>
      <p className="step-desc">
        Please verify all details carefully before submitting. You cannot edit after submission.
      </p>

      <table>
        <tbody>
          {rows.map(([label, value]) => (
            <tr key={label}>
              <td>{label}</td>
              <td>{value || "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="step-buttons">
        <button
          type="button"
          onClick={onBack}
          className="btn-back"
          disabled={submitted}
        >
          ← Back
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