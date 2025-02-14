import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import Breadcrumb from "../../../components/Breadcrumbs/Breadcrumb";
import { SUPER_DOMAIN } from "../constant";

function AddTest() {
  axios.defaults.withCredentials = true;
  const [fixedTime, setFixedTime] = useState(false);
  const formik = useFormik({
    initialValues: {
      title: "",
      examDuration: "",
      numberOfQuestions: "",
      totalMarks: "",
      startDate: "",
      endDate: "",
      startTime: "",
      endTime: "",
      description: "",
    },
    validationSchema: Yup.object().shape({
      title: Yup.string().required("Title is required"),
      examDuration: Yup.number()
        .required("Exam Duration is required")
        .positive()
        .integer(),
      numberOfQuestions: Yup.number()
        .required("Number of Questions is required")
        .positive()
        .integer(),
      totalMarks: Yup.number()
        .required("Total Marks is required")
        .positive(),
      startDate: Yup.string().when([], {
        is: () => fixedTime, // Accessing fixedTime from component state
        then: (schema) =>
          schema
            .required("Start Date is required")
            .test(
              "is-future-date",
              "Start Date cannot be in the past",
              (value) => {
                if (!value) return true;
                const today = new Date().toISOString().split("T")[0];
                return value >= today;
              }
            ),
        otherwise: (schema) => schema.notRequired(),
      }),
      endDate: Yup.string().when("fixedTime", {
          is: () => fixedTime,
          then: (schema) =>
            schema
              .required("End Date is required")
              .test(
                "is-valid-end-date",
                "End Date cannot be before Start Date",
                function (value) {
                  const { startDate } = this.parent;
                  if (!startDate || !value) return true;
                  const start = new Date(startDate);
                  const end = new Date(value);
                  return end >= start;
                }
              ),
          otherwise: (schema) => schema.notRequired(),
      }),

      startTime: Yup.string().when([], {
        is: () => fixedTime,
        then: (schema) => schema.required("Start Time is required"),
        otherwise: (schema) => schema.notRequired(),
      }),
      endTime: Yup.string().when([], {
        is: () => fixedTime,
        then: (schema) =>
          schema
            .required("End Time is required")
            .test(
              "is-valid-end-time",
              "End Time cannot be before Start Time",
              function (value) {
                const { startTime, startDate, endDate } = this.parent;
                if (!value || !startTime) return true;
                const [startHours, startMinutes] = startTime.split(":").map(Number);
                const [endHours, endMinutes] = value.split(":").map(Number);
                const startTimeDate = new Date();
                startTimeDate.setHours(startHours, startMinutes, 0, 0);
                const endTimeDate = new Date();
                endTimeDate.setHours(endHours, endMinutes, 0, 0);
                if (startDate === endDate) {
                  return endTimeDate > startTimeDate;
                }
                return true;
              }
            ),
        otherwise: (schema) => schema.notRequired(),
      }),
      description: Yup.string().required("Description is required"),
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        const response = await axios.post(
          `${SUPER_DOMAIN}/add-test`,
          values,
          { withCredentials: true }
        );
        alert(response.data.message || "Test/Exam added successfully!");
        resetForm();
      } catch (error) {
        console.error(
          "Error adding test:",
          error.response?.data || error.message
        );
        alert(
          error.response?.data.message ||
          "Failed to add test. Please try again."
        );
      }
    },
  });

  return (
    <>
      <Breadcrumb pageName="Add Test" />
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
          <h3 className="font-medium text-black dark:text-white">
            Please fill all text inputs correctly
          </h3>
        </div>
        <form
          onSubmit={ formik.handleSubmit }
          className="grid grid-cols-1 sm:grid-cols-2 gap-6.5 p-6.5"
        >
          {/* Title/Name */ }
          <div>
            <label className="mb-3 block text-black dark:text-white">Title/Name</label>
            <input
              type="text"
              name="title"
              placeholder="Title/Name"
              value={ formik.values.title }
              onChange={ formik.handleChange }
              onBlur={ formik.handleBlur }
              className={ `w-full rounded-lg border-[1.5px] ${formik.touched.title && formik.errors.title
                ? "border-red-500"
                : "border-stroke"
                } bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary` }
            />
            { formik.touched.title && formik.errors.title ? (
              <span className="text-red-500 text-sm">{ formik.errors.title }</span>
            ) : null }
          </div>

          {/* Exam Duration */ }
          <div>
            <label className="mb-3 block text-black dark:text-white">Exam Duration (Minutes)</label>
            <input
              type="number"
              name="examDuration"
              placeholder="Exam Duration (Minutes)"
              value={ formik.values.examDuration }
              onChange={ formik.handleChange }
              onBlur={ formik.handleBlur }
              className={ `w-full rounded-lg border-[1.5px] ${formik.touched.examDuration && formik.errors.examDuration
                ? "border-red-500"
                : "border-stroke"
                } bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary` }
            />
            { formik.touched.examDuration && formik.errors.examDuration ? (
              <span className="text-red-500 text-sm">{ formik.errors.examDuration }</span>
            ) : null }
          </div>

          {/* Number of Questions */ }
          <div>
            <label className="mb-3 block text-black dark:text-white">Number of Questions</label>
            <input
              type="number"
              name="numberOfQuestions"
              placeholder="Number of Questions"
              value={ formik.values.numberOfQuestions }
              onChange={ formik.handleChange }
              onBlur={ formik.handleBlur }
              className={ `w-full rounded-lg border-[1.5px] ${formik.touched.numberOfQuestions && formik.errors.numberOfQuestions
                ? "border-red-500"
                : "border-stroke"
                } bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary` }
            />
            { formik.touched.numberOfQuestions && formik.errors.numberOfQuestions ? (
              <span className="text-red-500 text-sm">{ formik.errors.numberOfQuestions }</span>
            ) : null }
          </div>

          {/* Total Marks */ }
          <div>
            <label className="mb-3 block text-black dark:text-white">Total Marks</label>
            <input
              type="number"
              name="totalMarks"
              placeholder="Total Marks"
              value={ formik.values.totalMarks }
              onChange={ formik.handleChange }
              onBlur={ formik.handleBlur }
              className={ `w-full rounded-lg border-[1.5px] ${formik.touched.totalMarks && formik.errors.totalMarks
                ? "border-red-500"
                : "border-stroke"
                } bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary` }
            />
            { formik.touched.totalMarks && formik.errors.totalMarks ? (
              <span className="text-red-500 text-sm">{ formik.errors.totalMarks }</span>
            ) : null }
          </div>
          <div>
            <label className="mb-3 block text-black dark:text-white">
              Available during fixed time slot each day
            </label>
          </div>
          <div>
            <div className="flex items-center space-x-20">
              <label className="inline-flex items-center text-black dark:text-white cursor-pointer">
                <input
                  type="radio"
                  name="fixedTime"
                  value="disable"
                  checked={ !fixedTime }
                  onChange={ () => setFixedTime(false) }
                  className="form-radio cursor-pointer text-primary focus:ring-0 rounded-md border-stroke dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:ring-0"
                />
                <span className="ml-2">Disable</span>
              </label>
              <label className="inline-flex items-center text-black dark:text-white cursor-pointer">
                <input
                  type="radio"
                  name="fixedTime"
                  value="enable"
                  checked={ fixedTime }
                  onChange={ () => setFixedTime(true) }
                  className="form-radio cursor-pointer text-primary focus:ring-0 rounded-md border-stroke dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:ring-0"
                />
                <span className="ml-2">Enable</span>
              </label>
            </div>
          </div>

          {
            fixedTime && (
              <>
                {/* Start Date */ }
                <div>
                  <label className="mb-3 block text-black dark:text-white">Start Date</label>
                  <input
                    type="date"
                    name="startDate"
                    value={ formik.values.startDate }
                    onChange={ formik.handleChange }
                    onBlur={ formik.handleBlur }
                    className={ `w-full rounded-lg border-[1.5px] ${formik.touched.startDate && formik.errors.startDate
                      ? "border-red-500"
                      : "border-stroke"
                      } bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary hover:cursor-pointer` }
                  />
                  { formik.touched.startDate && formik.errors.startDate ? (
                    <span className="text-red-500 text-sm">{ formik.errors.startDate }</span>
                  ) : null }
                </div>
                {/* Start Time */ }
                <div>
                  <label className="mb-3 block text-black dark:text-white">Start Time</label>
                  <input
                    type="time"
                    name="startTime"
                    value={ formik.values.startTime }
                    onChange={ formik.handleChange }
                    onBlur={ formik.handleBlur }
                    className={ `
                      w-full rounded-lg border-[1.5px] 
                      ${formik.touched.startTime && formik.errors.startTime
                        ? "border-red-500"
                        : "border-stroke"
                      } 
                        bg-transparent py-3 px-5 text-black outline-none transition 
                        focus:border-primary dark:border-form-strokedark dark:bg-form-input 
                        dark:text-white dark:focus:border-primary hover:cursor-pointer
                      `}
                  />
                  { formik.touched.startTime && formik.errors.startTime ? (
                    <span className="text-red-500 text-sm">{ formik.errors.startTime }</span>
                  ) : null }
                </div>
                {/* End Date */ }
                <div>
                  <label className="mb-3 block text-black dark:text-white">End Date</label>
                  <input
                    type="date"
                    name="endDate"
                    value={ formik.values.endDate }
                    onChange={ formik.handleChange }
                    onBlur={ formik.handleBlur }
                    className={ `w-full rounded-lg border-[1.5px] ${formik.touched.endDate && formik.errors.endDate
                      ? "border-red-500"
                      : "border-stroke"
                      } bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary hover:cursor-pointer` }
                  />
                  { formik.touched.endDate && formik.errors.endDate ? (
                    <span className="text-red-500 text-sm">{ formik.errors.endDate }</span>
                  ) : null }
                </div>
                {/* End Time */ }
                <div>
                  <label className="mb-3 block text-black dark:text-white">End Time</label>
                  <input
                    type="time"
                    name="endTime"
                    value={ formik.values.endTime }
                    onChange={ formik.handleChange }
                    onBlur={ formik.handleBlur }
                    className={ `
                      w-full rounded-lg border-[1.5px] 
                      ${formik.touched.endTime && formik.errors.endTime
                        ? "border-red-500"
                        : "border-stroke"
                      } 
                        bg-transparent py-3 px-5 text-black outline-none transition 
                        focus:border-primary dark:border-form-strokedark dark:bg-form-input 
                        dark:text-white dark:focus:border-primary hover:cursor-pointer
                      `}
                  />
                  { formik.touched.endTime && formik.errors.endTime ? (
                    <span className="text-red-500 text-sm">{ formik.errors.endTime }</span>
                  ) : null }
                </div>
              </>
            )
          }


          {/* Description */ }
          <div>
            <label className="mb-3 block text-black dark:text-white">Description</label>
            <textarea
              name="description"
              rows="3"
              placeholder="Exam Description"
              value={ formik.values.description }
              onChange={ formik.handleChange }
              onBlur={ formik.handleBlur }
              className={ `w-full rounded-lg border-[1.5px] ${formik.touched.description && formik.errors.description
                ? "border-red-500"
                : "border-stroke"
                } bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary` }
            ></textarea>
            { formik.touched.description && formik.errors.description ? (
              <span className="text-red-500 text-sm">{ formik.errors.description }</span>
            ) : null }
          </div>
          <div className="flex flex-col h-full">
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2.5 rounded-md bg-primary py-4 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10 w-full mt-auto mb-2"
            >
              Add Test/Exam
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

export default AddTest;

