
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import PageTitle from '../components/PageTitle';
import AddCondidate from '../pages/admin/Condidate/AddCondidate';
import Condidate from '../pages/admin/Condidate/Condidate';
import DefaultLayout from '../pages/admin/layout/DefaultLayout';
import AddLecturer from '../pages/admin/Lecturer/AddLecturer';
import Lecturer from '../pages/admin/Lecturer/Lecturer';
import Profile from '../pages/admin/Profile';
import Settings from '../pages/admin/Settings';
import AddTest from '../pages/admin/Test/AddTest';
import Test from '../pages/admin/Test/Test';
import SignIn from '../pages/Authentication/SignIn';
import LDefaultLayout from '../pages/lecturer/layout/LDefaultLayout';
import SDefaultLayout from '../pages/student/layout/SDefaultLayout';
import EditTest from '../pages/admin/Test/EditTest';
import Dashbord from '../pages/admin/dashbord/Dashbord';
import Questions from '../pages/lecturer/Questions/Questions';
import AddQuestion from '../pages/lecturer/Questions/AddQuestion';
import ForgotPassword from '../pages/Authentication/ForgotPassword';
import ProtectedRoute from '../pages/Authentication/ProtectedRoute';
import LSettings from '../pages/lecturer/LSettings';
import QuestionBank from '../pages/admin/QuestionBank/QuestionBank';
import SelectQuestionsForTest from '../pages/admin/Test/SelectQuestionsForTest';
import GetRelatedTest from '../pages/student/Tests/GetReleatedTest';
import CondidateResult from '../pages/student/Result/CondidateResult';
import CSettings from '../pages/student/CSettings';
import Result from '../pages/admin/results/Result';
import DemoQuestions from '../pages/admin/Test/DemoQuestions';
import EditCondidate from '../pages/admin/Condidate/EditCondidate';
import CandidateExamPaginate from '../pages/student/Tests/CandidateExamPaginate';
import Home from '../pages/landing/Home';
import AboutHome from '../pages/landing/AboutHome';
import NavBar from '../components/Landing/NavBar';
import Footer from '../pages/landing/Footer';
import FilterByTest from '../pages/admin/Condidate/FilterByTest';
import EditQuestion from '../pages/lecturer/Questions/EditQuestion';


