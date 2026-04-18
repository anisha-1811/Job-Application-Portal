import React from "react";
import "../shared/StepForm.css";

export default function Step2Education({ data, update, onNext, onBack }) {

  const handle = (e) => {
    const { name, value } = e.target;
    update({ [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onNext();
  };

  return (
    <form onSubmit={handleSubmit} className="step-form">
      <h2>Step 2: Educational Qualifications</h2>
      <p className="step-desc">Provide your academic details accurately.</p>

      {/* Graduation */}
      <div className="section-heading">Graduation / Current Degree</div>

      <div className="form-row">
        <div className="form-group">
          <label>Degree *</label>
          <select
            name="degree"
            value={data.degree || ""}
            onChange={handle}
            required
          >
            <option value="">Select</option>
            <option>B.Tech</option>
            <option>B.Sc</option>
            <option>B.Com</option>
            <option>BCA</option>
            <option>MBA</option>
            <option>M.Tech</option>
            <option>MCA</option>
          </select>
        </div>

        <div className="form-group">
          <label>Branch/Specialization *</label>
          <input
            name="branch"
            value={data.branch || ""}
            onChange={handle}
            placeholder="e.g. Computer Science"
            required
          />
        </div>
      </div>

      <div className="form-group">
        <label>Institution Name *</label>
        <input
          name="institution"
          value={data.institution || ""}
          onChange={handle}
          placeholder="Full university/college name"
          required
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>CGPA / Percentage *</label>
          <input
            name="cgpa"
            value={data.cgpa || ""}
            onChange={handle}
            placeholder="e.g. 8.5 or 85%"
            required
          />
        </div>

        <div className="form-group">
          <label>Passing Year *</label>
          <input
            type="number"
            name="passingYear"
            value={data.passingYear || ""}
            onChange={handle}
            placeholder="e.g. 2025"
            min="2000"
            max="2035"
            required
          />
        </div>
      </div>

      {/* Class 12 */}
      <div className="section-heading">Class XII (12th)</div>

      <div className="form-row">
        <div className="form-group">
          <label>Board *</label>
          <input
            name="twelthBoard"
            value={data.twelthBoard || ""}
            onChange={handle}
            placeholder="CBSE / ICSE / State"
            required
          />
        </div>

        <div className="form-group">
          <label>Marks / Percentage *</label>
          <input
            name="twelthMarks"
            value={data.twelthMarks || ""}
            onChange={handle}
            placeholder="e.g. 92%"
            required
          />
        </div>
      </div>

      {/* Class 10 */}
      <div className="section-heading">Class X (10th)</div>

      <div className="form-row">
        <div className="form-group">
          <label>Board *</label>
          <input
            name="tenthBoard"
            value={data.tenthBoard || ""}
            onChange={handle}
            placeholder="CBSE / ICSE / State"
            required
          />
        </div>

        <div className="form-group">
          <label>Marks / Percentage *</label>
          <input
            name="tenthMarks"
            value={data.tenthMarks || ""}
            onChange={handle}
            placeholder="e.g. 95%"
            required
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="step-buttons">
        <button
          type="button"
          onClick={onBack}
          className="btn-back"
        >
          ← Back
        </button>

        <button
          type="submit"
          className="btn-next"
        >
          Next: Experience →
        </button>
      </div>
    </form>
  );
}