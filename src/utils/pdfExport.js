import html2pdf from "html2pdf.js";

/**
 * Converts the resume preview DOM node to a downloadable PDF.
 * @param {HTMLElement} element - The ref.current from ResumePreview
 * @param {string} filename - Name for the downloaded file
 */
export async function downloadResumePDF(element, filename = "resume") {
  const safeName = filename
    .toLowerCase()
    .replace(/\s+/g, "_")
    .replace(/[^a-z0-9_]/g, "");

  const options = {
    margin: [8, 8, 8, 8],             // top, right, bottom, left (mm)
    filename: `${safeName}_resume.pdf`,
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: {
      scale: 2,                        // higher = sharper
      useCORS: true,
      letterRendering: true,
    },
    jsPDF: {
      unit: "mm",
      format: "a4",
      orientation: "portrait",
    },
    pagebreak: { mode: ["avoid-all", "css", "legacy"] },
  };

  await html2pdf().set(options).from(element).save();
}