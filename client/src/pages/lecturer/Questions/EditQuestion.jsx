import { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import LBreadcrumb from "../../../components/Breadcrumbs/LBreadcrumb";
import { SUPER_DOMAIN } from "../../admin/constant";

const EditSingleQuestion = () => {
  const { id } = useParams(); // question ID
  const navigate = useNavigate();
  const [question, setQuestion] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const res = await axios.get(`${SUPER_DOMAIN}/question/${id}`, {
          withCredentials: true,
        });
        if (res.data && res.data.data) {
          setQuestion(res.data.data);
        } else {
          alert("Question not found!");
          navigate("/lecturer/questions");
        }
      } catch (err) {
        console.error(err);
        alert("Failed to fetch question.");
        navigate("/lecturer/questions");
      } finally {
        setLoading(false);
      }
    };

    fetchQuestion();
  }, [id, navigate]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: question || {
      questionText: "",
      options: ["", "", "", ""],
      correctAnswer: "",
    },
    validationSchema: Yup.object({
      questionText: Yup.string().required("Question text is required"),
      options: Yup.array()
        .of(Yup.string().required("Option cannot be empty"))
        .length(4, "Exactly 4 options are required"),
      correctAnswer: Yup.string()
        .required("Correct answer is required")
        .oneOf(Yup.ref("options"), "Correct answer must be one of the options"),
    }),
    onSubmit: async (values) => {
      try {
        const payload = {
          questionText: values.questionText,
          options: values.options,
          correctAnswer: values.correctAnswer,
        };

        const res = await axios.put(
          `${SUPER_DOMAIN}/edit-single-question/${id}`,
          payload,
          {
            withCredentials: true,
          }
        );

        if (res.status === 200) {
          alert("Question updated successfully!");
          navigate("/lecturer/questions");
        }
      } catch (err) {
        console.error(err);
        alert(err.response?.data?.message || "Failed to update question.");
      }
    },
  });

  if (loading) return <p>Loading...</p>;
  if (!question) return null;

  return (
    <>
      <LBreadcrumb pageName="Edit Question" />
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
          <h3 className="font-medium text-black dark:text-white">
            Edit Question
          </h3>
        </div>

        <form
          onSubmit={formik.handleSubmit}
          className="grid grid-cols-1 gap-6.5 p-6.5"
        >
          <div>
            <label className="mb-2 block text-black dark:text-white">
              Question Text
            </label>
            <input
              type="text"
              name="questionText"
              value={formik.values.questionText}
              onChange={formik.handleChange}
              className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none"
            />
            {formik.touched.questionText && formik.errors.questionText && (
              <span className="text-red-500 text-sm">
                {formik.errors.questionText}
              </span>
            )}
          </div>

          <div>
            <label className="mb-2 block text-black dark:text-white">
              Options
            </label>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {formik.values.options.map((opt, i) => (
                <input
                  key={i}
                  type="text"
                  name={`options[${i}]`}
                  value={opt}
                  onChange={formik.handleChange}
                  className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none"
                  placeholder={`Option ${i + 1}`}
                />
              ))}
            </div>
            {formik.touched.options && formik.errors.options && (
              <span className="text-red-500 text-sm">
                {formik.errors.options}
              </span>
            )}
          </div>

          <div>
            <label className="mb-2 block text-black dark:text-white">
              Correct Answer
            </label>
            <select
              name="correctAnswer"
              value={formik.values.correctAnswer}
              onChange={formik.handleChange}
              className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none"
            >
              <option value="">Select correct answer</option>
              {formik.values.options.map((opt, i) => (
                <option key={i} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
            {formik.touched.correctAnswer && formik.errors.correctAnswer && (
              <span className="text-red-500 text-sm">
                {formik.errors.correctAnswer}
              </span>
            )}
          </div>

          <div>
            <button
              type="submit"
              className="mt-4 inline-flex items-center justify-center gap-2.5 rounded-md bg-primary py-3 px-10 text-white w-full"
            >
              Update Question
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default EditSingleQuestion;
