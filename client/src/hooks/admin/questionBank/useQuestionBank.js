import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useSearch } from "../../../context/SearchContext";
import { SUPER_DOMAIN } from "../../../pages/admin/constant";

const useQuestionBank = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterType, setFilterType] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

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
    fetchQuestions();
  }, [fetchQuestions]);

  const { searchValue } = useSearch();
  const filteredQuestions = questions.filter((question) => {
    const safeQuestion = question.questionText || "";
    const safeCategory = question.category || "";

    const matchesType = filterType === "all" || safeCategory === filterType;

    const matchesSearch =
      !searchValue ||
      safeQuestion.toLowerCase().includes(searchValue.toLowerCase()) ||
      safeCategory.toLowerCase().includes(searchValue.toLowerCase());

    return matchesType && matchesSearch;
  });

  useEffect(() => {
    setCurrentPage(1);
  }, [filterType, searchValue]);

  const totalPages = Math.ceil(filteredQuestions.length / itemsPerPage);
  const paginatedQuestions = filteredQuestions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return {
    questions,
    loading,
    error,
    filterType,
    setFilterType,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    setItemsPerPage,
    filteredQuestions,
    totalPages,
    paginatedQuestions,
    fetchQuestions,
  };
};

export default useQuestionBank;
