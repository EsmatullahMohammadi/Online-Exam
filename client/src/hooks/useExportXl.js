import * as XLSX from "xlsx";

const exportToExcel = (filteredItems) => {
  try {
    const dataToExport = filteredItems.map((item, index) => ({
      "#": index + 1,
      Name: item.candidateId?.name || "",
      "Father Name": item.candidateId?.fatherName || "",
      "Education Degree": item.candidateId?.educationDegree || "",
      Department: item.candidateId?.department || "",
      Faculty: item.candidateId?.faculty || "",
      University: item.candidateId?.university || "",
      Number: item.obtainedMarks?.toFixed(2) || "",
      Result: item.status || "",
    }));

    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Results");

    XLSX.writeFile(
      wb,
      `Results_${new Date().toLocaleDateString("en-GB")}.xlsx`
    );
  } catch (error) {
    console.error("Error exporting Excel file:", error);
  }
};

export default exportToExcel;
