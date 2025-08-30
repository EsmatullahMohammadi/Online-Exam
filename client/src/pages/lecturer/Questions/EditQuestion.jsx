import LBreadcrumb from "../../../components/Breadcrumbs/LBreadcrumb";
import { useLocation, useNavigate } from "react-router-dom";
import { useEditQuestion } from "../../../hooks/lecturer/useEditQuestion";

const EditQuestion = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { questionSetId, questionIndex, question } = location.state;

  const {
    questionText,
    setQuestionText,
    options,
    handleOptionChange,
    correctAnswer,
    setCorrectAnswer,
    handleSave,
    loading,
    error,
    setError,
  } = useEditQuestion({
    questionSetId,
    questionIndex,
    initialQuestion: question,
  });

  const handleSubmit = async () => {
    const result = await handleSave();
    if (result.success) {
      alert("Question updated successfully!");
      navigate("/lecturer/questions");
    } else {
      setError(result.message || "Failed to update question");
    }
  };

  return (
    <>
      <LBreadcrumb pageName="Edit Question" />
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark p-6.5">
        <h3 className="font-medium text-black dark:text-white mb-6">
          Editing question in {question.category} category
        </h3>

        {error && <p className="mb-4 text-red-500">{error}</p>}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6.5">
          {/* Question Text */}
          <div className="col-span-2 mb-4">
            <label className="mb-2 block text-black dark:text-white">
              Question Text
            </label>
            <input
              type="text"
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
              placeholder="Enter question text"
              className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
            />
          </div>

          {/* Options */}
          <div className="col-span-2 mb-4">
            <label className="mb-2 block text-black dark:text-white">
              Options
            </label>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {options.map((opt, idx) => (
                <div key={idx}>
                  <input
                    type="text"
                    value={opt}
                    onChange={(e) => handleOptionChange(idx, e.target.value)}
                    placeholder={`Option ${idx + 1}`}
                    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Correct Answer */}
          <div className="col-span-2 mb-4">
            <label className="mb-2 block text-black dark:text-white">
              Correct Answer
            </label>
            <select
              value={correctAnswer}
              onChange={(e) => setCorrectAnswer(e.target.value)}
              className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
            >
              <option value="">Select correct answer</option>
              {options.map((opt, idx) => (
                <option key={idx} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>

          {/* Save Button */}
          <div className="col-span-2">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="inline-flex items-center justify-center gap-2.5 rounded-md bg-primary py-3 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10 w-full"
            >
              {loading ? "Saving..." : "Save Question"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditQuestion;
