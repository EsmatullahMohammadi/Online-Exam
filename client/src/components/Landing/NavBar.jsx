import { useState } from "react";
import { FaBarsStaggered, FaXmark } from "react-icons/fa6";
import logo from "../../../public/logo.png";

const NavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleMenuToggler = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const navItems = [
    { id: "home", title: "Home" },
    { id: "about", title: "About Us" },
  ];

  return (
    <header className="fixed w-full top-0 z-50 bg-blue-800 shadow-md">
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
                href="auth/signin"
                className="ml-4 px-6 py-2.5 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-100 transition-all duration-300 shadow-md"
              >
                Login
              </a>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={handleMenuToggler}
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-blue-600 focus:outline-none transition duration-300"
            >
              {isMenuOpen ? (
                <FaXmark className="h-6 w-6" />
              ) : (
                <FaBarsStaggered className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
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

export default NavBar;
