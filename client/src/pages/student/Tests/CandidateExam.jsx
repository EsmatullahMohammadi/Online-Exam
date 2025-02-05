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

  useEffect(() => {
    fetchTestAndQuestions();
  }, []);

  const fetchTestAndQuestions = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${SUPER_DOMAIN}/test-byid/${testId}`);
      if (response.status === 200) {
        setTest(response.data.test);
        setQuestions(response.data.questions);
      }
    } catch (err) {
      setError("Failed to load test details.");
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
        candidateId: sessionStorage.getItem('_id'),
      });
      if (response.status === 200) {
        setSubmitted(true);
        alert("Exam submitted successfully!");
        navigate("/candidate"); // Redirect after submission
      }
    } catch (err) {
      alert("Failed to submit exam. Please try again.");
    }
  };

  if (loading) return <div>Loading exam...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (submitted) return <div>Exam submitted. Thank you!</div>;

  return (
    <div className="max-w-3xl mx-auto mt-5 p-5 border rounded-lg shadow-lg bg-white">
      <h2 className="text-2xl font-bold mb-4">{test?.title}</h2>
      <p className="text-gray-700 mb-2">Duration: {test?.examDuration} mins</p>
      <p className="text-gray-700 mb-4">Total Marks: {test?.totalMarks}</p>

      {questions?.map((question, index) => (
        <div key={question._id} className="mb-4 p-3 border-b">
          <h3 className="font-semibold">
            {index + 1}. {question.question}
          </h3>
          <div className="mt-2">
            {question.options.map((option, idx) => (
              <label key={idx} className="block p-2 border rounded-md cursor-pointer">
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

      <button
        onClick={handleSubmit}
        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-300"
      >
        Submit Exam
      </button>
    </div>
  );
};

export default CandidateExam;
