import LBreadcrumb from "../../../components/Breadcrumbs/LBreadcrumb";
import { useQuestionForm } from "../../../hooks/lecturer/useQuestionForm";

const AddQuestion = () => {
  const {
    loading,
    questions,
    category,
    formik,
    optionCount,
    handleQuestionChange,
    handleOptionChange,
    addQuestion,
    removeQuestion,
    validateQuestion,
    handleOptionCountChange,
  } = useQuestionForm();

  return (
    <>
      <LBreadcrumb pageName="Add Question" />
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
          <h3 className="font-medium text-black dark:text-white">
            You are in {category} Category.{" "}
            {category === "Reading"
              ? "Add a passage with questions"
              : category === "Listening"
                ? "Add a listening file with questions"
                : "Add a question"}
          </h3>
        </div>
        <form
          onSubmit={formik.handleSubmit}
          className="grid grid-cols-1 sm:grid-cols-2 gap-6.5 p-6.5"
        >
          {category === "Reading" && (
            <div className="col-span-2">
              <label className="mb-3 block text-black dark:text-white">
                Passage
              </label>
              <textarea
                name="passage"
                value={formik.values.passage}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter the passage"
                rows="6"
                className={`w-full rounded-lg border-[1.5px] ${
                  formik.touched.passage && formik.errors.passage
                    ? "border-red-500"
                    : "border-stroke"
                } bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary`}
              ></textarea>
              {formik.touched.passage && formik.errors.passage && (
                <span className="text-red-500 text-sm">
                  {formik.errors.passage}
                </span>
              )}
            </div>
          )}

          {category === "Listening" && (
            <div className="col-span-2">
              <label className="mb-3 block text-black dark:text-white">
                Upload Listening File (MP3, WAV, etc.)
              </label>
              <input
                type="file"
                accept="audio/*"
                onChange={(event) => {
                  const file = event.currentTarget.files[0];
                  formik.setFieldValue("listeningFile", file || null);
                  formik.setFieldTouched("listeningFile", true, false); 
                }}
                className={`w-full rounded-lg border-[1.5px] ${
                  formik.touched.listeningFile && formik.errors.listeningFile
                    ? "border-red-500"
                    : "border-stroke"
                } bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary`}
              />
              {formik.touched.listeningFile && formik.errors.listeningFile && (
                <span className="text-red-500 text-sm">
                  {formik.errors.listeningFile}
                </span>
              )}
              {formik.values.listeningFile && (
                <div className="mt-2 text-sm text-green-700">
                  Selected: {formik.values.listeningFile.name}
                </div>
              )}
            </div>
          )}

          <div className="col-span-2">
            <h3 className="mb-4 font-medium text-black dark:text-white">
              Questions
            </h3>
            {questions.map((q, qIndex) => {
              const errors = validateQuestion(q);
              const hasErrors = Object.keys(errors).length > 0;
              return (
                <div
                  key={qIndex}
                  id={`question-${qIndex}`}
                  className={`mb-8 p-4 border rounded-lg ${
                    hasErrors
                      ? "border-red-500"
                      : "border-stroke dark:border-strokedark"
                  }`}
                >
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-medium text-black dark:text-white">
                      Question {qIndex + 1}
                    </h4>
                    {questions.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeQuestion(qIndex)}
                        className="text-red-500 hover:text-red-700"
                      >
                        Remove
                      </button>
                    )}
                  </div>

                  <div className="mb-4">
                    <label className="mb-2 block text-black dark:text-white">
                      Question Text
                    </label>
                    <input
                      type="text"
                      value={q.questionText}
                      onChange={(e) =>
                        handleQuestionChange(
                          qIndex,
                          "questionText",
                          e.target.value
                        )
                      }
                      onBlur={() =>
                        handleQuestionChange(
                          qIndex,
                          "questionText",
                          q.questionText
                        )
                      }
                      placeholder="Enter question text"
                      className={`w-full rounded-lg border-[1.5px] ${
                        q.touched.questionText && errors.questionText
                          ? "border-red-500"
                          : "border-stroke"
                      } bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary`}
                    />
                    {q.touched.questionText && errors.questionText && (
                      <span className="text-red-500 text-sm">
                        {errors.questionText}
                      </span>
                    )}
                  </div>
                  {category === "Listening" && (
                    <div className="col-span-2">
                      <label className="mb-3 block text-black dark:text-white">
                        Number of Options
                      </label>
                      <select
                        value={optionCount}
                        onChange={(e) =>
                          handleOptionCountChange(Number(e.target.value))
                        }
                        className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                      >
                        <option value={2}>2 Options</option>
                        <option value={4}>4 Options</option>
                      </select>
                    </div>
                  )}
                  <div className="mb-4">
                    <label className="mb-2 block text-black dark:text-white">
                      Options
                    </label>
                    {q.touched.options && errors.options && (
                      <span className="text-red-500 text-sm block mb-2">
                        {errors.options}
                      </span>
                    )}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      {q.options
                        .slice(0, category === "Listening" ? optionCount : 4)
                        .map((option, optIndex) => (
                          <div key={optIndex}>
                            <input
                              type="text"
                              value={option}
                              onChange={(e) =>
                                handleOptionChange(
                                  qIndex,
                                  optIndex,
                                  e.target.value
                                )
                              }
                              onBlur={() =>
                                handleOptionChange(qIndex, optIndex, option)
                              }
                              placeholder={`Option ${optIndex + 1}`}
                              className={`w-full rounded-lg border-[1.5px] ${
                                q.touched.options[optIndex] && !option.trim()
                                  ? "border-red-500"
                                  : "border-stroke"
                              } bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary`}
                            />
                            {q.touched.options[optIndex] && !option.trim() && (
                              <span className="text-red-500 text-sm">
                                Option cannot be empty
                              </span>
                            )}
                          </div>
                        ))}
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-black dark:text-white">
                      Correct Answer
                    </label>
                    <select
                      value={q.correctAnswer}
                      onChange={(e) =>
                        handleQuestionChange(
                          qIndex,
                          "correctAnswer",
                          e.target.value
                        )
                      }
                      onBlur={() =>
                        handleQuestionChange(
                          qIndex,
                          "correctAnswer",
                          q.correctAnswer
                        )
                      }
                      className={`w-full rounded-lg border-[1.5px] ${
                        q.touched.correctAnswer && errors.correctAnswer
                          ? "border-red-500"
                          : "border-stroke"
                      } bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary`}
                    >
                      <option value="">Select correct answer</option>
                      {q.options
                        .filter((opt) => opt.trim() !== "")
                        .map((option, optIndex) => (
                          <option key={optIndex} value={option}>
                            {option}
                          </option>
                        ))}
                    </select>
                    {q.touched.correctAnswer && errors.correctAnswer && (
                      <span className="text-red-500 text-sm">
                        {errors.correctAnswer}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}

            <button
              type="button"
              onClick={addQuestion}
              className="mt-2 inline-flex items-center justify-center gap-2.5 rounded-md bg-secondary py-2 px-4 text-center font-medium text-white hover:bg-opacity-90"
            >
              Add Another Question
            </button>
          </div>

          <div className="col-span-2">
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2.5 rounded-md bg-primary py-3 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10 w-full"
              disabled={loading}
            >
              {loading ? "Saving..." : "Save Questions"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default AddQuestion;
