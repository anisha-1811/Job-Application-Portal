import React, { useState } from "react";
import "../shared/StepForm.css";

export default function Step4Documents({ data, update, onNext, onBack }) {
  const [previews, setPreviews] = useState({});

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (file) {
      update({ [e.target.name]: file });
      if (file.type.startsWith("image/")) {
        setPreviews((prev) => ({ ...prev, [e.target.name]: "image" }));
      } else {
        setPreviews((prev) => ({ ...prev, [e.target.name]: file.name }));
      }
    }
  };

  const fileStatus = (name) => {
    const val = previews[name] || (data[name]?.name);
    if (!val) return null;
    return val === "image" ? "✓ Image selected" : `✓ ${val}`;
  };

  return (
    <form
      onSubmit={(e) => { e.preventDefault(); onNext(); }}
      className="step-form"
    >
      <h2>Step 4: Upload Documents</h2>
      <p className="step-desc">
        Upload your supporting documents. Accepted formats: PDF, JPG, PNG.
      </p>

      <div className="info-box">
        📎 Files are stored locally for this session only. Max recommended size: 5 MB each.
      </div>

      <div className="section-heading">Required Documents</div>

      <div className="form-group">
        <label>Resume / CV * (PDF preferred)</label>
        <input
          type="file"
          name="resume"
          accept=".pdf,.doc,.docx"
          onChange={handleFile}
          required={!data.resume}
        />
        {fileStatus("resume") && (
          <small style={{ color: "#2e7d32" }}>{fileStatus("resume")}</small>
        )}
      </div>

      <div className="form-group">
        <label>Passport-size Photo * (JPG / PNG)</label>
        <input
          type="file"
          name="photo"
          accept="image/*"
          onChange={handleFile}
          required={!data.photo}
        />
        {fileStatus("photo") && (
          <small style={{ color: "#2e7d32" }}>{fileStatus("photo")}</small>
        )}
      </div>

      <div className="section-heading">Identity Proof</div>

      <div className="form-group">
        <label>ID Proof (Aadhaar / PAN / Passport)</label>
        <input
          type="file"
          name="idProof"
          accept=".pdf,image/*"
          onChange={handleFile}
        />
        {fileStatus("idProof") && (
          <small style={{ color: "#2e7d32" }}>{fileStatus("idProof")}</small>
        )}
        <small>Optional — accepted formats: PDF or image.</small>
      </div>

      <div className="step-buttons">
        <button type="button" onClick={onBack} className="btn-back">
          ← Back
        </button>
        <button type="submit" className="btn-next">
          Next: Review →
        </button>
      </div>
    </form>
  );
}