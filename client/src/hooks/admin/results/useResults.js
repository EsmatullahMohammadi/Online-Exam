/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import axios from "axios";
import { SUPER_DOMAIN } from "../../../pages/admin/constant";
import { useSearchParams } from "react-router-dom";

const useResults = () => {
  const { searchValue } = useSearchParams();
  const [results, setResults] = useState([]);
  const [filteredResults, setFilteredResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTest, setSelectedTest] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  axios.defaults.withCredentials = true;

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await axios.get(`${SUPER_DOMAIN}/results`, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        setResults(response.data);
        setFilteredResults(response.data);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch results.");
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, []);

  useEffect(() => {
    let filtered = results;

    if (selectedTest) {
      filtered = filtered.filter(
        (result) => result.testId?.title === selectedTest
      );
    }

    if (selectedStatus) {
      filtered = filtered.filter((result) => result.status === selectedStatus);
    }

    if (searchValue) {
      const lower = searchValue.toLowerCase();
      filtered = filtered.filter(
        (result) =>
          result.candidateId?.name?.toLowerCase().includes(lower) ||
          result.testId?.title?.toLowerCase().includes(lower)
      );
    }

    setFilteredResults(filtered);
    setCurrentPage(1);
  }, [searchValue, selectedTest, selectedStatus, results]);

  const testTitles = [
    ...new Set(results.map((r) => r.testId?.title).filter(Boolean)),
  ];

  const totalPages = Math.ceil(filteredResults.length / itemsPerPage);
  const paginatedResults = filteredResults.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return {
    loading,
    error,
    selectedTest,
    setSelectedTest,
    selectedStatus,
    setSelectedStatus,
    filteredResults,
    paginatedResults,
    testTitles,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    setItemsPerPage,
  };
};

export default useResults;
