/* eslint-disable react/prop-types */

const ViewCandidateDetails = ({ candidate, onClose }) => {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-6">
          {/* Modal Header */}
          <div className="flex justify-between items-center border-b pb-2 mb-4">
            <h2 className="text-lg font-semibold">Candidate Details</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition text-2xl font-bold"
            >
              &times;
            </button>
          </div>
  
          {/* Modal Body */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <h3 className="text-base font-medium text-gray-700">
              Name: <span className="font-normal">{candidate?.name || "N/A"}</span>
            </h3>
            <h3 className="text-base font-medium text-gray-700">
              Father Name: <span className="font-normal">{candidate?.fatherName || "N/A"}</span>
            </h3>
            <h3 className="text-base font-medium text-gray-700">
              University: <span className="font-normal">{candidate?.university || "N/A"}</span>
            </h3>
            <h3 className="text-base font-medium text-gray-700">
              Faculty: <span className="font-normal">{candidate?.faculty || "N/A"}</span>
            </h3>
            <h3 className="text-base font-medium text-gray-700">
              Department: <span className="font-normal">{candidate?.department || "N/A"}</span>
            </h3>
            <h3 className="text-base font-medium text-gray-700">
              Education Degree: <span className="font-normal">{candidate?.educationDegree || "N/A"}</span>
            </h3>
            <h3 className="text-base font-medium text-gray-700">
              Phone Number: <span className="font-normal">{candidate?.phoneNumber || "N/A"}</span>
            </h3>
            <h3 className="text-base font-medium text-gray-700">
              Email: <span className="font-normal">{candidate?.email || "N/A"}</span>
            </h3>
            <h3 className="text-base font-medium text-gray-700">
              Status:
              <span
                className={`ml-2 px-3 py-1 rounded-full text-sm font-medium ${
                  candidate?.status === "Pending"
                    ? "bg-yellow-100 text-yellow-700"
                    : candidate?.status === "Passed"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {candidate?.status || "N/A"}
              </span>
            </h3>
          </div>
  
          {/* Modal Footer */}
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };
  
  export default ViewCandidateDetails;
  