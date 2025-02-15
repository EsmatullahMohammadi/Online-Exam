/* eslint-disable react/prop-types */

import axios from "axios";
import { useEffect, useState } from "react";
import { SUPER_DOMAIN } from "../constant";

const Modal = ({ testID, onClose }) => {
  const [test, setTest] = useState(null); // State for test details
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true); // Initial loading state
  axios.defaults.withCredentials = true;
  useEffect(() => {
    async function fetchTest() {
      setLoading(true); // Start loading
      try {
        const response = await axios.get(`${SUPER_DOMAIN}/tests/${testID}`);
        setTest(response.data.test); // Store the test details in state
        setError(""); // Clear any previous errors
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch test details.");
      } finally {
        setLoading(false); // End loading
      }
    }

    fetchTest();
  }, [testID]);

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
          <p className="text-center text-gray-700">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
          <p className="text-center text-red-500">{ error }</p>
          <div className="flex justify-end">
            <button
              onClick={ onClose }
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-6">
        {/* Modal Header */ }
        <div className="flex justify-between items-center border-b pb-2 mb-4">
          <h2 className="text-lg font-semibold">Test Details</h2>
          <button
            onClick={ onClose }
            className="text-gray-400 hover:text-gray-600 transition text-2xl font-bold"
          >
            &times;
          </button>
        </div>

        {/* Modal Body */ }
        <div className="mb-4">
          <h3 className="text-base font-medium text-gray-700 mb-2">
            Title: <span className="font-normal">{ test?.title || "N/A" }</span>
          </h3>
          <h3 className="text-base font-medium text-gray-700 mb-2">
            Duration:{ " " }
            <span className="font-normal">
              { test?.examDuration ? `${test.examDuration} minutes` : "N/A" }
            </span>
          </h3>
          <h3 className="text-base font-medium text-gray-700 mb-2">
            Number of Questions:{ " " }
            <span className="font-normal">{ test?.numberOfQuestions || "N/A" }</span>
          </h3>
          <h3 className="text-base font-medium text-gray-700 mb-2">
            Total Marks: <span className="font-normal">{ test?.totalMarks || "N/A" }</span>
          </h3>
          <h3 className="text-base font-medium text-gray-700 mb-2">
          Start Date: <span className="font-normal">{ test?.startDate ? new Date(test?.startDate).toLocaleString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
              hour12: true
            }) : "No Start Date Set" }</span>
          </h3>
          <h3 className="text-base font-medium text-gray-700 mb-2">
            End Date: <span className="font-normal">{ test?.endDate ? new Date(test?.endDate).toLocaleString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
              hour12: true
            }) : "No End Date Set" }</span>
          </h3>
          <h3 className="text-base font-medium text-gray-700">
            Description: <span className="font-normal">{ test?.description || "N/A" }</span>
          </h3>
        </div>

        {/* Modal Footer */ }
        <div className="flex justify-end">
          <button
            onClick={ onClose }
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
