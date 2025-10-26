import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

function Navbar() {
  const [show, setShow] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const isHome = useLocation().pathname === "/";
  const controlNavbar = () => {
    if (typeof window !== "undefined") {
      if (window.scrollY > lastScrollY) {
        setShow(false);
      } else {
        setShow(true);
      }
      setLastScrollY(window.scrollY);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", controlNavbar);
    return () => {
      window.removeEventListener("scroll", controlNavbar);
    };
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
              LeaderBoard
            </Link>
            <Link to="/" className="text-white hover:text-blue-500">
              TodayQuestions
            </Link>
            <Link to="/" className="text-white hover:text-blue-500">
              Profile
            </Link>
          </div>
          <div className="flex space-x-4">
            <Link
              to="/signin"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Sign In
            </Link>
            <Link
              to="/signup"
              className="border border-blue-500 text-blue-500 px-4 py-2 rounded hover:bg-blue-500 hover:text-white"
            >
              Sign Up
            </Link>
          </div>

        </div>
      </div>
    </nav>
  );
}

export default Navbar;
