import { useState, useEffect } from 'react';
import Breadcrumb from '../../../components/Breadcrumbs/Breadcrumb';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { SUPER_DOMAIN } from '../constant';
import TestDetailModel from './ViewTestDetails';
import { MdAdd, MdDelete, MdEdit,  MdQuiz, MdVisibility } from 'react-icons/md';
import Pagination from '../../../components/Pagination';

function Test() {
  const [testData, setTestData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isOpenModel, setIsOpenModel] = useState(false);
  const handleCloseModal = () => setIsOpenModel(false);
  const [testID, setTestID] = useState();

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5); 
 
  axios.defaults.withCredentials = true;

  useEffect(() => {
    async function fetchTests() {
      try {
        setLoading(true);
        const response = await axios.get(`${SUPER_DOMAIN}/all-tests`, {
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.data && response.data.tests) {
          setTestData(response.data.tests); // Accessing `tests` property from the response
        } else {
          setError('No tests found.');
        }
      } catch (err) {
        setError(err.response?.data?.message || err.message); // Handle errors properly
      } finally {
        setLoading(false);
      }
    }

    fetchTests();
  }, []);

  const deleteTest = async (testID) => {
    try {
      const confirmDelete = window.confirm('Are you sure you want to delete this test?');
      if (!confirmDelete) return; // If the user cancels the delete, exit

      // Send DELETE request to the backend
      const response = await axios.delete(`${SUPER_DOMAIN}/tests/${testID}`);
      console.log(response.data.message); // Optionally log the success message

      // Remove the deleted test from the state
      setTestData((prevTests) => prevTests.filter((test) => test._id !== testID));
      alert('Test deleted successfully!');
    } catch (err) {
      alert('Failed to delete test.', err.message);
    }
  };
  
  // pagination concept
  const totalPages = Math.ceil(testData.length / itemsPerPage);
  const paginatedtestData = testData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <>
      <Breadcrumb pageName="Tests" />
      <div>
        <Link
          to="/admin/addTest"
          className="inline-flex items-center justify-center gap-2.5 rounded-sm bg-primary py-3 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10 mb-3"
        >
          <span>
            <MdAdd className="text-2xl" />
          </span>
          Add test
        </Link>
      </div>
      <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
        <div className="max-w-full overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-300 text-left dark:bg-meta-4">
                <th className=" py-4 px-4 font-medium text-black dark:text-white">#</th>
                <th className="min-w-[220px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
                  Title/Name
                </th>
                <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                  Exam Date
                </th>
                <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                  Status
                </th>
                <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                  Test Question
                </th>
                <th className="py-4 px-4 font-medium text-black dark:text-white">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="4" className="text-center py-3">
                    Loading...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan="4" className="text-center py-3 text-red-500">
                    {error}
                  </td>
                </tr>
              ) : paginatedtestData.length > 0 ? (
                paginatedtestData.map((test, key) => (
                  <tr key={key}>
                    <td className="py-3 px-4">{(currentPage - 1) * itemsPerPage + key + 1}</td>
                    <td className="border-b border-[#eee] py-3 px-4 pl-9 dark:border-strokedark xl:pl-11">
                      <h5 className="font-medium text-black dark:text-white">
                        {test.title} {/* Assuming `test.title` holds the title */}
                      </h5>
                    </td>
                    <td className="border-b border-[#eee] py-3 px-4 dark:border-strokedark">
                      <p className="text-black dark:text-white">
                        {new Date(test.startDate).toLocaleDateString()} {/* Assuming `test.startDate` holds the date */}
                      </p>
                    </td>
                    <td className="border-b border-[#eee] py-3 px-4 dark:border-strokedark">
                      <p
                        className={`inline-flex rounded-full bg-opacity-10 py-1 px-3 text-sm font-medium ${
                          test.questions.length >0
                            ? 'bg-success text-success'
                            : 'bg-warning text-warning'
                        }`}
                      >
                        {test.questions.length>0 ? "Pending":"No Question"}
                      </p>
                    </td>
                    <td className="border-b border-[#eee] py-3 px-4 dark:border-strokedark">
                      <Link to={`/admin/select-question/${test.title}`}
                      state={{ testId: test._id, numberOfQuestion: test.numberOfQuestions }} className="flex items-center gap-2 bg-blue-500 text-white px-2 py-1 rounded-md hover:bg-blue-600 w-36">
                        <MdQuiz size={20} className="text-white" />
                        <span className="font-medium">Add Question</span>
                      </Link >
                    </td>
                    <td className="border-b border-[#eee] py-3 px-4 dark:border-strokedark">
                      <div className="flex items-center space-x-3.5">
                        <button
                          className="hover:text-primary"
                          onClick={() => {
                            setIsOpenModel(!isOpenModel);
                            setTestID(test._id);
                          }}
                        >
                          <MdVisibility className="text-2xl text-blue-500 hover:text-blue-600" />
                        </button>
                        <button className="hover:text-primary" onClick={() => deleteTest(test._id)}>
                          <MdDelete className="text-2xl text-red-500 hover:text-red-600" />
                        </button>
                        <Link to={`/admin/editTest/${test._id}`} className="hover:text-primary">
                          <MdEdit className="text-2xl text-indigo-500 hover:text-indigo-600" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center py-3">
                    No tests found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="my-3">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            setCurrentPage={setCurrentPage}
            setItemsPerPage={setItemsPerPage} // Pass the setItemsPerPage function
          />
        </div>
      </div>
      {isOpenModel && <TestDetailModel testID={testID} onClose={handleCloseModal} />}
    </>
  );
}

export default Test;
