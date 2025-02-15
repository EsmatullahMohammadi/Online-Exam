import { useState, useEffect } from "react";
import axios from "axios";
import { SUPER_DOMAIN } from "../../admin/constant";
import CBreadcrumb from "../../../components/Breadcrumbs/CBreadcrump";
import { FaClipboardCheck, FaTrophy, FaExclamationTriangle, FaCheckCircle, FaRegCalendarAlt, FaFileAlt, FaFileSignature, FaRegClock, FaListOl } from "react-icons/fa";


const CandidateResult = () => {
  const candidateId = sessionStorage.getItem("_id");
  const [test, setTest] = useState(null);
  const [submittedTest, setSubmittedTest] = useState(null);
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

          const submissionResponse = await axios.get(
            `${SUPER_DOMAIN}/candidate/${candidateId}/submission/${testResponse.data.test._id}`
          );
          if (submissionResponse.status === 200 && submissionResponse.data.submitted) {
            setSubmittedTest(submissionResponse.data);
          }
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

  // Status Styling
  const getStatusStyle = (status) => {
    switch (status) {
      case "Passed":
        return "bg-green-100 text-green-600 border border-green-500";
      case "Failed":
        return "bg-red-100 text-red-600 border border-red-500";
      default:
        return "bg-orange-100 text-orange-600 border border-orange-500";
    }
  };

  if (loading) return <p className="text-center text-gray-500">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <>
      <CBreadcrumb pageName="Candidate Result" />

      <div className="container mx-auto p-6">
        <div className="rounded-lg border border-gray-300 bg-white p-6 shadow-lg dark:border-gray-700 dark:bg-gray-800">
          {submittedTest ? (
          // Test Result Section
          <div className="p-6 rounded-lg bg-green-100 dark:bg-green-900 shadow-md">
            <h3 className="text-2xl font-bold text-green-800 dark:text-green-300 flex items-center">
              <FaTrophy className="mr-2 text-green-500" /> Test Results
            </h3>
            <div className="mt-4 space-y-3 text-gray-800 dark:text-gray-200">
              <p className="text-lg font-bold text-gray-700 dark:text-gray-400 flex items-center">
                <FaFileSignature   className="mr-2 text-gray-600 dark:text-gray-300" />
                <span className="mr-3">Test Title:</span> {test?.title}
              </p>
              <p className="text-gray-700 dark:text-gray-400 flex items-center">
                <FaFileAlt className="mr-2 text-gray-600 dark:text-gray-300" />
                <strong className="mr-3">Total Score:</strong> {test?.totalMarks}
              </p>
              <p className="text-gray-700 dark:text-gray-400 flex items-center">
                <FaFileAlt className="mr-2 text-gray-600 dark:text-gray-300" />
                <strong className="mr-3">Your Score:</strong> {submittedTest?.obtainedMarks}
              </p>
              <p className="text-gray-700 dark:text-gray-400 flex items-center">
                <FaRegCalendarAlt className="mr-2 text-gray-600 dark:text-gray-300" />
                <strong className="mr-3">Submitted On:</strong> { new Date(submittedTest?.submittedAt).toLocaleString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true
                  }) }
              </p>
              {/* Dynamic Status with Nice Styling */}
              <p className="flex items-center">
                <FaCheckCircle className="mr-2 text-gray-600 dark:text-gray-300" />
                <strong className="mr-3">Status:</strong>
                <span className={`ml-2 px-3 py-1 rounded-lg text-sm font-semibold ${getStatusStyle(submittedTest.status)}`}>
                  {submittedTest?.status}
                </span>
              </p>
            </div>
          </div>
          ) : test ? (
            // ⚠️ Test Assigned but Not Submitted
            <div className="p-6 rounded-lg bg-yellow-100 dark:bg-yellow-900 shadow-md">
              <h3 className="text-2xl font-bold text-yellow-800 dark:text-yellow-300 flex items-center">
                <FaExclamationTriangle className="mr-2 text-yellow-600" /> Test Not Submitted
              </h3>
              <p className="text-gray-800 dark:text-gray-200 mt-2">
                ⚠️ You have an **assigned test** but have **not submitted** it yet! Make sure to complete it before the deadline.
              </p>
              <div className="mt-4 space-y-3 text-gray-800 dark:text-gray-200">
                <p className="text-lg font-bold text-gray-700 dark:text-gray-400 flex items-center">
                  <FaFileSignature   className="mr-2 text-gray-600 dark:text-gray-300" />
                  <span className="mr-3">Test Title:</span> {test.title}
                </p>
                <p className="text-gray-700 dark:text-gray-400 flex items-center">
                  <FaListOl className="mr-2 text-gray-600 dark:text-gray-300" />
                  <strong className="mr-3">Number of Questions:</strong> {test.numberOfQuestions}
                </p>
                <p className="text-gray-700 dark:text-gray-400 flex items-center">
                  <FaRegClock className="mr-2 text-gray-600 dark:text-gray-300" />
                  <strong className="mr-3">Duration:</strong> {test.examDuration} minutes
                </p>
                <p className="text-gray-700 dark:text-gray-400 flex items-center">
                  <FaRegCalendarAlt className="mr-2 text-gray-600 dark:text-gray-300" />
                  <strong className="mr-3">Start Date:</strong> { test.startDate ? new Date(test.startDate).toLocaleString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true
                  }): "No Start Date Set" }
                </p>
                <p className="text-gray-700 dark:text-gray-400 flex items-center">
                  <FaRegCalendarAlt className="mr-2 text-gray-600 dark:text-gray-300" />
                  <strong className="mr-3">End Date:</strong> { test.endDate ? new Date(test.endDate).toLocaleString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true
                  }): "No End Date Set" }
                </p>
              </div>
            </div>
          ) : (
            //  No Assigned Test
            <div className="p-6 rounded-lg bg-gray-100 dark:bg-gray-700 shadow-md text-center">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 flex justify-center items-center">
                <FaClipboardCheck className="mr-2 text-gray-600 dark:text-gray-400" /> No Test Assigned
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mt-2">
                You currently do not have any assigned tests. Please check back later.
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CandidateResult;
