import React, { useContext, useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";


function Navbar() {


  const date = new Date();
  const dd = String(date.getDate()).padStart(2,"0");
  const mm = String(date.getMonth()).padStart(2,"0");
  const yy = String(date.getFullYear());
  const formattedDate = `/${dd}-${mm}-${yy}/daily-questions`

  const { token, setToken } = useContext(AuthContext);
  const navigate = useNavigate();
  const isHome = useLocation().pathname === "/";

  const [show, setShow] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const controlNavbar = () => {
    if (window.scrollY > lastScrollY) setShow(false);
    else setShow(true);
    setLastScrollY(window.scrollY);
  };

  const handleLogout = () => {
    console.log(token);
    setToken(null); 
    console.log(token);
    navigate("/signin");
  };

  useEffect(() => {
    window.addEventListener("scroll", controlNavbar);
    return () => window.removeEventListener("scroll", controlNavbar);
  }, [lastScrollY]);

  return (
    <nav
      className={`w-full fixed top-0 left-0 z-50 transition-transform duration-300 ${
        show ? "translate-y-0" : "-translate-y-full"
      } ${isHome ? "bg-transparent" : "bg-gray-900"}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex space-x-6 text-xl">
            <Link to="/" className="text-white hover:text-blue-500">
              CodeCoin
            </Link>
            <Link to="/" className="text-white hover:text-blue-500">
              LeaderBoard
            </Link>
            <Link to={formattedDate} className="text-white hover:text-blue-500">
              TodayQuestions
            </Link>
            <Link to="/profile" className="text-white hover:text-blue-500">
              Profile
            </Link>
          </div>
          <div className="flex space-x-4">
            {token ? (
              <>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                  Logout
                </button>
                <Link
                  to="/profile"
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Profile
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/signin"
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
