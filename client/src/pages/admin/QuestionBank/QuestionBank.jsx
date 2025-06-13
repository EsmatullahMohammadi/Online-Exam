import { useState, useEffect } from "react";
import axios from "axios";
import { SUPER_DOMAIN } from "../constant";
import { MdEdit } from "react-icons/md";
import Breadcrumb from "../../../components/Breadcrumbs/Breadcrumb";
import Pagination from "../../../components/Pagination";
import { useSearch } from "../../../context/SearchContext";
import { QuestionCategory } from "../../../types/questionType";

const QuestionBank = () => {
  const { searchValue } = useSearch();
  const [questions, setQuestions] = useState([]);
  const [filterType, setFilterType] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  axios.defaults.withCredentials = true;

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

  // Filter questions by type and search value
  const filteredQuestions = questions.filter((question) => {
    const matchesType =
      filterType === "all" || question.category === filterType;
    const matchesSearch =
      searchValue === "" ||
      question.question.toLowerCase().includes(searchValue.toLowerCase()) ||
      question.category.toLowerCase().includes(searchValue.toLowerCase());
    return matchesType && matchesSearch;
  });

  // Reset to first page when filters or search change
  useEffect(() => {
    setCurrentPage(1);
  }, [filterType, searchValue]);

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
          <h2 className="text-xl font-semibold text-black dark:text-white">
            Question Bank
          </h2>
          <div className="flex gap-2">
            <select
              className="border p-2 rounded dark:bg-boxdark dark:text-white"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="all">All Categories</option>
              <option value={QuestionCategory.READING}>Reading</option>
              <option value={QuestionCategory.WRITING}>Writing</option>
              <option value={QuestionCategory.GRAMMAR}>grammar</option>
              <option value={QuestionCategory.LISTENING}>Listening</option>
            </select>
          </div>
        </div>

        <div className="max-w-full overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-300 text-left dark:bg-meta-4">
                <th className="py-4 px-4 font-medium text-black dark:text-white">
                  #
                </th>
                <th className="py-4 px-4 font-medium text-black dark:text-white">
                  Question
                </th>
                <th className="py-4 px-4 font-medium text-black dark:text-white">
                  Category
                </th>
                <th className="py-4 px-4 font-medium text-black dark:text-white">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredQuestions.length > 0 ? (
                paginatedQuestions.map((question, index) => (
                  <tr
                    key={question._id}
                    className="border-b border-[#eee] dark:border-strokedark"
                  >
                    <td className="py-3 px-4">
                      {(currentPage - 1) * itemsPerPage + index + 1}
                    </td>
                    <td className="py-3 px-4">{question.question}</td>
                    <td className="py-3 px-4 capitalize">
                      {question.category}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-3.5">
                        <button
                          className="hover:text-primary"
                          onClick={() => alert("Edit feature coming soon!")}
                        >
                          <MdEdit className="text-2xl text-indigo-500 hover:text-indigo-600" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="4"
                    className="text-center py-3 text-black dark:text-white"
                  >
                    No questions found{" "}
                    {searchValue && `matching "${searchValue}"`}
                    {filterType !== "all" && ` in category "${filterType}"`}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {filteredQuestions.length > 0 && (
          <div className="my-3">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              setCurrentPage={setCurrentPage}
              setItemsPerPage={setItemsPerPage}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default QuestionBank;
