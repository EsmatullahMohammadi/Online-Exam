import { Link } from "react-router-dom";
import { FiAlertCircle, FiMail, FiEye, FiEyeOff } from "react-icons/fi";
import LogoP from "../../../public/logo.png";
import { useSignInForm } from "../../hooks/auth/useSignInForm";

const SignIn = () => {
  const {
    formik,
    serverError,
    selectItem,
    setSelectItem,
    showPassword,
    toggleShowPassword,
    isLoading
  } = useSignInForm();

  return (
    <>
      <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-5 2xl:px-48">
        <div className="rounded-2xl border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="flex flex-wrap items-center">
            <div className="w-full xl:block xl:w-1/2">
              <div className="py-17.5 px-26 text-center">
                <Link className="mb-2 inline-block" to="/">
                  <img className="dark:hidden h-30" src={ LogoP } alt="Logo" />
                </Link>
                <p className="2xl:px-0">
                 Login here in Kabul Polytechnic University Online Exam
                </p>
              </div>
            </div>
            <div className="w-full border-stroke dark:border-strokedark xl:w-1/2 xl:border-l-2">
              <div className="w-full p-4 sm:p-12.5 xl:p-17.5">
                <h2 className="mb-9 text-2xl font-bold text-black dark:text-white sm:text-title-xl2">
                  Sign In to KPU Language Exam System
                </h2>

                { serverError && (
                  <div className="mb-4 flex items-center justify-center bg-red-100 border border-red-400 text-red-600 rounded-lg px-4 py-3">
                    <FiAlertCircle className="w-6 h-6 mr-2" />
                    { serverError }
                  </div>
                ) }

                <form onSubmit={ formik.handleSubmit }>
                  <div className="mb-4">
                    <label className="mb-2.5 block font-medium text-black dark:text-white">
                      Kind of User
                    </label>
                    <div className="relative">
                      <select
                        onChange={ (event) => setSelectItem(event.target.value) }
                        value={ selectItem }
                        className="w-full rounded-lg border border-stroke bg-transparent py-3 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                      >
                        <option value="Admin" defaultChecked>Admin</option>
                        <option value="Lecturer">Lecturer</option>
                        <option value="Candidate">Candidate</option>
                      </select>
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="mb-2.5 block font-medium text-black dark:text-white">
                      Email/Username
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Enter your email/username"
                        name="emailAddress"
                        value={ formik.values.emailAddress }
                        onChange={ formik.handleChange }
                        onBlur={ formik.handleBlur }
                        className={ `w-full rounded-lg border ${formik.touched.emailAddress && formik.errors.emailAddress
                            ? "border-red-500"
                            : "border-stroke"
                          } bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary` }
                      />
                      <span className="absolute right-4 top-4">
                        <FiMail size={ 22 } opacity={ 0.5 } />
                      </span>
                    </div>
                    { formik.touched.emailAddress && formik.errors.emailAddress && (
                      <div className="text-red-500 mt-1">
                        { formik.errors.emailAddress }
                      </div>
                    ) }
                  </div>

                  <div className="mb-6">
                    <label className="mb-2.5 block font-medium text-black dark:text-white">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        type={ showPassword ? "text" : "password" }
                        placeholder="Enter your password"
                        name="password"
                        value={ formik.values.password }
                        onChange={ formik.handleChange }
                        onBlur={ formik.handleBlur }
                        className={ `w-full rounded-lg border ${formik.touched.password && formik.errors.password
                            ? "border-red-500"
                            : "border-stroke"
                          } bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary` }
                      />
                      <button
                        type="button"
                        onClick={ toggleShowPassword }
                        className="absolute right-4 top-4 text-gray-500 dark:text-gray-300"
                      >
                        { showPassword ? <FiEyeOff size={ 22 } /> : <FiEye size={ 22 } /> }
                      </button>
                    </div>
                    { formik.touched.password && formik.errors.password && (
                      <div className="text-red-500 mt-1">
                        { formik.errors.password }
                      </div>
                    ) }
                  </div>
                  <div className="mb-5">
                    <button
                      type="submit"
                      disabled={ isLoading }
                      className={ `w-full rounded-lg border border-primary bg-primary p-4 text-white transition hover:bg-opacity-90 ${isLoading ? "opacity-50 cursor-not-allowed" : ""
                        }` }
                    >
                      { isLoading ? "Signing In..." : "Sign In" }
                    </button>
                  </div>

                  {/* <div className="mt-6">
                    <p>
                      <Link to="/auth/forgot-password" className="text-primary">
                        Forgot Your Password?
                      </Link>
                    </p>
                  </div> */}

                </form>
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
};

export default SignIn;
