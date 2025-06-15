import { useState, useEffect } from "react";
import axios from "axios";
import { SUPER_DOMAIN } from "../../pages/admin/constant";

const useQuestions = (lecturerId) => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${SUPER_DOMAIN}/all-questions/${lecturerId}`,
          {
            headers: { "Content-Type": "application/json" },
          }
        );

        const formattedQuestions = response.data.data.flatMap((questionSet) =>
          questionSet.questions.map((question) => ({
            ...question,
            category: questionSet.category,
            passage: questionSet.passage,
            listeningFile: questionSet.listeningFile,
          }))
        );

        setQuestions(formattedQuestions);
        setError(
          formattedQuestions.length === 0 ? "No questions found." : null
        );
      } catch (err) {
        setError(err.response?.data?.message || "Error fetching questions.");
        setQuestions([]);
      } finally {
        setLoading(false);
      }
    };

    if (lecturerId) {
      fetchQuestions();
    } else {
      setError("No lecturer ID found.");
      setLoading(false);
    }
  }, [lecturerId]);

  return { questions, loading, error };
};

export default useQuestions;
