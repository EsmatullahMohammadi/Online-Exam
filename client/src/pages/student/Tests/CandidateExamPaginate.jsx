import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { SUPER_DOMAIN } from "../../admin/constant";
import CBreadcrumb from "../../../components/Breadcrumbs/CBreadcrump";

const CandidateExamPaginate = () => {
  const { testId } = useParams();
  const navigate = useNavigate();
  const [test, setTest] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(() => {
    const savedTime = sessionStorage.getItem(`exam_${testId}_timeLeft`);
    return savedTime ? parseInt(savedTime) : 0;
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [saving, setSaving] = useState(false);
  const questionsPerPage = 3;
  const candidateId = sessionStorage.getItem("_id");

  axios.defaults.withCredentials = true;

  useEffect(() => {
    fetchTestAndQuestions();
    loadSavedProgress();

    return () => {
      // Clean up timer if component unmounts
      sessionStorage.setItem(`exam_${testId}_timeLeft`, timeLeft.toString());
    };
  }, []);

  useEffect(() => {
    let timer;
    if (timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prevTime) => {
          const newTime = prevTime - 1;
          sessionStorage.setItem(`exam_${testId}_timeLeft`, newTime.toString());
          return newTime;
        });
      }, 1000);
    } else if (timeLeft === 0 && test && !submitted) {
      handleSubmit();
    }

    return () => clearInterval(timer);
  }, [timeLeft, test, submitted]);

  const fetchTestAndQuestions = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${SUPER_DOMAIN}/test-byid/${testId}/${candidateId}`);
      
      if (response.status === 200) {
        console.log(response.data.submitted);
        
        if (response.data.submitted === true) {
          navigate("/candidate/candidate-result");
        } else {
          setTest(response.data.test);
          setQuestions(response.data.questions);
          
          if (timeLeft === 0) {
            const initialTime = response.data.test.examDuration * 60;
            setTimeLeft(initialTime);
            sessionStorage.setItem(`exam_${testId}_timeLeft`, initialTime.toString());
          }
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load test details.");
    } finally {
      setLoading(false);
    }
  };

  const loadSavedProgress = async () => {
    try {
      const response = await axios.get(`${SUPER_DOMAIN}/tests/progress/${testId}/${candidateId}`);
      if (response.data.answers) {
        setAnswers(response.data.answers);
        sessionStorage.setItem(`exam_${testId}_answers`, JSON.stringify(response.data.answers));
      }
      if (response.data.currentPage) {
        setCurrentPage(response.data.currentPage);
      }
    } catch (err) {
      console.error("Error loading saved progress:", err);
      // Fallback to sessionStorage if API fails
      const savedAnswers = sessionStorage.getItem(`exam_${testId}_answers`);
      if (savedAnswers) {
        setAnswers(JSON.parse(savedAnswers));
      }
    }
  };

  const handleOptionChange = (questionId, option) => {
    const newAnswers = { ...answers, [questionId]: option };
    setAnswers(newAnswers);
    sessionStorage.setItem(`exam_${testId}_answers`, JSON.stringify(newAnswers));
    saveProgress(newAnswers, currentPage);
  };

  const saveProgress = async (answersToSave, page) => {
    try {
      await axios.post(`${SUPER_DOMAIN}/tests/save-progress`, {
        testId,
        candidateId,
        answers: answersToSave,
        currentPage: page
      });
    } catch (err) {
      console.error("Error auto-saving answer:", err);
    }
  };

  const saveAndGoToPage = async (page) => {
    try {
      setSaving(true);
      await axios.post(`${SUPER_DOMAIN}/tests/save-progress`, {
        testId,
        candidateId,
        answers,
        currentPage: page
      });
      setCurrentPage(page);
    } catch (err) {
      console.error("Error saving progress:", err);
      alert("Error saving your answers. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleSubmit = async () => {
    if (submitted) return;
    
    if (!window.confirm("Are you sure you want to submit your exam?")) {
      return;
    }

    try {
      setSubmitted(true);
      const response = await axios.post(`${SUPER_DOMAIN}/tests/submit-exam`, {
        testId,
        candidateId,
        answers
      });
      
      if (response.status === 200) {
        sessionStorage.removeItem(`exam_${testId}_timeLeft`);
        sessionStorage.removeItem(`exam_${testId}_answers`);
        alert("Exam submitted successfully!");
        navigate("/candidate/candidate-result");
      }
    } catch (err) {
      setSubmitted(false);
      alert(err.response?.data?.message || "Failed to submit exam. Please try again.");
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  // Calculate pagination
  const indexOfLastQuestion = currentPage * questionsPerPage;
  const indexOfFirstQuestion = indexOfLastQuestion - questionsPerPage;
  const currentQuestions = questions.slice(indexOfFirstQuestion, indexOfLastQuestion);
  const totalPages = Math.ceil(questions.length / questionsPerPage);

  if (loading) return <div className="flex justify-center items-center h-screen">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
      <p className="text-gray-500 mt-4">Loading exam...</p>
    </div>
  </div>;

  if (error) return <div className="flex justify-center items-center h-screen">
    <div className="text-center">
      <p className="text-red-500 font-bold text-lg">{error}</p>
      <button 
        onClick={() => window.location.reload()}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Try Again
      </button>
    </div>
  </div>;

  if (submitted) return <div className="flex justify-center items-center h-screen">
    <div className="text-center">
      <p className="text-green-500 font-bold text-lg">Exam submitted. Thank you!</p>
      <p className="text-gray-600 mt-2">Redirecting to results...</p>
    </div>
  </div>;

  return (
    <>
      <CBreadcrumb pageName="Candidate Test" />
      <div className="container mx-auto p-4 md:p-6">
        <div className="rounded-lg border border-gray-300 bg-white p-4 md:p-6 shadow-lg dark:border-gray-700 dark:bg-gray-800">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b pb-4 gap-2">
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">{test?.title}</h2>
              <p className="text-gray-600 text-sm md:text-base">
                Question {indexOfFirstQuestion + 1}-{Math.min(indexOfLastQuestion, questions.length)} of {questions.length}
              </p>
            </div>
            <div className="px-3 py-1 md:px-4 md:py-2 text-white bg-red-600 rounded-md font-semibold text-sm md:text-base">
              ⏳ Time Left: {formatTime(timeLeft)}
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:justify-between md:items-center mt-4 gap-2">
            <p className="text-gray-600 text-sm md:text-base">Duration: {test?.examDuration} mins</p>
            <p className="text-gray-600 text-sm md:text-base">Total Marks: {test?.totalMarks}</p>
          </div>

          <div className="space-y-4 mt-6">
            {currentQuestions.map((question, index) => (
              <div key={question._id} className="p-3 md:p-4 border rounded-md bg-gray-100 dark:bg-gray-700">
                <h3 className="font-semibold text-base md:text-lg text-gray-800 dark:text-white">
                  {indexOfFirstQuestion + index + 1}. {question.question}
                </h3>

                {question.category === "Listening" && question.listeningFile && (
                  <div className="mt-2 md:mt-3">
                    <audio controls className="w-full">
                      <source src={`${SUPER_DOMAIN}/listening/${question.listeningFile}`} type="audio/mpeg" />
                      Your browser does not support the audio element.
                    </audio>
                  </div>
                )}

                <div className="mt-2 space-y-2">
                  {question.options.map((option, idx) => (
                    <label
                      key={idx}
                      className={`block p-2 md:p-3 border rounded-md ${
                        answers[question._id] === option 
                          ? 'bg-blue-100 dark:bg-blue-900' 
                          : 'bg-white dark:bg-gray-800'
                      } cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600`}
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
          </div>

          <div className="flex flex-col-reverse md:flex-row justify-between items-center mt-6 gap-4">
            <button
              onClick={() => saveAndGoToPage(currentPage - 1)}
              disabled={currentPage === 1 || saving}
              className={`w-full md:w-auto px-4 py-2 rounded-md ${
                currentPage === 1 || saving 
                  ? 'bg-gray-300 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700'
              } text-white`}
            >
              {saving ? 'Saving...' : 'Previous'}
            </button>

            <div className="flex space-x-2 overflow-x-auto py-2 w-full justify-center">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i + 1}
                  onClick={() => saveAndGoToPage(i + 1)}
                  className={`min-w-8 h-8 md:w-10 md:h-10 rounded-full ${
                    currentPage === i + 1 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-200 hover:bg-gray-300'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>

            <button
              onClick={() => currentPage === totalPages ? handleSubmit() : saveAndGoToPage(currentPage + 1)}
              disabled={saving}
              className={`w-full md:w-auto px-4 py-2 rounded-md ${
                currentPage === totalPages 
                  ? 'bg-green-600 hover:bg-green-700' 
                  : 'bg-blue-600 hover:bg-blue-700'
              } text-white`}
            >
              {saving ? 'Saving...' : currentPage === totalPages ? 'Submit Exam' : 'Next'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default CandidateExamPaginate;