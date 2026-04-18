import React from "react";

export default function Step4Documents({ update, onNext, onBack }) {

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (file) {
      update({ [e.target.name]: file });
    }
  };

  return (
    <form onSubmit={(e) => { e.preventDefault(); onNext(); }}>
      <h2>Step 4</h2>

      <input type="file" name="resume" onChange={handleFile} />

      <br /><br />

      <button type="button" onClick={onBack}>Back</button>
      <button type="submit">Next</button>
    </form>
  );
}