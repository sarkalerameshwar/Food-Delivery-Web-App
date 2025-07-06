import React, { useState, useEffect, useContext } from 'react';
import './MyOrders.css';
import { StoreContext } from '../../context/StoreContext';
import { assets } from '../../assets/assets';
import axios from 'axios';

const MyOrders = () => {
  const { url, token } = useContext(StoreContext);
  const [data, setData] = useState([]);

  // Simple function to decode JWT token payload
  const decodeToken = (token) => {
    try {
      const payload = token.split('.')[1];
      const decoded = JSON.parse(atob(payload));
      return decoded;
    } catch (error) {
      console.error('Failed to decode token:', error);
      return null;
    }
  };

  const fetchOrders = async () => {
    try {
      const decoded = decodeToken(token);
      const userId = decoded ? decoded.id || decoded._id : null;

      if (!userId) {
        console.error('User ID not found in token');
        return;
      }

      const response = await axios.post(
        `${url}/api/order/userorders`,
        { userId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      setData(response.data.orders); // Assuming the backend returns { orders: [...] }
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    }
  };

  useEffect(() => {
    if (token) {
      fetchOrders();
    }
  }, [token]);

  return (
    <div className="my-orders">
      <h2>My Orders</h2>
      <div className="container">
        {data.map((order, index) => (
          <div key={index} className="my-orders-order">
            <img src={assets.parcel_icon} alt="parcel" />
            <p>
              {order.items.map((item) => {
               if(index === order.items.length -1){
                return `${item.name} x ${item.quantity}`;
               }else{
                return `${item.name} x ${item.quantity}, `;
               }
              })}
            </p>
            <p>${order.amount}.00</p>
            <p>Items: {order.items.length}</p>
            <p><span>&#x25cf;</span><b>{order.status}</b></p>
            <button onClick={fetchOrders}>Track Order</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyOrders;
