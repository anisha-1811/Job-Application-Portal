import React from "react";
import { db } from "../../firebase/config";
import { collection, addDoc } from "firebase/firestore";
import { useAuth } from "../../context/AuthContext";

export default function Step5Review({ data, onBack }) {
  return (
    <div>
      <h2>Step 5</h2>

      <p>Name: {data.firstName} {data.lastName}</p>
      <p>Skills: {data.skills}</p>
      <p>Resume: {data.resume?.name || "Not uploaded"}</p>

      <br />

      <button onClick={onBack}>Back</button>
      <button onClick={() => alert("Submitted ✅")}>Submit</button>
    </div>
  );
}