import React from "react";
import "./ProgressBar.css";

export default function ProgressBar({ currentStep, steps }) {
  return (
    <div className="progress-wrapper">
      {steps.map((label, i) => {
        const num = i + 1;
        const isCompleted = num < currentStep;
        const isActive = num === currentStep;
        return (
          <React.Fragment key={num}>
            <div className={`step-item ${isCompleted ? "completed" : ""} ${isActive ? "active" : ""}`}>
              <div className="step-circle">
                {isCompleted ? "✓" : num}
              </div>
              <span className="step-label">{label}</span>
            </div>
            {i < steps.length - 1 && (
              <div className={`step-line ${isCompleted ? "filled" : ""}`} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}