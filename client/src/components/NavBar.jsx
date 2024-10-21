/* eslint-disable no-unused-vars */
import { useState } from 'react';
import { FaBarsStaggered, FaXmark } from 'react-icons/fa6';
import { Link, NavLink } from 'react-router-dom';
import { FiGlobe } from 'react-icons/fi';

const NavBar = () => {
  const [isMenuOpen,setIsMenuOpen]=useState(false);
  
  
  const handleMenuToggler=()=>{
    setIsMenuOpen(!isMenuOpen)
  }
  const photoURL = sessionStorage.getItem("photoURL");
  const handleLogout=()=>{
  
  }
 
  const navItem=[
    {path:"/",title: "HomePage" },
    {path:"/exams",title: "Exams" },
    {path:"/create-question",title: "Create Qusetion" },
    {path:"/admin",title: "Admin"}
  ]
  
  return (
    <header className='mx-auto xl:px-24  px-4 sticky top-0 z-50 shadow-md bg-white'>
      <nav className={`flex justify-between items-center py-2`}>
        <a href="/" className=''><img src="/logo.jpeg" alt="logo"  className=' h-20 border-0 '/></a>
        {/* nav Item for large device */}
        <ul className='hidden md:flex gap-12 font-iransans'>
          {
            navItem.map(({path,title})=>(
              <li key={path} className={`text-base text-primary hover:font-semibold `}>
                <NavLink to={path} className={({isActive})=> isActive?"active":""}>
                  {title}
                </NavLink>
              </li>
            ))
          }
        </ul>
        
        <div className='flex items-center'>
          {/* it is the muti language the site */}
          <div className="relative inline-block">
            <select
              className="appearance-none text-sm rounded-md py-2 pl-10 pr-4 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              onChange={(e) => {
                
              }}
              value={""}
            >
              <option value="en" className="text-gray-800">English</option>
              <option value="fa" className="text-gray-800">فارسی</option>
            </select>
            {/* Globe Icon positioned inside the select */}
            <FiGlobe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500 w-5 h-5 pointer-events-none" />
          </div>
          {/* sign up and login buttons */}
          {sessionStorage.getItem('isAuthenticated') ? (
            <div className='text-base text-primary font-medium space-x-5 hidden lg:block'>
              <button onClick={handleLogout} className='py-2 px-5 border border-blue rounded  text-black hover:bg-blue hover:text-white'>Logout</button>
              <img src={photoURL || "images/userLogo.png" }
                className="w-12 h-12 inline rounded-full border object-cover"
                alt="User Profile"
              />
            </div>
          ):(
            <div className='text-base text-primary font-medium space-x-5 hidden lg:block'>
              <Link to="/login" className='py-2 px-5 border rounded hover:text-lg'>Login</Link>
              <Link to="/sign-up" className='py-2 px-5 border rounded bg-blue-500 text-white hover:text-lg'>Sign Up</Link>
            </div>
          )}
          
        
          {/* mobile menu */}
          <div className={`md:hidden block `}>
            <button onClick={handleMenuToggler}>
              {isMenuOpen ? <FaXmark className='w-5 h-5 text-primary' /> : <FaBarsStaggered  className='w-5 h-5 text-primary'/>}
            </button>
          </div>
        </div>
      </nav>
      {/* navitem for mobile */}
      <div className={`px-4 py-5 bg-gray-700 rounded-sm ${isMenuOpen? '' : 'hidden'}`}>
        <ul>
          {navItem.map(({ path, title }) => (
            <li key={path} className="text-base text-white first:text-white py-1">
              <NavLink
                to={path}
                className={({ isActive }) => (isActive ? 'active' : '')}
                onClick={() => setIsMenuOpen(false)} // Close the menu on click
              >
                {title}
              </NavLink>
            </li>
          ))}
          <li className="text-white text-base">
            <Link
              to="/login"
              onClick={() => setIsMenuOpen(false)} // Close the menu on click
            >
              Login
            </Link>
          </li>
        </ul>

      </div>
    </header>
  )
}

export default NavBar