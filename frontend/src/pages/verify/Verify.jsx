import React, { useEffect, useContext } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";
import "./Verify.css";
import {toast} from "react-toastify";

const Verify = () => {
  const [searchParams] = useSearchParams();
  const { url, token } = useContext(StoreContext);
  const navigate = useNavigate();
  const successParam = searchParams.get("success");
  const session_id = searchParams.get("session_id");
  const orderId = searchParams.get("orderId");

  // Convert success string to boolean
  const success = successParam === "true";

  // Utility to check if token is expired
  const isTokenExpired = (token) => {
    if (!token) return true;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      if (!payload.exp) return true;
      const expiry = payload.exp * 1000;
      return Date.now() > expiry;
    } catch {
      return true;
    }
  };

  const verifyPayment = async () => {

    if (!token || isTokenExpired(token)) {
      toast.error("Session expired or unauthorized. Please login again.");
      navigate("/login");
      return;
    }
    try {
      const response = await axios.post(
        url + "/api/order/verify",
        { success, session_id, orderId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.success) {
        toast.success("Order placed successfully");
        // Clear cart on frontend after successful payment
        localStorage.removeItem("cartItems");
        // Assuming setCartItems is available via context, add it to context destructure
        if (typeof window !== "undefined") {
          window.dispatchEvent(new Event("storage")); // Notify other tabs
        }
        navigate("/myorders");
      } else {
        navigate("/");
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        toast.error("Session expired or unauthorized. Please login again.");
        navigate("/login");
      } else {
        toast.error("Verification failed");
        navigate("/");
      }
    }
  };

  useEffect(() => {
    if (token) {
      verifyPayment();
    }
  }, [token]);

  return (
    <div className="verify">
      <div className="spinner"></div>
    </div>
  );
};

export default Verify;
