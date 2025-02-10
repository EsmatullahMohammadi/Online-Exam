import { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useParams } from "react-router-dom";
import { SUPER_DOMAIN } from "../constant";
import Breadcrumb from "../../../components/Breadcrumbs/Breadcrumb";
import Pagination from "../../../components/Pagination";

const SelectQuestionsForTest = () => {
  const { testName } = useParams();
  const { state } = useLocation();
  const { testId, numberOfQuestion } = state || {};
  const [questions, setQuestions] = useState([]);
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [filterType, setFilterType] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5); 

  axios.defaults.withCredentials = true;

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${SUPER_DOMAIN}/questions`);
      if (response.status === 200) {
        setQuestions(response.data);
      }
    } catch (error) {
      console.log(error);
      setError("Failed to load questions.");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectQuestion = (questionId) => {
    setSelectedQuestions((prevSelected) =>
      prevSelected.includes(questionId)
        ? prevSelected.filter((id) => id !== questionId)
        : [...prevSelected, questionId]
    );
  };

  const handleSubmit = async () => {
    if (selectedQuestions.length === 0) {
      alert("Please select at least one question.");
      return;
    }
    try {
      const response = await axios.post(`${SUPER_DOMAIN}/assign-questions`, {
        testId,
        questionIds: selectedQuestions,
      });
      if (response.status === 200) {
        alert(response.data.message || "Questions assigned successfully!");
      }
    } catch (error) {
      alert(error.response.data.message || "Failed to assign questions.");
    }
  };
  const handleAssignRandomQuestions = async () => {
    if (questions.length < numberOfQuestion) {
      alert("Not enough questions available to assign.");
      return;
    }
  
    // Group questions by category
    const categoryMap = questions.reduce((acc, question) => {
      if (!acc[question.category]) acc[question.category] = [];
      acc[question.category].push(question);
      return acc;
    }, {});

    const categories = Object.keys(categoryMap);
    const numCategories = categories.length;
    const questionsPerCategory = Math.floor(numberOfQuestion / numCategories);
    let remainingQuestions = numberOfQuestion % numCategories;
    let selectedQuestions = [];

    categories.forEach((category) => {
      let shuffled = [...categoryMap[category]].sort(() => 0.5 - Math.random());
      let count = questionsPerCategory + (remainingQuestions > 0 ? 1 : 0);
      remainingQuestions--;
      selectedQuestions.push(...shuffled.slice(0, count));
    });
  
    // Extract selected question IDs
    const randomQuestionIds = selectedQuestions.map((q) => q._id);

    try {
      const response = await axios.post(`${SUPER_DOMAIN}/assign-questions`, {
        testId,
        questionIds: randomQuestionIds,
      });
      if (response.status === 200) {
        alert(response.data.message || "Random questions assigned successfully!");
        setSelectedQuestions(randomQuestionIds);
      }
    } catch (error) {
      alert(error.response?.data?.message || "Failed to assign random questions.");
    }
  };
  

  const filteredQuestions =
    filterType === "all" ? questions : questions.filter((q) => q.category === filterType);

  // Pagination logic
  const totalPages = Math.ceil(filteredQuestions.length / itemsPerPage);
  const paginatedQuestions = filteredQuestions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <>
      <Breadcrumb pageName="Select Questions" />

      {/* Action Buttons */}
      <div className="mb-3 flex justify-between">       
        {/* Assign Random Questions */}
        <button
          className="flex items-center gap-2 bg-green-500 text-white px-6 py-2 rounded-md shadow-md transition duration-300 hover:bg-opacity-90 hover:shadow-lg focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
          onClick={handleAssignRandomQuestions}
        >
          Assign Random Questions
        </button>
        {/* Assign Selected Questions */}
        <button
          className="flex items-center gap-2 bg-primary text-white px-6 py-2 rounded-md shadow-md transition duration-300 hover:bg-opacity-90 hover:shadow-lg focus:ring-2 focus:ring-primary focus:ring-opacity-50"
          onClick={handleSubmit}
        >
          Assign Selected Questions
        </button>
      </div>

      {/* Table Wrapper */}
      <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-base lg:text-lg font-semibold text-black dark:text-white">{`Select Questions for "${testName}" that has ${numberOfQuestion} questions`}</h3>

          {/* Filter Dropdown */}
          <div>
            <label className="mr-2 font-medium text-black dark:text-white">Filter by Type:</label>
            <select
              className="border p-2 rounded-md bg-white dark:bg-boxdark dark:text-white focus:outline-none"
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
        </div>

        {/* Table */}
        <div className="max-w-full overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-300 dark:bg-meta-4">
                <th className="py-3 px-4 text-left text-black dark:text-white">Select</th>
                <th className="py-3 px-4 text-left text-black dark:text-white">Question</th>
                <th className="py-3 px-4 text-left text-black dark:text-white">Category</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="3" className="text-center py-3 text-black dark:text-white">
                    Loading...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan="3" className="text-center py-3 text-red-500">
                    {error}
                  </td>
                </tr>
              ) : paginatedQuestions.length > 0 ? (
                paginatedQuestions.map((question, index) => (
                  <tr key={index} className="border-b border-[#eee] dark:border-strokedark">
                    <td className="py-3 px-4 flex items-center justify-between">
                      <span className="pr-2 border-r-4 rounded-full">{(currentPage - 1) * itemsPerPage + index + 1}</span>
                      <input
                        type="checkbox"
                        className="form-checkbox text-primary rounded focus:ring-primary focus:ring-opacity-50"
                        checked={selectedQuestions.includes(question._id)}
                        onChange={() => handleSelectQuestion(question._id)}
                      />
                    </td>
                    <td className="py-3 px-4 text-black dark:text-white">{question.question}</td>
                    <td className="py-3 px-4 capitalize text-black dark:text-white">
                      {question.category}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="text-center py-3 text-black dark:text-white">
                    No questions found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="my-3">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            setCurrentPage={setCurrentPage}
            setItemsPerPage={setItemsPerPage}
          />
        </div>
      </div>
    </>
  );
};

export default SelectQuestionsForTest;
