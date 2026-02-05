import React, { useState } from "react";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const { setShowLogin, axios, setToken } = useAppContext();
  const navigate = useNavigate();

  const [state, setState] = useState("login");
  const [loading, setLoading] = useState(false); // New: Handle API wait time
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");

  const textContent = {
    login: {
      title: "Login",
      button: "Login",
      prompt: "Create an account?",
      promptAction: "Click here",
      action: () => setState("register"),
    },
    register: {
      title: "Sign Up",
      button: "Create Account",
      prompt: "Already have an account?",
      promptAction: "Click here",
      action: () => setState("login"),
    },
    forgot: {
      title: "Reset Password",
      button: "Send Reset Link",
      prompt: "Remembered your password?",
      promptAction: "Back to Login",
      action: () => setState("login"),
    },
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading

    try {
      let url = "";
      let payload = {};

      if (state === "login") {
        url = "/api/user/login";
        payload = { email: email.toLowerCase(), password };
      } else if (state === "register") {
        url = "/api/user/register";
        payload = {
          name,
          phone_no: phone,
          email: email.toLowerCase(),
          password,
        };
      } else if (state === "forgot") {
        url = "/api/user/forgot-password";
        payload = { email: email.toLowerCase() };
      }

      const { data } = await axios.post(url, payload);

      if (data.success) {
        if (state === "login" || state === "register") {
          setToken(data.token);
          localStorage.setItem("token", data.token);
          navigate("/");
          setShowLogin(false);
        }

        if (state === "forgot") {
          toast.success("Reset link sent! Please check your inbox.");
          setState("login"); // Move them back to login state automatically
        } else {
          toast.success(
            data.message || `${textContent[state].title} successful`
          );
        }
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false); // Stop loading regardless of success/fail
    }
  };

  return (
    <div
      onClick={() => {
        setShowLogin(false);
      }}
      className="fixed top-0 left-0 bottom-0 right-0 z-100 flex items-center text-sm text-gray-700 bg-black/50 backdrop-blur-sm"
    >
      <form
        onSubmit={onSubmit}
        onClick={(e) => e.stopPropagation()}
        className="flex flex-col gap-4 m-auto items-start p-8 py-12 w-80 sm:w-[352px] text-gray-500 rounded-lg shadow-xl border border-gray-200 bg-white"
      >
        <p className="text-2xl font-medium m-auto">
          <span className="text-black">User</span> {textContent[state].title}
        </p>

        {state === "register" && (
          <>
            <div className="w-full">
              <p>Name</p>
              <input
                onChange={(e) => setName(e.target.value)}
                value={name}
                placeholder="Enter your name"
                className="border border-gray-200 rounded w-full p-2 mt-1 outline-black"
                type="text"
                required
              />
            </div>
            <div className="w-full">
              <p>Phone Number</p>
              <div className="flex items-center border border-gray-200 rounded w-full mt-1 focus-within:outline outline-2 outline-black">
                <span className="p-2 text-gray-500 bg-gray-100 border-r border-gray-200">
                  +91
                </span>
                <input
                  onChange={(e) => setPhone(e.target.value)}
                  value={phone}
                  placeholder="Enter 10-digit number"
                  className="p-2 w-full outline-none"
                  type="tel"
                  required
                  maxLength="10"
                  pattern="[6-9][0-9]{9}"
                />
              </div>
            </div>
          </>
        )}

        <div className="w-full">
          <p>Email</p>
          <input
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            placeholder="abc@gmail.com"
            className="border border-gray-200 rounded w-full p-2 mt-1 outline-black"
            type="email"
            required
          />
        </div>

        {state !== "forgot" && (
          <div className="w-full">
            <p>Password</p>
            <input
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              placeholder="xxxx"
              className="border border-gray-200 rounded w-full p-2 mt-1 outline-black"
              type="password"
              required
            />
          </div>
        )}

        {state === "login" && (
          <p
            onClick={() => setState("forgot")}
            className="self-end -mt-2 text-black cursor-pointer hover:underline"
          >
            Forgot Password?
          </p>
        )}

        <p>
          {textContent[state].prompt}{" "}
          <span
            onClick={textContent[state].action}
            className="text-black cursor-pointer font-medium"
          >
            {textContent[state].promptAction}
          </span>
        </p>

        <button
          disabled={loading}
          className="bg-black hover:bg-gray-700 transition-all text-white w-full py-2 rounded-md cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed flex justify-center items-center gap-2"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Processing...
            </>
          ) : (
            textContent[state].button
          )}
        </button>
      </form>
    </div>
  );
};

export default Login;
