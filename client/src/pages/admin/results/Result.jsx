import { useEffect, useState } from "react";
import axios from "axios";
import { MdVisibility } from "react-icons/md";
import { SUPER_DOMAIN } from "../constant";
import Pagination from "../../../components/Pagination";
import ViewResultsDetails from "./ViewResultsDetails";
import Breadcrumb from "../../../components/Breadcrumbs/Breadcrumb";

const Result = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isOpenModel, setIsOpenModel] = useState(false);
  const handleCloseModal = () => setIsOpenModel(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(2);
  const [selectedResult, setSelectedResult] = useState(null);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await axios.get(`${SUPER_DOMAIN}/results`, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        setResults(response.data);
      } catch (err) {
        console.log(err);
        setError("Failed to fetch results.");
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, []);

  // Pagination Logic
  const totalPages = Math.ceil(results.length / itemsPerPage);
  const paginatedResults = results.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  return (
    <>
      <Breadcrumb pageName={"Results"}/>
      <div className="p-6 bg-white shadow-md rounded-sm border border-stroke">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Candidate Results</h2>
        </div>
        <div className="max-w-full overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-300 text-left dark:bg-meta-4">
                <th className="py-4 px-4 font-medium text-black dark:text-white">#</th>
                <th className="py-4 px-4 font-medium text-black dark:text-white">Candidate Name</th>
                <th className="py-4 px-4 font-medium text-black dark:text-white">Test Title</th>
                <th className="py-4 px-4 font-medium text-black dark:text-white">Status</th>
                <th className="py-4 px-4 font-medium text-black dark:text-white">Submitted At</th>
                <th className="py-4 px-4 font-medium text-black dark:text-white">Actions</th>
              </tr>
            </thead>
            <tbody>
            {loading ? (
                <tr>
                  <td colSpan="4" className="text-center py-3">
                    Loading...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan="4" className="text-center py-3 text-red-500">
                    {error}
                  </td>
                </tr>
              ) :paginatedResults.length > 0 ? (
                paginatedResults.map((result, index) => (
                  <tr key={result._id} className="border-b border-gray-200">
                    <td className="py-3 px-4">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                    <td className="py-3 px-4">{result.candidateId?.name}</td>
                    <td className="py-3 px-4">{result.testId?.title}</td>
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
                    <td className="py-3 px-4">{new Date(result.submittedAt).toLocaleString()}</td>
                    <td className="py-3 px-4">
                      <button className="text-blue-500 hover:text-blue-600" 
                        onClick={() =>{ 
                          setIsOpenModel(!isOpenModel)
                          setSelectedResult(result)
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
      {isOpenModel && <ViewResultsDetails result={selectedResult}  onClose={handleCloseModal} />}
    </>
  );
};

export default Result;
