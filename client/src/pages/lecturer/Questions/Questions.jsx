import { Link } from "react-router-dom";
import { MdAdd } from "react-icons/md";
import LBreadcrumb from "../../../components/Breadcrumbs/LBreadcrumb";
import useQuestions from "../../../hooks/lecturer/useQuestions";

const Questions = () => {
  const lecturerId = sessionStorage.getItem("lecturerID");
  const { questions, loading, error } = useQuestions(lecturerId);

  return (
    <>
      <LBreadcrumb pageName="Questions" />
      <div>
        <Link
          to="/lecturer/add-questions"
          className="inline-flex items-center justify-center gap-2.5 rounded-sm bg-primary py-3 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10 mb-3"
        >
          <MdAdd className="text-2xl" />
          Add Question
        </Link>
      </div>
      <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
        <div className="max-w-full overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-300 text-left dark:bg-meta-4">
                <th className="min-w-[220px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
                  Question
                </th>
                <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                  Options
                </th>
                <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                  Correct Answer
                </th>
                <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                  Category
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="4" className="text-center py-3">
                    Loading...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan="4" className="text-center py-3 text-red-500">
                    {error}
                  </td>
                </tr>
              ) : questions.length > 0 ? (
                questions.map((question, key) => (
                  <tr key={key}>
                    <td className="border-b border-[#eee] py-3 px-4 pl-9 dark:border-strokedark xl:pl-11">
                      <h5 className="font-medium text-black dark:text-white">
                        {question.questionText}
                      </h5>
                      {question.passage && (
                        <p className="text-xs text-gray-500 mt-1 line-clamp-1">
                          {question.passage.substring(0, 50)}...
                        </p>
                      )}
                    </td>
                    <td className="border-b border-[#eee] py-3 px-4 dark:border-strokedark">
                      <ul className="list-disc pl-5">
                        {question.options.map((option, index) => (
                          <li key={index} className="border-b">
                            {option}
                          </li>
                        ))}
                      </ul>
                    </td>
                    <td className="border-b border-[#eee] py-3 px-4 dark:border-strokedark font-semibold text-green-600 dark:text-green-400">
                      {question.correctAnswer}
                    </td>
                    <td className="border-b border-[#eee] py-3 px-4 dark:border-strokedark font-medium text-blue-600 dark:text-blue-400">
                      {question.category}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center py-3">
                    No questions found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default Questions;
