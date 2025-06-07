import React from 'react';
import { NavLink } from 'react-router-dom';
import logo from '../public/images/logo.svg';

interface NavbarProps {
  user: { identifier: string };
  logout: () => void;
  showPrivacyPolicy: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ user, logout, showPrivacyPolicy }) => {
  return (
    <nav className="bg-indigo-500">
      <div className="flex justify-between items-center px-8">
        <div className="flex items-center space-x-7">
          <div className="flex items-center py-4">
            <img src={logo} alt="Logo" />
          </div>

          <div className="hidden md:flex items-center space-x-6">
            <NavLink
              to="/playground"
              className={({ isActive }) =>
                `relative flex items-center py-4 px-4 text-[14px] h-16 text-white font-semibold ${
                  isActive
                    ? "border-b-2 border-white"
                    : "border-b-2 border-transparent"
                }`
              }
            >
              Ask
            </NavLink>
            <NavLink
              to="/file-viewer"
              className={({ isActive }) =>
                `relative flex items-center py-4 px-4 text-[14px] h-16 text-white font-semibold ${
                  isActive
                    ? "border-b-2 border-white"
                    : "border-b-2 border-transparent"
                }`
              }
            >
              Sources
            </NavLink>
          </div>
        </div>

        <div className="hidden md:flex items-center space-x-3">
          {user ? (
            <>
              <div className="text-sm text-white text-center">
                {user.identifier}
              </div>
              <button
                className="text-sm text-white cursor-pointer"
                onClick={showPrivacyPolicy}
              >
                Privacy Policy
              </button>
              <button
                className="w-[76px] h-[36px] text-[12px] font-semibold bg-white text-gray-700 rounded-[8px]"
                onClick={logout}
              >
                Log out
              </button>
            </>
          ) : (
            <a href="#" className="py-2 px-2 font-medium text-white">
              Log In
            </a>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
