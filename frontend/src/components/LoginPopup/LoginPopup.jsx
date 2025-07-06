import React, { useState, useContext } from "react";
import "./LoginPopup.css";
import { assets } from "../../assets/assets";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";
import { toast } from "react-toastify";

const LoginPopup = ({ setShowLogin }) => {
  const { url, setToken } = useContext(StoreContext);

  const [currState, setCurrentState] = useState("Login");
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const validateInputs = () => {
    if (!data.email.includes("@") || !data.email.includes(".")) {
      toast.error("Please enter a valid email.");
      return false;
    }
    if (data.password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return false;
    }
    if (currState === "Sign Up" && data.name.trim().length < 2) {
      toast.error("Name must be at least 2 characters.");
      return false;
    }
    return true;
  };

  const onLogin = async (e) => {
    e.preventDefault();

    if (!validateInputs()) return;

    setIsSubmitting(true);

    try {
      const endpoint = currState === "Login" ? "/api/user/login" : "/api/user/register";
      const response = await axios.post(`${url}${endpoint}`, data);

      if (response.data.success && response.data.token) {
        setToken(response.data.token);
        localStorage.setItem("token", response.data.token);
        toast.success(response.data.message || `${currState} successful!`);
        setShowLogin(false); // close popup
      } 
      // else {
      //   toast.error(`${currState} failed.`);
      // }
    } catch (error) {
      console.error("Auth error:", error);
      const message =
        error.response?.data?.message ||
        error.message ||
        "Unexpected error occurred.";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="login-popup">
      <form onSubmit={onLogin} className="login-popup-container">
        <div className="login-popup-title">
          <h2>{currState}</h2>
          <img
            onClick={() => setShowLogin(false)}
            src={assets.cross_icon}
            alt="close"
          />
        </div>

        <div className="login-popup-inputs">
          {currState === "Sign Up" && (
            <input
              type="text"
              placeholder="Your name"
              name="name"
              onChange={onChangeHandler}
              value={data.name}
              required
            />
          )}
          <input
            type="email"
            placeholder="Your email"
            name="email"
            onChange={onChangeHandler}
            value={data.email}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={onChangeHandler}
            value={data.password}
            required
          />
        </div>

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? "Please wait..."
            : currState === "Sign Up"
            ? "Create account"
            : "Login"}
        </button>

        <div className="login-popup-condition">
          <input type="checkbox" required />
          <p>
            By continuing, I agree to the terms of use & privacy policy.
          </p>
        </div>

        {currState === "Login" ? (
          <p>
            Create a new account{" "}
            <span onClick={() => setCurrentState("Sign Up")}>Click here</span>
          </p>
        ) : (
          <p>
            Already have an account?{" "}
            <span onClick={() => setCurrentState("Login")}>Login here</span>
          </p>
        )}
      </form>
    </div>
  );
};

export default LoginPopup;
