import { useState, useEffect } from "react";
import axios from "axios";
import { SUPER_DOMAIN } from "../../pages/admin/constant";

const useCandidateTestResult = (candidateId) => {
  const [test, setTest] = useState(null);
  const [submittedTest, setSubmittedTest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTestDetails = async () => {
      try {
        setLoading(true);
        axios.defaults.withCredentials = true;

        const testResponse = await axios.get(
          `${SUPER_DOMAIN}/${candidateId}/test`
        );

        if (testResponse.status === 200) {
          setTest(testResponse.data.test);

          const submissionResponse = await axios.get(
            `${SUPER_DOMAIN}/candidate/${candidateId}/submission/${testResponse.data.test._id}`
          );

          if (
            submissionResponse.status === 200 &&
            submissionResponse.data.submitted
          ) {
            setSubmittedTest(submissionResponse.data);
          }
        } else {
          setError("No assigned test found.");
        }
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Error fetching test. Please try again later."
        );
      } finally {
        setLoading(false);
      }
    };

    if (candidateId) {
      fetchTestDetails();
    }
  }, [candidateId]);

  return { test, submittedTest, loading, error };
};

export default useCandidateTestResult;
