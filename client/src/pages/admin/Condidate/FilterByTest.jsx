import { useEffect, useState } from "react";
import Breadcrumb from "../../../components/Breadcrumbs/Breadcrumb";
import axios from "axios";
import { SUPER_DOMAIN } from "../constant";
import { useSearchParams } from "react-router-dom";
import { FaDownload } from "react-icons/fa";
import useExportPDF from "../../../hooks/useExportPDF";

const FilterByTest = () => {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchParams] = useSearchParams();
  const testId = searchParams.get("testId");
  const { elementRef, exportToPDF } = useExportPDF({
    filename: "candidates.pdf",
    orientation: "landscape",
  });

  useEffect(() => {
    async function fetchByTest() {
      try {
        setLoading(true);
        if (!testId) return;
        const response = await axios.get(`${SUPER_DOMAIN}/candidates-by-test`, {
          params: { testId },
          headers: { "Content-Type": "application/json" },
        });
        if (response.data && response.data.candidates) {
          setCandidates(response.data.candidates);
        } else {
          setError("No candidates found for this test.");
        }
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchByTest();
  }, [testId]);

  return (
    <>
      <Breadcrumb pageName="Candidates by Test" />
      <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
        <div className="flex flex-wrap gap-4 mb-4 justify-end">
          <button
            onClick={exportToPDF}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm shadow"
          >
            <FaDownload /> Download PDF
          </button>
        </div>
        <div className="max-w-full overflow-x-auto" ref={elementRef}>
          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <table className="w-full table-auto">
              <thead>
                <tr className="bg-gray-300 text-left dark:bg-meta-4">
                  <th className="py-4 px-4 font-medium text-black dark:text-white">
                    #
                  </th>
                  <th className="py-4 px-4 font-medium text-black dark:text-white">
                    Candidate Name
                  </th>
                  <th className="py-4 px-4 font-medium text-black dark:text-white">
                    Phone Number
                  </th>
                  <th className="py-4 px-4 font-medium text-black dark:text-white">
                    UserName
                  </th>
                  <th className="py-4 px-4 font-medium text-black dark:text-white">
                    Password
                  </th>
                </tr>
              </thead>
              <tbody>
                {candidates.map((cand, idx) => (
                  <tr
                    key={cand._id}
                    className="border-b border-gray-200 dark:border-strokedark"
                  >
                    <td className="py-3 px-4">{idx + 1}</td>
                    <td className="py-3 px-4 text-black dark:text-white">
                      {cand.name}
                    </td>
                    <td className="py-3 px-4 text-black dark:text-white">
                      {cand.phoneNumber}
                    </td>
                    <td className="py-3 px-4 text-black dark:text-white">
                      {cand.userName}
                    </td>
                    <td className="py-3 px-4 text-black dark:text-white">
                      {cand.password}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
};

export default FilterByTest;
