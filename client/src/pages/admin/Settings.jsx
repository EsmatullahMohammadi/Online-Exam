
import axios from 'axios';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import { FiMail } from 'react-icons/fi';
import { HiOutlineUser } from 'react-icons/hi';
import { SUPER_DOMAIN } from './constant';
import UploadPhoto from './Profile/UploadPhoto';

const Settings = () => {
  const validationSchema = Yup.object().shape({
    fullName: Yup.string().required('Full Name is required'),
    phoneNumber: Yup.string()
      .required('Phone Number is required')
      .matches(/^\d+$/, 'Phone Number must be numeric')
      .min(10, 'Phone Number must be at least 10 digits'),
    emailAddress: Yup.string()
      .email('Invalid email address')
      .required('Email Address is required'),
    currentPassword: Yup.string().required('Current Password is required'),
    newPassword: Yup.string()
      .required('New Password is required')
      .min(8, 'New Password must be at least 8 characters'),
  });

  const formik = useFormik({
    initialValues: {
      fullName: '',
      phoneNumber: '',
      emailAddress: '',
      currentPassword: '',
      newPassword: '',
    },
    validationSchema,
    onSubmit: async (values,{resetForm}) => {
      try {
        const response = await axios.put(`${SUPER_DOMAIN}/settings`, values);
        if (response.status === 200) {
          alert(response.data.message || 'Your Profile Successfully!');
          resetForm();
        } else {
          alert(response.data.message || 'Error updating setting');
        }
      } catch (error) {
        console.error('Error updating settings:', error);
        alert(error.response?.data?.message || 'An error occurred');
      }
    },
  });

  return (
    <>
      <div className="mx-auto max-w-270">
        <Breadcrumb pageName="Settings" />

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
                  <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                    <div className="w-full sm:w-1/2">
                      <label
                        className="mb-3 block text-sm font-medium text-black dark:text-white"
                        htmlFor="fullName"
                      >
                        Full Name
                      </label>
                      <div className="relative">
                        <span className="absolute left-4.5 top-3">
                          <HiOutlineUser style={{ fontSize: '23px' }} />
                        </span>
                        <input
                          className={`w-full rounded border ${
                            formik.errors.fullName && formik.touched.fullName
                              ? 'border-red-500'
                              : 'border-stroke'
                          } bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white`}
                          type="text"
                          name="fullName"
                          id="fullName"
                          value={formik.values.fullName}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          placeholder="Full Name"
                        />
                        {formik.touched.fullName && formik.errors.fullName && (
                          <p className="text-red-500 text-sm mt-1">
                            {formik.errors.fullName}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="w-full sm:w-1/2">
                      <label
                        className="mb-3 block text-sm font-medium text-black dark:text-white"
                        htmlFor="phoneNumber"
                      >
                        Phone Number
                      </label>
                      <input
                        className={`w-full rounded border ${
                          formik.errors.phoneNumber && formik.touched.phoneNumber
                            ? 'border-red-500'
                            : 'border-stroke'
                        } bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white`}
                        type="text"
                        name="phoneNumber"
                        id="phoneNumber"
                        value={formik.values.phoneNumber}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder="Phone Number"
                      />
                      {formik.touched.phoneNumber && formik.errors.phoneNumber && (
                        <p className="text-red-500 text-sm mt-1">
                          {formik.errors.phoneNumber}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="mb-5.5">
                    <label
                      className="mb-3 block text-sm font-medium text-black dark:text-white"
                      htmlFor="emailAddress"
                    >
                      Email Address
                    </label>
                    <div className="relative">
                      <span className="absolute left-4.5 top-4">
                        <FiMail style={{ fontSize: '20px' }} />
                      </span>
                      <input
                        className={`w-full rounded border ${
                          formik.errors.emailAddress && formik.touched.emailAddress
                            ? 'border-red-500'
                            : 'border-stroke'
                        } bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white`}
                        type="email"
                        name="emailAddress"
                        id="emailAddress"
                        value={formik.values.emailAddress}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder="Email Address"
                      />
                      {formik.touched.emailAddress && formik.errors.emailAddress && (
                        <p className="text-red-500 text-sm mt-1">
                          {formik.errors.emailAddress}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                    <div className="w-full sm:w-1/2">
                      <label
                        className="mb-3 block text-sm font-medium text-black dark:text-white"
                        htmlFor="currentPassword"
                      >
                        Current Password
                      </label>
                      <input
                        className={`w-full rounded border ${
                          formik.errors.currentPassword && formik.touched.currentPassword
                            ? 'border-red-500'
                            : 'border-stroke'
                        } bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white`}
                        type="password"
                        name="currentPassword"
                        id="currentPassword"
                        value={formik.values.currentPassword}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder="Current Password"
                      />
                      {formik.touched.currentPassword &&
                        formik.errors.currentPassword && (
                          <p className="text-red-500 text-sm mt-1">
                            {formik.errors.currentPassword}
                          </p>
                        )}
                    </div>

                    <div className="w-full sm:w-1/2">
                      <label
                        className="mb-3 block text-sm font-medium text-black dark:text-white"
                        htmlFor="newPassword"
                      >
                        New Password
                      </label>
                      <input
                        className={`w-full rounded border ${
                          formik.errors.newPassword && formik.touched.newPassword
                            ? 'border-red-500'
                            : 'border-stroke'
                        } bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white`}
                        type="password"
                        name="newPassword"
                        id="newPassword"
                        value={formik.values.newPassword}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder="New Password"
                      />
                      {formik.touched.newPassword && formik.errors.newPassword && (
                        <p className="text-red-500 text-sm mt-1">
                          {formik.errors.newPassword}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-end gap-4.5">
                    <button
                      className="flex justify-center rounded border border-stroke py-2 px-6 font-medium text-black hover:shadow-1 dark:border-strokedark dark:text-white"
                      type="button"
                    >
                      Cancel
                    </button>
                    <button
                      className="flex justify-center rounded bg-primary py-2 px-6 font-medium text-gray hover:bg-opacity-90"
                      type="submit"
                    >
                      Save
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
          <UploadPhoto />
        </div>
      </div>
    </>
  );
};

export default Settings;
