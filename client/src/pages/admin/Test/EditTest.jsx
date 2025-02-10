import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Breadcrumb from "../../../components/Breadcrumbs/Breadcrumb";
import { SUPER_DOMAIN } from "../constant";
import { FiArrowLeft } from "react-icons/fi";


// Validation Schema
const validationSchema = Yup.object().shape({
    title: Yup.string().required("Title is required"),
    examDuration: Yup.number().required("Exam Duration is required").positive().integer(),
    numberOfQuestions: Yup.number().required("Number of Questions is required").positive().integer(),
    totalMarks: Yup.number().required("Total Marks is required").positive(),
    startDate: Yup.date().required("Start Date is required").min(new Date().toLocaleDateString(), "Start Date cannot be in the past"),
    endDate: Yup.date()
    .required("End Date is required.")
    .min(Yup.ref("startDate"), "End Date cannot be before Start Date."),
    description: Yup.string().required("Description is required"),
});

const EditTest = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [initialValues, setInitialValues] = useState({
    title: "",
    examDuration: "",
    numberOfQuestions: "",
    totalMarks: "",
    startDate: "",
    endDate: "",
    description: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  axios.defaults.withCredentials = true;

  useEffect(() => {
    async function fetchTest() {
      try {
        const response = await axios.get(`${SUPER_DOMAIN}/tests/${id}`);
        const { title, examDuration, numberOfQuestions, totalMarks, startDate, endDate, description } =
          response.data.test;
        setInitialValues({
          title,
          examDuration,
          numberOfQuestions,
          totalMarks,
          startDate: new Date(startDate).toISOString().split("T")[0],
          endDate: new Date(endDate).toISOString().split("T")[0],
          description,
        });
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch test details.");
      } finally {
        setLoading(false);
      }
    }

    fetchTest();
  }, [id]);

  const handleFormSubmit = async (values, { setSubmitting }) => {
    try {
      await axios.put(`${SUPER_DOMAIN}/tests/${id}`, values, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      alert("Test updated successfully!");
      navigate("/admin/tests");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update test.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <>
      <Breadcrumb pageName="Edit Test" />
      <button onClick={() => navigate(-1)} className="flex items-center text-gray-600 hover:text-gray-900 mb-4">
        <FiArrowLeft size={24} className="mr-2" /> Back
      </button>
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
          <h3 className="font-medium text-black dark:text-white">
            Update the test details
          </h3>
        </div>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleFormSubmit}
          enableReinitialize // Important for updating initial values after data fetch
        >
          {({ isSubmitting }) => (
            <Form className="grid grid-cols-1 sm:grid-cols-2 gap-6.5 p-6.5">
              {/* Title */}
              <div>
                <label className="mb-3 block text-black dark:text-white">Title/Name</label>
                <Field
                  type="text"
                  name="title"
                  placeholder="Title/Name"
                  className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                />
                <ErrorMessage
                  name="title"
                  component="p"
                  className="mt-1 text-red-500 text-sm"
                />
              </div>

              {/* Exam Duration */}
              <div>
                <label className="mb-3 block text-black dark:text-white">Exam Duration (Minutes)</label>
                <Field
                  type="number"
                  name="examDuration"
                  placeholder="Exam Duration"
                  className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                />
                <ErrorMessage
                  name="examDuration"
                  component="p"
                  className="mt-1 text-red-500 text-sm"
                />
              </div>

              {/* Number of Questions */}
              <div>
                <label className="mb-3 block text-black dark:text-white">Number of Questions</label>
                <Field
                  type="number"
                  name="numberOfQuestions"
                  placeholder="Number of Questions"
                  className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                />
                <ErrorMessage
                  name="numberOfQuestions"
                  component="p"
                  className="mt-1 text-red-500 text-sm"
                />
              </div>

              {/* Total Marks */}
              <div>
                <label className="mb-3 block text-black dark:text-white">Total Marks</label>
                <Field
                  type="number"
                  name="totalMarks"
                  placeholder="Total Marks"
                  className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                />
                <ErrorMessage
                  name="totalMarks"
                  component="p"
                  className="mt-1 text-red-500 text-sm"
                />
              </div>

              {/* Start Date */}
              <div>
                <label className="mb-3 block text-black dark:text-white">Start Date</label>
                <Field
                  type="date"
                  name="startDate"
                  className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary hover:cursor-pointer"
                />
                <ErrorMessage
                  name="startDate"
                  component="p"
                  className="mt-1 text-red-500 text-sm"
                />
              </div>

              {/* End Date */}
              <div>
                <label className="mb-3 block text-black dark:text-white">End Date</label>
                <Field
                  type="date"
                  name="endDate"
                  className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary hover:cursor-pointer"
                />
                <ErrorMessage
                  name="endDate"
                  component="p"
                  className="mt-1 text-red-500 text-sm"
                />
              </div>

              {/* Description */}
              <div className="">
                <label className="mb-3 block text-black dark:text-white">Description</label>
                <Field
                  as="textarea"
                  name="description"
                  rows="4"
                  placeholder="Test Description"
                  className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                />
                <ErrorMessage
                  name="description"
                  component="p"
                  className="mt-1 text-red-500 text-sm"
                />
              </div>

              {/* Submit Button */}
              <div className="flex flex-col h-full">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center justify-center gap-2.5 rounded-md bg-primary py-4 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10 w-full mt-auto mb-2"
                >
                  {isSubmitting ? "Updating..." : "Update Test"}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </>
  );
};

export default EditTest;
