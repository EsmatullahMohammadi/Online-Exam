/* eslint-disable no-unused-vars */

/* eslint-disable react/no-unknown-property */
import  { useEffect, useState } from 'react';
import Breadcrumb from '../../../components/Breadcrumbs/Breadcrumb';
import { Link } from 'react-router-dom';
import { MdAdd, MdDelete} from 'react-icons/md';
import axios from 'axios';
import { SUPER_DOMAIN } from '../constant';

const Lecturer = () => {
  const [lecturers, setLecturers] = useState([]); // State to store lecturers
  const [error, setError] = useState(''); // State to store any errors
  const [loading, setLoading] = useState(true);

  // Fetch data from the backend using Axios
  useEffect(() => {
    const fetchLecturers = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${SUPER_DOMAIN}/all-lecturars`); // Update this with your backend endpoint
        setLecturers(response.data.lecturar); // Set the retrieved data to state
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLecturers();
  }, []);

  const deleteLecturer = async (lecturarID) => {
    try {
      const confirmDelete = window.confirm("Are you sure you want to delete this lecturer?");
      if (!confirmDelete) return; // If the user cancels the delete, exit

      // Send DELETE request to the backend
      await axios.delete(`${SUPER_DOMAIN}/lecturars/${lecturarID}`);
      // Remove the deleted lecturer from the state
      setLecturers((prevLecturer) => prevLecturer.filter((lecturar) => lecturar._id !== lecturarID));
      alert("Lecturer deleted successfully!");
    } catch (err) {
      alert("Failed to delete lecturer.",err.message);
    }
  };

  return (
    <>
      <Breadcrumb pageName="Lecturer" />
      <div>
        <Link
          to="/admin/addLecturer"
          className="inline-flex items-center justify-center gap-2.5 rounded-sm bg-primary py-3 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10 mb-3"
        >
          <MdAdd className="text-2xl" />
          Add Lecturer
        </Link>
      </div>

      <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
        <div className="max-w-full overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-300 text-left dark:bg-meta-4">
                <th className="min-w-[220px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
                  Name
                </th>
                <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                  Last Name
                </th>
                <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                  Email
                </th>
                <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                  Category
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
              ) :
              lecturers.length > 0 ? (
                lecturers.map((lecturer, key) => (
                  <tr key={key}>
                    <td className="border-b border-[#eee] py-3 px-4 pl-9 dark:border-strokedark xl:pl-11">
                      <h5 className="font-medium text-black dark:text-white">
                        {lecturer.name}
                      </h5>
                    </td>
                    <td className="border-b border-[#eee] py-3 px-4 dark:border-strokedark">
                      <p className="text-black dark:text-white">
                        {lecturer.lastName}
                      </p>
                    </td>
                    <td className="border-b border-[#eee] py-3 px-4 dark:border-strokedark">
                      <p className="text-black dark:text-white">
                        {lecturer.email}
                      </p>
                    </td>
                    <td className="border-b border-[#eee] py-3 px-4 dark:border-strokedark">
                      <p
                        className={`inline-flex rounded-full bg-opacity-10 py-1 px-3 text-sm font-medium`}
                      >
                        {lecturer.category}
                      </p>
                    </td>
                    <td className="border-b border-[#eee] py-3 px-4 dark:border-strokedark">
                      <div className="flex items-center space-x-3.5">
                        <button className="hover:text-primary" onClick={() => deleteLecturer(lecturer._id)}>
                          <MdDelete className="text-2xl text-red-500 hover:text-red-600" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-4">
                    No lecturers found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className='flex justify-center text-black space-x-8 my-4'>
            {/* <button className='hover:underline hover:text-lg' onClick={console.log("pre")}>Previouse</button>
            <button className='hover:underline hover:text-lg' onClick={console.log("next")}>Next</button> */}
        </div>
      </div>
    </>
  );
};

export default Lecturer;
