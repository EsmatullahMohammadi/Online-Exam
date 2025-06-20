import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { SUPER_DOMAIN } from "../../admin/constant";
import CBreadcrumb from "../../../components/Breadcrumbs/CBreadcrump";
import { FaRegFileAlt, FaClock, FaPlayCircle, FaCalendarAlt, FaListOl } from "react-icons/fa";
import { MdDescription } from "react-icons/md";

const GetRelatedTest = () => {
  const candidateId = sessionStorage.getItem("_id");
  const navigate = useNavigate();
  const [test, setTest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  axios.defaults.withCredentials = true;

  useEffect(() => {
    const fetchTestDetails = async () => {
      try {
        setLoading(true);
        const testResponse = await axios.get(`${SUPER_DOMAIN}/${candidateId}/test`);
        if (testResponse.status === 200) {
          setTest(testResponse.data.test);
        } else {
          setError("No assigned test found.");
        }
      } catch (err) {
        setError(err.response?.data?.message || "Error fetching test. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchTestDetails();
  }, [candidateId]);

  if (loading) return <p className="text-center text-gray-500">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{ error }</p>;

  return (
    <>
      <CBreadcrumb pageName="Candidate Test" />

      <div className="container mx-auto p-6">
        <div className="rounded-lg border border-gray-300 bg-white p-6 shadow-lg dark:border-gray-700 dark:bg-gray-800">
          { test ? (
            <>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-200 mb-6 text-center leading-relaxed">
                <FaRegFileAlt className="inline-block text-blue-600 mr-2" />
                Welcome, { sessionStorage.getItem("name") }!
                <span className="block text-lg text-gray-600 dark:text-gray-400 mt-2">
                  You can **only submit your answers once**, so double-check before submitting.
                  The exam is **timed**, so complete it within the given duration.
                  Ensure all answers are submitted before time runs out.
                </span>
                <span className="text-blue-600 font-semibold mt-2 block">Good luck! 🍀</span>
              </h2>

              <div className="bg-gray-100 dark:bg-gray-900 p-6 rounded-lg shadow-md space-y-3">
                <p className="text-lg font-bold text-gray-700 dark:text-gray-400 flex items-center">
                  <FaRegFileAlt className="mr-2 text-gray-600 dark:text-gray-300" />
                  <span >Title:</span> { test.title }
                </p>
                <p className="text-gray-700 dark:text-gray-400 flex items-center">
                  <MdDescription className="mr-2 text-gray-600 dark:text-gray-300" />
                  <strong>Description:</strong>  { test.description }
                </p>
                <p className="text-gray-700 dark:text-gray-400 flex items-center">
                  <FaListOl className="mr-2 text-gray-600 dark:text-gray-300" />
                  <strong>Questions:</strong> { test.numberOfQuestions }
                </p>
                <p className="text-gray-700 dark:text-gray-400 flex items-center">
                  <FaClock className="mr-2 text-gray-600 dark:text-gray-300" />
                  <strong>Duration:</strong> { test.examDuration } minutes
                </p>
                <p className="text-gray-700 dark:text-gray-400 flex items-center">
                  <FaRegFileAlt className="mr-2 text-gray-600 dark:text-gray-300" />
                  <strong>Total Marks:</strong> { test.totalMarks }
                </p>
                <p className="text-gray-700 dark:text-gray-400 flex items-center">
                  <FaCalendarAlt className="mr-2 text-gray-600 dark:text-gray-300" />
                  <strong>Start Date:</strong> { test.startDate ? new Date(test.startDate).toLocaleString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true
                  }): "No Start Date Set"}
                </p>
                <p className="text-gray-700 dark:text-gray-400 flex items-center">
                  <FaCalendarAlt className="mr-2 text-gray-600 dark:text-gray-300" />
                  <strong>End Date:</strong> { test.endDate ? new Date(test.endDate).toLocaleString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true
                  }): "No End Date Set" }
                </p>

                <button
                  onClick={ () => navigate(`/candidate/candidate-question/${test._id}`) }
                  className="w-full mt-6 bg-blue-600 text-white py-3 px-6 rounded-lg text-lg font-semibold hover:bg-blue-700 transition duration-300 shadow-md flex items-center justify-center"
                >
                  <FaPlayCircle className="mr-2 text-white text-xl" />
                  Start Test
                </button>
              </div>
            </>
          ) : (
            <div className="p-6 rounded-lg bg-gray-100 dark:bg-gray-700 shadow-md text-center">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 flex justify-center items-center">
                <FaRegFileAlt className="mr-2 text-gray-600 dark:text-gray-400" /> No Test Assigned
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mt-2">
                You currently do not have any assigned tests. Please check back later.
              </p>
            </div>
          ) }
        </div>
      </div>
    </>
  );
};

export default GetRelatedTest;
