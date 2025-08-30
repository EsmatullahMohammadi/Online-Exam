/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import Breadcrumb from '../../../components/Breadcrumbs/Breadcrumb';
import { SUPER_DOMAIN } from '../constant';

const AddCandidate = () => {
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [tests, setTests] = useState([]);
    axios.defaults.withCredentials = true;
    useEffect(() => {
      const fetchTests = async () => {
        try {
          const response = await axios.get(`${SUPER_DOMAIN}/all-tests`);
          if (response.status === 200) {
            setTests(response.data.tests);
          }
        } catch (error) {
          console.error("Error fetching tests:", error);
        }
      };
  
      fetchTests();
    }, []);

  const validationSchema = Yup.object({
    name: Yup.string().required('Name is required'),
    fatherName: Yup.string().required('Father Name is required'),
    university: Yup.string().required('University is required'),
    faculty: Yup.string().required('Faculty is required'),
    department: Yup.string().required('Department is required'),
    educationDegree: Yup.string().required('Education Degree is required'),
    phoneNumber: Yup.string()
    .matches(/^[0-9]{10,15}$/, 'Phone Number must be between 10 and 15 digits')
    .required('Phone Number is required'),
    testId: Yup.string().required('Test is required'),
  });

  const handleSubmit = async (values, { resetForm }) => {
    setError('');
    setSuccess(false);

    try {
      const response = await axios.post(`${SUPER_DOMAIN}/add-candidates`, values);

      if (response.status === 201) {
        setSuccess(true);
        resetForm();
      } else {
        setError(response.data.message || 'Failed to add candidate. Please try again.');
      }
    } catch (err) {
      setError(
        err.response?.data?.message || 'Server error. Please try again later.'
      );
    }
  };

  return (
    <>
      <Breadcrumb pageName="Add Candidate" />
      {success && (
        <div className="flex w-full border-l-6 border-[#34D399] bg-[#34D399] bg-opacity-[15%] px-7 py-2 shadow-md dark:bg-[#1B1B24] dark:bg-opacity-30 md:p-2 mb-2">
          <div className="mr-5 flex h-9 w-full max-w-[36px] items-center justify-center rounded-lg bg-[#34D399]">
            <svg
              width="16"
              height="12"
              viewBox="0 0 16 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M15.2984 0.826822L15.2868 0.811827L15.2741 0.797751C14.9173 0.401867 14.3238 0.400754 13.9657 0.794406L5.91888 9.45376L2.05667 5.2868C1.69856 4.89287 1.10487 4.89389 0.747996 5.28987C0.417335 5.65675 0.417335 6.22337 0.747996 6.59026L0.747959 6.59029L0.752701 6.59541L4.86742 11.0348C5.14445 11.3405 5.52858 11.5 5.89581 11.5C6.29242 11.5 6.65178 11.3355 6.92401 11.035L15.2162 2.11161C15.5833 1.74452 15.576 1.18615 15.2984 0.826822Z"
                fill="white"
                stroke="white"
              ></path>
            </svg>
          </div>
          <div className="w-full">
            <h5 className="mb-3 text-lg font-semibold text-black dark:text-[#34D399] ">
              Candidate Added Successfully
            </h5>
          </div>
        </div>
      )}
      {error && (
        <div className="flex w-full border-l-6 border-[#EF4444] bg-[#EF4444] bg-opacity-[15%] px-7 py-2 shadow-md dark:bg-[#1B1B24] dark:bg-opacity-30 md:p-2 mb-2">
          <div className="mr-5 flex h-9 w-full max-w-[36px] items-center justify-center rounded-lg bg-[#EF4444]">
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M8 0.666667C3.94 0.666667 0.666668 3.94 0.666668 8C0.666668 12.06 3.94 15.3333 8 15.3333C12.06 15.3333 15.3333 12.06 15.3333 8C15.3333 3.94 12.06 0.666667 8 0.666667ZM8 13.6667C4.88 13.6667 2.33333 11.12 2.33333 8C2.33333 4.88 4.88 2.33333 8 2.33333C11.12 2.33333 13.6667 4.88 13.6667 8C13.6667 11.12 11.12 13.6667 8 13.6667ZM7.33333 4.66667H8.66667V9.33333H7.33333V4.66667ZM7.33333 10.6667H8.66667V12H7.33333V10.6667Z"
                fill="white"
              />
            </svg>
          </div>
          <div className="w-full">
            <h5 className="mb-3 text-lg font-semibold text-black dark:text-[#EF4444]">
              Error Occurred
            </h5>
            <p className="text-base leading-relaxed text-body">
              {error}
            </p>
          </div>
        </div>
      )}

      <Formik
        initialValues={{
          name: '',
          fatherName: '',
          university: '',
          faculty: '',
          department: '',
          educationDegree: '',
          phoneNumber: '',
          email: '',
          password: '',
          testId: '',
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form>
            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
              <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
                <h3 className="font-medium text-black dark:text-white">
                  Please fill all fields correctly
                </h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6.5 p-6.5">
                {/* Map Input Fields */}
                {[
                  { name: 'name', label: 'Name', type: 'text' },
                  { name: 'fatherName', label: 'Father Name', type: 'text' },
                  { name: 'university', label: 'University', type: 'text' },
                  { name: 'faculty', label: 'Faculty', type: 'text' },
                  { name: 'department', label: 'Department', type: 'text' },
                  { name: 'phoneNumber', label: 'Phone Number', type: 'text' },
                ].map(({ name, label, type }) => (
                  <div key={name}>
                    <label
                      htmlFor={name}
                      className="mb-3 block text-black dark:text-white"
                    >
                      {label}
                    </label>
                    <Field
                      type={type}
                      name={name}
                      id={name}
                      placeholder={label}
                      className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />
                    <ErrorMessage
                      name={name}
                      component="div"
                      className="text-red-600 text-sm mt-1"
                    />
                  </div>
                ))}

                <div>
                  <label htmlFor="testId" className="mb-3 block text-black dark:text-white">
                    Select Education Degree
                  </label>
                  <Field
                    as="select"
                    name="educationDegree"
                    id="educationDegree"
                    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  >
                    <option value="">Select a Education Degree</option>
                    <option  value={"Lisans"}>Lisans</option>
                    <option  value={"Master"}>Master</option>
                  </Field>
                  <ErrorMessage name="testId" component="div" className="text-red-600 text-sm mt-1" />
                </div>
                {/* Test Selection Dropdown */}
                <div>
                  <label htmlFor="testId" className="mb-3 block text-black dark:text-white">
                    Select Test
                  </label>
                  <Field
                    as="select"
                    name="testId"
                    id="testId"
                    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  >
                    <option value="">Select a Test</option>
                    {tests.map((test) => (
                      <option key={test._id} value={test._id}>
                        {test.title}
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage name="testId" component="div" className="text-red-600 text-sm mt-1" />
                </div>

                {/* Submit Button */}
                <div className="flex flex-col h-full">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center justify-center gap-2.5 rounded-md bg-primary py-3.5 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10 w-full mt-auto "
                  >
                    {isSubmitting ? 'Adding...' : 'Add Candidate'}
                  </button>
                </div>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default AddCandidate;
