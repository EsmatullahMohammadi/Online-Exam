/* eslint-disable react/no-unknown-property */

import Breadcrumb from '../../../components/Breadcrumbs/Breadcrumb'
import { Link } from 'react-router-dom';
import { MdAdd, MdDelete, MdEdit } from 'react-icons/md';

const Lecturer=()=> {
	const packageData = [
		{
			name: 'Esmatullah',
			price: "Mohammadi",
			invoiceDate: `Mohammadi`,
			status: 'esmatullah1382@gmail.com',
		},
		{
			name: 'Esmatullah',
			price: "Mohammadi",
			invoiceDate: `Mohammadi`,
			status: 'esmatullah1382@gmail.com',
		},
		{
			name: 'Esmatullah',
			price: "Mohammadi",
			invoiceDate: `Mohammadi`,
			status: 'esmatullah1382@gmail.com',
		},
		{
			name: 'Esmatullah',
			price: "Mohammadi",
			invoiceDate: `Mohammadi`,
			status: 'esmatullah1382@gmail.com',
		},
	];
  return (
    <>
		<Breadcrumb pageName="Lecturer" />
    <div>

      <Link
        to="/dashbord/addLecturer"
        className="inline-flex items-center justify-center gap-2.5 rounded-sm bg-primary py-3 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10 mb-3"
            >
              <MdAdd className='text-2xl' />
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
              <th className="py-4 px-4 font-medium text-black dark:text-white">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {packageData.map((packageItem, key) => (
              <tr key={key}>
                <td className="border-b border-[#eee] py-3 px-4 pl-9 dark:border-strokedark xl:pl-11">
                  <h5 className="font-medium text-black dark:text-white">
                    {packageItem.name}
                  </h5>
                  {/* <p className="text-sm">${packageItem.price}</p> */}
                </td>
                <td className="border-b border-[#eee] py-3 px-4 dark:border-strokedark">
                  <p className="text-black dark:text-white">
                    {packageItem.invoiceDate}
                  </p>
                </td>
                <td className="border-b border-[#eee] py-3 px-4 dark:border-strokedark">
                  <p
                    className={`inline-flex rounded-full bg-opacity-10 py-1 px-3 text-sm font-medium `}
                  >
                    {packageItem.status}
                  </p>
                </td>
                <td className="border-b border-[#eee] py-3 px-4 dark:border-strokedark">
                  <div className="flex items-center space-x-3.5">
                    <button className="hover:text-primary">
                    <MdDelete className='text-2xl text-red-400 hover:text-red-500'/>
                    </button>
                    <button className="hover:text-primary">
                    <MdEdit className='text-2xl'/>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* pagination */}
      <div className='flex justify-center text-black space-x-8 my-4'>
          {/* <button className='hover:underline hover:text-lg' onClick={}>Previouse</button>
          <button className='hover:underline hover:text-lg' onClick={""}>Next</button> */}
      </div>
    </div>
		</>
  )
}

export default Lecturer;