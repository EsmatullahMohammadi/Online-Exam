import { useEffect, useState } from "react";
import axios from "axios";
import CardDataStats from "../../../components/CardDataStats";
import {
  FaBook,
  FaChalkboardTeacher,
  FaClipboardList,
  FaUserGraduate,
} from "react-icons/fa";
import { SUPER_DOMAIN } from "../constant";

const Dashbord = () => {
  const [counts, setCounts] = useState({
    tests: 0,
    lecturers: 0,
    candidates: 0,
    questions: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  axios.defaults.withCredentials = true;
  useEffect(() => {
    const fetchCounts = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${SUPER_DOMAIN}/counts`, {
          headers: { "Content-Type": "application/json" },
        });
        if (res.data) {
          setCounts(res.data);
        }
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCounts();
  }, []);

  return (
    <>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
        <CardDataStats title="All Test" total={counts.tests} routCard={"tests"}>
          <FaClipboardList className="text-primary dark:text-white" size={22} />
        </CardDataStats>
        <CardDataStats
          title="All Lecturer"
          total={counts.lecturers}
          routCard={"lecturer"}
        >
          <FaChalkboardTeacher
            className="text-primary dark:text-white"
            size={22}
          />
        </CardDataStats>
        <CardDataStats
          title="All Candidate"
          total={counts.candidates}
          routCard={"condidate"}
        >
          <FaUserGraduate className="text-primary dark:text-white" size={22} />
        </CardDataStats>
        <CardDataStats
          title="Question Bank"
          total={counts.questions}
          routCard={"question-bank"}
        >
          <FaBook className="text-primary dark:text-white" size={22} />
        </CardDataStats>
      </div>

      <div className="mt-6 rounded-xl bg-white p-6 shadow-md dark:bg-boxdark">
        {loading ? (
          <p className="text-gray-600 dark:text-gray-300">Loading...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
              Welcome, Admin 👋
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              This dashboard provides a quick overview of the examination
              system. Here you can:
            </p>
            <ul className="mt-3 list-disc pl-6 text-gray-600 dark:text-gray-300">
              <li>
                Monitor the total number of <strong>tests</strong> being
                conducted.
              </li>
              <li>
                View and manage all <strong>lecturers</strong> registered in the
                system.
              </li>
              <li>
                Track the number of <strong>candidates</strong> participating in
                exams.
              </li>
              <li>
                Access the <strong>question bank</strong> for future exams.
              </li>
              <li>
                Review and analyze <strong>results</strong> to track performance
                and progress.
              </li>
            </ul>
            <p className="mt-3 text-gray-600 dark:text-gray-300">
              Use the cards above to navigate directly to each section. This
              helps you manage exams efficiently, track outcomes, and ensure
              smooth operation of the system. Keeping an eye on the results
              section also allows you to evaluate candidate performance and
              identify areas where improvements may be needed.
            </p>
          </>
        )}
      </div>
    </>
  );
};

export default Dashbord;
