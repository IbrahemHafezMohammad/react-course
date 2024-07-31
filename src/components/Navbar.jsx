import React from "react";
import { Logo } from "../assets";
import { NavLink, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { removeCredentials } from "../slices/authSlice";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const { userInfo, userType } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(removeCredentials());
    navigate("/");
  };

  const linkClass = ({ isActive }) =>
    isActive
      ? "bg-black text-white hover:bg-gray-900 hover:text-white rounded-md px-3 py-2"
      : "text-white hover:bg-gray-900 hover:text-white rounded-md px-3 py-2";

  return (
    <nav className="bg-indigo-700 border-b border-indigo-500 z-50 relative">
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          <div className="flex flex-1 items-center justify-center md:items-stretch md:justify-start">
            <NavLink className="flex flex-shrink-0 items-center mr-4" to="/">
              <img className="h-10 w-auto" src={Logo} alt="React Jobs" />
              <span className="hidden md:block text-white text-2xl font-bold ml-2">
                React Jobs
              </span>
            </NavLink>
            <div className="md:ml-auto">
              <div className="flex space-x-2">
                <NavLink to="/" className={linkClass}>
                  Home
                </NavLink>
                <NavLink to="/jobs" className={linkClass}>
                  Jobs
                </NavLink>
                <NavLink to="/add-job" className={linkClass}>
                  Add Job
                </NavLink>
              </div>
            </div>
            <div className="md:ml-auto flex items-center">
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
                    // to={{ pathname: "/sign-up", state: { isLogin: false } }}
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
    </nav>
  );
};

export default Navbar;
