import { Route, Routes, useNavigate, Navigate } from "react-router-dom";
import "./App.css";

import Navbar from "./components/navbar/Navbar";
import PlaceOrder from "./pages/PlaceOrder/PlaceOrder";
import Home from "./pages/Home/Home.jsx";
import Cart from "./pages/Cart/Cart.jsx";
import Footer from "./components/footer/Footer.jsx";
import { useState } from "react";
import LoginPopup from "./components/LoginPopup/LoginPopup.jsx";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Verify from "./pages/verify/Verify.jsx";
import MyOrders from "./pages/myorders/MyOrders.jsx";

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  if (!token) {
    toast.error("Please login to access this page");
    return <Navigate to="/" replace />;
  }

  return children;
};

function App() {
  const [showLogin, setShowLogin] = useState(false);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  // ✅ Function to check login before placing order
  const handlePlaceOrderClick = async () => {
    if (token) {
      navigate("/order");
      
    } else {
      toast.error("Please login to place an order");
    }
  };

  const protect =async () => {
    if(!token) {
      toast.error("Please login to view your orders");
      return <Navigate to="/" replace />;
    }
  }

  return (
    <>
      <ToastContainer />
      {showLogin && <LoginPopup setShowLogin={setShowLogin} />}
      <div className="app">
        <Navbar setShowLogin={setShowLogin} />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/cart"
            element={<Cart onPlaceOrderClick={handlePlaceOrderClick} />}
          />
          <Route
            path="/order"
            element={
              <ProtectedRoute>
                <PlaceOrder />
              </ProtectedRoute>
            }
          />
          <Route
            path="/verify"
            element={
              <ProtectedRoute>
                <Verify />
              </ProtectedRoute>
            }
          />
          <Route
            path="myorders"
            element={
              <ProtectedRoute>
                <MyOrders protect={protect}/>
              </ProtectedRoute>
            }
          ></Route>
        </Routes>
      </div>
      <Footer />
    </>
  );
}

export default App;
