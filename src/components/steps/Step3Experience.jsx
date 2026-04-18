import React from "react";
import "../shared/StepForm.css";

export default function Step3Experience({ data, update, onNext, onBack }) {
  const handle = (e) => update({ [e.target.name]: e.target.value });

  return (
    <form
      onSubmit={(e) => { e.preventDefault(); onNext(); }}
      className="step-form"
    >
      <h2>Step 3: Skills &amp; Experience</h2>
      <p className="step-desc">
        Tell us about your technical skills, work experience, and projects.
      </p>

      <div className="form-group">
        <label>Technical Skills *</label>
        <textarea
          name="skills"
          value={data.skills || ""}
          onChange={handle}
          placeholder="e.g. Java, Python, React, SQL, Circuit Design, MATLAB..."
          rows={3}
          required
        />
        <small>Separate each skill with a comma.</small>
      </div>

      <div className="section-heading">Work Experience</div>

      <div className="form-group">
        <label>Work Experience</label>
        <textarea
          name="experience"
          value={data.experience || ""}
          onChange={handle}
          placeholder="Company Name, Role, Duration — e.g. ABC Corp, Software Intern, Jun 2024 – Aug 2024"
          rows={3}
        />
        <small>Leave blank if not applicable.</small>
      </div>

      <div className="form-group">
        <label>Internships</label>
        <textarea
          name="internships"
          value={data.internships || ""}
          onChange={handle}
          placeholder="e.g. DRDO, Electronics Intern, 2 months"
          rows={2}
        />
        <small>List any academic or industry internships.</small>
      </div>

      <div className="section-heading">Projects &amp; Achievements</div>

      <div className="form-group">
        <label>Projects *</label>
        <textarea
          name="projects"
          value={data.projects || ""}
          onChange={handle}
          placeholder="Project title and brief description — e.g. Smart Irrigation System using Arduino (IoT-based water management)"
          rows={3}
          required
        />
      </div>

      <div className="form-group">
        <label>Achievements &amp; Certifications</label>
        <textarea
          name="achievements"
          value={data.achievements || ""}
          onChange={handle}
          placeholder="e.g. Ranked 3rd in college hackathon, AWS Cloud Practitioner Certificate"
          rows={2}
        />
      </div>

      <div className="step-buttons">
        <button type="button" onClick={onBack} className="btn-back">
          ← Back
        </button>
        <button type="submit" className="btn-next">
          Next: Documents →
        </button>
      </div>
    </form>
  );
}