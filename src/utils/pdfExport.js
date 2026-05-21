export async function downloadResumePDF(element, filename = "resume") {
  const { default: html2canvas } = await import("html2canvas");
  const { default: jsPDF } = await import("jspdf");

  const safeName = filename
    .toLowerCase()
    .replace(/\s+/g, "_")
    .replace(/[^a-z0-9_]/g, "");

  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    letterRendering: true,
    backgroundColor: "#ffffff",
  });

  const imgData = canvas.toDataURL("image/jpeg", 0.98);
  const pdf = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });

  const pageWidth  = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const imgWidth   = pageWidth - 16;
  const imgHeight  = (canvas.height * imgWidth) / canvas.width;

  let y = 8;
  let remaining = imgHeight;

  while (remaining > 0) {
    pdf.addImage(imgData, "JPEG", 8, y, imgWidth, Math.min(imgHeight, pageHeight - 16));
    remaining -= (pageHeight - 16);
    y = -(imgHeight - remaining);
    if (remaining > 0) pdf.addPage();
  }

  pdf.save(`${safeName}_resume.pdf`);
}