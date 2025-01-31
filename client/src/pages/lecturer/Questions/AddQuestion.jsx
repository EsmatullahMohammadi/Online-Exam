/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import axios from "axios";
import { useFormik } from "formik";
import * as Yup from "yup";
import Breadcrumb from "../../../components/Breadcrumbs/Breadcrumb";
import { SUPER_DOMAIN } from "../../admin/constant";

const AddQuestion = () => {
  const [loading, setLoading] = useState(false);
	const category = sessionStorage.getItem("category");

  const formik = useFormik({
    initialValues: {
      question: "",
      options: ["", "", "", ""],
      correctAnswer: "",
    },
    validationSchema: Yup.object({
      question: Yup.string().required("Question is required"),
      options: Yup.array()
        .of(Yup.string().required("Each option is required"))
        .min(4, "All 4 options are required"),
      correctAnswer: Yup.string().required("Correct answer is required"),
    }),
    onSubmit: async (values, { resetForm }) => {
      setLoading(true);
      try {
				const payload = { ...values, category };
        const response = await axios.post(`${SUPER_DOMAIN}/add-question`, payload);
        
        if (response.status === 201) {
          alert(response.data.message);
          resetForm();
        } else {
          alert("Something went wrong!");
        }
      } catch (error) {
        console.error("Error submitting question:", error);
        alert(error.response?.data?.message || "Server Error! Please try again.");
      } finally {
        setLoading(false);
      }
    },
  });

  const handleOptionChange = (index, value) => {
    const updatedOptions = [...formik.values.options];
    updatedOptions[index] = value;
    formik.setFieldValue("options", updatedOptions);
  };

  return (
    <>
      <Breadcrumb pageName="Add Question" />
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
          <h3 className="font-medium text-black dark:text-white">
            You are in {category} Category Please Make {category} Question
          </h3>
        </div>
        <form
          onSubmit={formik.handleSubmit}
          className="grid grid-cols-1 sm:grid-cols-2 gap-6.5 p-6.5"
        >
          {/* Question Field */}
          <div className="col-span-2">
            <label className="mb-3 block text-black dark:text-white">Question</label>
            <textarea
              name="question"
              value={formik.values.question}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Enter the question"
              rows="4"
              className={`w-full rounded-lg border-[1.5px] ${
                formik.touched.question && formik.errors.question ? "border-red-500" : "border-stroke"
              } bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary`}
            ></textarea>
            {formik.touched.question && formik.errors.question && (
              <span className="text-red-500 text-sm">{formik.errors.question}</span>
            )}
          </div>

          {/* Options Fields */}
          <div className="col-span-2">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 gap-x-6">
              {formik.values.options.map((option, index) => (
                <div key={index}>
                  <label className="block mb-1 ml-1 text-black dark:text-white">
                    Option {index + 1}
                  </label>
                  <input
                    type="text"
										name={`options[${index + 1}]`}
                    value={option}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                    onBlur={formik.handleBlur}
                    className={`w-full rounded-lg border-[1.5px] ${
                      formik.touched.options &&
                      formik.errors.options &&
                      formik.errors.options[index]
                        ? "border-red-500"
                        : "border-stroke"
                    } bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary`}
                    placeholder={`Option ${index + 1}`}
                  />
                  {formik.touched.options && formik.errors.options && formik.errors.options[index] && (
                    <span className="text-red-500 text-sm">{formik.errors.options[index]}</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Correct Answer Field and Submit Button */}
          <div className="col-span-2 grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Correct Answer Field */}
            <div>
              <label className="mb-3 block text-black dark:text-white">Correct Answer</label>
              <select
                name="correctAnswer"
                value={formik.values.correctAnswer}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`w-full rounded-lg border-[1.5px] ${
                  formik.touched.correctAnswer && formik.errors.correctAnswer ? "border-red-500" : "border-stroke"
                } bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary`}
              >
                <option value="">Select the correct answer</option>
                {formik.values.options.map((option, index) => (
                  <option key={index} value={option}>
                    {option || `Option ${index + 1}`}
                  </option>
                ))}
              </select>
              {formik.touched.correctAnswer && formik.errors.correctAnswer && (
                <span className="text-red-500 text-sm">{formik.errors.correctAnswer}</span>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex items-end">
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2.5 rounded-md bg-primary py-3 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10 w-full"
                disabled={loading}
              >
                {loading ? "Adding..." : "Add Question"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default AddQuestion;
