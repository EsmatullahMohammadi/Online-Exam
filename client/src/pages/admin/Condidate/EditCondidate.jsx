import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Breadcrumb from "../../../components/Breadcrumbs/Breadcrumb";
import { FiArrowLeft } from "react-icons/fi";
import { SUPER_DOMAIN } from "../constant";

// Validation Schema
const validationSchema = Yup.object().shape({
	name: Yup.string().required("Name is required"),
	fatherName: Yup.string().required("Father's Name is required"),
	university: Yup.string().required("University is required"),
	faculty: Yup.string().required("Faculty is required"),
	department: Yup.string().required("Department is required"),
	educationDegree: Yup.string()
		.oneOf(["Lisans", "Master"], "Invalid degree")
		.required("Education Degree is required"),
	phoneNumber: Yup.string()
		.matches(/^[0-9]{10,15}$/, 'Phone Number must be between 10 and 15 digits')
		.required('Phone Number is required'),
	email: Yup.string().email('Invalid email address').required('Email is required'),
	password: Yup.string()
		.min(6, 'Password must be at least 6 characters')
});

const EditCandidate = () => {
	const location = useLocation();
	const navigate = useNavigate();
	const { candidate } = location.state || {};

	const [initialValues, setInitialValues] = useState({
		name: "",
		fatherName: "",
		university: "",
		faculty: "",
		department: "",
		educationDegree: "",
		phoneNumber: "",
		email: "",
		password: "",
	});

	useEffect(() => {
		if (candidate) {
			setInitialValues({
				name: candidate.name || "",
				fatherName: candidate.fatherName || "",
				university: candidate.university || "",
				faculty: candidate.faculty || "",
				department: candidate.department || "",
				educationDegree: candidate.educationDegree || "",
				phoneNumber: candidate.phoneNumber || "",
				email: candidate.email || "",
				password: "",
			});
		}
	}, [candidate]);

	const handleFormSubmit = async (values, { setSubmitting }) => {
		try {
			await axios.put(`${SUPER_DOMAIN}/update-candidate/${candidate._id}`, values, {
				headers: { "Content-Type": "application/json" },
			});
			alert("Candidate updated successfully!");
			navigate("/admin/condidate");
		} catch (error) {
			console.error("Error updating candidate:", error);
			alert("Failed to update candidate.");
		} finally {
			setSubmitting(false);
		}
	};

	return (
		<>
			<Breadcrumb pageName="Edit Candidate" />
			<button onClick={ () => navigate(-1) } className="flex items-center text-gray-600 hover:text-gray-900 mb-4">
				<FiArrowLeft size={ 24 } className="mr-2" /> Back
			</button>
			<div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
				<div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
					<h3 className="font-medium text-black dark:text-white">
						Update Candidate Details
					</h3>
				</div>
				<Formik
					initialValues={ initialValues }
					validationSchema={ validationSchema }
					onSubmit={ handleFormSubmit }
					enableReinitialize
				>
					{ ({ isSubmitting }) => (
						<Form className="grid grid-cols-1 sm:grid-cols-2 gap-6.5 p-6.5">
							{/* Name */ }
							<div>
								<label className="mb-3 block text-black dark:text-white">Name</label>
								<Field type="text" name="name" placeholder="Full Name" className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary" />
								<ErrorMessage name="name" component="p" className="mt-1 text-red-500 text-sm" />
							</div>

							{/* Father's Name */ }
							<div>
								<label className="mb-3 block text-black dark:text-white">Father Name</label>
								<Field type="text" name="fatherName" placeholder="Father's Name" className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary" />
								<ErrorMessage name="fatherName" component="p" className="mt-1 text-red-500 text-sm" />
							</div>

							{/* University */ }
							<div>
								<label className="mb-3 block text-black dark:text-white">University</label>
								<Field type="text" name="university" placeholder="University Name" className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary" />
								<ErrorMessage name="university" component="p" className="mt-1 text-red-500 text-sm" />
							</div>

							{/* Faculty */ }
							<div>
								<label className="mb-3 block text-black dark:text-white">Faculty</label>
								<Field type="text" name="faculty" placeholder="Faculty Name" className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary" />
								<ErrorMessage name="faculty" component="p" className="mt-1 text-red-500 text-sm" />
							</div>

							{/* Department */ }
							<div>
								<label className="mb-3 block text-black dark:text-white">Department</label>
								<Field type="text" name="department" placeholder="Department Name" className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary" />
								<ErrorMessage name="department" component="p" className="mt-1 text-red-500 text-sm" />
							</div>

							{/* Education Degree */ }
							<div>
								<label className="mb-3 block text-black dark:text-white">Education Degree</label>
								<Field as="select" name="educationDegree" className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary">
									<option value="">Select Degree</option>
									<option value="Lisans">Lisans</option>
									<option value="Master">Master</option>
								</Field>
								<ErrorMessage name="educationDegree" component="p" className="mt-1 text-red-500 text-sm" />
							</div>

							{/* Phone Number */ }
							<div>
								<label className="mb-3 block text-black dark:text-white">Phone Number</label>
								<Field type="text" name="phoneNumber" placeholder="Phone Number" className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary" />
								<ErrorMessage name="phoneNumber" component="p" className="mt-1 text-red-500 text-sm" />
							</div>

							{/* Email */ }
							<div>
								<label className="mb-3 block text-black dark:text-white">Email</label>
								<Field type="email" name="email" placeholder="Email Address" className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary" />
								<ErrorMessage name="email" component="p" className="mt-1 text-red-500 text-sm" />
							</div>
							{/* Email */ }
							<div>
								<label className="mb-3 block text-black dark:text-white">Password</label>
								<Field type="password" name="password" placeholder="Password Address" className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary" />
								<ErrorMessage name="password" component="p" className="mt-1 text-red-500 text-sm" />
							</div>

							{/* Submit Button */ }
							<div className="flex flex-col h-full">
								<button
									type="submit"
									disabled={ isSubmitting }
									className="inline-flex items-center justify-center gap-2.5 rounded-md bg-primary py-3 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10 w-full mt-auto"
								>
									{ isSubmitting ? "Updating..." : "Update Candidate" }
								</button>
							</div>
						</Form>
					) }
				</Formik>
			</div>
		</>
	);
};

export default EditCandidate;
