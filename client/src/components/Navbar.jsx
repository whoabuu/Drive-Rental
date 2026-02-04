import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { assets, menuLinks } from "../assets/assets";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";
import { motion } from "framer-motion"; // Changed from "motion/react" to avoid import issues

const Navbar = () => {
  const { setShowLogin, user, logout, axios, fetchUser } = useAppContext();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const requestToBeOwner = async () => {
    try {
      const { data } = await axios.post("/api/user/request-owner-role");
      if (data.success) {
        toast.success(data.message);
        fetchUser();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred.");
    }
  };

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
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
      <Link to="/" onClick={() => setOpen(false)}>
        <motion.img
          whileHover={{ scale: 1.05 }}
          src={assets.logo}
          alt="logo"
          className="h-12 w-auto"
        />
      </Link>

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
            className="hover:text-black transition-colors"
            onClick={() => setOpen(false)}
          >
            {link.name}
          </Link>
        ))}

        <div className="flex max-sm:flex-col items-start sm:items-center gap-6">
          {user && (
            <button
              onClick={() => {
                if (user.role === "admin") {
                  navigate("/admin/owner-requests"); // Updated to match App.jsx route
                } else if (user.role === "owner") {
                  navigate("/owner");
                } else {
                  requestToBeOwner();
                }
                setOpen(false);
              }}
              disabled={user.ownerStatus === "Pending"}
              className="cursor-pointer disabled:cursor-not-allowed disabled:text-gray-400 font-medium"
            >
              {user.role === "admin"
                ? "Admin Panel"
                : user.role === "owner"
                ? "Owner Dashboard"
                : user.ownerStatus === "Pending"
                ? "Request Pending"
                : "List your cars"}
            </button>
          )}

          <button
            onClick={() => {
              user ? logout() : setShowLogin(true);
              setOpen(false);
            }}
            className="cursor-pointer px-8 py-2 bg-[var(--color-primary-dull)] hover:bg-gray-800 transition-all text-white rounded-lg shadow-md"
          >
            {user ? "Logout" : "Login"}
          </button>
        </div>
      </div>

      <button
        className="sm:hidden cursor-pointer"
        aria-label="Menu"
        onClick={() => {
          setOpen(!open);
        }}
      >
        <img
          src={open ? assets.close_icon : assets.menu_icon}
          className="h-8"
          alt="menu"
        />
      </button>
    </motion.div>
  );
};

export default Navbar;
