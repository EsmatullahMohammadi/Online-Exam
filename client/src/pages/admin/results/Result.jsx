import { useEffect, useState } from "react";
import axios from "axios";
import { MdVisibility } from "react-icons/md";
import { SUPER_DOMAIN } from "../constant";
import Pagination from "../../../components/Pagination";
import ViewResultsDetails from "./ViewResultsDetails";
import Breadcrumb from "../../../components/Breadcrumbs/Breadcrumb";

const Result = () => {
  const [results, setResults] = useState([]);
  const [filteredResults, setFilteredResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isOpenModel, setIsOpenModel] = useState(false);
  const handleCloseModal = () => setIsOpenModel(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(2);
  const [selectedResult, setSelectedResult] = useState(null);

  // Filters
  const [selectedTest, setSelectedTest] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await axios.get(`${SUPER_DOMAIN}/results`, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        setResults(response.data);
        setFilteredResults(response.data); // Initialize filtered results
      } catch (err) {
        console.log(err);
        setError("Failed to fetch results.");
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, []);

  // Apply filters
  useEffect(() => {
    let filtered = results;

    if (selectedTest) {
      filtered = filtered.filter((result) => result.testId?.title === selectedTest);
    }

    if (selectedStatus) {
      filtered = filtered.filter((result) => result.status === selectedStatus);
    }

    setFilteredResults(filtered);
    setCurrentPage(1); // Reset to first page when filtering
  }, [selectedTest, selectedStatus, results]);

  // Get unique test titles for dropdown
  const testTitles = [...new Set(results.map((result) => result.testId?.title).filter(Boolean))];

  // Pagination Logic
  const totalPages = Math.ceil(filteredResults.length / itemsPerPage);
  const paginatedResults = filteredResults.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <>
      <Breadcrumb pageName={"Results"} />
      <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-4 justify-end">
          <select
            className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-boxdark text-black dark:text-white rounded-md px-3 py-2 focus:ring focus:ring-blue-200"
            value={selectedTest}
            onChange={(e) => setSelectedTest(e.target.value)}
          >
            <option value="">All Tests</option>
            {testTitles.map((title) => (
              <option key={title} value={title}>
                {title}
              </option>
            ))}
          </select>

          <select
            className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-boxdark text-black dark:text-white rounded-md px-3 py-2 focus:ring focus:ring-blue-200"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="">All Status</option>
            <option value="Passed">Passed</option>
            <option value="Failed">Failed</option>
          </select>
        </div>

        <div className="max-w-full overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-300 text-left dark:bg-meta-4">
                <th className="py-4 px-4 font-medium text-black dark:text-white">#</th>
                <th className="py-4 px-4 font-medium text-black dark:text-white">Candidate Name</th>
                <th className="py-4 px-4 font-medium text-black dark:text-white">Test Title</th>
                <th className="py-4 px-4 font-medium text-black dark:text-white">Status</th>
                <th className="min-w-[200px] py-4 px-4 font-medium text-black dark:text-white">Submitted At</th>
                <th className="py-4 px-4 font-medium text-black dark:text-white">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="text-center py-3">
                    Loading...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan="6" className="text-center py-3 text-red-500">
                    {error}
                  </td>
                </tr>
              ) : paginatedResults.length > 0 ? (
                paginatedResults.map((result, index) => (
                  <tr key={result._id} className="border-b border-gray-200 dark:border-strokedark">
                    <td className="py-3 px-4">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                    <td className="py-3 px-4 text-black dark:text-white">{result.candidateId?.name}</td>
                    <td className="py-3 px-4 text-black dark:text-white">{result.testId?.title}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
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
                    <td className="py-3 px-4 text-black dark:text-white">{new Date(result.submittedAt).toLocaleString()}</td>
                    <td className="py-3 px-4">
                      <button
                        className="text-blue-500 hover:text-blue-600"
                        onClick={() => {
                          setIsOpenModel(true);
                          setSelectedResult(result);
                        }}
                      >
                        <MdVisibility className="text-2xl" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-3">
                    No results found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="my-3">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            setCurrentPage={setCurrentPage}
            setItemsPerPage={setItemsPerPage}
          />
        </div>
      </div>
      {isOpenModel && <ViewResultsDetails result={selectedResult} onClose={handleCloseModal} />}
    </>
  );
};

export default Result;
