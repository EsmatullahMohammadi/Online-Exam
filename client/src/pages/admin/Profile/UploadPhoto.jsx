/* eslint-disable react/prop-types */

import { HiOutlineUpload } from 'react-icons/hi';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { SUPER_DOMAIN } from '../constant';

const UploadPhoto = ({ id, role }) => {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);
  const [uploadedImage, setUploadedImage] = useState(null);

  // Fetch existing admin image on mount
  useEffect(() => {
    const fetchAdminImage = async () => {
      try {
        const response = await axios.get(`${SUPER_DOMAIN}/get-image/${role}/${id}`);
				
        if (response.data.profileImage) {
          setUploadedImage(`${SUPER_DOMAIN}/userImage/${response.data.profileImage}`);
        }
      } catch (error) {
        console.error("Error fetching user image:", error);
      }
    };

    fetchAdminImage();
  }, [id, uploadedImage, role]);
  // Handle file selection
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file)); // Show preview before upload
    }
  };

  // Handle file upload
  const handleUpload = async () => {
    if (!image) return alert("Please select an image.");

    const formData = new FormData();
    formData.append("profileImage", image);

    setIsUploading(true);
    setError(null);

    try {
      const response = await axios.put(`${SUPER_DOMAIN}/update-image/${role}/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert(response.data.message);
      setUploadedImage(`${SUPER_DOMAIN}/uploads/${response.data.imageUrl}`);
      setPreview(null); // Reset preview after upload
    } catch (error) {
      setError("Upload failed! Please try again.");
			alert(error)
      console.error(error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="col-span-5 xl:col-span-2">
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="border-b border-stroke py-4 px-7 dark:border-strokedark">
          <h3 className="font-medium text-black dark:text-white">Your Photo</h3>
        </div>
        <div className="p-7">
          <form>
            {/* Profile Image Display */}
            <div className="mb-4 flex items-center gap-3">
              <div className="h-14 w-14 rounded-full">
                <img src={preview || uploadedImage} alt="User" className="h-14 w-14 rounded-full object-cover" />
              </div>
              <div>
                <span className="mb-1.5 text-black dark:text-white">Edit your photo</span>
                <span className="flex gap-2.5">
                  <button className="text-sm text-red-500 hover:text-red-700" onClick={() => setPreview(null)}>
                    Remove
                  </button>
                  <button className="text-sm text-blue-500 hover:text-blue-700" onClick={handleUpload} disabled={isUploading}>
                    {isUploading ? "Uploading..." : "Update"}
                  </button>
                </span>
              </div>
            </div>

            {/* File Upload Input */}
            <div
              id="FileUpload"
              className="relative mb-5 block w-full cursor-pointer appearance-none rounded border border-dashed border-primary bg-gray py-4 px-4 dark:bg-meta-4 sm:py-7.5"
            >
              <input
                type="file"
                onChange={handleFileChange}
                accept="image/*"
                className="absolute inset-0 z-50 m-0 h-full w-full cursor-pointer p-0 opacity-0 outline-none"
              />
              <div className="flex flex-col items-center justify-center space-y-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full border border-stroke bg-white dark:border-strokedark dark:bg-boxdark">
                  <HiOutlineUpload size={24} color="#3C50E0" />
                </span>
                <p>
                  <span className="text-primary">Click to upload</span> or drag and drop
                </p>
                <p className="mt-1.5">SVG, PNG, JPG or GIF</p>
                <p>(max, 800 X 800px)</p>
              </div>
            </div>

            {/* Upload Buttons */}
            <div className="flex justify-end gap-4.5">
              <button
                className="flex justify-center rounded border border-stroke py-2 px-6 font-medium text-black hover:shadow-1 dark:border-strokedark dark:text-white"
                type="button"
                onClick={() => setPreview(null)}
              >
                Cancel
              </button>
              <button
                className="flex justify-center rounded bg-primary py-2 px-6 font-medium text-gray hover:bg-opacity-90"
                onClick={handleUpload}
                disabled={isUploading}
              >
                {isUploading ? "Uploading..." : "Save"}
              </button>
            </div>

            {error && <p className="text-red-500 mt-3 font-bold">{error}</p>}
          </form>
        </div>
      </div>
    </div>
  );
};

export default UploadPhoto;
