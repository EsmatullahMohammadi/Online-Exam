/* eslint-disable react/prop-types */
import { useState } from "react";
import { Link } from "react-router-dom";
import {
  FaBarsStaggered,
  FaXmark,
  FaPhone,
  FaEnvelope,
} from "react-icons/fa6";
import {
  FaFacebookF as FaFacebook,
  FaInstagram as FaInsta,
  FaLinkedinIn as FaLinkedIn,
  FaTwitter as FaTwit,
  FaYoutube as FaYT,
} from "react-icons/fa";

import logo from "../../../public/logo.png";
import bg2 from "../../../public/university.jpg";

// Reusable Button
const Button = ({ children, className, variant }) => {
  const base =
    "inline-flex items-center justify-center px-6 py-2 text-base font-medium rounded-lg shadow-sm transition duration-300";
  const variants = {
    light: "bg-white text-blue-600 hover:bg-blue-100",
    dark: "bg-blue-600 text-white hover:bg-blue-700",
  };
  return (
    <button className={`${base} ${variants[variant]} ${className}`}>
      {children}
    </button>
  );
};

// Reusable Titlebar
const Titlebar = ({ title }) => (
  <span className="text-blue-500 uppercase tracking-widest font-bold text-sm">
    {title}
  </span>
);

// NavBar
const NavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const handleMenuToggler = () => setIsMenuOpen(!isMenuOpen);

  const navItems = [
    { id: "home", title: "Home" },
    { id: "salary", title: "Salary Estimate" },
    { id: "post-job", title: "Post Job" },
    { id: "contact", title: "Contact" },
  ];

  return (
    <header className="fixed w-full top-0 z-50 bg-blue-700 shadow-md">
      <nav className="max-w-screen-2xl container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <a href="#home" className="flex-shrink-0">
            <img
              src={logo}
              alt="KPU Logo"
              className="h-14 w-auto hover:scale-105 transition-transform"
            />
          </a>
          <div className="hidden md:flex items-center space-x-8">
            <ul className="flex space-x-6">
              {navItems.map(({ id, title }) => (
                <li key={id}>
                  <a
                    href={`#${id}`}
                    className="px-4 py-2 rounded-lg text-lg font-medium text-white hover:bg-blue-600 transition duration-300"
                  >
                    {title}
                  </a>
                </li>
              ))}
            </ul>
            {sessionStorage.getItem("isAuthenticated") ? (
              <button className="ml-4 px-6 py-2.5 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition-all duration-300 shadow-md">
                Logout
              </button>
            ) : (
              <a
                href="#login"
                className="ml-4 px-6 py-2.5 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-100 transition-all duration-300 shadow-md"
              >
                Login
              </a>
            )}
          </div>
          <div className="md:hidden flex items-center">
            <button
              onClick={handleMenuToggler}
              className="p-2 text-white hover:bg-blue-600 rounded-md transition duration-300"
            >
              {isMenuOpen ? (
                <FaXmark className="h-6 w-6" />
              ) : (
                <FaBarsStaggered className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        <div
          className={`md:hidden transition-all duration-300 ease-in-out ${
            isMenuOpen
              ? "max-h-96 opacity-100"
              : "max-h-0 opacity-0 overflow-hidden"
          }`}
        >
          <div className="px-2 pt-2 pb-4 space-y-2 bg-blue-400 shadow-md rounded-b-lg">
            {navItems.map(({ id, title }) => (
              <a
                key={id}
                href={`#${id}`}
                onClick={() => setIsMenuOpen(false)}
                className="block px-4 py-3 rounded-lg text-base font-medium text-white hover:bg-blue-500"
              >
                {title}
              </a>
            ))}
            <div className="pt-2 border-t border-blue-300">
              {sessionStorage.getItem("isAuthenticated") ? (
                <button className="block w-full px-4 py-3 rounded-lg text-base font-semibold text-left text-white bg-red-500 hover:bg-red-600">
                  Logout
                </button>
              ) : (
                <a
                  href="#login"
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-4 py-3 rounded-lg text-base font-semibold text-center text-blue-600 bg-white hover:bg-blue-100"
                >
                  Login
                </a>
              )}
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

// Home
const Home = () => {
  return (
    <div
      style={{
        backgroundImage: `url(${bg2})`,
        transition: "background-image 1s ease-in-out",
      }}
      className="w-full flex items-center justify-center relative h-screen bg-cover bg-center"
    >
      <div className="absolute inset-0 bg-black bg-opacity-30 z-0"></div>
      <div className="flex flex-col lg:items-start items-center px-6 lg:px-0 z-10">
        <div className="text-center">
          <h1 className="text-white font-semibold font-arial lg:text-[100px] text-[30px] lg:leading-[140px] tracking-wide uppercase">
            KPU English Departemnt
          </h1>
          <p className="text-white font-light font-arial text-sm lg:text-xl mt-4 lg:px-32 px-4 py-2 text-center">
            With reliable and trusted security solutions, we prioritize the
            protection of your home, business, and assets...
          </p>
          <div className="mt-6 flex justify-center">
            <Link
              to={"/about-us"}
              className="bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-700 hover:to-blue-900 text-white font-bold py-3 px-8 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 ease-in-out"
            >
              Why Choose Us!
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

// AboutHome
const AboutHome = () => {
  return (
    <div className="w-full flex items-center justify-between bg-[#f9fafb] lg:h-[514px] p-6 lg:p-0 px-4 md:px-14 lg:px-[210px]">
      <div className="container mx-auto">
        <div className="flex lg:flex-row flex-col items-start justify-between w-full gap-4 lg:gap-10">
          <div className="flex flex-col gap-4">
            <Titlebar title="about us" />
            <span className="uppercase font-oswald font-bold text-[45px] leading-[55px] text-gray-800 lg:max-w-[450px]">
              Discover More About KPU
            </span>
          </div>
          <div className="flex flex-col gap-3 lg:max-w-[640px] max-w-full">
            <span className="font-sans font-semibold text-lg text-gray-800">
              Kabul Polytechnic University: Shaping the Future with Knowledge,
              Innovation, and Dedication.
            </span>
            <p className="text-gray-600 font-sans text-lg">
              Kabul Polytechnic University is Afghanistan leading institution
              for engineering and technical education...
            </p>
            <Link to={"/about-us"}>
              <Button className="!h-[54px] mt-8 shadow-lg" variant="light">
                about us
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

// Footer
const Footer = () => {
  return (
    <div className="w-full lg:pt-24 pt-16 flex flex-col bg-blue-800">
      <div className="w-full flex lg:flex-row flex-col items-start justify-between pb-[100px] lg:px-[100px] xl:px-[200px] px-5 lg:gap-0 gap-16">
        <div className="flex flex-col lg:flex-col md:flex-row sm:flex-row items-center lg:items-start md:items-center sm:items-center gap-2 lg:h-60 md:h-auto sm:h-auto lg:w-52 w-full">
          <div className="flex items-center justify-center lg:w-full md:w-1/2 sm:w-1/2 bg-transparent text-center">
            <Link to={"/"}>
              <img src={logo} alt="logo" className="h-40 w-40 object-cover" />
            </Link>
          </div>
          <span className="font-arial text-xl text-white text-center max-w-[280px]">
            Protecting What Matters
          </span>
        </div>
        <div className="flex flex-col gap-5">
          <span className="text-white font-bold text-xl font-sans">About</span>
          <a href="#" className="text-white hover:text-orange-300 font-arial">
            Terms & Conditions
          </a>
          <a href="#" className="text-white hover:text-orange-300 font-arial">
            Privacy Policy
          </a>
          <a href="#" className="text-white hover:text-orange-300 font-arial">
            Help
          </a>
        </div>
        <div className="flex flex-col gap-5">
          <span className="text-white font-bold text-xl font-sans">
            Quick Links
          </span>
          <Link to="/" className="text-white hover:text-orange-300 font-arial">
            Home
          </Link>
          <Link
            to="service"
            className="text-white hover:text-orange-300 font-arial"
          >
            Services
          </Link>
          <Link
            to="about-us"
            className="text-white hover:text-orange-300 font-arial"
          >
            About us
          </Link>
          <Link
            to="join-our-team"
            className="text-white hover:text-orange-300 font-arial"
          >
            Join Our Team
          </Link>
          <Link
            to="contact"
            className="text-white hover:text-orange-300 font-arial"
          >
            Contact
          </Link>
        </div>
        <div className="flex flex-col gap-5">
          <span className="text-white font-bold text-xl font-sans">
            Information
          </span>
          <span className="text-white font-sans">
            Portland, OR, United States
          </span>
          <a
            href="tel:+15038779505"
            className="text-white hover:text-orange-300 font-arial flex items-center gap-2"
          >
            <FaPhone />
            +1 (503) 877-9505
          </a>
          <a
            href="mailto:info@ecotonesecurity.com"
            className="text-white hover:text-orange-300 font-arial flex items-center gap-2"
          >
            <FaEnvelope />
            info@ecotonesecurity.com
          </a>
        </div>
      </div>
      <div className="w-full flex lg:flex-row flex-col items-center justify-center border-t lg:h-[80px] gap-0 lg:gap-20 lg:py-0 py-5 border-[#DADADA] lg:px-[210px] px-5">
        <span className="font-arial text-white lg:text-left text-center">
          ©2024 Ecotone Security Services. All Rights Reserved
        </span>
        <div className="flex items-center gap-6 mt-4 lg:mt-0">
          <FaFacebook className="text-white w-6 h-6 hover:text-[#3b5998] hover:scale-110 transition-transform duration-300 cursor-pointer" />
          <FaInsta className="text-white w-6 h-6 hover:text-[#E4405F] hover:scale-110 transition-transform duration-300 cursor-pointer" />
          <FaLinkedIn className="text-white w-6 h-6 hover:text-[#0077B5] hover:scale-110 transition-transform duration-300 cursor-pointer" />
          <FaTwit className="text-white w-6 h-6 hover:text-[#1DA1F2] hover:scale-110 transition-transform duration-300 cursor-pointer" />
          <FaYT className="text-white w-6 h-6 hover:text-[#FF0000] hover:scale-110 transition-transform duration-300 cursor-pointer" />
        </div>
      </div>
    </div>
  );
};

// Landing Component
const Landing = () => {
  return (
    <>
      <NavBar />
      <Home />
      <AboutHome />
      <Footer />
    </>
  );
};

export default Landing;
