/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import  { useEffect, useRef, useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { FaClipboardList, FaChalkboardTeacher, FaTachometerAlt, FaUserGraduate, FaBook, FaCog, FaArrowLeft, FaFileAlt } from "react-icons/fa";
import { FiLogOut } from 'react-icons/fi';
import { SUPER_DOMAIN } from '../constant';
import axios from 'axios';


const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const navigate = useNavigate();

  const location = useLocation();
  const { pathname } = location;

  const trigger = useRef(null);
  const sidebar = useRef(null);

  const storedSidebarExpanded = localStorage.getItem('sidebar-expanded');
  const [sidebarExpanded, setSidebarExpanded] = useState(
    storedSidebarExpanded === null ? false : storedSidebarExpanded === 'true'
  );

  // Close sidebar on outside click
  useEffect(() => {
    const clickHandler = ({ target }) => {
      if (!sidebar.current || !trigger.current) return;
      if (
        !sidebarOpen ||
        sidebar.current.contains(target) ||
        trigger.current.contains(target)
      )
        return;
      setSidebarOpen(false);
    };
    document.addEventListener('click', clickHandler);
    return () => document.removeEventListener('click', clickHandler);
  }, [sidebarOpen, setSidebarOpen]);

  // Close sidebar on Esc key press
  useEffect(() => {
    const keyHandler = ({ keyCode }) => {
      if (!sidebarOpen || keyCode !== 27) return;
      setSidebarOpen(false);
    };
    document.addEventListener('keydown', keyHandler);
    return () => document.removeEventListener('keydown', keyHandler);
  }, [sidebarOpen, setSidebarOpen]);

  // Manage sidebar expanded state
  useEffect(() => {
    localStorage.setItem('sidebar-expanded', sidebarExpanded.toString());
    if (sidebarExpanded) {
      document.querySelector('body')?.classList.add('sidebar-expanded');
    } else {
      document.querySelector('body')?.classList.remove('sidebar-expanded');
    }
  }, [sidebarExpanded]);

  const handleLogout = async () => {
    try {
        const response = await axios.get(`${SUPER_DOMAIN}/logout-admin`, {
          withCredentials: true, // Ensure cookies are included in the request
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.data.status) {
          navigate("/auth/signin")
        }
    } catch (err) {
      console.log(err) // Redirect to sign-in if authentication fails
    }
  };
  return (
    <aside
      ref={ sidebar }
      className={ `absolute left-0 top-0 z-9999 flex h-screen w-72.5 flex-col overflow-y-hidden bg-black duration-300 ease-linear dark:bg-boxdark lg:static lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }` }
    >
      {/* <!-- SIDEBAR HEADER --> */ }
      <div className="flex items-center justify-between gap-2 px-6 py-5.5 lg:py-6.5">
        <NavLink to="/" >
          <img src="/logo.png" alt="Logo" className='w-32' />
        </NavLink>
        <button
          ref={ trigger }
          onClick={ () => setSidebarOpen(!sidebarOpen) }
          aria-controls="sidebar"
          aria-expanded={ sidebarOpen }
          className="block lg:hidden"
        >
          <FaArrowLeft className="text-current w-7 h-7" />
        </button>
      </div>
      {/* <!-- SIDEBAR HEADER --> */ }

      <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear">
        {/* <!-- Sidebar Menu --> */ }
        <nav className="mt-5 py-4 px-4 lg:mt-9 lg:px-6">
          {/* <!-- Menu Group --> */ }
          <div>
            <h3 className="mb-4 ml-4 text-sm font-semibold text-bodydark2">MENU</h3>
            <ul className="mb-6 flex flex-col gap-2">
              {/* <!-- Menu Item Dashboard --> */ }
              <li>
                <NavLink
                  to="/admin"
                  end
                  className={ ({ isActive }) =>
                    `group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${isActive &&
                    'bg-graydark dark:bg-meta-4'
                    }` }
                >
                  <FaTachometerAlt className="text-2xl" />

                  Dashboard
                </NavLink>
              </li>
              {/* <!-- Menu Item Dashboard --> */ }
              {/* <!-- Menu Item Test --> */ }
              <li>
                <NavLink
                  to="/admin/tests"
                  className={ `group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${pathname.includes('tests') &&
                    'bg-graydark dark:bg-meta-4'
                    }` }
                >
                  <FaClipboardList className="text-2xl" />
                  Test
                </NavLink>
              </li>
              {/* <!-- Menu Item Test --> */ }
              {/* <!-- Menu Item Lecturare --> */ }
              <li>
                <NavLink
                  to="/admin/lecturer"
                  className={ `group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${pathname.includes('lecturer') &&
                    'bg-graydark dark:bg-meta-4'
                    }` }
                >
                  <FaChalkboardTeacher className="text-2xl" />
                  Lecturer
                </NavLink>
              </li>
              {/* <!-- Menu Item Lecturare --> */ }
              {/* <!-- Menu Item Student --> */ }
              <li>
                <NavLink
                  to="/admin/condidate"
                  className={ `group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${pathname.includes('condidate') &&
                    'bg-graydark dark:bg-meta-4'
                    }` }
                >
                  <FaUserGraduate className="text-2xl" />
                  Condidate
                </NavLink>
              </li>
              {/* <!-- Menu Item Student --> */ }
              {/* <!-- Menu Item Question Bank --> */ }
              <li>
                <NavLink
                  to="/admin/question-bank"
                  className={ `group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${pathname.includes('question-bank') &&
                    'bg-graydark dark:bg-meta-4'
                    }` }
                >
                  <FaBook className="text-2xl" />
                  Question Bank
                </NavLink>
              </li>
              {/* <!-- Menu Item Question Bank --> */ }
              {/* Menu Item Result */ }
              <li>
                <NavLink
                  to="/admin/results"
                  className={ ({ isActive }) =>
                    `group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${isActive &&
                    'bg-graydark dark:bg-meta-4'
                    }` }
                >
                  <FaFileAlt className="text-2xl" />
                  Result
                </NavLink>
              </li>
              {/* <!-- Menu Item Settings --> */ }
              <li>
                <NavLink
                  to="/admin/settings"
                  className={ ({ isActive }) =>
                    `group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${isActive &&
                    'bg-graydark dark:bg-meta-4'
                    }` }
                >
                  <FaCog className="text-2xl" />
                  Settings
                </NavLink>
              </li>
              <li>
                <button
                  onClick={ handleLogout }
                  className={ `group relative w-full flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${pathname.includes('logout') &&
                    'bg-graydark dark:bg-meta-4'
                    }` }
                >
                  <FiLogOut className="text-2xl" />
                  Logout
                </button>
              </li>
              {/* <!-- Menu Item Settings --> */ }

            </ul>
          </div>
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
