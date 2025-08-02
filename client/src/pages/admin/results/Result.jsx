import { useState } from "react";
import { MdVisibility } from "react-icons/md";
import { FaDownload } from "react-icons/fa";
import useExportPDF from "../../../hooks/useExportPDF";
import exportToExcel from "../../../hooks/useExportXl";
import Breadcrumb from "../../../components/Breadcrumbs/Breadcrumb";
import Pagination from "../../../components/Pagination";
import ViewResultsDetails from "./ViewResultsDetails";
import useResults from "../../../hooks/admin/results/useResults";

const Result = () => {
  const {
    loading,
    error,
    selectedTest,
    setSelectedTest,
    selectedStatus,
    setSelectedStatus,
    filteredResults,
    paginatedResults,
    testTitles,
    currentPage,
    setCurrentPage,
    setItemsPerPage,
  } = useResults();

  const { elementRef, exportToPDF } = useExportPDF({
    filename: "results.pdf",
    orientation: "landscape",
  });

  const [isOpenModel, setIsOpenModel] = useState(false);
  const [selectedResult, setSelectedResult] = useState(null);
  const handleCloseModal = () => setIsOpenModel(false);

  const totalPages = Math.ceil(filteredResults.length / 5); // static itemsPerPage = 5

  return (
    <>
      <Breadcrumb pageName={"Results"} />
      <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-4 justify-end">
          <button
            onClick={exportToPDF}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm shadow"
          >
            <FaDownload /> Download PDF
          </button>
          <button
            onClick={() => exportToExcel(filteredResults)}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm shadow"
          >
            <FaDownload /> Download XLSX
          </button>

          <select
            value={selectedTest}
            onChange={(e) => setSelectedTest(e.target.value)}
            className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-boxdark text-black dark:text-white rounded-md px-3 py-2"
          >
            <option value="">All Tests</option>
            {testTitles.map((title) => (
              <option key={title} value={title}>
                {title}
              </option>
            ))}
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-boxdark text-black dark:text-white rounded-md px-3 py-2"
          >
            <option value="">All Status</option>
            <option value="Passed">Passed</option>
            <option value="Failed">Failed</option>
          </select>
        </div>

        <div
          ref={elementRef}
          className="print:bg-white print:text-black print:p-4 print:shadow-none"
        >
          <div className="max-w-full overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr className="bg-gray-300 text-left dark:bg-meta-4">
                  <th className="py-4 px-4 font-medium">#</th>
                  <th className="py-4 px-4 font-medium">Name</th>
                  <th className="py-4 px-4 font-medium">Father name</th>
                  <th className="py-4 px-4 font-medium">Education</th>
                  <th className="py-4 px-4 font-medium">Department</th>
                  <th className="py-4 px-4 font-medium">Faculty</th>
                  <th className="py-4 px-4 font-medium">University</th>
                  <th className="py-4 px-4 font-medium">Number</th>
                  <th className="py-4 px-4 font-medium">Test</th>
                  <th className="py-4 px-4 font-medium">Status</th>
                  <th className="py-4 px-4 font-medium">Submitted At</th>
                  <th className="py-4 px-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="12" className="text-center py-3">
                      Loading...
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan="12" className="text-center text-red-500 py-3">
                      {error}
                    </td>
                  </tr>
                ) : paginatedResults.length > 0 ? (
                  paginatedResults.map((result, index) => (
                    <tr
                      key={result._id}
                      className="border-b dark:border-strokedark"
                    >
                      <td className="py-3 px-4">
                        {(currentPage - 1) * 5 + index + 1}
                      </td>
                      <td className="py-3 px-4">{result.candidateId?.name}</td>
                      <td className="py-3 px-4">
                        {result.candidateId?.fatherName}
                      </td>
                      <td className="py-3 px-4">
                        {result.candidateId?.educationDegree}
                      </td>
                      <td className="py-3 px-4">
                        {result.candidateId?.department}
                      </td>
                      <td className="py-3 px-4">
                        {result.candidateId?.faculty}
                      </td>
                      <td className="py-3 px-4">
                        {result.candidateId?.university}
                      </td>
                      <td className="py-3 px-4">
                        {result.obtainedMarks.toFixed(2)}
                      </td>
                      <td className="py-3 px-4">{result.testId?.title}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                            result.status === "Passed"
                              ? "bg-green-100 text-green-700"
                              : result.status === "Failed"
                                ? "bg-red-100 text-red-700"
                                : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {result.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {new Date(result.submittedAt).toLocaleString()}
                      </td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() => {
                            setSelectedResult(result);
                            setIsOpenModel(true);
                          }}
                          className="text-blue-500 hover:text-blue-600"
                        >
                          <MdVisibility className="text-2xl" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="12" className="text-center py-3">
                      No results found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {filteredResults.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            setCurrentPage={setCurrentPage}
            setItemsPerPage={setItemsPerPage}
          />
        )}
      </div>

      {isOpenModel && selectedResult && (
        <ViewResultsDetails
          result={selectedResult}
          onClose={handleCloseModal}
        />
      )}
    </>
  );
};

export default Result;
