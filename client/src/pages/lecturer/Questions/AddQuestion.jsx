/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import axios from "axios";
import { useFormik } from "formik";
import * as Yup from "yup";
import { SUPER_DOMAIN } from "../../admin/constant";
import LBreadcrumb from "../../../components/Breadcrumbs/LBreadcrumb";

const AddQuestion = () => {
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState([
    {
      questionText: "",
      options: ["", "", "", ""],
      correctAnswer: "",
      touched: {
        questionText: false,
        options: [false, false, false, false],
        correctAnswer: false,
      },
    },
  ]);

  const category = sessionStorage.getItem("category");
  const lecturerId = sessionStorage.getItem("lecturerID");
  axios.defaults.withCredentials = true;

  // Validation schema for individual questions
  const questionSchema = Yup.object().shape({
    questionText: Yup.string().required("Question text is required"),
    options: Yup.array()
      .of(Yup.string().required("Option cannot be empty"))
      .test(
        "options-length",
        category === "Listening"
          ? "Listening questions must have 2 or 4 options"
          : "Questions must have exactly 4 options",
        (options) => {
          const filledOptions = options.filter((opt) => opt.trim() !== "");
          if (category === "Listening") {
            return filledOptions.length === 2 || filledOptions.length === 4;
          }
          return filledOptions.length === 4;
        }
      ),
    correctAnswer: Yup.string()
      .required("Correct answer is required")
      .test(
        "correct-answer-in-options",
        "Correct answer must be one of the options",
        function (value) {
          return this.parent.options.includes(value);
        }
      ),
  });

  const formik = useFormik({
    initialValues: {
      passage: "",
      listeningFile: null,
    },
    validationSchema: Yup.object({
      passage:
        category === "Reading"
          ? Yup.string().required("Passage is required")
          : Yup.string().notRequired(),
      listeningFile:
        category === "Listening"
          ? Yup.mixed()
              .required("Audio file is required")
              .test(
                "fileType",
                "Only audio files are accepted",
                (value) => value && value instanceof File
              )
          : Yup.mixed().notRequired(),
    }),
    onSubmit: async (values, { resetForm }) => {
      setLoading(true);

      try {
        // Validate all questions first
        let hasErrors = false;
        const validatedQuestions = questions.map((q) => {
          try {
            questionSchema.validateSync(q, { abortEarly: false });
            return {
              questionText: q.questionText,
              options: q.options, // Send all options (backend will filter)
              correctAnswer: q.correctAnswer,
            };
          } catch (err) {
            hasErrors = true;
            console.error("Validation errors:", err.errors);
            return null;
          }
        });

        if (hasErrors || validatedQuestions.some((q) => q === null)) {
          alert("Please fix all validation errors before submitting");
          setLoading(false);
          return;
        }

        // Validate main form fields
        try {
          await formik.validateForm();
        } catch (err) {
          console.error("Form validation errors:", err);
          alert("Please fill all required fields");
          setLoading(false);
          return;
        }

        // Create FormData payload
        const payload = new FormData();
        payload.append("category", category);

        if (category === "Reading") {
          payload.append("passage", values.passage);
        }
        if (category === "Listening") {
          payload.append("listeningFile", values.listeningFile);
        }

        // Stringify questions and append
        payload.append("questions", JSON.stringify(validatedQuestions));

        // Send to backend
        const response = await axios.post(
          `${SUPER_DOMAIN}/add-question/${lecturerId}`,
          payload,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
            withCredentials: true,
          }
        );

        if (response.status === 201) {
          alert(response.data.message);
          resetForm();
          setQuestions([
            {
              questionText: "",
              options: ["", "", "", ""],
              correctAnswer: "",
              touched: {
                questionText: false,
                options: [false, false, false, false],
                correctAnswer: false,
              },
            },
          ]);
        } else {
          alert("Something went wrong!");
        }
      } catch (error) {
        console.error("Error submitting question:", error);
        if (error.response) {
          alert(
            error.response.data?.message || "Server Error! Please try again."
          );
        } else {
          alert(error.message || "Network Error! Please try again.");
        }
      } finally {
        setLoading(false);
      }
    },
  });

  // ... (keep all your existing helper functions unchanged)
  const handleQuestionChange = (index, field, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index][field] = value;
    updatedQuestions[index].touched[field] = true;
    setQuestions(updatedQuestions);
  };

  const handleOptionChange = (qIndex, optIndex, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[qIndex].options[optIndex] = value;
    updatedQuestions[qIndex].touched.options[optIndex] = true;

    if (
      value.trim() === "" &&
      updatedQuestions[qIndex].correctAnswer === value
    ) {
      updatedQuestions[qIndex].correctAnswer = "";
      updatedQuestions[qIndex].touched.correctAnswer = true;
    }

    setQuestions(updatedQuestions);
  };

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        questionText: "",
        options: ["", "", "", ""],
        correctAnswer: "",
        touched: {
          questionText: false,
          options: [false, false, false, false],
          correctAnswer: false,
        },
      },
    ]);
  };

  const removeQuestion = (index) => {
    if (questions.length > 1) {
      const updatedQuestions = [...questions];
      updatedQuestions.splice(index, 1);
      setQuestions(updatedQuestions);
    }
  };

  const validateQuestion = (question) => {
    try {
      questionSchema.validateSync(question, { abortEarly: false });
      return {};
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        return err.inner.reduce((acc, curr) => {
          return { ...acc, [curr.path]: curr.message };
        }, {});
      }
      return {};
    }
  };

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
          {/* Passage for Reading */}
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
                  formik.setFieldTouched("listeningFile", true);
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
                <div className="mt-2 text-sm text-green-500">
                  Selected: {formik.values.listeningFile.name}
                </div>
              )}
            </div>
          )}

          {/* Questions List */}
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

                  {/* Question Text */}
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

                  {/* Options */}
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
                      {q.options.map((option, optIndex) => (
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

                  {/* Correct Answer */}
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

          {/* Submit Button */}
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
