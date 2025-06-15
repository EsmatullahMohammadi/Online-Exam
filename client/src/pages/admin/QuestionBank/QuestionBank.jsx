import { MdEdit } from "react-icons/md";
import Breadcrumb from "../../../components/Breadcrumbs/Breadcrumb";
import Pagination from "../../../components/Pagination";
import { useSearch } from "../../../context/SearchContext";
import { QuestionCategory } from "../../../types/questionType";
import useQuestionBank from "../../../hooks/admin/questionBank/useQuestionBank";

const QuestionBank = () => {
  const { searchValue } = useSearch();
  const {
    loading,
    error,
    filterType,
    setFilterType,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    setItemsPerPage,
    filteredQuestions,
    totalPages,
    paginatedQuestions,
  } = useQuestionBank();

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
              <option value={QuestionCategory.GRAMMAR}>Grammar</option>
              <option value={QuestionCategory.LISTENING}>Listening</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-6">Loading questions...</div>
        ) : error ? (
          <div className="text-center py-6 text-red-500">{error}</div>
        ) : (
          <>
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
                  {paginatedQuestions.length > 0 ? (
                    paginatedQuestions.map((question, index) => (
                      <tr
                        key={question._id}
                        className="border-b border-[#eee] dark:border-strokedark"
                      >
                        <td className="py-3 px-4">
                          {(currentPage - 1) * itemsPerPage + index + 1}
                        </td>
                        <td className="py-3 px-4">{question.questionText}</td>
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
          </>
        )}
      </div>
    </>
  );
};

export default QuestionBank;
