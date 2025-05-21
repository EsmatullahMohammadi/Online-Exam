import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import api from '../../service/api';

export const useSignInForm = () => {
    const [selectItem, setSelectItem] = useState("Admin");
    const [isLoading, setIsLoading] = useState(false);
    const [serverError, setServerError] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const navigate = useNavigate();
    const toggleShowPassword = () => {
        setShowPassword((prev) => !prev);
    };

    const formik = useFormik({
        initialValues: {
            emailAddress: "",
            password: "",
        },
        validationSchema: Yup.object({
            emailAddress: Yup.string()
                .email("Invalid email address")
                .required("Email is required"),
            password: Yup.string()
                .min(6, "Password must be at least 6 characters")
                .required("Password is required"),
        }),
        onSubmit: async (values) => {
            setServerError("");
            setIsLoading(true);
            try {
                const response = await api.post(`/login`, {
                    emailAddress: values.emailAddress,
                    password: values.password,
                    role: selectItem,
                });

                if (response.status === 200) {
                    if (response.data.role === "Admin") {
                        sessionStorage.setItem("name", response.data.name);
                        sessionStorage.setItem("arole", response.data.role);
                        sessionStorage.setItem("adminId", response.data.adminId);
                        setIsLoading(false);
                        navigate("/admin");
                    } else if (response.data.role === "Lecturer") {
                        sessionStorage.setItem("lrole", response.data.role);
                        sessionStorage.setItem("name", response.data.name);
                        sessionStorage.setItem("category", response.data.category);
                        sessionStorage.setItem("lecturerID", response.data.lecturerID);
                        setIsLoading(false);
                        navigate("/lecturer");
                    } else if (response.data.role === "Candidate") {
                        sessionStorage.setItem("crole", response.data.role);
                        sessionStorage.setItem("name", response.data.name);
                        sessionStorage.setItem("_id", response.data.id);
                        sessionStorage.setItem("candidateID", response.data.id);
                        setIsLoading(false);
                        navigate("/candidate");
                    } else {
                        setServerError("The type of user is not authenticated.");
                    }
                }
            } catch (error) {
                if (error.response) {
                    setServerError(error.response.data.message || "Login failed");
                } else {
                    setServerError("An error occurred. Please try again.");
                }
                setIsLoading(false);
            }
        },
    });

    return { formik, serverError, selectItem, setSelectItem, showPassword, toggleShowPassword, isLoading };
};
