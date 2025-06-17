import { Link } from "react-router-dom";
import Breadcrumb from "../../../components/Breadcrumbs/Breadcrumb";
import Pagination from "../../../components/Pagination";
import { QuestionCategory } from "../../../types/questionType";
import { useQuestionSelection } from "../../../hooks/admin/tests/useQuestionSelection";

const SelectQuestionsForTest = () => {
  const {
    testName,
    loading,
    error,
    paginatedQuestions,
    selectedQuestions,
    filterType,
    currentPage,
    itemsPerPage,
    totalPages,
    numberOfQuestion,
    handleSelectQuestion,
    handleSubmit,
    handleAssignRandomQuestions,
    setFilterType,
    setCurrentPage,
    setItemsPerPage,
    testId
  } = useQuestionSelection();

  return (
    <>
      <Breadcrumb pageName="Select Questions" />

      <div className="mb-3 flex justify-end space-x-3">
        <Link
          to={`/admin/demo-question/${testId}`}
          className="flex items-center gap-2 bg-primary text-white px-6 py-2 rounded-sm shadow-md transition duration-300 hover:bg-opacity-90 hover:shadow-lg focus:ring-2 focus:ring-primary focus:ring-opacity-50"
        >
          See Demo Questions
        </Link>
        <button
          className="flex items-center gap-2 bg-primary text-white px-6 py-2 rounded-sm shadow-md transition duration-300 hover:bg-opacity-90 hover:shadow-lg focus:ring-2 focus:ring-primary focus:ring-opacity-50"
          onClick={handleAssignRandomQuestions}
          disabled={loading || !paginatedQuestions.length}
        >
          Assign Random Questions
        </button>
        <button
          className="flex items-center gap-2 bg-primary text-white px-6 py-2 rounded-sm shadow-md transition duration-300 hover:bg-opacity-90 hover:shadow-lg focus:ring-2 focus:ring-primary focus:ring-opacity-50"
          onClick={handleSubmit}
          disabled={loading || selectedQuestions.length === 0}
        >
          Assign Selected Questions
        </button>
      </div>

      <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-base lg:text-lg font-semibold text-black dark:text-white">
            {testName
              ? `Select Questions for "${testName}"`
              : "Select Questions"}
            {numberOfQuestion && ` (Required: ${numberOfQuestion})`}
          </h3>
          <div>
            <label className="mr-2 font-medium text-black dark:text-white">
              Filter by Type:
            </label>
            <select
              className="border p-2 rounded-md bg-white dark:bg-boxdark dark:text-white focus:outline-none"
              value={filterType}
              onChange={(e) => {
                setFilterType(e.target.value);
                setCurrentPage(1);
              }}
              disabled={loading}
            >
              <option value="all">All</option>
              {Object.values(QuestionCategory).map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="max-w-full overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-300 dark:bg-meta-4">
                <th className="py-3 px-4 text-left text-black dark:text-white">
                  #
                </th>
                <th className="py-3 px-4 text-left text-black dark:text-white">
                  Select
                </th>
                <th className="py-3 px-4 text-left text-black dark:text-white">
                  Question
                </th>
                <th className="py-3 px-4 text-left text-black dark:text-white">
                  Category
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan="4"
                    className="text-center py-3 text-black dark:text-white"
                  >
                    Loading questions...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan="4" className="text-center py-3 text-red-500">
                    {error}
                  </td>
                </tr>
              ) : paginatedQuestions.length > 0 ? (
                paginatedQuestions.map((question, index) => (
                  <tr
                    key={question._id || index}
                    className="border-b border-[#eee] dark:border-strokedark"
                  >
                    <td className="py-3 px-4 text-black dark:text-white">
                      {(currentPage - 1) * itemsPerPage + index + 1}
                    </td>
                    <td className="py-3 px-4">
                      <input
                        type="checkbox"
                        className="form-checkbox text-primary rounded focus:ring-primary focus:ring-opacity-50"
                        checked={selectedQuestions.includes(question._id)}
                        onChange={() => handleSelectQuestion(question._id)}
                        disabled={!question._id}
                      />
                    </td>
                    <td className="py-3 px-4 text-black dark:text-white">
                      {question.questionText || "No question text"}
                    </td>
                    <td className="py-3 px-4 capitalize text-black dark:text-white">
                      {question.category || "uncategorized"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="4"
                    className="text-center py-3 text-black dark:text-white"
                  >
                    No questions found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {!loading && !error && paginatedQuestions.length > 0 && (
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

export default SelectQuestionsForTest;
