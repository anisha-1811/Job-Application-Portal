import React from "react";

export default function Step3Experience({ data, update, onNext, onBack }) {
  const handle = (e) => update({ [e.target.name]: e.target.value });

  return (
    <form onSubmit={(e) => { e.preventDefault(); onNext(); }}>
      <h2>Step 3</h2>

      <input
        name="skills"
        value={data.skills || ""}
        onChange={handle}
        placeholder="Skills"
      />

      <br /><br />

      <button type="button" onClick={onBack}>Back</button>
      <button type="submit">Next</button>
    </form>
  );
}