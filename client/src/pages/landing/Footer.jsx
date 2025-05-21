import { Link } from "react-router-dom";
import logo from "../../../public/logo.png";
import {
  FaPhone,
  FaEnvelope,
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaTwitter,
  FaYoutube,
} from "react-icons/fa";

const Footer = () => {
  return (
    <div className="w-full lg:pt-24 pt-16 flex flex-col bg-blue-800">
      <div className="w-full flex lg:flex-row flex-col items-start justify-between pb-[100px] lg:px-[100px] xl:px-[200px] px-5 lg:gap-0 gap-16">
        {/* Logo & Tagline */}
        <div className="flex flex-col lg:flex-col md:flex-row sm:flex-row items-center lg:items-start md:items-center sm:items-center gap-2 lg:h-60 md:h-auto sm:h-auto lg:w-52 w-full">
          <div className="flex items-center justify-center lg:w-full md:w-1/2 sm:w-1/2 bg-transparent text-center">
            <Link to={"/"}>
              <img
                src={logo}
                alt="Kabul Polytechnic University Logo"
                className="h-40 w-40 object-cover"
              />
            </Link>
          </div>
          <span className="font-arial text-xl text-white text-center max-w-[280px]">
            Building Afghanistan Future
          </span>
        </div>

        {/* About Links */}
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

        {/* Navigation Links */}
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
            About Us
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

        {/* Contact Info */}
        <div className="flex flex-col gap-5">
          <span className="text-white font-bold text-xl font-sans max-w-[240px]">
            Information
          </span>
          <span className="text-white font-sans max-w-[240px]">
            Karte-e-Mamorin, Kabul, Afghanistan
          </span>
          <a
            href="tel:+93712345678"
            className="text-white hover:text-orange-300 font-arial flex items-center gap-2"
          >
            <FaPhone />
            +93 712 345 678
          </a>
          <a
            href="mailto:info@kpu.edu.af"
            className="text-white hover:text-orange-300 font-arial flex items-center gap-2"
          >
            <FaEnvelope />
            info@kpu.edu.af
          </a>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="w-full flex lg:flex-row flex-col items-center justify-center border-t lg:h-[80px] gap-0 lg:gap-20 lg:py-0 py-5 border-[#DADADA] lg:px-[210px] px-5">
        <span className="font-arial text-white lg:text-left text-center">
          ©2024 Kabul Polytechnic University. All Rights Reserved.
        </span>
        <div className="flex items-center gap-6 mt-4 lg:mt-0">
          <FaFacebookF className="text-white w-6 h-6 hover:text-[#3b5998] hover:scale-110 transition-transform duration-300 cursor-pointer" />
          <FaInstagram className="text-white w-6 h-6 hover:text-[#E4405F] hover:scale-110 transition-transform duration-300 cursor-pointer" />
          <FaLinkedinIn className="text-white w-6 h-6 hover:text-[#0077B5] hover:scale-110 transition-transform duration-300 cursor-pointer" />
          <FaTwitter className="text-white w-6 h-6 hover:text-[#1DA1F2] hover:scale-110 transition-transform duration-300 cursor-pointer" />
          <FaYoutube className="text-white w-6 h-6 hover:text-[#FF0000] hover:scale-110 transition-transform duration-300 cursor-pointer" />
        </div>
      </div>
    </div>
  );
};

export default Footer;
