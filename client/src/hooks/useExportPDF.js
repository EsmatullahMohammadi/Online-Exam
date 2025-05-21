import { useRef } from "react";
import html2pdf from "html2pdf.js";

const useExportPDF = ({ filename = "document.pdf", orientation = "portrait" } = {}) => {
  const elementRef = useRef(null);

  const exportToPDF = () => {
    if (!elementRef.current) return;

    const opt = {
      margin: 0.5,
      filename,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "letter", orientation },
    };

    html2pdf().set(opt).from(elementRef.current).save();
  };

  return { elementRef, exportToPDF };
};

export default useExportPDF;
