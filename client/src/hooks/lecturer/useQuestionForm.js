import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { SUPER_DOMAIN } from "../../pages/admin/constant";

export const useQuestionForm = () => {
  const [optionCount, setOptionCount] = useState(2);
  const [loading, setLoading] = useState(false);
  const category = sessionStorage.getItem("category");
  const lecturerId = sessionStorage.getItem("lecturerID");
  const [questions, setQuestions] = useState([
    {
      questionText: "",
      options:
        category === "Listening"
          ? Array(optionCount).fill("")
          : ["", "", "", ""],
      correctAnswer: "",
      touched: {
        questionText: false,
        options:
          category === "Listening"
            ? Array(optionCount).fill(false)
            : [false, false, false, false],
        correctAnswer: false,
      },
    },
  ]);

  axios.defaults.withCredentials = true;

  const questionSchema = Yup.object().shape({
    questionText: Yup.string().required("Question text is required"),
    options: Yup.array()
      .of(Yup.string().required("Option cannot be empty"))
      .test(
        "options-length",
        category === "Listening"
          ? `Listening questions must have ${optionCount} options`
          : "Questions must have exactly 4 options",
        (options) => {
          const relevantOptions =
            category === "Listening"
              ? options.slice(0, optionCount)
              : options.slice(0, 4);
          return relevantOptions.every((opt) => opt.trim() !== "");
        }
      ),
    correctAnswer: Yup.string()
      .required("Correct answer is required")
      .test(
        "correct-answer-in-options",
        "Correct answer must be one of the options",
        function (value) {
          const validOptions =
            category === "Listening"
              ? this.parent.options.slice(0, optionCount)
              : this.parent.options.slice(0, 4);
          return validOptions.includes(value);
        }
      ),
  });

  const handleOptionCountChange = (count) => {
    setOptionCount(count);
    const updatedQuestions = questions.map((q) => ({
      ...q,
      options: Array(count)
        .fill("")
        .map((_, i) => q.options[i] || ""),
      touched: {
        ...q.touched,
        options: Array(count)
          .fill(false)
          .map((_, i) => q.touched.options[i] || false),
      },
    }));
    setQuestions(updatedQuestions);
  };

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
              .test("fileType", "Only audio files are accepted", (value) => {
                if (!value) return false;
                return value instanceof File && value.type.startsWith("audio/");
              })
          : Yup.mixed().notRequired(),
    }),
    onSubmit: async (values, { resetForm }) => {
      setLoading(true);

      try {
        let hasErrors = false;
        const validatedQuestions = questions.map((q) => {
          try {
            questionSchema.validateSync(q, { abortEarly: false });
            return {
              questionText: q.questionText,
              options: q.options,
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

        try {
          await formik.validateForm();
        } catch (err) {
          console.error("Form validation errors:", err);
          alert("Please fill all required fields");
          setLoading(false);
          return;
        }

        const payload = new FormData();
        payload.append("category", category);

        if (category === "Reading") {
          payload.append("passage", values.passage);
        }
        if (category === "Listening") {
          payload.append("listeningFile", values.listeningFile);
        }

        payload.append("questions", JSON.stringify(validatedQuestions));

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
              options:
                category === "Listening"
                  ? Array(optionCount).fill("")
                  : ["", "", "", ""],
              correctAnswer: "",
              touched: {
                questionText: false,
                options:
                  category === "Listening"
                    ? Array(optionCount).fill(false)
                    : [false, false, false, false],
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
        options:
          category === "Listening"
            ? Array(optionCount).fill("")
            : ["", "", "", ""],
        correctAnswer: "",
        touched: {
          questionText: false,
          options:
            category === "Listening"
              ? Array(optionCount).fill(false)
              : [false, false, false, false],
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
      const questionToValidate =
        category === "Listening"
          ? {
              ...question,
              options: question.options.slice(0, optionCount),
              correctAnswer: question.correctAnswer,
            }
          : question;

      questionSchema.validateSync(questionToValidate, { abortEarly: false });
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

  return {
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
  };
};
