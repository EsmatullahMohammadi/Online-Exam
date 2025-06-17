import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { SUPER_DOMAIN } from "../constant";
import Breadcrumb from "../../../components/Breadcrumbs/Breadcrumb";

const DemoQuestions = () => {
  const { testId } = useParams();
  const navigate = useNavigate();
  const [test, setTest] = useState(null);
  const [questionGroups, setQuestionGroups] = useState([]);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);

  axios.defaults.withCredentials = true;

  useEffect(() => {
    fetchTestAndQuestions();
  }, []);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0 && test) {
      handleSubmit();
    }
  }, [timeLeft, test]);

  const fetchTestAndQuestions = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${SUPER_DOMAIN}/demo-test-byid/${testId}`
      );
      if (response.status === 200) {
        setTest(response.data.test);
        setQuestionGroups(response.data.groupedQuestions || []);
        setTimeLeft(response.data.test.examDuration * 60);
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

  const handleSubmit = () => {
    const totalQuestions = questionGroups.reduce(
      (sum, group) => sum + group.questions.length,
      0
    );
    if (Object.keys(answers).length !== totalQuestions) {
      alert("Please answer all questions before submitting.");
      return;
    }

    alert("This demo submit test is for showing admin the question of test!");
    navigate("/admin/tests");
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  if (loading) return <p className="text-center text-gray-500">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <>
      <Breadcrumb pageName="Test Demo" />
      <div className="container mx-auto p-6">
        <div className="rounded-lg border border-gray-300 bg-white p-6 shadow-lg dark:border-gray-700 dark:bg-gray-800">
          {/* Exam Header */}
          <div className="flex items-center justify-between border-b pb-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {test?.title}
            </h2>
            <div className="px-4 py-2 text-white bg-red-600 rounded-md font-semibold">
              ⏳ Time Left: {formatTime(timeLeft)}
            </div>
          </div>

          <p className="text-gray-600 mt-2">
            Duration: {test?.examDuration} mins
          </p>
          <p className="text-gray-600 mb-6">Total Marks: {test?.totalMarks}</p>

          {/* Render Grouped Questions */}
          <div className="space-y-6">
            {questionGroups.map((group, groupIndex) => (
              <div key={group._id} className="bg-gray-50 p-4 rounded-lg border">
                {/* If passage exists */}
                {group.category === "Reading" && group.passage && (
                  <div className="mb-4 p-4 bg-blue-50 border border-blue-300 rounded">
                    <h4 className="font-semibold mb-2 text-blue-800">
                      Reading Passage:
                    </h4>
                    <p className="text-gray-800 whitespace-pre-wrap">
                      {group.passage}
                    </p>
                  </div>
                )}

                {/* If listening file exists */}
                {group.category === "Listening" && group.listeningFile && (
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

                {/* Questions in the group */}
                {group.questions.map((question, index) => (
                  <div
                    key={question._id}
                    className="p-4 border rounded-md bg-white dark:bg-gray-700 mt-4"
                  >
                    <h3 className="font-semibold text-lg text-gray-800 dark:text-white">
                      {groupIndex + 1}.{index + 1} {question.questionText}
                    </h3>

                    <div className="mt-2 space-y-2">
                      {question.options.map((option, idx) => (
                        <label
                          key={idx}
                          className="block p-3 border rounded-md bg-white dark:bg-gray-800 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600"
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
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            className="w-full mt-6 py-3 rounded-lg text-white font-semibold bg-blue-600 hover:bg-blue-700 transition-all"
          >
            Submit Exam
          </button>
        </div>
      </div>
    </>
  );
};

export default DemoQuestions;