const RouterComponent = () => {
  

  const router = createBrowserRouter([
    // {
    //   path: "/",
    //   element: <App />,
    // },
    {
      path: "/",
      element: (
        <>
          <NavBar />
          <Home />
          <AboutHome />
          <Footer />
        </>
      ),
    },
    {
      path: "/admin",
      element: (
        <ProtectedRoute requiredRole="Admin">
          <DefaultLayout />
        </ProtectedRoute>
      ),
      children: [
        {
          index: true,
          element: (
            <>
              <PageTitle title="Dashbord | Admine - KPU Online Exam" />
              <Dashbord />
            </>
          ),
        },
        {
          path: "profile",
          element: (
            <>
              <PageTitle title="Profile | Admine - KPU Online Exam" />
              <Profile />
            </>
          ),
        },
        {
          path: "settings",
          element: (
            <>
              <PageTitle title="Setting | Admine - KPU Online Exam" />
              <Settings />
            </>
          ),
        },
        {
          path: "tests",
          element: (
            <>
              <PageTitle title="Test | Admine - KPU Online Exam" />
              <Test />
            </>
          ),
        },
        {
          path: "addTest",
          element: (
            <>
              <PageTitle title="Add Test | Admine - KPU Online Exam" />
              <AddTest />
            </>
          ),
        },
        {
          path: "editTest/:id",
          element: (
            <>
              <PageTitle title="Edit Test | Admine - KPU Online Exam" />
              <EditTest />
            </>
          ),
        },
        {
          path: "lecturer",
          element: (
            <>
              <PageTitle title="Lecturer | Admine - KPU Online Exam" />
              <Lecturer />
            </>
          ),
        },
        {
          path: "addLecturer",
          element: (
            <>
              <PageTitle title="Add Lecturer | Admine - KPU Online Exam" />
              <AddLecturer />
            </>
          ),
        },
        {
          path: "condidate",
          element: (
            <>
              <PageTitle title="Candidate | Admine - KPU Online Exam" />
              <Condidate />
            </>
          ),
        },
        {
          path: "addCondidate",
          element: (
            <>
              <PageTitle title="Add Candidate | Admine - KPU Online Exam" />
              <AddCondidate />
            </>
          ),
        },
        {
          path: "condidate/edit-candidate",
          element: (
            <>
              <PageTitle title="Edit Candidate | Admine - KPU Online Exam" />
              <EditCondidate />
            </>
          ),
        },
        {
          path: "condidate/filter-by-test",
          element: (
            <>
              <PageTitle title="Filter Candidate By test | Admine - KPU Online Exam" />
              <FilterByTest />
            </>
          ),
        },
        {
          path: "question-bank",
          element: (
            <>
              <PageTitle title="Question Bank | Admine - KPU Online Exam" />
              <QuestionBank />
            </>
          ),
        },
        {
          path: "select-question/:testName",
          element: (
            <>
              <PageTitle title="Select Question For Test | Admine - KPU Online Exam" />
              <SelectQuestionsForTest />
            </>
          ),
        },
        {
          path: "demo-question/:testId",
          element: (
            <>
              <PageTitle title="Demo Question | Admin - KPU Online Exam" />
              <DemoQuestions />
            </>
          ),
        },
        {
          path: "results",
          element: (
            <>
              <PageTitle title="Result | Lecturer - KPU Online Exam" />
              <Result />
            </>
          ),
        },
      ],
    },
    {
      path: "/lecturer",
      element: (
        <ProtectedRoute requiredRole="Lecturer">
          <LDefaultLayout />
        </ProtectedRoute>
      ),
      children: [
        {
          index: true,
          element: (
            <>
              <PageTitle title="Dashbord | Lecturer - KPU Online Exam" />
              <Dashbord />
            </>
          ),
        },
        {
          path: "questions",
          element: (
            <>
              <PageTitle title="Questions | Lecturer - KPU Online Exam" />
              <Questions />
            </>
          ),
        },
        {
          path: "add-questions",
          element: (
            <>
              <PageTitle title="Add Questions | Lecturer - KPU Online Exam" />
              <AddQuestion />
            </>
          ),
        },
        {
          path: "edit-question/:id",
          element: (
            <>
              <PageTitle title="Edit Questions | Lecturer - KPU Online Exam" />
              <EditQuestion />
            </>
          ),
        },
        {
          path: "settings",
          element: (
            <>
              <PageTitle title="Settings | Lecturer - KPU Online Exam" />
              <LSettings />
            </>
          ),
        },
      ],
    },
    {
      path: "/candidate",
      element: (
        <ProtectedRoute requiredRole="Candidate">
          <SDefaultLayout />
        </ProtectedRoute>
      ),
      children: [
        {
          index: true,
          element: (
            <>
              <PageTitle title="Dashbord | Candidate - KPU Online Exam" />
              <Dashbord />
            </>
          ),
        },
        {
          path: "candidate-question/:testId",
          element: (
            <>
              <PageTitle title="Submit Question | Candidate - KPU Online Exam" />
              <CandidateExamPaginate />
            </>
          ),
        },
        {
          path: "all-tests",
          element: (
            <>
              <PageTitle title="Candidate Exam | Candidate - KPU Online Exam" />
              <GetRelatedTest />
            </>
          ),
        },
        {
          path: "candidate-result",
          element: (
            <>
              <PageTitle title="Candidate Result | Candidate - KPU Online Exam" />
              <CondidateResult />
            </>
          ),
        },
        {
          path: "settings",
          element: (
            <>
              <PageTitle title="Settings | Candidate - KPU Online Exam" />
              <CSettings />
            </>
          ),
        },
      ],
    },
    { path: "/auth/signin", element: <SignIn /> },
    { path: "/auth/forgot-password", element: <ForgotPassword /> },
  ]);

return <RouterProvider router={router} />;

};

export default RouterComponent;


