
import { createBrowserRouter } from 'react-router-dom';
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
import SignUp from '../pages/Authentication/SignUp';
import LDefaultLayout from '../pages/lecturer/layout/LDefaultLayout';
import SDefaultLayout from '../pages/student/layout/SDefaultLayout';
import EditTest from '../pages/admin/Test/EditTest';
import Dashbord from '../pages/admin/dashbord/Dashbord';


const router = createBrowserRouter([
  {
    path: '/',
    element: <App />, // This is the layout component
  },
  { 
    path: '/dashbord' ,
    element: <DefaultLayout />,
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
    ]
  },
  {
    path: '/lecturer',
    element: <LDefaultLayout />,
    children: [
      {}
    ]
  },
  {
    path: '/condidate',
    element: <SDefaultLayout />,
    children: [
      {}
    ]
  },
  { path: '/auth/signin', element: <SignIn /> },
  { path: '/auth/signup', element: <SignUp /> },
]);

export default router;


