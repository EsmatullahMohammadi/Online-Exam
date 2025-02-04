
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from '../App';
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


const RouterComponent = () => {
  

  const router = createBrowserRouter([
  {
    path: '/',
    element: <App />, // This is the layout component
  },
  { 
    path: '/admin' ,
    element:(
      <ProtectedRoute  requiredRole="Admin">
        <DefaultLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true, 
        element:(
          <>
            <PageTitle title="Dashbord | Admine - KPU Online Exam" />
            <Dashbord />
          </>         
        )
      },
      {
        path:'profile',
        element:(
          <>
            <PageTitle title="Profile | Admine - KPU Online Exam" />
            <Profile />
          </>         
        )
      },
      {
        path:'settings',
        element:(
          <>
            <PageTitle title="Setting | Admine - KPU Online Exam" />
            <Settings />
          </>         
        )
      },
      {
        path:'tests',
        element:(
          <>
            <PageTitle title="Test | Admine - KPU Online Exam" />
            <Test />
          </>         
        )
      },
      {
        path:'addTest',
        element:(
          <>
            <PageTitle title="Add Test | Admine - KPU Online Exam" />
            <AddTest />
          </>         
        )
      },
      {
        path:'editTest/:id',
        element:(
          <>
            <PageTitle title="Edit Test | Admine - KPU Online Exam" />
            <EditTest />
          </>         
        )
      },
      {
        path:'lecturer',
        element:(
          <>
            <PageTitle title="Lecturer | Admine - KPU Online Exam" />
            <Lecturer />
          </>         
        )
      },
      {
        path:'addLecturer',
        element:(
          <>
            <PageTitle title="Add Lecturer | Admine - KPU Online Exam" />
            <AddLecturer />
          </>         
        )
      },
      {
        path:'condidate',
        element:(
          <>
            <PageTitle title="Condidate | Admine - KPU Online Exam" />
            <Condidate />
          </>         
        )
      },
      {
        path:'addCondidate',
        element:(
          <>
            <PageTitle title="Add Condidate | Admine - KPU Online Exam" />
            <AddCondidate />
          </>         
        )
      },
      {
        path:'question-bank',
        element:(
          <>
            <PageTitle title="Question Bank | Admine - KPU Online Exam" />
            <QuestionBank />
          </>         
        )
      },
      {
        path:'select-question/:testName/:testId/:numberOfQuestion',
        element:(
          <>
            <PageTitle title="Select Question For Test | Admine - KPU Online Exam" />
            <SelectQuestionsForTest />
          </>         
        )
      },
    ]
  },
  {
    path: '/lecturer',
    element:(
      <ProtectedRoute requiredRole="Lecturer">
        <LDefaultLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true, 
        element:(
          <>
            <PageTitle title="Dashbord | Lecturer - KPU Online Exam" />
            <Dashbord />
          </>         
        )
      },
      {
        path: "questions", 
        element:(
          <>
          <PageTitle title="Questions | Lecturer - KPU Online Exam" />
            <Questions />
          </>         
        )
      },
      {
        path: "add-questions", 
        element:(
          <>
          <PageTitle title="Add Questions | Lecturer - KPU Online Exam" />
            <AddQuestion />
          </>         
        )
      },
      {
        path: "settings", 
        element:(
          <>
          <PageTitle title="Settings | Lecturer - KPU Online Exam" />
            <LSettings />
          </>         
        )
      },
    ]
  },
  {
    path: '/condidate',
    element:(
      <ProtectedRoute requiredRole="Candidate">
        <SDefaultLayout />
      </ProtectedRoute>
    ),
    children: [
      {}
    ]
  },
  { path: '/auth/signin', element: <SignIn /> },
  { path: '/auth/forgot-password', element: <ForgotPassword /> },
]);

return <RouterProvider router={router} />;

};

export default RouterComponent;


