import { useState, useEffect } from "react";
import axios from "axios";
import { SUPER_DOMAIN } from "../constant";
import { MdDelete, MdEdit } from "react-icons/md";
import Breadcrumb from "../../../components/Breadcrumbs/Breadcrumb";
import Pagination from "../../../components/Pagination";

const QuestionBank = () => {
  const [questions, setQuestions] = useState([]);
  const [filterType, setFilterType] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5); // New state for items per page

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const response = await axios.get(`${SUPER_DOMAIN}/questions`);
      if (response.status === 200) {
        setQuestions(response.data);
      }
    } catch (error) {
      console.error("Error fetching questions:", error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this question?")) return;

    try {
      await axios.delete(`${SUPER_DOMAIN}/questions/${id}`);
      alert("Question deleted successfully!");
      fetchQuestions();
    } catch (error) {
      console.error("Error deleting question:", error);
      alert("Failed to delete question.");
    }
  };

  const filteredQuestions =
    filterType === "all" ? questions : questions.filter((q) => q.category === filterType);

    // pagination concept
  const totalPages = Math.ceil(filteredQuestions.length / itemsPerPage);
  const paginatedQuestions = filteredQuestions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <>
      <Breadcrumb pageName="Question Bank" />
      <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-black dark:text-white">Question Bank</h2>
          <select
            className="border p-2 rounded dark:bg-boxdark dark:text-white"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="all">All</option>
            <option value="Reading">Reading</option>
            <option value="Writing">Writing</option>
            <option value="Speaking">Speaking</option>
            <option value="Listening">Listening</option>
          </select>
        </div>

        <div className="max-w-full overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-300 text-left dark:bg-meta-4">
                <th className="py-4 px-4 font-medium text-black dark:text-white">#</th>
                <th className="py-4 px-4 font-medium text-black dark:text-white">Question</th>
                <th className="py-4 px-4 font-medium text-black dark:text-white">Category</th>
                <th className="py-4 px-4 font-medium text-black dark:text-white">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedQuestions.length > 0 ? (
                paginatedQuestions.map((question, index) => (
                  <tr key={question._id} className="border-b border-[#eee] dark:border-strokedark">
                    <td className="py-3 px-4">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                    <td className="py-3 px-4">{question.question}</td>
                    <td className="py-3 px-4 capitalize">{question.category}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-3.5">
                        <button className="hover:text-primary" onClick={() => alert("Edit feature coming soon!")}>
                          <MdEdit className="text-2xl text-indigo-500 hover:text-indigo-600" />
                        </button>
                        <button className="hover:text-primary" onClick={() => handleDelete(question._id)}>
                          <MdDelete className="text-2xl text-red-500 hover:text-red-600" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center py-3 text-black dark:text-white">
                    No questions found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          setCurrentPage={setCurrentPage}
          setItemsPerPage={setItemsPerPage} // Pass the setItemsPerPage function
        />
      </div>
    </>
  );
};

export default QuestionBank;
