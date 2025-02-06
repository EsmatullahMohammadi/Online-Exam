/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { SUPER_DOMAIN } from "../../admin/constant";

const CandidateExam = () => {
  const { testId } = useParams(); // Get test ID from URL params
  const navigate = useNavigate();
  const [test, setTest] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0); // Timer state in seconds

  axios.defaults.withCredentials = true;
  useEffect(() => {
    fetchTestAndQuestions();
  }, []);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);

      return () => clearInterval(timer);
    } else if (timeLeft === 0 && test) {
      handleSubmit(); // Auto-submit when timer reaches 0
    }
  }, [timeLeft, test]);

  const fetchTestAndQuestions = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${SUPER_DOMAIN}/test-byid/${testId}`);
      if (response.status === 200) {
        setTest(response.data.test);
        setQuestions(response.data.questions);
        setTimeLeft(response.data.test.examDuration * 60); // Convert minutes to seconds
      }
    } catch (err) {
      setError(err.response.data.message || "Failed to load test details.");
    } finally {
      setLoading(false);
    }
  };

  const handleOptionChange = (questionId, option) => {
    setAnswers((prev) => ({ ...prev, [questionId]: option }));
  };

  const handleSubmit = async () => {
    if (Object.keys(answers).length !== questions.length) {
      alert("Please answer all questions before submitting.");
      return;
    }

    try {
      const response = await axios.post(`${SUPER_DOMAIN}/tests/submit-exam`, {
        testId,
        answers,
        candidateId: sessionStorage.getItem("_id"),
      });
      if (response.status === 200) {
        setSubmitted(true);
        alert("Exam submitted successfully!");
        navigate("/candidate"); // Redirect after submission
      }
    } catch (err) {
      alert(err.response.data.message || "Failed to submit exam. Please try again.");
    }
  };

  // Convert seconds to MM:SS format
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  if (loading) return <p className="text-center text-gray-500">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;
  if (submitted) return <div>Exam submitted. Thank you!</div>;

  return (
    <div className="max-w-3xl mx-auto mt-5 p-5 border rounded-lg shadow-lg bg-white">
      {/* Exam Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">{test?.title}</h2>
        <div className="bg-red-500 text-white px-4 py-2 rounded-lg font-semibold">
          ⏳ Time Left: {formatTime(timeLeft)}
        </div>
      </div>
      
      <p className="text-gray-700 mb-2">Duration: {test?.examDuration} mins</p>
      <p className="text-gray-700 mb-4">Total Marks: {test?.totalMarks}</p>

      {/* Questions Section */}
      {questions?.map((question, index) => (
        <div key={question._id} className="mb-4 p-3 border-b">
          <h3 className="font-semibold">
            {index + 1}. {question.question}
          </h3>
          <div className="mt-2">
            {question.options.map((option, idx) => (
              <label
                key={idx}
                className="block p-2 border rounded-md cursor-pointer hover:bg-gray-100"
              >
                <input
                  type="radio"
                  name={`question-${question._id}`}
                  value={option}
                  checked={answers[question._id] === option}
                  onChange={() => handleOptionChange(question._id, option)}
                  className="mr-2"
                />
                {option}
              </label>
            ))}
          </div>
        </div>
      ))}

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-300 mt-4"
      >
        Submit Exam
      </button>
    </div>
  );
};

export default CandidateExam;
