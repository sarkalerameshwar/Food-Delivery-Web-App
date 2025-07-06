import React from 'react'
import './Order.css'
import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useEffect } from 'react';
import { assets } from '../../assets/assets';

const Order = ({url}) => {

  const [orders, setOrders] = useState([]);

  const fetchAllOrders = async () => {
    const response = await axios.get(`${url}/api/order/list`);
    if(response.data.success) {
      setOrders(response.data.orders);
      console.log(response.data.orders);
    }
    else{
      toast.error("Failed to fetch orders");
      console.error("Error fetching orders:", response.data.message);
    }
  }

  const statusHandler = async (event, orderId)=>{
    try {
      const response = await axios.post(url+"/api/order/status", { orderId, status:event.target.value });
      if(response.data.success) {
        toast.success("Order status updated successfully");
        await fetchAllOrders(); // Refresh the order list
      } else {
        toast.error("Failed to update order status");
      }
    } catch (error) {
      console.error("Error updating order status:", error);
      toast.error("An error occurred while updating the order status");
    }
  }

  useEffect(() => {
    fetchAllOrders();
  },[])

  return (
    <div className='order add'>
      <h3>Order Page</h3>
      <div className='order-list'>
        {orders && orders.length > 0 ? orders.map((order, index) => (
          <div key={index} className='order-item'>
            <img src={assets.parcel_icon} alt="" />
            <div>
              <p className='order-item-food'>
                {order.items && order.items.length > 0 ? order.items.map((item, idx) => {
                  if (idx === order.items.length - 1) {
                    return item.name + " x " + item.quantity;
                  } else {
                    return item.name + " x " + item.quantity + ", ";
                  }
                }) : null}
              </p>
              <p className="order-item-name">
                {order.address?.firstName} {order.address?.lastName}
              </p>
              <div className='order-item-address'>
                <p>{order.address?.street + ", "}</p>
                <p>{order.address?.city + ", " + order.address?.state + ", " + order.address?.country + ", " + order.address?.zipcode}</p>
              </div>
              <p className="order-item-phone">{order.address?.phone}</p>
            </div>
            <p>Items : {order.items ? order.items.length : 0}</p>
            <p>${order.amount}</p>
            <select onChange={(event)=> statusHandler(event, order._id)} value={order.status}>
              <option value="Food Processing">Food Processing</option>
              <option value="Out for delivery">Out for delivery</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        )) : <p>No orders found.</p>}
      </div>

    </div>
  )
}

export default Order