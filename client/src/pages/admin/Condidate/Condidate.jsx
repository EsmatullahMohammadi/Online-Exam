import { useEffect, useState } from "react";
import Breadcrumb from "../../../components/Breadcrumbs/Breadcrumb";
import { Link, useNavigate } from "react-router-dom";
import { MdAdd, MdDelete, MdEdit, MdVisibility } from "react-icons/md";
import axios from "axios";
import { SUPER_DOMAIN } from "../constant";
import Pagination from "../../../components/Pagination";
import ViewCandidateDetails from "./ViewCandidateDetails";
import { useSearch } from "../../../context/SearchContext";

const Condidate = () => {
  const { searchValue } = useSearch();
  const [candidates, setCandidates] = useState([]);
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isOpenModel, setIsOpenModel] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const navigate = useNavigate();

  axios.defaults.withCredentials = true;

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const candRes = await axios.get(`${SUPER_DOMAIN}/all-candidates`, {
          headers: { "Content-Type": "application/json" },
        });
        if (candRes.data && candRes.data.candidate) {
          setCandidates(candRes.data.candidate);
        }
        const testRes = await axios.get(`${SUPER_DOMAIN}/all-tests`, {
          headers: { "Content-Type": "application/json" },
        });
        if (testRes.data && testRes.data.tests) {
          setTests(testRes.data.tests);
        }
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const filteredCandidates = candidates.filter((candidate) => {
    const searchLower = searchValue.toLowerCase();
    return (
      candidate.name.toLowerCase().includes(searchLower) ||
      candidate.fatherName.toLowerCase().includes(searchLower)
    );
  });

  const deleteCandidate = async (candidateID) => {
    if (!window.confirm("Are you sure you want to delete this candidate?"))
      return;
    try {
      const res = await axios.delete(
        `${SUPER_DOMAIN}/candidates/${candidateID}`
      );
      setCandidates((prev) => prev.filter((c) => c._id !== candidateID));
      alert(res.data.message || "Candidate deleted successfully!");
    } catch (err) {
      alert("Failed to delete candidate: " + err.message);
    }
  };

  const handleTestChange = (e) => {
    const testId = e.target.value;
    if (testId) {
      navigate(`/admin/condidate/filter-by-test?testId=${testId}`);
    } else {
      navigate("/admin/condidate");
    }
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [searchValue]);

  const totalPages = Math.ceil(filteredCandidates.length / itemsPerPage);
  const paginatedCondidates = filteredCandidates.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <>
      <Breadcrumb pageName="Candidate" />
      <div className="flex justify-between mb-3">
        <Link
          to="/admin/addCondidate"
          className="inline-flex items-center gap-2.5 rounded-sm bg-primary py-3 px-10 text-white hover:bg-opacity-90"
        >
          <MdAdd className="text-2xl" /> Add Candidate
        </Link>
        <select
          className="border px-3 py-2 rounded"
          onChange={handleTestChange}
        >
          <option value="">All Tests</option>
          {tests.map((test) => (
            <option key={test._id} value={test._id}>
              {test.title}
            </option>
          ))}
        </select>
      </div>
      <div className="overflow-x-auto bg-white shadow rounded p-5">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-300 text-left">
              <th className="py-4 px-4">#</th>
              <th className="py-4 px-4">Candidate Name</th>
              <th className="py-4 px-4">Father Name</th>
              <th className="py-4 px-4">Result</th>
              <th className="py-4 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" className="text-center py-3">
                  Loading...
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan="5" className="text-center py-3 text-red-500">
                  {error}
                </td>
              </tr>
            ) : filteredCandidates.length > 0 ? (
              paginatedCondidates.map((cand, idx) => (
                <tr key={cand._id} className="border-b">
                  <td className="py-3 px-4">
                    {(currentPage - 1) * itemsPerPage + idx + 1}
                  </td>
                  <td className="py-3 px-4">{cand.name}</td>
                  <td className="py-3 px-4">{cand.fatherName}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex rounded-full py-1 px-3 text-sm font-medium text-white ${
                        cand.status === "Pending"
                          ? "bg-warning"
                          : cand.status === "Passed"
                            ? "bg-success"
                            : "bg-danger"
                      }`}
                    >
                      {cand.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex space-x-3">
                      <MdVisibility
                        className="text-2xl text-blue-500 cursor-pointer"
                        onClick={() => {
                          setSelectedCandidate(cand);
                          setIsOpenModel(true);
                        }}
                      />
                      <MdDelete
                        className="text-2xl text-red-500 cursor-pointer"
                        onClick={() => deleteCandidate(cand._id)}
                      />
                      <Link
                        to="/admin/condidate/edit-candidate"
                        state={{ candidate: cand }}
                      >
                        <MdEdit className="text-2xl text-indigo-500" />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center py-3">
                  No candidates found{" "}
                  {searchValue && `matching "${searchValue}"`}
                </td>
              </tr>
            )}
          </tbody>
        </table>
        {filteredCandidates.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            setCurrentPage={setCurrentPage}
            setItemsPerPage={setItemsPerPage}
          />
        )}
      </div>
      {isOpenModel && (
        <ViewCandidateDetails
          candidate={selectedCandidate}
          onClose={() => setIsOpenModel(false)}
        />
      )}
    </>
  );
};

export default Condidate;
