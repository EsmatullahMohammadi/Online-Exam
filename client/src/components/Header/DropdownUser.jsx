import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ClickOutside from '../ClickOutside';
import UserOne from '../../images/user/user-000.png';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { SUPER_DOMAIN } from '../../pages/admin/constant';
import { FiLogOut } from 'react-icons/fi';
import { FaChevronDown, FaCog, FaUser } from 'react-icons/fa';
const DropdownUser = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const adminRole = sessionStorage.getItem("arole");
  const lecturerRole = sessionStorage.getItem("lrole");
  const candidateRole = sessionStorage.getItem("crole");
  const [imageProfile ,setImageProfile] = useState(null);
  const adminId= sessionStorage.getItem("adminId");
  const lecturerId= sessionStorage.getItem("lecturerID");
  const candidateId= sessionStorage.getItem("candidateID");

  axios.defaults.withCredentials = true;
  useEffect(() => {
    const fetchAdminImage = async () => {
      try {
        const response = await axios.get(`${SUPER_DOMAIN}/get-image/${adminRole || lecturerRole || candidateRole}/${adminId || lecturerId || candidateId}`);
				
        if (response.data.profileImage) {
          setImageProfile(`${SUPER_DOMAIN}/userImage/${response.data.profileImage}`);
        }
      } catch (error) {
        console.error("Error fetching user image:", error);
      }
    };

    fetchAdminImage();
  }, [adminId]);
  const handleLogout = async () => {
    try {
      if (adminRole === "Admin") {
        const response = await axios.get(`${SUPER_DOMAIN}/logout-admin`, {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.data.status) {
          navigate("/auth/signin")
        }
      }
      if (lecturerRole === "Lecturer") {
        const response = await axios.get(`${SUPER_DOMAIN}/logout-lecturer`, {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.data.status) {
          navigate("/auth/signin")
        }
      }
      if (candidateRole === "Candidate") {
        const response = await axios.get(`${SUPER_DOMAIN}/logout-candidate`, {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.data.status) {
          navigate("/auth/signin")
        }
      }
    } catch (err) {
      console.log(err)
    }
  };


  return (
    <ClickOutside onClick={ () => setDropdownOpen(false) } className="relative">
      <Link
        onClick={ () => setDropdownOpen(!dropdownOpen) }
        className="flex items-center gap-4"
        to="#"
      >
        <span className="hidden text-right lg:block">
          <span className="block text-sm font-medium text-black dark:text-white">
            { sessionStorage.getItem("name") }
          </span>
          <span className="block text-xs">{ adminRole } { lecturerRole } { candidateRole }</span>
        </span>
        <span className=" flex justify-center ">
          <img src={ imageProfile || UserOne } alt="User" className='h-12 w-12 rounded-full object-cover' />
        </span>
        <FaChevronDown className="hidden sm:block text-current" size={ 15 } />
      </Link>

      { dropdownOpen && (
        <div
          className={ `absolute right-0 mt-4 flex w-62.5 flex-col rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark` }
        >
          <ul className="flex flex-col gap-5 border-b border-stroke px-6 py-7.5 dark:border-strokedark">
            <li>
              <Link
                to="/profile"
                className="flex items-center gap-3.5 text-sm font-medium duration-300 ease-in-out hover:text-primary lg:text-base"
              >
                <FaUser size={ 22 } className="text-gray-500" />
                My Profile
              </Link>
            </li>
            <li>
              <Link
                to="/admin/settings"
                className="flex items-center gap-3.5 text-sm font-medium duration-300 ease-in-out hover:text-primary lg:text-base"
              >
                <FaCog size={ 22 } className='text-gray-500' />
                Account Settings
              </Link>
            </li>
          </ul>
          <button className="flex items-center gap-3.5 px-6 py-4 text-sm font-medium duration-300 ease-in-out hover:text-primary lg:text-base" onClick={ handleLogout }>
            <FiLogOut size={ 22 } className="text-gray-500" />
            Log Out
          </button>
        </div>
      ) }
    </ClickOutside>
  );
};

export default DropdownUser;
