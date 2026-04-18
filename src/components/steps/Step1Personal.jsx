import React from "react";
import "../shared/StepForm.css";

export default function Step1Personal({ data, update, onNext }) {

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
      <h2>Step 1: Personal Information</h2>
      <p className="step-desc">
        Enter your basic personal details as per your government ID.
      </p>

      {/* Name */}
      <div className="form-row">
        <div className="form-group">
          <label>First Name *</label>
          <input
            name="firstName"
            value={data.firstName || ""}
            onChange={handle}
            placeholder="First name"
            required
          />
        </div>

        <div className="form-group">
          <label>Last Name *</label>
          <input
            name="lastName"
            value={data.lastName || ""}
            onChange={handle}
            placeholder="Last name"
            required
          />
        </div>
      </div>

      {/* DOB + Gender */}
      <div className="form-row">
        <div className="form-group">
          <label>Date of Birth *</label>
          <input
            type="date"
            name="dob"
            value={data.dob || ""}
            onChange={handle}
            required
          />
        </div>

        <div className="form-group">
          <label>Gender *</label>
          <select
            name="gender"
            value={data.gender || ""}
            onChange={handle}
            required
          >
            <option value="">Select Gender</option>
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
            <option>Prefer not to say</option>
          </select>
        </div>
      </div>

      {/* Phone */}
      <div className="form-group">
        <label>Phone Number *</label>
        <input
          type="tel"
          name="phone"
          value={data.phone || ""}
          onChange={handle}
          placeholder="Enter 10-digit number"
          pattern="[0-9]{10}"
          required
        />
      </div>

      {/* Address */}
      <div className="form-group">
        <label>Address *</label>
        <textarea
          name="address"
          value={data.address || ""}
          onChange={handle}
          placeholder="House No., Street, Area"
          rows={2}
          required
        />
      </div>

      {/* City, State, PIN */}
      <div className="form-row">
        <div className="form-group">
          <label>City *</label>
          <input
            name="city"
            value={data.city || ""}
            onChange={handle}
            placeholder="City"
            required
          />
        </div>

        <div className="form-group">
          <label>State *</label>
          <input
            name="state"
            value={data.state || ""}
            onChange={handle}
            placeholder="State"
            required
          />
        </div>

        <div className="form-group">
          <label>PIN Code *</label>
          <input
            name="pincode"
            value={data.pincode || ""}
            onChange={handle}
            placeholder="6-digit PIN"
            maxLength={6}
            pattern="[0-9]{6}"
            required
          />
        </div>
      </div>

      {/* Nationality */}
      <div className="form-group">
        <label>Nationality *</label>
        <input
          name="nationality"
          value={data.nationality || ""}
          onChange={handle}
          placeholder="Indian"
          required
        />
      </div>

      {/* Buttons */}
      <div className="step-buttons">
        <button type="submit" className="btn-next">
          Next: Education →
        </button>
      </div>
    </form>
  );
}