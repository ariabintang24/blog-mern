import React, { useState, useRef, useEffect } from "react";
import { assets } from "../assets/assets";
import { useAppContext } from "../context/AppContext";
import {
  FiUser,
  FiSettings,
  FiEdit,
  FiLock,
  FiGrid,
  FiLogOut,
  FiChevronRight,
  FiChevronDown,
  FiHome,
  FiInfo,
} from "react-icons/fi";

const Navbar = () => {
  const { navigate, token, user, logout } = useAppContext();

  // console.log("NAVBAR USER:", user); // 👈 TARUH DI SINI

  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenu, setUserMenu] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [mobileSettingsOpen, setMobileSettingsOpen] = useState(false);

  const userMenuRef = useRef(null);

  const go = (path) => {
    navigate(path);
    setMenuOpen(false);
    setUserMenu(false);
    setSettingsOpen(false);
    setMobileSettingsOpen(false);
  };

  // Close desktop dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="flex justify-between items-center py-5 mx-8 sm:mx-20 xl:mx-32">
        {/* Logo */}
        <h1
          onClick={() => navigate("/")}
          className="text-2xl sm:text-3xl font-bold cursor-pointer"
        >
          <span className="text-primary">Go</span>-Blog
        </h1>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8 text-gray-700 font-medium">
          <button
            onClick={() => navigate("/")}
            className="cursor-pointer hover:text-primary"
          >
            Home
          </button>

          <button
            onClick={() => navigate("/blogs")}
            className="cursor-pointer hover:text-primary"
          >
            Blogs
          </button>

          <button
            onClick={() => navigate("/about")}
            className="cursor-pointer hover:text-primary"
          >
            About
          </button>
        </div>

        {/* Desktop Right */}
        <div className="hidden md:flex items-center gap-4">
          {!token && (
            <button
              onClick={() => navigate("/login")}
              className="flex items-center gap-2 rounded-full text-sm px-8 py-2.5 bg-primary text-white"
            >
              Login
              <img src={assets.arrow} className="w-3" />
            </button>
          )}

          {token && user && (
            <div ref={userMenuRef} className="relative">
              {/* Avatar */}
              <div
                onClick={() => {
                  setUserMenu(!userMenu);
                  setMenuOpen(false);
                }}
                className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center cursor-pointer"
              >
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="font-semibold">
                    {user?.name?.[0]?.toUpperCase() || "U"}
                  </span>
                )}
              </div>

              {/* Dropdown */}
              {userMenu && (
                <div className="absolute right-0 mt-3 w-52 bg-white shadow-lg rounded-lg py-3 text-sm">
                  {/* Profile */}
                  <button
                    onClick={() => go("/profile")}
                    className="flex items-center gap-3 w-full text-left px-4 py-2 hover:bg-gray-50"
                  >
                    <FiUser size={16} />
                    My Profile
                  </button>

                  {/* Settings */}
                  <div>
                    <button
                      onClick={() => setSettingsOpen(!settingsOpen)}
                      className="w-full flex items-center justify-between px-4 py-2 hover:bg-gray-50"
                    >
                      <div className="flex items-center gap-3">
                        <FiSettings size={16} />
                        <span>Settings</span>
                      </div>

                      {settingsOpen ? (
                        <FiChevronDown size={16} />
                      ) : (
                        <FiChevronRight size={16} />
                      )}
                    </button>

                    {settingsOpen && (
                      <div className="ml-3 border-l border-gray-300 pl-1">
                        <button
                          onClick={() => go("/settings/edit-profile")}
                          className="flex items-center gap-3 w-full text-left px-4 py-2 hover:bg-gray-50"
                        >
                          <FiEdit size={15} />
                          Edit Profile
                        </button>

                        <button
                          onClick={() => go("/settings/change-password")}
                          className="flex items-center gap-3 w-full text-left px-4 py-2 hover:bg-gray-50"
                        >
                          <FiLock size={15} />
                          Change Password
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Admin */}
                  {user?.role === "admin" && (
                    <button
                      onClick={() => go("/admin")}
                      className="flex items-center gap-3 w-full text-left px-4 py-2 hover:bg-gray-50"
                    >
                      <FiGrid size={16} />
                      Dashboard
                    </button>
                  )}

                  {/* Logout */}
                  <button
                    onClick={logout}
                    className="flex items-center gap-3 w-full text-left px-4 py-2 hover:bg-gray-50 text-red-500"
                  >
                    <FiLogOut size={16} />
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden p-2"
          onClick={() => {
            setMenuOpen(!menuOpen);
            setUserMenu(false);
          }}
        >
          <img
            src={menuOpen ? assets.close_icon_dark : assets.menu_icon}
            className="w-5"
          />
        </button>

        {/* Overlay for mobile */}
        {menuOpen && (
          <div
            onClick={() => setMenuOpen(false)}
            className="fixed inset-0 z-40"
          />
        )}

        {/* Mobile Menu */}
        {menuOpen && (
          <div
            onClick={(e) => e.stopPropagation()}
            className="absolute top-16 right-4 w-64 bg-white shadow-xl rounded-2xl md:hidden z-50 overflow-hidden"
          >
            {/* USER HEADER */}
            {token && user && (
              <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-300">
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center font-semibold">
                  {user?.avatar ? (
                    <img
                      src={user.avatar}
                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : (
                    user?.name?.[0]?.toUpperCase()
                  )}
                </div>

                <div className="text-sm">
                  <p className="font-medium">{user.name}</p>
                  <p className="text-gray-500 text-xs">@{user.username}</p>
                </div>
              </div>
            )}

            {/* MENU ITEMS */}
            <div className="flex flex-col py-2 text-sm">
              {/* MAIN MENU (tanpa icon) */}
              <button
                onClick={() => go("/")}
                className="px-5 py-3 text-left hover:bg-gray-50"
              >
                Home
              </button>

              <button
                onClick={() => go("/blogs")}
                className="px-5 py-3 text-left hover:bg-gray-50"
              >
                Blogs
              </button>

              <button
                onClick={() => go("/about")}
                className="px-5 py-3 text-left hover:bg-gray-50"
              >
                About
              </button>

              {token && user && (
                <button
                  onClick={() => go(`/profile/${user.username}`)}
                  className="px-5 py-3 text-left hover:bg-gray-50"
                >
                  My Profile
                </button>
              )}

              {/* SETTINGS */}
              {token && (
                <div>
                  <button
                    onClick={() => setMobileSettingsOpen(!mobileSettingsOpen)}
                    className="w-full flex items-center justify-between px-5 py-3 hover:bg-gray-50"
                  >
                    <span>Settings</span>

                    {mobileSettingsOpen ? (
                      <FiChevronDown size={16} className="" />
                    ) : (
                      <FiChevronRight size={16} className="" />
                    )}
                  </button>

                  {mobileSettingsOpen && (
                    <div className="ml-3 border-l border-gray-300 pl-1">
                      <button
                        onClick={() => go("/settings/edit-profile")}
                        className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50"
                      >
                        <FiEdit size={15} />
                        Edit Profile
                      </button>

                      <button
                        onClick={() => go("/settings/change-password")}
                        className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50"
                      >
                        <FiLock size={15} />
                        Change Password
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* ADMIN */}
              {token && user?.role === "admin" && (
                <button
                  onClick={() => go("/admin")}
                  className="px-5 py-3 text-left hover:bg-gray-50"
                >
                  Dashboard
                </button>
              )}

              {/* LOGOUT */}
              {token && (
                <button
                  onClick={logout}
                  className="flex items-center gap-3 px-5 py-3 text-red-500 hover:bg-red-50"
                >
                  <FiLogOut size={16} />
                  Logout
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
