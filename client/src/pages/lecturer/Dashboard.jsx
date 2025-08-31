
const LecturerDashboard = () => {
  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="rounded-xl bg-white p-6 shadow-md dark:bg-boxdark">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-3">
          Welcome, Lecturer 👨‍🏫
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          You have successfully logged into your dashboard. Here, you can easily
          contribute to the question bank, manage your own content, and update
          your profile when needed. This platform is designed to be simple,
          reliable, and secure.
        </p>
      </div>

      {/* Features Section */}
      <div className="rounded-xl bg-white p-6 shadow-md dark:bg-boxdark">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
          What you can do here:
        </h3>
        <ul className="list-disc pl-6 text-gray-600 dark:text-gray-300 space-y-2">
          <li>
            <strong>Add Questions:</strong> Create new questions and add them to
            the <em>Question Bank</em> for candidates.
          </li>
          <li>
            <strong>Manage Questions:</strong> View and edit your existing
            questions whenever needed.
          </li>
          <li>
            <strong>Edit Profile:</strong> Keep your information up to date by
            editing your lecturer profile.
          </li>
        </ul>
      </div>

      {/* Security Section */}
      <div className="rounded-xl bg-white p-6 shadow-md dark:bg-boxdark">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
          Security First 🔒
        </h3>
        <p className="text-gray-600 dark:text-gray-300">
          Your data and questions are fully protected. Only you and authorized
          admins can view or edit your content. The system uses secure
          authentication, encrypted connections, and role-based access to ensure
          that your work remains safe and private.
        </p>
      </div>
    </div>
  );
};

export default LecturerDashboard;
