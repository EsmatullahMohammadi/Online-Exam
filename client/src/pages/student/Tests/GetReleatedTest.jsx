import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { SUPER_DOMAIN } from "../../admin/constant";
import CBreadcrumb from "../../../components/Breadcrumbs/CBreadcrump";

const GetRelatedTest = () => {
  const candidateId = sessionStorage.getItem("_id");
  const navigate = useNavigate();
  const [test, setTest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  axios.defaults.withCredentials = true;
  useEffect(() => {
    const fetchTest = async () => {
      try {
        const response = await axios.get(`${SUPER_DOMAIN}/${candidateId}/test`);
        if (response.status === 200) {
          setTest(response.data.test);
        } else {
          setError("No assigned test found.");
        }
      } catch (err) {
        setError(err.response?.data?.message || "Error fetching test. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchTest();
  }, [candidateId]);

  // Format date function
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) return <p className="text-center text-gray-500">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <>
    <CBreadcrumb pageName={"Candidate test"}/>
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-sm border border-gray-200 mt-10">
      {/* Header Message */}
      <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 text-center leading-relaxed">
        📄 Welcome, Candidates!  
        <span className="block text-lg text-gray-600 mt-2">
          ✅ You can **only submit your answers once**, so double-check before submitting.  
          ⏳ The exam is **timed**, so complete it within the given duration.  
          🎯 Ensure all answers are submitted before time runs out.  
        </span>
        <span className="text-blue-600 font-semibold mt-2 block">Good luck! 🍀</span>
      </h2>

      {test ? (
        <div className="bg-gray-100 p-6 rounded-lg shadow-md">
          <p className="text-lg font-semibold text-gray-800">
            <span className="text-blue-600">📌 Title:</span> {test.title}
          </p>
          <p className="text-gray-700"><strong>📝 Description:</strong> {test.description}</p>
          <p className="text-gray-700"><strong>📋 Number of Questions:</strong> {test.numberOfQuestions}</p>
          <p className="text-gray-700"><strong>⏳ Duration:</strong> {test.examDuration} minutes</p>
          <p className="text-gray-700"><strong>🏆 Total Marks:</strong> {test.totalMarks}</p>
          <p className="text-gray-700"><strong>📅 Start Date:</strong> {formatDate(test.startDate)}</p>
          <p className="text-gray-700"><strong>⏰ End Date:</strong> {formatDate(test.endDate)}</p>

          {/* Start Test Button */}
          <button
            onClick={() => navigate(`/candidate/candidate-question/${test._id}`)}
            className="w-full mt-6 bg-blue-600 text-white py-3 px-6 rounded-lg text-lg font-semibold hover:bg-blue-700 transition duration-300 shadow-md"
          >
            🚀 Start Test
          </button>
        </div>
      ) : (
        <p className="text-center text-gray-500 text-lg">No test assigned yet.</p>
      )}
    </div>
    </>

  );
};

export default GetRelatedTest;
