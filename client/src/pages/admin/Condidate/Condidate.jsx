/* eslint-disable react/no-unknown-property */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react'
import Breadcrumb from '../../../components/Breadcrumbs/Breadcrumb'
import { Link } from 'react-router-dom';
import { MdAdd, MdDelete, MdEdit, MdVisibility } from 'react-icons/md';
import axios from 'axios';  // Import axios for API requests
import { SUPER_DOMAIN } from '../constant';

const Condidate = () => {
  // State to store the candidates data
  const [candidates, setCandidates] = useState();
  const [loading, setLoading] = useState(true);  // Loading state
  const [error, setError] = useState(null);  // Error state

  useEffect(() => {
    async function fetchCandidates() {
      try {
        setLoading(true);
        const response = await axios.get(`${SUPER_DOMAIN}/all-candidates`, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        // Ensure we are setting the correct data here.
        if (response.data && response.data.candidate) {
          setCandidates(response.data.candidate); // Accessing `candidates` property from the response
        } else {
          setError('No Candidates found.');
        }
      } catch (err) {
        setError(err.response?.data?.message || err.message); // Handle errors properly
      } finally {
        setLoading(false);
      }
    }

    fetchCandidates();
  }, []);


  return (
    <>
      <Breadcrumb pageName="Candidate" />
      <div>
        <Link
          to="/dashbord/addCondidate"
          className="inline-flex items-center justify-center gap-2.5 rounded-sm bg-primary py-3 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10 mb-3"
        >
          <span>
            <MdAdd className='text-2xl' />
          </span>
          Add Candidate
        </Link>
      </div>
      <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
        <div className="max-w-full overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-300 text-left dark:bg-meta-4">
                <th className="min-w-[220px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
                  Candidate Name
                </th>
                <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                  Father Name
                </th>
                <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                  Result
                </th>
                <th className="py-4 px-4 font-medium text-black dark:text-white">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
            { loading ? (
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
              ) : candidates?.length > 0 ? (
              candidates.map((candidate, key) => (
                <tr key={key}>
                  <td className="border-b border-[#eee] py-3 px-4 pl-9 dark:border-strokedark xl:pl-11">
                    <h5 className="font-medium text-black dark:text-white">
                      {candidate.name}
                    </h5>
                  </td>
                  <td className="border-b border-[#eee] py-3 px-4 dark:border-strokedark">
                    <p className="text-black dark:text-white">
                      {candidate.fatherName}
                    </p>
                  </td>
                  <td className="border-b border-[#eee] py-3 px-4 dark:border-strokedark">
                    <p
                      className={`inline-flex rounded-full bg-opacity-10 py-1 px-3 text-sm font-medium ${
                        candidate.status === 'Pending'
                          ? 'bg-warning text-warning'
                          : Condidate.status=== "Passed"? 'bg-success text-success':
                          "Failed"
                      }`}
                    >
                      {candidate.status}
                    </p>
                  </td>
                  <td className="border-b border-[#eee] py-3 px-4 dark:border-strokedark">
                    <div className="flex items-center space-x-3.5">
                      <button className="hover:text-primary">
                        <MdVisibility className='text-2xl text-blue-500 hover:text-blue-600' />
                      </button>
                      <button className="hover:text-primary">
                        <MdDelete className='text-2xl text-red-500 hover:text-red-600' />
                      </button>
                      <button className="hover:text-primary">
                        <MdEdit className='text-2xl text-indigo-500 hover:text-indigo-600' />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center py-3">
                  No candidates found.
                </td>
              </tr>
            )}
            </tbody>
          </table>
        </div>
        {/* pagination */}
        <div className='flex justify-center text-black space-x-8 my-4'>
          {/* <button className='hover:underline hover:text-lg' onClick={""}>Previous</button>
          <button className='hover:underline hover:text-lg' onClick={""}>Next</button> */}
        </div>
      </div>
    </>
  );
}

export default Condidate;
