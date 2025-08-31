
const CandidateDashboard = () => {
  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="rounded-xl bg-white p-6 shadow-md dark:bg-boxdark">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-3">
          Welcome, Candidate 🎓
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          You are now in your candidate dashboard. This is where you will take
          your <strong>English Exam</strong>, which is required before becoming
          a university lecturer. Please read the instructions carefully and
          manage your exam responsibly.
        </p>
      </div>

      {/* Exam Instructions */}
      <div className="rounded-xl bg-white p-6 shadow-md dark:bg-boxdark">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
          About Your Exam 📝
        </h3>
        <ul className="list-disc pl-6 text-gray-600 dark:text-gray-300 space-y-2">
          <li>
            <strong>Listening:</strong> You will listen to an audio recording
            and answer related questions.
          </li>
          <li>
            <strong>Reading:</strong> Read a passage carefully and answer the
            given questions.
          </li>
          <li>
            <strong>Writing:</strong> Write responses based on the given
            prompts.
          </li>
          <li>
            <strong>Grammar:</strong> Answer grammar-based multiple-choice
            questions.
          </li>
        </ul>
        <p className="mt-3 text-gray-600 dark:text-gray-300">
          Once you complete and <strong>submit</strong> your exam, you cannot
          retake it. Please make sure you review your answers before submitting.
        </p>
      </div>

      {/* After Exam Section */}
      <div className="rounded-xl bg-white p-6 shadow-md dark:bg-boxdark">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
          After Submission ✅
        </h3>
        <p className="text-gray-600 dark:text-gray-300">
          Once submitted, your answers will be evaluated automatically. You can
          then view your <strong>results</strong> in the results section. This
          will show your performance in Listening, Reading, Writing, and
          Grammar.
        </p>
      </div>

      {/* Profile Section */}
      <div className="rounded-xl bg-white p-6 shadow-md dark:bg-boxdark">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
          Manage Your Profile 👤
        </h3>
        <p className="text-gray-600 dark:text-gray-300">
          Keep your personal details up to date by editing your profile. Your
          profile will be used to identify you during exams and for official
          records.
        </p>
      </div>

      {/* Security Section */}
      <div className="rounded-xl bg-white p-6 shadow-md dark:bg-boxdark">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
          Security Matters 🔒
        </h3>
        <p className="text-gray-600 dark:text-gray-300">
          Your exam is strictly protected. Each candidate is allowed only
          <strong> one submission</strong>. The system prevents re-entry after
          submission to ensure fairness. All your data and results are encrypted
          and can only be accessed by you and authorized examiners.
        </p>
      </div>
    </div>
  );
};

export default CandidateDashboard;
