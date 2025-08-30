import { useState } from "react";
import axios from "axios";
import { SUPER_DOMAIN } from "../../pages/admin/constant";

export const useEditQuestion = ({
  questionSetId,
  questionIndex,
  initialQuestion,
}) => {
  const [questionText, setQuestionText] = useState(
    initialQuestion.questionText
  );
  const [options, setOptions] = useState([...initialQuestion.options]);
  const [correctAnswer, setCorrectAnswer] = useState(
    initialQuestion.correctAnswer
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  axios.defaults.withCredentials = true;

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleSave = async () => {
    setLoading(true);
    setError("");

    if (!questionText.trim()) {
      setError("Question text is required");
      setLoading(false);
      return { success: false };
    }
    if (options.some((opt) => !opt.trim())) {
      setError("All options must be filled");
      setLoading(false);
      return { success: false };
    }
    if (!correctAnswer) {
      setError("Correct answer must be selected");
      setLoading(false);
      return { success: false };
    }
    if (!options.includes(correctAnswer)) {
      setError("Correct answer must be one of the options");
      setLoading(false);
      return { success: false };
    }

    try {
      const res = await axios.put(
        `${SUPER_DOMAIN}/edit-single-question/${questionSetId}`,
        {
          questionIndex,
          questionText: questionText.trim(),
          options: options.map((o) => o.trim()),
          correctAnswer: correctAnswer.trim(),
        },
        { withCredentials: true }
      );

      if (res.status === 200) {
        return { success: true, data: res.data.data };
      } else {
        return { success: false, message: res.data.message || "Update failed" };
      }
    } catch (err) {
      console.error("Edit question error:", err);
      return {
        success: false,
        message: err.response?.data?.message || err.message || "Server error",
      };
    } finally {
      setLoading(false);
    }
  };

  return {
    questionText,
    setQuestionText,
    options,
    setOptions,
    correctAnswer,
    setCorrectAnswer,
    handleOptionChange,
    handleSave,
    loading,
    error,
    setError,
  };
};
