import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { SUPER_DOMAIN } from "../../../pages/admin/constant";

export const useQuestionSelection = () => {
  const { testName } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const { testId, numberOfQuestion } = state || {};

  const [questions, setQuestions] = useState([]);
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [filterType, setFilterType] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  axios.defaults.withCredentials = true;

  const fetchQuestions = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${SUPER_DOMAIN}/questions`);

      if (response.status === 200) {
        const data = response.data.data || response.data;
        const formattedQuestions = Array.isArray(data)
          ? data.flatMap((questionSet) =>
              (questionSet.questions || []).map((question) => ({
                ...question,
                category: questionSet.category,
                passage: questionSet.passage,
                listeningFile: questionSet.listeningFile,
              }))
            )
          : [];

        setQuestions(formattedQuestions);
        setError(
          formattedQuestions.length === 0 ? "No questions found." : null
        );
      }
    } catch (error) {
      console.error("Error fetching questions:", error);
      setError(error.response?.data?.message || "Failed to fetch questions");
      setQuestions([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!testId || !numberOfQuestion) {
      setError("Missing test information. Please go back and try again.");
      return;
    }
    fetchQuestions();
  }, [testId, numberOfQuestion, fetchQuestions]);

  const handleSelectQuestion = useCallback((questionId) => {
    if (!questionId) return;

    setSelectedQuestions((prevSelected) =>
      prevSelected.includes(questionId)
        ? prevSelected.filter((id) => id !== questionId)
        : [...prevSelected, questionId]
    );
  }, []);

  const handleSubmit = useCallback(async () => {
    if (selectedQuestions.length === 0) {
      alert("Please select at least one question.");
      return;
    }
    try {
      const response = await axios.post(`${SUPER_DOMAIN}/assign-questions`, {
        testId,
        questionIds: selectedQuestions,
      });
      if (response.status === 200) {
        alert(response.data.message || "Questions assigned successfully!");
        navigate(-1);
      }
    } catch (error) {
      console.error("Assignment error:", error);
      alert(
        error.response?.data?.message ||
          "Failed to assign questions. Please try again."
      );
    }
  }, [testId, selectedQuestions, navigate]);

  const handleAssignRandomQuestions = useCallback(async () => {
    if (!questions || questions.length === 0) {
      alert("No questions available to assign.");
      return;
    }

    if (questions.length < numberOfQuestion) {
      alert(
        `Not enough questions available (${questions.length}) to assign ${numberOfQuestion}.`
      );
      return;
    }

    try {
      const groupedSets = {
        Reading: [],
        Listening: [],
        Writing: [],
        Grammar: [],
      };

      // Step 1: Group questions by category and keep track of which question set they came from
      for (const q of questions) {
        if (!q || !q.category) continue;
        groupedSets[q.category].push(q);
      }

      // Step 2: Calculate equal division
      const categories = ["Reading", "Listening", "Writing", "Grammar"];
      const basePerCategory = Math.floor(numberOfQuestion / 4);
      let extra = numberOfQuestion % 4;

      const selectedQuestions = [];

      for (const category of categories) {
        const targetCount = basePerCategory + (extra > 0 ? 1 : 0);
        extra--;

        const candidates = groupedSets[category];
        if (!candidates || candidates.length === 0) continue;

        if (category === "Reading" || category === "Listening") {
          // Group by passage or listeningFile
          const groupKey = category === "Reading" ? "passage" : "listeningFile";
          const groupedMap = {};

          for (const q of candidates) {
            const key = q[groupKey];
            if (!key) continue;
            if (!groupedMap[key]) groupedMap[key] = [];
            groupedMap[key].push(q);
          }

          const groupedSetsArr = Object.values(groupedMap).sort(
            () => Math.random() - 0.5
          );

          let collected = 0;
          for (const set of groupedSetsArr) {
            if (collected >= targetCount) break;
            if (collected + set.length <= targetCount) {
              selectedQuestions.push(...set);
              collected += set.length;
            }
          }
        } else {
          // Writing and Grammar: choose individual questions
          const shuffled = [...candidates].sort(() => Math.random() - 0.5);
          selectedQuestions.push(...shuffled.slice(0, targetCount));
        }
      }

      // Final adjustment if selected count doesn't meet exact requirement
      let remaining = numberOfQuestion - selectedQuestions.length;
      if (remaining > 0) {
        const unused = questions
          .filter((q) => !selectedQuestions.some((sel) => sel._id === q._id))
          .sort(() => Math.random() - 0.5);

        for (const q of unused) {
          if (selectedQuestions.length >= numberOfQuestion) break;
          selectedQuestions.push(q);
        }
      }

      if (selectedQuestions.length !== numberOfQuestion) {
        alert(
          `Only assigned ${selectedQuestions.length} of ${numberOfQuestion} required questions.`
        );
        return;
      }

      const selectedIds = selectedQuestions.map((q) => q._id).filter(Boolean);
      const response = await axios.post(`${SUPER_DOMAIN}/assign-questions`, {
        testId,
        questionIds: selectedIds,
      });

      if (response.status === 200) {
        alert(
          response.data.message || "Random questions assigned successfully!"
        );
        setSelectedQuestions(selectedIds);
        navigate(-1);
      }
    } catch (error) {
      console.error("Random assignment error:", error);
      alert(
        error.response?.data?.message ||
          "Failed to assign random questions. Please try again."
      );
    }
  }, [questions, numberOfQuestion, testId, navigate]);

  const filteredQuestions = questions.filter((q) => {
    if (!q) return false;
    return filterType === "all" || q.category === filterType;
  });

  const totalPages = Math.ceil(filteredQuestions.length / itemsPerPage);
  const paginatedQuestions = filteredQuestions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return {
    testName,
    loading,
    error,
    paginatedQuestions,
    selectedQuestions,
    filterType,
    currentPage,
    itemsPerPage,
    totalPages,
    numberOfQuestion,
    testId,
    questions,
    filteredQuestions,
    handleSelectQuestion,
    handleSubmit,
    handleAssignRandomQuestions,
    setFilterType,
    setCurrentPage,
    setItemsPerPage,
  };
};
