import React, { useState } from "react";
import { assets } from "../assets/assets";
import { useAppContext } from "../context/AppContext";

const Navbar = () => {
  const { navigate, token } = useAppContext();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="flex justify-between items-center py-5 mx-8 sm:mx-20 xl:mx-32">
        {/* Logo */}
        <img
          onClick={() => navigate("/")}
          src={assets.logo}
          alt="logo"
          className="w-32 sm:w-44 cursor-pointer"
        />

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8 text-gray-700 font-medium">
          <button
            onClick={() => navigate("/")}
            className="hover:text-primary transition"
          >
            Home
          </button>

          <button
            onClick={() => navigate("/about")}
            className="hover:text-primary transition"
          >
            About
          </button>
        </div>

        {/* Desktop Login */}
        <div className="hidden md:block">
          <button
            onClick={() => navigate("/admin")}
            className="flex items-center gap-2 rounded-full text-sm px-8 py-2.5 bg-primary text-white hover:opacity-90 transition"
          >
            {token ? "Dashboard" : "Login"}
            <img src={assets.arrow} alt="arrow" className="w-3" />
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <img
            src={menuOpen ? assets.close_icon_dark : assets.menu_icon}
            alt="menu"
            className="w-5"
          />
        </button>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="absolute top-16 right-0 text-center bg-white shadow-xl rounded-xl w-56 p-6 flex flex-col gap-5 md:hidden">
            <button
              onClick={() => {
                navigate("/");
                setMenuOpen(false);
              }}
              className="text-left text-gray-700 hover:text-primary font-medium"
            >
              Home
            </button>

            <button
              onClick={() => {
                navigate("/about");
                setMenuOpen(false);
              }}
              className="text-left text-gray-700 hover:text-primary font-medium"
            >
              About
            </button>

            <button
              onClick={() => {
                navigate("/admin");
                setMenuOpen(false);
              }}
              className="bg-primary text-white py-2 rounded-md"
            >
              {token ? "Dashboard" : "Login"}
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
