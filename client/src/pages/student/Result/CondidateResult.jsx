import {
  FaClipboardCheck,
  FaTrophy,
  FaExclamationTriangle,
  FaCheckCircle,
  FaRegCalendarAlt,
  FaFileAlt,
  FaFileSignature,
  FaRegClock,
  FaListOl,
} from "react-icons/fa";
import CBreadcrumb from "../../../components/Breadcrumbs/CBreadcrump";
import useCandidateTestResult from "../../../hooks/condidate/useCandidateTestResult";

const CandidateResult = () => {
  const candidateId = sessionStorage.getItem("_id");
  const { test, submittedTest, loading, error } =
    useCandidateTestResult(candidateId);

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
            <>
              <div className="p-6 rounded-lg bg-green-100 dark:bg-green-900 shadow-md">
                <h3 className="text-2xl font-bold text-green-800 dark:text-green-300 flex items-center">
                  <FaTrophy className="mr-2" /> Test Results
                </h3>

                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3 text-gray-800 dark:text-gray-200">
                    <p className="text-lg font-bold text-gray-700 dark:text-gray-400 flex items-center">
                      <FaFileSignature className="mr-2 text-gray-600 dark:text-gray-300" />
                      <span className="mr-3">Test Title:</span> {test?.title}
                    </p>
                    <p className="text-gray-700 dark:text-gray-400 flex items-center">
                      <FaFileAlt className="mr-2 text-gray-600 dark:text-gray-300" />
                      <strong className="mr-3">Total Score:</strong>{" "}
                      {test?.totalMarks}
                    </p>
                  </div>

                  <div className="space-y-3 text-gray-800 dark:text-gray-200">
                    <p className="text-gray-700 dark:text-gray-400 flex items-center">
                      <FaRegCalendarAlt className="mr-2 text-gray-600 dark:text-gray-300" />
                      <strong className="mr-3">Submitted On:</strong>{" "}
                      {new Date(submittedTest?.submittedAt).toLocaleString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true,
                        }
                      )}
                    </p>
                    <p className="flex items-center">
                      <FaCheckCircle className="mr-2 text-gray-600 dark:text-gray-300" />
                      <strong className="mr-3">Status:</strong>
                      <span
                        className={`ml-2 px-3 py-1 rounded-lg text-sm font-semibold ${getStatusStyle(submittedTest.status)}`}
                      >
                        {submittedTest?.status}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="mt-6 bg-white dark:bg-gray-700 p-4 rounded-lg shadow">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-bold text-gray-800 dark:text-gray-200">
                      <FaFileAlt className="inline mr-2" />
                      Your Total Score:{" "}
                      {submittedTest?.obtainedMarks.toFixed(2)}/
                      {test?.totalMarks}
                    </span>
                    <span className="font-bold text-gray-800 dark:text-gray-200">
                      {(
                        (submittedTest?.obtainedMarks / test?.totalMarks) *
                        100
                      ).toFixed(1)}
                      %
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-4 dark:bg-gray-600">
                    <div
                      className={`h-4 rounded-full ${
                        (submittedTest?.obtainedMarks / test?.totalMarks) *
                          100 <
                        30
                          ? "bg-red-500"
                          : (submittedTest?.obtainedMarks / test?.totalMarks) *
                                100 <=
                              70
                            ? "bg-yellow-500"
                            : "bg-green-500"
                      }`}
                      style={{
                        width: `${(submittedTest?.obtainedMarks / test?.totalMarks) * 100}%`,
                        minWidth: "0.5rem",
                      }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                    <span>0%</span>
                    <span>100%</span>
                  </div>
                </div>

                {submittedTest?.categoryBreakdown && (
                  <div className="mt-6">
                    <h3 className="text-xl font-bold text-green-800 dark:text-green-300 flex items-center">
                      <FaClipboardCheck className="mr-2" /> Section-wise
                      Performance
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                      {Object.entries(submittedTest.categoryBreakdown).map(
                        ([category, data]) => (
                          <div
                            key={category}
                            className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow"
                          >
                            <h4 className="font-bold text-lg text-gray-800 dark:text-gray-200 mb-2">
                              {category} Section
                            </h4>
                            <div className="space-y-2">
                              <p className="text-gray-700 dark:text-gray-300">
                                <span className="font-medium">
                                  Correct Answers:
                                </span>{" "}
                                {data.correct}/{data.total}
                              </p>
                              <p className="text-gray-700 dark:text-gray-300">
                                <span className="font-medium">Percentage:</span>{" "}
                                {data.percentage.toFixed(1)}%
                              </p>
                              <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-600">
                                <div
                                  className={`h-2.5 rounded-full ${
                                    data.percentage >= 70
                                      ? "bg-green-500"
                                      : data.percentage >= 50
                                        ? "bg-yellow-500"
                                        : "bg-red-500"
                                  }`}
                                  style={{ width: `${data.percentage}%` }}
                                ></div>
                              </div>
                              <p className="text-gray-700 dark:text-gray-300">
                                <span className="font-medium">
                                  Weighted Score:
                                </span>{" "}
                                {data.weightedScore.toFixed(2)}
                              </p>
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : test ? (
            <div className="p-6 rounded-lg bg-yellow-100 dark:bg-yellow-900 shadow-md">
              <h3 className="text-2xl font-bold text-yellow-800 dark:text-yellow-300 flex items-center">
                <FaExclamationTriangle className="mr-2 text-yellow-600" /> Test
                Not Submitted
              </h3>
              <p className="text-gray-800 dark:text-gray-200 mt-2">
                ⚠️ You have an <strong>assigned test</strong> but have{" "}
                <strong>not submitted</strong> it yet! Make sure to complete it
                before the deadline.
              </p>
              <div className="mt-4 space-y-3 text-gray-800 dark:text-gray-200">
                <p className="text-lg font-bold text-gray-700 dark:text-gray-400 flex items-center">
                  <FaFileSignature className="mr-2 text-gray-600 dark:text-gray-300" />
                  <span className="mr-3">Test Title:</span> {test.title}
                </p>
                <p className="text-gray-700 dark:text-gray-400 flex items-center">
                  <FaListOl className="mr-2 text-gray-600 dark:text-gray-300" />
                  <strong className="mr-3">Number of Questions:</strong>{" "}
                  {test.numberOfQuestions}
                </p>
                <p className="text-gray-700 dark:text-gray-400 flex items-center">
                  <FaRegClock className="mr-2 text-gray-600 dark:text-gray-300" />
                  <strong className="mr-3">Duration:</strong>{" "}
                  {test.examDuration} minutes
                </p>
                <p className="text-gray-700 dark:text-gray-400 flex items-center">
                  <FaRegCalendarAlt className="mr-2 text-gray-600 dark:text-gray-300" />
                  <strong className="mr-3">Start Date:</strong>{" "}
                  {test.startDate
                    ? new Date(test.startDate).toLocaleString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                      })
                    : "No Start Date Set"}
                </p>
                <p className="text-gray-700 dark:text-gray-400 flex items-center">
                  <FaRegCalendarAlt className="mr-2 text-gray-600 dark:text-gray-300" />
                  <strong className="mr-3">End Date:</strong>{" "}
                  {test.endDate
                    ? new Date(test.endDate).toLocaleString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                      })
                    : "No End Date Set"}
                </p>
              </div>
            </div>
          ) : (
            <div className="p-6 rounded-lg bg-gray-100 dark:bg-gray-700 shadow-md text-center">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 flex justify-center items-center">
                <FaClipboardCheck className="mr-2 text-gray-600 dark:text-gray-400" />{" "}
                No Test Assigned
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mt-2">
                You currently do not have any assigned tests. Please check back
                later.
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CandidateResult;
