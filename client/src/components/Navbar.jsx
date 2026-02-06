import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { assets, menuLinks } from "../assets/assets";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

const Navbar = () => {
  const { setShowLogin, user, logout, axios, fetchUser } = useAppContext();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  // Function to handle the Owner Request (Supports Re-application)
  const requestToBeOwner = async () => {
    try {
      const { data } = await axios.post("/api/user/request-owner-role");
      if (data.success) {
        toast.success(data.message);
        fetchUser(); // Refresh user data to update 'Pending' status globally
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred.");
    }
  };

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [open]);

  return (
    <motion.div
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="flex justify-between items-center px-6 md:px-24 xl:px-32 py-4 text-xl text-gray-700 bg-[var(--color-primary)] border-b border-gray-300 sticky top-0 z-50 shadow-md"
    >
      {/* Logo */}
      <Link to="/" onClick={() => setOpen(false)}>
        <motion.img
          whileHover={{ scale: 1.05 }}
          src={assets.logo}
          alt="logo"
          className="h-14 w-auto scale-180 cursor-pointer"
        />
      </Link>

      {/* Navigation Links & Buttons */}
      <div
        className={`max-sm:fixed max-sm:h-screen max-sm:w-full max-sm:top-16
            max-sm:border-t border-borderColor right-0 flex flex-col sm:flex-row
            items-start sm:items-center gap-4 sm:gap-8 max-sm:p-4 transition-all
            duration-300 ease-in-out z-50 max-sm:bg-[var(--color-primary)]
            ${open ? "max-sm:translate-x-0" : "max-sm:translate-x-full"}`}
      >
        {menuLinks.map((link, index) => (
          <Link
            key={index}
            to={link.path}
            onClick={() => setOpen(false)}
            className="hover:text-black transition-colors"
          >
            {link.name}
          </Link>
        ))}

        {/* Search Bar (Desktop) */}
        <div className="hidden lg:flex items-center gap-2 text-sm border border-borderColor px-3 rounded-full max-w-56 bg-white/50">
          <input
            type="text"
            className="py-1.5 w-full bg-transparent outline-none placeholder-gray-500"
            placeholder="Search available cars"
          />
          <img src={assets.search_icon} alt="search" className="h-4" />
        </div>

        <div className="flex max-sm:flex-col items-start sm:items-center gap-6">
          {/* Role-Based Action Button */}
          {user && (
            <button
              onClick={() => {
                if (user.role === "admin") {
                  navigate("/admin/owner-requests");
                } else if (user.role === "owner") {
                  navigate("/owner");
                } else {
                  // Handles 'Not Applied' or 'Rejected' states
                  requestToBeOwner();
                }
                setOpen(false);
              }}
              disabled={user.ownerStatus === "Pending"}
              className={`cursor-pointer font-medium transition-colors ${
                user.ownerStatus === "Pending"
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-black hover:text-gray-600"
              }`}
            >
              {user.role === "admin"
                ? "Admin Panel"
                : user.role === "owner"
                ? "Owner Dashboard"
                : user.ownerStatus === "Pending"
                ? "Request Pending"
                : user.ownerStatus === "Rejected"
                ? "Rejected - Apply Again"
                : "List your cars"}
            </button>
          )}

          {/* Login / Logout Button */}
          <button
            onClick={() => {
              user ? logout() : setShowLogin(true);
              setOpen(false);
            }}
            className="cursor-pointer px-8 py-2 bg-[var(--color-primary-dull)] hover:bg-gray-800 transition-all text-white rounded-lg shadow-md active:scale-95"
          >
            {user ? "Logout" : "Login"}
          </button>
        </div>
      </div>

      {/* Mobile Menu Toggle */}
      <button
        className="sm:hidden cursor-pointer"
        aria-label="Menu"
        onClick={() => {
          setOpen(!open);
        }}
      >
        <img
          src={open ? assets.close_icon : assets.menu_icon}
          alt="menu"
          className="h-8"
        />
      </button>
    </motion.div>
  );
};

export default Navbar;
