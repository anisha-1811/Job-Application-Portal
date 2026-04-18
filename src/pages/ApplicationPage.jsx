import React, { useState } from "react";
import Navbar from "../components/shared/Navbar";
import Step1Personal from "../components/steps/Step1Personal";
import Step2Education from "../components/steps/Step2Education";
import Step3Experience from "../components/steps/Step3Experience";
import Step4Documents from "../components/steps/Step4Documents";
import Step5Review from "../components/steps/Step5Review";

export default function ApplicationPage() {
  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    dob: "",
    gender: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    nationality: "",

    degree: "",
    branch: "",
    institution: "",
    cgpa: "",
    passingYear: "",
    twelthBoard: "",
    twelthMarks: "",
    tenthBoard: "",
    tenthMarks: "",

    skills: "",
    experience: "",
    internships: "",
    projects: "",
    achievements: "",

    resume: null,
    photo: null,
    idProof: null
  });

  const update = (fields) =>
    setFormData((prev) => ({ ...prev, ...fields }));

  const next = () => setStep((s) => s + 1);
  const back = () => setStep((s) => s - 1);

  return (
    <>
      <Navbar />

      <div style={{ padding: "80px 20px" }}>
        <h1>Job Application Portal</h1>

        {step === 1 && (
          <Step1Personal data={formData} update={update} onNext={next} />
        )}

        {step === 2 && (
          <Step2Education data={formData} update={update} onNext={next} onBack={back} />
        )}

        {step === 3 && (
          <Step3Experience data={formData} update={update} onNext={next} onBack={back} />
        )}

        {step === 4 && (
          <Step4Documents data={formData} update={update} onNext={next} onBack={back} />
        )}

        {step === 5 && (
          <Step5Review data={formData} onBack={back} />
        )}
      </div>
    </>
  );
}