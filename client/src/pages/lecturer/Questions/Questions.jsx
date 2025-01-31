/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { MdAdd } from "react-icons/md";
import { SUPER_DOMAIN } from "../../admin/constant";
import Breadcrumb from "../../../components/Breadcrumbs/Breadcrumb";

const Questions = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const category = sessionStorage.getItem("category"); // Get category from session storage

  axios.defaults.withCredentials = true;

  useEffect(() => {
    async function fetchQuestions() {
      try {
        setLoading(true);
        const response = await axios.get(`${SUPER_DOMAIN}/all-questions/${category}`, {
          headers: { "Content-Type": "application/json" },
        });

        if (response.data.length > 0) {
          setQuestions(response.data);
        } else {
          setError("No questions found.");
        }
      } catch (err) {
        setError(err.response?.data?.message || "Error fetching questions.");
      } finally {
        setLoading(false);
      }
    }

    fetchQuestions();
  }, [category]); // Fetch when category changes

  return (
    <>
      <Breadcrumb pageName="Questions" />
      <div>
        <Link
          to="/lecturer/add-questions"
          className="inline-flex items-center justify-center gap-2.5 rounded-sm bg-primary py-3 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10 mb-3"
        >
          <MdAdd className="text-2xl" />
          Add Question
        </Link>
      </div>
      <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
        <div className="max-w-full overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-300 text-left dark:bg-meta-4">
                <th className="min-w-[220px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
                  Question
                </th>
                <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                  Options
                </th>
                <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                  Correct Answer
                </th>
                <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                  Category
                </th>
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
              ) : questions.length > 0 ? (
                questions.map((question, key) => (
                  <tr key={key}>
                    <td className="border-b border-[#eee] py-3 px-4 pl-9 dark:border-strokedark xl:pl-11">
                      <h5 className="font-medium text-black dark:text-white">
                        {question.question}
                      </h5>
                    </td>
                    <td className="border-b border-[#eee] py-3 px-4 dark:border-strokedark">
                      <ul className="list-disc pl-5">
                        {question.options.map((option, index) => (
                          <li key={index} className="border-b">{option}</li>
                        ))}
                      </ul>
                    </td>
                    <td className="border-b border-[#eee] py-3 px-4 dark:border-strokedark font-semibold text-green-600 dark:text-green-400">
                      {question.correctAnswer}
                    </td>
                    <td className="border-b border-[#eee] py-3 px-4 dark:border-strokedark font-medium text-blue-600 dark:text-blue-400">
                      {question.category}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center py-3">
                    No questions found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default Questions;
