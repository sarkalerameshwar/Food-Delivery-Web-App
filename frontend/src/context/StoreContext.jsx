import { createContext, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
  const [cartItems, setCartItems] = useState({});

  const url = "http://localhost:5000";
  const [token, setToken] = useState("");
  const [food_list, setFood_list] = useState([]);

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

  // Load token and cart data on mount
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
      loadCartData(storedToken);
    } else {
      // Load cart from localStorage if no token
      const localCart = localStorage.getItem("cartItems");
      if (localCart) {
        setCartItems(JSON.parse(localCart));
      }
    }
  }, []);

  // Save cartItems to localStorage whenever it changes
  useEffect(() => {
    if (!token) {
      localStorage.setItem("cartItems", JSON.stringify(cartItems));
    }
  }, [cartItems, token]);

  const addToCart = async (itemId) => {
    if (isTokenExpired(token)) {
      toast.error("Session expired. Please login again.");
      setToken("");
      localStorage.removeItem("token");
      // window.location.reload();
      return;
    }
    if (!cartItems[itemId]) {
      setCartItems((prev) => ({ ...prev, [itemId]: 1 }));
    } else {
      setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));
    }
    if (token) {
      try {
        await axios.post(`${url}/api/cart/add`, { itemId }, { headers: { Authorization: `Bearer ${token}` } });
      } catch (error) {
        if (error.response && error.response.status === 401) {
          toast.error("Session expired or unauthorized. Please login again.");
          setToken("");
          localStorage.removeItem("token");
          // window.location.reload();
        }
      }
    }
  };

  const removeFromCart = async (itemId) => {
    if (isTokenExpired(token)) {
      toast.error("Session expired. Please login again.");
      setToken("");
      localStorage.removeItem("token");
      // window.location.reload();
      return;
    }
    setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }));
    if (token) {
      try {
        await axios.post(`${url}/api/cart/remove`, { itemId }, { headers: { Authorization: `Bearer ${token}` } });
      } catch (error) {
        if (error.response && error.response.status === 401) {
          toast.error("Session expired or unauthorized. Please login again.");
          setToken("");
          localStorage.removeItem("token");
          // window.location.reload();
        }
      }
    }
  };

  const getTotalCartAmount = () => {
    let totalAmount = 0;
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        let itemInfo = food_list.find((product) => product._id === item);
        if (itemInfo) {
          totalAmount += itemInfo.price * cartItems[item];
        }
      }
    }
    return totalAmount;
  };

  const fetchFoodList = async () => {
    const response = await axios.get(url + "/api/food/list");
    setFood_list(response.data.data);
  };

  const loadCartData = async (tokenParam) => {
    const response = await axios.post(`${url}/api/cart/get`, {}, { headers: tokenParam ? { Authorization: `Bearer ${tokenParam}` } : {} });
    setCartItems(response.data.cartData);
  };

  useEffect(() => {
    fetchFoodList();
  }, []);

  const contextValue = {
    food_list,
    cartItems,
    setCartItems,
    addToCart,
    removeFromCart,
    getTotalCartAmount,
    url,
    token,
    setToken,
  };

  return <StoreContext.Provider value={contextValue}>{props.children}</StoreContext.Provider>;
};

export default StoreContextProvider;
