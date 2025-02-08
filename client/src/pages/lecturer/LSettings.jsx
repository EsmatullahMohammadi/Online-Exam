import axios from "axios";
import { useFormik } from "formik";
import * as Yup from "yup";
import { FiMail } from "react-icons/fi";
import LBreadcrumb from "../../components/Breadcrumbs/LBreadcrumb";
import { SUPER_DOMAIN } from "../admin/constant";
import UploadPhoto from "../admin/Profile/UploadPhoto";
import { useEffect, useState } from "react";

const LSettings = () => {
  const [lecturerId, setLecturerId] = useState("");

  axios.defaults.withCredentials = true;
  // Fetch lecturer ID from localStorage or context
  useEffect(() => {
    const storedId = sessionStorage.getItem("lecturerID"); 
    if (storedId) {
      setLecturerId(storedId);
    }
  }, []);

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("First Name is required"),
    lastName: Yup.string().required("Last Name is required"),
    email: Yup.string().email("Invalid email address").required("Email is required"),
    currentPassword: Yup.string().required("Current Password is required"),
    newPassword: Yup.string().required("New Password is required").min(8, "New Password must be at least 8 characters"),
  });

  const formik = useFormik({
    initialValues: {
      name: "",
      lastName: "",
      email: "",
      currentPassword: "",
      newPassword: "",
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      if (!lecturerId) {
        alert("Lecturer ID not found!");
        return;
      }

      try {
        const response = await axios.put(`${SUPER_DOMAIN}/settings/${lecturerId}`, values);

        if (response.status === 200) {
          alert(response.data.message || "Profile Updated Successfully!");
          resetForm();
        } else {
          alert(response.data.message || "Error updating profile");
        }
      } catch (error) {
        console.error("Error updating settings:", error);
        alert(error.response?.data?.message || "An error occurred");
      }
    },
  });

  return (
    <>
      <div className="mx-auto max-w-270">
        <LBreadcrumb pageName="Settings" />

        <div className="grid grid-cols-5 gap-8">
          <div className="col-span-5 xl:col-span-3">
            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
              <div className="border-b border-stroke py-4 px-7 dark:border-strokedark">
                <h3 className="font-medium text-black dark:text-white">
                  Personal Information
                </h3>
              </div>
              <div className="p-7">
                <form onSubmit={formik.handleSubmit}>
                  {/* First Name Field */}
                  <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                    <div className="w-full sm:w-1/2">
                      <label className="mb-3 block text-sm font-medium text-black dark:text-white" htmlFor="name">
                        First Name
                      </label>
                      <input
                        className={`w-full rounded border ${
                          formik.touched.name && formik.errors.name ? "border-red-500" : "border-stroke"
                        } bg-gray py-3 px-4.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white`}
                        type="text"
                        name="name"
                        id="name"
                        value={formik.values.name}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder="First Name"
                      />
                      {formik.touched.name && formik.errors.name && <p className="text-red-500 text-sm mt-1">{formik.errors.name}</p>}
                    </div>

                    {/* Last Name Field */}
                    <div className="w-full sm:w-1/2">
                      <label className="mb-3 block text-sm font-medium text-black dark:text-white" htmlFor="lastName">
                        Last Name
                      </label>
                      <input
                        className={`w-full rounded border ${
                          formik.touched.lastName && formik.errors.lastName ? "border-red-500" : "border-stroke"
                        } bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white`}
                        type="text"
                        name="lastName"
                        id="lastName"
                        value={formik.values.lastName}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder="Last Name"
                      />
                      {formik.touched.lastName && formik.errors.lastName && <p className="text-red-500 text-sm mt-1">{formik.errors.lastName}</p>}
                    </div>
                  </div>

                  {/* Email Field */}
                  <div className="mb-5.5">
                    <label className="mb-3 block text-sm font-medium text-black dark:text-white" htmlFor="email">
                      Email Address
                    </label>
                    <div className="relative">
                      <span className="absolute left-4.5 top-4">
                        <FiMail style={{ fontSize: "20px" }} />
                      </span>
                      <input
                        className={`w-full rounded border ${
                          formik.touched.email && formik.errors.email ? "border-red-500" : "border-stroke"
                        } bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white`}
                        type="email"
                        name="email"
                        id="email"
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder="Email Address"
                      />
                      {formik.touched.email && formik.errors.email && <p className="text-red-500 text-sm mt-1">{formik.errors.email}</p>}
                    </div>
                  </div>

                  {/* Password Fields */}
                  <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                    <div className="w-full sm:w-1/2">
                      <label className="mb-3 block text-sm font-medium text-black dark:text-white" htmlFor="currentPassword">
                        Current Password
                      </label>
                      <input
                        className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white"
                        type="password"
                        name="currentPassword"
                        id="currentPassword"
                        value={formik.values.currentPassword}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder="Current Password"
                      />
                      {formik.touched.currentPassword && formik.errors.currentPassword && <p className="text-red-500 text-sm mt-1">{formik.errors.currentPassword}</p>}
                    </div>

                    <div className="w-full sm:w-1/2">
                      <label className="mb-3 block text-sm font-medium text-black dark:text-white" htmlFor="newPassword">
                        New Password
                      </label>
                      <input
                        className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white"
                        type="password"
                        name="newPassword"
                        id="newPassword"
                        value={formik.values.newPassword}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder="New Password"
                      />
                      {formik.touched.newPassword && formik.errors.newPassword && <p className="text-red-500 text-sm mt-1">{formik.errors.newPassword}</p>}
                    </div>
                  </div>

                  <button className="mt-5 bg-primary text-white px-6 py-2 rounded" type="submit">
                    Save
                  </button>
                </form>
              </div>
            </div>
          </div>
          <UploadPhoto id={sessionStorage.getItem("lecturerID")} role={"Lecturer"}/>
        </div>
      </div>
    </>
  );
};

export default LSettings;
