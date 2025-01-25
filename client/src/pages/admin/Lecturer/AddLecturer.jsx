/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import Breadcrumb from '../../../components/Breadcrumbs/Breadcrumb';
import { MdPublic, MdArrowDropDown } from 'react-icons/md';
import axios from 'axios';
import { SUPER_DOMAIN } from '../constant';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';

const AddLecturer = () => {
  const [error, setError] = useState('');
  const navigate = useNavigate();
  // Validation Schema with Yup
  const validationSchema = Yup.object({
    name: Yup.string()
      .required('Name is required')
      .min(2, 'Name must be at least 2 characters'),
    lastName: Yup.string()
      .required('Last Name is required')
      .min(2, 'Last Name must be at least 2 characters'),
    email: Yup.string()
      .required('Email is required')
      .email('Invalid email format'),
    password: Yup.string()
      .required('Password is required')
      .min(6, 'Password must be at least 6 characters'),
    category: Yup.string()
      .required('Please select a category'),
  });

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    setError('');

    try {
      const response = await axios.post(`${SUPER_DOMAIN}/add-lecturar`, values);

      if (response.status === 201) {
        resetForm();
        alert("Lecturare Added successfully!");
        navigate("/admin/lecturer");
      }
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred. Please try again.');
    } finally {
      setSubmitting(false); // Stop the Formik submitting state
    }
  };

  return (
    <>
      <Breadcrumb pageName="Add Lecturer" />

      {/* Error Alert */}
      {error && (
        <div className="flex w-full border-l-6 border-red-500 bg-red-100 px-7 py-2 shadow-md dark:bg-[#1B1B24] dark:bg-opacity-30 md:p-2 mb-2">
          <div className="w-full">
            <h5 className="mb-3 text-lg font-semibold text-red-700">Error</h5>
            <p className="text-base leading-relaxed text-body">{error}</p>
          </div>
        </div>
      )}

      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <Formik
          initialValues={{
            name: '',
            lastName: '',
            email: '',
            password: '',
            category: '',
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="grid grid-cols-1 sm:grid-cols-2 gap-6.5 p-6.5">
              {/* Name */}
              <div>
                <label className="mb-3 block text-black dark:text-white">Name</label>
                <Field
                  type="text"
                  name="name"
                  placeholder="Name"
                  className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                />
                <ErrorMessage name="name" component="div" className="text-red-500 text-sm" />
              </div>

              {/* Last Name */}
              <div>
                <label className="mb-3 block text-black dark:text-white">Last Name</label>
                <Field
                  type="text"
                  name="lastName"
                  placeholder="Last Name"
                  className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                />
                <ErrorMessage name="lastName" component="div" className="text-red-500 text-sm" />
              </div>

              {/* Email */}
              <div>
                <label className="mb-3 block text-black dark:text-white">Email</label>
                <Field
                  type="email"
                  name="email"
                  placeholder="Email"
                  className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                />
                <ErrorMessage name="email" component="div" className="text-red-500 text-sm" />
              </div>

              {/* Password */}
              <div>
                <label className="mb-3 block text-black dark:text-white">Password</label>
                <Field
                  type="password"
                  name="password"
                  placeholder="Password"
                  className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                />
                <ErrorMessage name="password" component="div" className="text-red-500 text-sm" />
              </div>

              {/* Category */}
              <div>
                <label className="mb-3 block text-black dark:text-white">Select a Category</label>
                <div className="relative z-20 bg-white dark:bg-form-input">
                  <span className="absolute top-1/2 left-4 z-30 -translate-y-1/2">
                    <MdPublic className="text-gray-500 opacity-80" size={20} />
                  </span>
                  <Field
                    as="select"
                    name="category"
                    className="relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-3 px-12 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input"
                  >
                    <option value="" disabled>
                      Select a Category
                    </option>
                    <option value="Reading">Reading</option>
                    <option value="Writing">Writing</option>
                    <option value="Speaking">Speaking</option>
                    <option value="Listening">Listening</option>
                  </Field>
                  <ErrorMessage name="category" component="div" className="text-red-500 text-sm" />
                  <span className="absolute top-1/2 right-4 z-10 -translate-y-1/2">
                    <MdArrowDropDown className="text-gray-500 opacity-80" size={24} />
                  </span>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex flex-col h-full">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center justify-center gap-2.5 rounded-md bg-primary py-3.5 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10 w-full mt-auto"
                >
                  {isSubmitting ? 'Adding...' : 'Add Test/Exam'}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </>
  );
};

export default AddLecturer
