/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { SUPER_DOMAIN } from "../../admin/constant";
import CBreadcrumb from "../../../components/Breadcrumbs/CBreadcrump";

const CandidateExam = () => {
  const { testId } = useParams();
  const navigate = useNavigate();
  const [test, setTest] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const candidateId = sessionStorage.getItem("_id");

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
      handleSubmit();
    }
  }, [timeLeft, test]);

  const fetchTestAndQuestions = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${SUPER_DOMAIN}/test-byid/${testId}/${candidateId}`);
      if (response.status === 200) {
        if (response.data.submitted === true) {
          navigate("/candidate/candidate-result");
        } else {
          setTest(response.data.test);
          setQuestions(response.data.questions);
          setTimeLeft(response.data.test.examDuration * 60);
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load test details.");
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
      // sessionStorage.setItem("results", JSON.stringify(response.data));
      if (response.status === 200) {
        setSubmitted(true);
        alert("Exam submitted successfully!");
        navigate("/candidate/candidate-result");
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to submit exam. Please try again.");
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  if (loading) return <p className="text-center text-gray-500">Loading...</p>;
  if (error) return <p className="text-center font-bold text-red-500">{ error }</p>;
  if (submitted) return <div className="text-center text-lg font-semibold text-green-500">Exam submitted. Thank you!</div>;

  return (
    <>
      <CBreadcrumb pageName="Candidate Test" />
      <div className="container mx-auto p-6">
        <div className="rounded-lg border border-gray-300 bg-white p-6 shadow-lg dark:border-gray-700 dark:bg-gray-800">
          {/* Exam Header */ }
          <div className="flex items-center justify-between border-b pb-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{ test?.title }</h2>
            <div className="px-4 py-2 text-white bg-red-600 rounded-md font-semibold">
              ⏳ Time Left: { formatTime(timeLeft) }
            </div>
          </div>

          <p className="text-gray-600 mt-2">Duration: { test?.examDuration } mins</p>
          <p className="text-gray-600 mb-6">Total Marks: { test?.totalMarks }</p>

          {/* Questions Section */ }
          <div className="space-y-5">
            { questions.map((question, index) => (
              <div key={ question._id } className="p-4 border rounded-md bg-gray-100 dark:bg-gray-700">
                <h3 className="font-semibold text-lg text-gray-800 dark:text-white">
                  { index + 1 }. { question.question }
                </h3>

                {/* If the question has a listening file, show the audio player */ }
                { question.category === "Listening" && question.listeningFile && (
                  <div className="mt-3">
                    <audio controls className="w-full">
                      <source src={ `${SUPER_DOMAIN}/listening/${question.listeningFile}` } type="audio/mpeg" />
                      Your browser does not support the audio element.
                    </audio>
                  </div>
                ) }

                {/* Options Section */ }
                <div className="mt-2 space-y-2">
                  { question.options.map((option, idx) => (
                    <label
                      key={ idx }
                      className="block p-3 border rounded-md bg-white dark:bg-gray-800 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600"
                    >
                      <input
                        type="radio"
                        name={ `question-${question._id}` }
                        value={ option }
                        checked={ answers[question._id] === option }
                        onChange={ () => handleOptionChange(question._id, option) }
                        className="mr-2"
                      />
                      { option }
                    </label>
                  )) }
                </div>
              </div>
            )) }
          </div>

          {/* Submit Button */ }
          <button
            onClick={ handleSubmit }
            className="w-full mt-6 py-3 rounded-lg text-white font-semibold bg-blue-600 hover:bg-blue-700 transition-all"
          >
            Submit Exam
          </button>
        </div>
      </div>
    </>
  );
};

export default CandidateExam;
