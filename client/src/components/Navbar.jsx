import React, { useState, useRef, useEffect } from "react";
import { assets } from "../assets/assets";
import { useAppContext } from "../context/AppContext";

const Navbar = () => {
  const { navigate, token, user, logout } = useAppContext();

  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenu, setUserMenu] = useState(false);

  const userMenuRef = useRef(null);

  const go = (path) => {
    navigate(path);
    setMenuOpen(false);
    setUserMenu(false);
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
          <button onClick={() => navigate("/")} className="hover:text-primary">
            Home
          </button>

          <button
            onClick={() => navigate("/about")}
            className="hover:text-primary"
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
                className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center cursor-pointer font-semibold"
              >
                {user?.name?.[0]?.toUpperCase() || "U"}
              </div>

              {/* Dropdown */}
              {userMenu && (
                <div className="absolute right-0 mt-3 w-44 bg-white shadow-lg rounded-lg py-3 text-sm">
                  <button
                    onClick={() => go(`/profile/${user?.username || user?.id}`)}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-50"
                  >
                    Profile
                  </button>

                  <button
                    onClick={() => go("/create-blog")}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-50"
                  >
                    Add Blogs
                  </button>

                  {user?.role === "admin" && (
                    <button
                      onClick={() => go("/admin")}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-50"
                    >
                      Dashboard
                    </button>
                  )}

                  <button
                    onClick={logout}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-50 text-red-500"
                  >
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
            className="absolute top-16 right-0 bg-white shadow-xl rounded-xl w-56 p-6 flex flex-col gap-5 md:hidden z-50"
          >
            <button onClick={() => go("/")}>Home</button>

            <button onClick={() => go("/about")}>About</button>

            {token && (
              <button onClick={() => go("/create-blog")}>Add Blogs</button>
            )}

            {token && user && (
              <button
                onClick={() => go(`/profile/${user.username || user.id}`)}
              >
                Profile
              </button>
            )}

            {!token && (
              <button
                onClick={() => go("/login")}
                className="bg-primary text-white py-2 rounded-md"
              >
                Login
              </button>
            )}

            {token && user?.role === "admin" && (
              <button
                onClick={() => go("/admin")}
                className="bg-primary text-white py-2 rounded-md"
              >
                Dashboard
              </button>
            )}

            {token && (
              <button onClick={logout} className="text-red-500">
                Logout
              </button>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
