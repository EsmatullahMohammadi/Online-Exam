import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { SUPER_DOMAIN } from "../../admin/constant";
import CBreadcrumb from "../../../components/Breadcrumbs/CBreadcrump";

const CandidateExamPaginate = () => {
  const { testId } = useParams();
  const navigate = useNavigate();
  const [test, setTest] = useState(null);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(() => {
    const savedTime = sessionStorage.getItem(`exam_${testId}_timeLeft`);
    return savedTime ? parseInt(savedTime, 10) : 0;
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [saving, setSaving] = useState(false);
  const candidateId = sessionStorage.getItem("_id");

  axios.defaults.withCredentials = true;

  useEffect(() => {
    fetchTestAndGroups();
    loadSavedProgress();

    return () => {
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
      handleSubmit(true);
    }
    return () => clearInterval(timer);
  }, [timeLeft, test, submitted]);

  const fetchTestAndGroups = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${SUPER_DOMAIN}/test-byid/${testId}/${candidateId}`
      );

      if (response.status === 200) {
        if (response.data.submitted === true) {
          navigate("/candidate/candidate-result");
          return;
        }

        const testData = response.data.test;
        setTest(testData);

        if (timeLeft === 0) {
          const initialTime = testData.examDuration * 60;
          setTimeLeft(initialTime);
          sessionStorage.setItem(
            `exam_${testId}_timeLeft`,
            initialTime.toString()
          );
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
      const response = await axios.get(
        `${SUPER_DOMAIN}/tests/progress/${testId}/${candidateId}`
      );
      if (response.data.answers) {
        const loadedAnswers = {};
        for (const [key, value] of Object.entries(response.data.answers)) {
          loadedAnswers[key] = value.answer;
        }
        setAnswers(loadedAnswers);
        sessionStorage.setItem(
          `exam_${testId}_answers`,
          JSON.stringify(loadedAnswers)
        );
      }
      if (response.data.currentPage) {
        setCurrentPage(response.data.currentPage);
      }
    } catch (err) {
      console.error("Error loading saved progress:", err);
      const savedAnswers = sessionStorage.getItem(`exam_${testId}_answers`);
      if (savedAnswers) {
        setAnswers(JSON.parse(savedAnswers));
      }
    }
  };

  const handleOptionChange = (questionId, option) => {
    const newAnswers = { ...answers, [questionId]: option };
    setAnswers(newAnswers);
    sessionStorage.setItem(
      `exam_${testId}_answers`,
      JSON.stringify(newAnswers)
    );

    const saveData = {};
    saveData[questionId] = option;

    saveProgress(newAnswers, currentPage);
  };

  const saveProgress = async (answersToSave, page) => {
    try {
      setSaving(true);
      await axios.post(`${SUPER_DOMAIN}/tests/save-progress`, {
        testId,
        candidateId,
        answers: answersToSave,
        currentPage: page,
      });
    } catch (err) {
      console.error("Error auto-saving answer:", err);
    } finally {
      setSaving(false);
    }
  };

  const saveAndGoToPage = async (page) => {
    if (page < 1 || page > 4) return;
    try {
      setSaving(true);
      await axios.post(`${SUPER_DOMAIN}/tests/save-progress`, {
        testId,
        candidateId,
        answers,
        currentPage: page,
      });
      setCurrentPage(page);
    } catch (err) {
      console.error("Error saving progress:", err);
      alert("Error saving your answers. Please try again.");
    } finally {
      setSaving(false);
    }
  };
  const handleSubmit = async (timeLeft) => {
    if (submitted) return;
    if (!timeLeft) {
      if (!window.confirm("Are you sure you want to submit your exam?")) return;
    }

    try {
      setSubmitted(true);
      const response = await axios.post(`${SUPER_DOMAIN}/tests/submit-exam`, {
        testId,
        candidateId,
        answers,
      });

      if (response.status === 200) {
        sessionStorage.removeItem(`exam_${testId}_timeLeft`);
        sessionStorage.removeItem(`exam_${testId}_answers`);
        alert(`Exam submitted successfully!`);
        navigate("/candidate/candidate-result");
      }
    } catch (err) {
      setSubmitted(false);
      alert(
        err.response?.data?.message ||
          "Failed to submit exam. Please try again."
      );
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  const groupedQuestions = {
    Reading: [],
    Listening: [],
    Grammar: [],
    Writing: [],
  };

  if (test?.questionGroups) {
    test.questionGroups.forEach((group) => {
      if (groupedQuestions[group.category]) {
        groupedQuestions[group.category].push(group);
      }
    });
  }

  const totalPages = 4;
  const pageTitles = [
    "Reading Section",
    "Listening Section",
    "Grammar Section",
    "Writing Section",
  ];
  const currentCategory = ["Reading", "Listening", "Grammar", "Writing"][
    currentPage - 1
  ];
  const currentGroups = groupedQuestions[currentCategory] || [];

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="text-gray-500 mt-4">Loading exam...</p>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <p className="text-red-500 font-bold text-lg">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );

  if (submitted)
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <p className="text-green-500 font-bold text-lg">
            Exam submitted. Thank you!
          </p>
          <p className="text-gray-600 mt-2">Redirecting to results...</p>
        </div>
      </div>
    );

  return (
    <>
      <CBreadcrumb pageName="Candidate Test" />
      <div className="container mx-auto p-4 md:p-6">
        <div className="rounded-lg border border-gray-300 bg-white p-4 md:p-6 shadow-lg dark:border-gray-700 dark:bg-gray-800">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b pb-4 gap-2">
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
                {test?.title}
              </h2>
              <p className="text-gray-600 text-sm md:text-base">
                {pageTitles[currentPage - 1]} (Page {currentPage} of{" "}
                {totalPages})
              </p>
            </div>
            <div className="px-3 py-1 md:px-4 md:py-2 text-white bg-red-600 rounded-md font-semibold text-sm md:text-base">
              ⏳ Time Left: {formatTime(timeLeft)}
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:justify-between md:items-center mt-4 gap-2">
            <p className="text-gray-600 text-sm md:text-base">
              Duration: {test?.examDuration} mins
            </p>
            <p className="text-gray-600 text-sm md:text-base">
              Total Marks: {test?.totalMarks}
            </p>
          </div>

          <div className="space-y-6 mt-6">
            {currentCategory === "Reading" && (
              <section>
                <h2 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">
                  Reading: ( 30 Points)
                </h2>
                <p className="mb-5 text-gray-700 dark:text-gray-300">
                  Read the passage and answer the questions below.
                </p>
                {currentGroups.map((group) => (
                  <div key={group._id} className="mb-8">
                    {group.passage && (
                      <div className="p-4 bg-gray-200 dark:bg-gray-600 rounded rounded-b-none mb-4">
                        <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                          {group.passage}
                        </p>
                      </div>
                    )}
                    {group.questions.map((question, idx) => (
                      <div
                        key={question._id}
                        className="mb-4 p-4 border rounded-md bg-gray-100 dark:bg-gray-700"
                      >
                        <h3 className="font-semibold text-lg text-gray-800 dark:text-white mb-2">
                          {idx + 1}. {question.questionText}
                        </h3>
                        <div className="space-y-2">
                          {question.options.map((option, i) => (
                            <label
                              key={i}
                              className={`block p-2 border rounded-md cursor-pointer ${
                                answers[question._id] === option
                                  ? "bg-blue-100 dark:bg-blue-900"
                                  : "bg-white dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-600"
                              }`}
                            >
                              <input
                                type="radio"
                                name={`question-${question._id}`}
                                value={option}
                                checked={answers[question._id] === option}
                                onChange={() =>
                                  handleOptionChange(question._id, option)
                                }
                                className="mr-2"
                              />
                              {option}
                            </label>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </section>
            )}

            {currentCategory === "Listening" && (
              <section>
                <h2 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">
                  Listening (30 Points)
                </h2>
                <p className="mb-5 text-gray-700 dark:text-gray-300">
                  Please read each question carefully and select the correct
                  answer from the four or two options provided. There is only
                  one correct answer for each question. Good luck!
                </p>
                {currentGroups.map((group) => (
                  <div key={group._id} className="mb-8">
                    {group.listeningFile && (
                      <div className="mb-4">
                        <audio controls className="w-full">
                          <source
                            src={`${SUPER_DOMAIN}/listening/${group.listeningFile}`}
                            type="audio/mpeg"
                          />
                          Your browser does not support the audio element.
                        </audio>
                      </div>
                    )}
                    {group.questions.map((question, idx) => (
                      <div
                        key={question._id}
                        className="mb-4 p-4 border rounded-md bg-gray-100 dark:bg-gray-700"
                      >
                        <h3 className="font-semibold text-lg text-gray-800 dark:text-white mb-2">
                          {idx + 1}. {question.questionText}
                        </h3>
                        <div className="space-y-2">
                          {question.options.map((option, i) => (
                            <label
                              key={i}
                              className={`block p-2 border rounded-md cursor-pointer ${
                                answers[question._id] === option
                                  ? "bg-blue-100 dark:bg-blue-900"
                                  : "bg-white dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-600"
                              }`}
                            >
                              <input
                                type="radio"
                                name={`question-${question._id}`}
                                value={option}
                                checked={answers[question._id] === option}
                                onChange={() =>
                                  handleOptionChange(question._id, option)
                                }
                                className="mr-2"
                              />
                              {option}
                            </label>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </section>
            )}

            {currentCategory === "Grammar" && (
              <section>
                <h2 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">
                  Grammar (30 Points)
                </h2>

                <p className="mb-5 text-gray-700 dark:text-gray-300">
                  Please read each question carefully and select the correct
                  answer from the four options provided. There is only one
                  correct answer for each question. Good luck!
                </p>

                {(() => {
                  let questionNumber = 1;
                  return currentGroups.map((group) => (
                    <div key={group._id} className="mb-8">
                      {group.questions.map((question) => (
                        <div
                          key={question._id}
                          className="mb-4 p-4 border rounded-md bg-gray-100 dark:bg-gray-700"
                        >
                          <h3 className="font-semibold text-lg text-gray-800 dark:text-white mb-2">
                            {questionNumber++}. {question.questionText}
                          </h3>
                          <div className="space-y-2">
                            {question.options.map((option, i) => (
                              <label
                                key={i}
                                className={`block p-2 border rounded-md cursor-pointer ${
                                  answers[question._id] === option
                                    ? "bg-blue-100 dark:bg-blue-900"
                                    : "bg-white dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-600"
                                }`}
                              >
                                <input
                                  type="radio"
                                  name={`question-${question._id}`}
                                  value={option}
                                  checked={answers[question._id] === option}
                                  onChange={() =>
                                    handleOptionChange(question._id, option)
                                  }
                                  className="mr-2"
                                />
                                {option}
                              </label>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  ));
                })()}
              </section>
            )}

            {currentCategory === "Writing" && (
              <section>
                <h2 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">
                  Writing ( 10 Points)
                </h2>

                <p className="mb-5 text-gray-700 dark:text-gray-300">
                  Please read each question carefully and select the correct
                  answer from the four options provided. There is only one
                  correct answer for each question. Good luck!
                </p>

                {(() => {
                  let questionNumber = 1;
                  return currentGroups.map((group) => (
                    <div key={group._id} className="mb-8">
                      {group.questions.map((question) => (
                        <div
                          key={question._id}
                          className="mb-4 p-4 border rounded-md bg-gray-100 dark:bg-gray-700"
                        >
                          <h3 className="font-semibold text-lg text-gray-800 dark:text-white mb-2">
                            {questionNumber++}. {question.questionText}
                          </h3>
                          <div className="space-y-2">
                            {question.options.map((option, i) => (
                              <label
                                key={i}
                                className={`block p-2 border rounded-md cursor-pointer ${
                                  answers[question._id] === option
                                    ? "bg-blue-100 dark:bg-blue-900"
                                    : "bg-white dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-600"
                                }`}
                              >
                                <input
                                  type="radio"
                                  name={`question-${question._id}`}
                                  value={option}
                                  checked={answers[question._id] === option}
                                  onChange={() =>
                                    handleOptionChange(question._id, option)
                                  }
                                  className="mr-2"
                                />
                                {option}
                              </label>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  ));
                })()}
              </section>
            )}
          </div>

          <div className="flex flex-col-reverse md:flex-row justify-between items-center mt-6 gap-4">
            <button
              onClick={() => saveAndGoToPage(currentPage - 1)}
              disabled={currentPage === 1 || saving}
              className={`w-full md:w-auto px-4 py-2 rounded-md ${
                currentPage === 1 || saving
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              } text-white`}
            >
              {saving ? "Saving..." : "Previous"}
            </button>

            <div className="flex space-x-2 overflow-x-auto py-2 w-full justify-center">
              {[1, 2, 3, 4].map((page) => (
                <button
                  key={page}
                  onClick={() => saveAndGoToPage(page)}
                  className={`min-w-8 h-8 md:w-10 md:h-10 rounded-full ${
                    currentPage === page
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 hover:bg-gray-300"
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>

            <button
              onClick={() =>
                currentPage === totalPages
                  ? handleSubmit()
                  : saveAndGoToPage(currentPage + 1)
              }
              disabled={saving}
              className={`w-full md:w-auto px-4 py-2 rounded-md ${
                saving
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              } text-white`}
            >
              {currentPage === totalPages ? "Submit" : "Next"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default CandidateExamPaginate;
