import React, { useState } from "react";
import { Logo } from "../assets";
import { NavLink } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { removeCredentials } from "../slices/authSlice";
import { useNavigate } from "react-router-dom";
import { MenuOutlined, CloseOutlined } from '@ant-design/icons';

const Navbar = () => {
  const { userInfo, userType, emailVerified } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    dispatch(removeCredentials());
    navigate("/");
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const linkClass = ({ isActive }) =>
    isActive
      ? "bg-black text-white hover:bg-gray-900 hover:text-white rounded-md px-3 py-2"
      : "text-white hover:bg-gray-900 hover:text-white rounded-md px-3 py-2";

  return (
    <nav className="bg-indigo-700 border-b border-indigo-500 z-50 relative">
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          <div className="flex items-center justify-between w-full md:w-auto">
            <NavLink className="flex flex-shrink-0 items-center" to="/">
              <img className="h-10 w-auto" src={Logo} alt="Job Finder" />
              <span className="hidden md:block text-white text-2xl font-bold ml-2">
                Job Finder
              </span>
            </NavLink>
            <div className="md:hidden">
              <button
                onClick={toggleMobileMenu}
                className="text-white focus:outline-none"
              >
                {isMobileMenuOpen ? <CloseOutlined className="text-xl" /> : <MenuOutlined className="text-xl" />}
              </button>
            </div>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex md:items-center md:space-x-2">
            <NavLink to="/" className={linkClass}>
              Home
            </NavLink>
            <NavLink to="/about" className={linkClass}>
              About Us
            </NavLink>
            {userInfo && userType === 'employer' && emailVerified === 'yes' && (
              <NavLink to="/post-job" className={linkClass}>
                Add Job
              </NavLink>
            )}
             {userInfo && userType === 'seeker' && emailVerified === 'yes' && (
              <NavLink to="/list-jobs" className={linkClass} onClick={toggleMobileMenu}>
                Jobs
              </NavLink>
            )}
            <div className="flex items-center">
              {userInfo ? (
                <>
                  <NavLink
                    to="/dashboard"
                    className="bg-indigo-700 text-white border border-white px-4 py-2 rounded-md ml-2 hover:bg-white hover:text-indigo-700"
                  >
                    Dashboard
                  </NavLink>
                  <button
                    onClick={handleLogout}
                    className="bg-indigo-700 text-white border border-white px-4 py-2 rounded-md ml-2 hover:bg-white hover:text-indigo-700"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <NavLink
                    to="/sign-up"
                    state={{ isLogin: false }}
                    className="bg-indigo-700 text-white border border-white px-4 py-2 rounded-md ml-2 hover:bg-white hover:text-indigo-700"
                  >
                    Sign Up
                  </NavLink>
                  <NavLink
                    to="/sign-up"
                    state={{ isLogin: true }}
                    className="bg-indigo-700 text-white border border-white px-4 py-2 rounded-md ml-2 hover:bg-white hover:text-indigo-700"
                  >
                    Login
                  </NavLink>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-indigo-700 border-t border-indigo-500 pb-4">
          <div className="px-2 pt-2 flex flex-col space-y-2">
            <NavLink to="/" className={linkClass} onClick={toggleMobileMenu}>
              Home
            </NavLink>
            <NavLink to="/jobs" className={linkClass} onClick={toggleMobileMenu}>
              Jobs
            </NavLink>
            <NavLink to="/about" className={linkClass} onClick={toggleMobileMenu}>
              About Us
            </NavLink>
            {userInfo && userType === 'employer' && emailVerified === 'yes' && (
              <NavLink to="/post-job" className={linkClass} onClick={toggleMobileMenu}>
                Add Job
              </NavLink>
            )}
            {userInfo && userType === 'seeker' && emailVerified === 'yes' && (
              <NavLink to="/list-jobs" className={linkClass} onClick={toggleMobileMenu}>
                Jobs
              </NavLink>
            )}
            {userInfo ? (
              <>
                <NavLink
                  to="/dashboard"
                  className="bg-indigo-700 text-white border border-white px-4 py-2 rounded-md block hover:bg-white hover:text-indigo-700"
                  onClick={toggleMobileMenu}
                >
                  Dashboard
                </NavLink>
                <button
                  onClick={() => { handleLogout(); toggleMobileMenu(); }}
                  className="bg-indigo-700 text-white border border-white px-4 py-2 rounded-md block hover:bg-white hover:text-indigo-700"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <NavLink
                  to="/sign-up"
                  state={{ isLogin: false }}
                  className="bg-indigo-700 text-white border border-white px-4 py-2 rounded-md block hover:bg-white hover:text-indigo-700"
                  onClick={toggleMobileMenu}
                >
                  Sign Up
                </NavLink>
                <NavLink
                  to="/sign-up"
                  state={{ isLogin: true }}
                  className="bg-indigo-700 text-white border border-white px-4 py-2 rounded-md block hover:bg-white hover:text-indigo-700"
                  onClick={toggleMobileMenu}
                >
                  Login
                </NavLink>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
