import React, { useState } from "react";
import { uploadDocuments } from "../../services/api";
import "../shared/StepForm.css";

// Tracks upload state per field: null | "uploading" | "done" | "error"
const IDLE = null;

export default function Step4Documents({ data, update, onNext, onBack }) {
  const [status, setStatus]   = useState({
    resume:  IDLE,
    photo:   IDLE,
    idProof: IDLE,
  });
  const [error, setError]     = useState(null);

  // ── Upload a single file immediately on selection ────────────────────────
  const handleFile = async (e) => {
    const field = e.target.name;   // "resume" | "photo" | "idProof"
    const file  = e.target.files[0];
    if (!file) return;

    // Store File object in parent formData (used as fallback display)
    update({ [field]: file });
    setStatus(s => ({ ...s, [field]: "uploading" }));
    setError(null);

    try {
      const res = await uploadDocuments({ [field]: file });
      if (res.success) {
        // Store the server filename so it's saved in the application payload
        const serverFilename = res.uploaded?.[
          field === "resume"  ? "resume_filename"   :
          field === "photo"   ? "photo_filename"    :
                                "id_proof_filename"
        ];
        if (serverFilename) {
          const linkKey =
            field === "resume"  ? "resumeLink"  :
            field === "photo"   ? "photoLink"   : "idProofLink";
          update({ [field]: file, [linkKey]: serverFilename });
        }
        setStatus(s => ({ ...s, [field]: "done" }));
      } else {
        setStatus(s => ({ ...s, [field]: "error" }));
        setError(`Upload failed for ${field}: ${res.message}`);
      }
    } catch (err) {
      setStatus(s => ({ ...s, [field]: "error" }));
      setError("Upload failed — please check your connection and try again.");
    }
  };

  // ── Status badge under each input ───────────────────────────────────────
  const Badge = ({ field, required }) => {
    const s    = status[field];
    const file = data[field];
    const link = data[field === "resume" ? "resumeLink" : field === "photo" ? "photoLink" : "idProofLink"];

    // Already uploaded in a previous session (link stored in DB)
    if (!s && !file && link) {
      return <small style={{ color: "#059669" }}>✓ Previously uploaded: {link}</small>;
    }
    if (!s && !file) return null;
    if (s === "uploading") return (
      <small style={{ color: "#6366f1", display: "flex", alignItems: "center", gap: 6 }}>
        <span style={{ display: "inline-block", width: 12, height: 12, border: "2px solid #6366f1", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
        Uploading…
      </small>
    );
    if (s === "done") return (
      <small style={{ color: "#059669" }}>✅ Uploaded: {file?.name}</small>
    );
    if (s === "error") return (
      <small style={{ color: "#dc2626" }}>❌ Upload failed — please try again.</small>
    );
    // File chosen but not yet uploaded (shouldn't normally happen)
    if (file) return (
      <small style={{ color: "#d97706" }}>⏳ {file.name} — pending upload</small>
    );
    return null;
  };

  // ── Validation before proceeding ────────────────────────────────────────
  const handleNext = (e) => {
    e.preventDefault();
    const resumeOk = status.resume === "done" || data.resumeLink;
    const photoOk  = status.photo  === "done" || data.photoLink;
    if (!resumeOk) { setError("Please upload your Resume before continuing."); return; }
    if (!photoOk)  { setError("Please upload your Photo before continuing."); return; }
    if (status.resume === "uploading" || status.photo === "uploading" || status.idProof === "uploading") {
      setError("Please wait — file upload in progress."); return;
    }
    setError(null);
    onNext();
  };

  const isUploading = Object.values(status).some(s => s === "uploading");

  return (
    <form onSubmit={handleNext} className="step-form">
      <h2>Step 4: Upload Documents</h2>
      <p className="step-desc">
        Files are uploaded directly to the server. You won't need to re-upload them when editing your application.
      </p>

      {error && (
        <div style={{
          background: "#fee2e2", color: "#991b1b", border: "1px solid #fca5a5",
          borderRadius: 10, padding: "10px 16px", marginBottom: 16, fontSize: 13,
        }}>
          ⚠️ {error}
        </div>
      )}

      <div className="section-heading">Required Documents</div>

      {/* Resume */}
      <div className="form-group">
        <label>Resume / CV * (PDF preferred)</label>
        <input
          type="file"
          name="resume"
          accept=".pdf,.doc,.docx"
          onChange={handleFile}
          disabled={isUploading}
        />
        <Badge field="resume" required />
      </div>

      {/* Photo */}
      <div className="form-group">
        <label>Passport-size Photo * (JPG / PNG)</label>
        <input
          type="file"
          name="photo"
          accept="image/*"
          onChange={handleFile}
          disabled={isUploading}
        />
        <Badge field="photo" required />
      </div>

      <div className="section-heading">Identity Proof</div>

      {/* ID Proof */}
      <div className="form-group">
        <label>ID Proof (Aadhaar / PAN / Passport)</label>
        <input
          type="file"
          name="idProof"
          accept=".pdf,image/*"
          onChange={handleFile}
          disabled={isUploading}
        />
        <Badge field="idProof" />
        <small>Optional — accepted formats: PDF or image.</small>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

      <div className="step-buttons">
        <button type="button" onClick={onBack} className="btn-back" disabled={isUploading}>
          ← Back
        </button>
        <button type="submit" className="btn-next" disabled={isUploading}>
          {isUploading ? "Uploading…" : "Next: Review →"}
        </button>
      </div>
    </form>
  );
}