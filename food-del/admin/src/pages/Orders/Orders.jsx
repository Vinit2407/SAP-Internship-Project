import React, { useEffect, useState } from 'react';
import './Orders.css';
import { toast } from "react-toastify";
import axios from "axios";
import { assets } from "../../assets/assets";

const Orders = ({ url }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAllOrders = async () => {
    const token = localStorage.getItem('adminToken');
    try {
      const response = await axios.get(`${url}/api/admin/list-orders`, {
        headers: { token }
      });
      if (response.data.success) {
        setOrders(response.data.data);
      } else {
        toast.error("Error fetching orders");
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Error fetching orders");
      if (error.response?.status === 401) {
        localStorage.removeItem('adminToken');
        window.location.reload();
      }
    } finally {
      setLoading(false);
    }
  };

  const statusHandler = async (event, orderId) => {
    const token = localStorage.getItem('adminToken');
    try {
      const response = await axios.post(`${url}/api/admin/update-status`, {
        orderId,
        status: event.target.value
      }, {
        headers: { token }
      });
      if (response.data.success) {
        await fetchAllOrders();
        toast.success("Status updated successfully");
      } else {
        toast.error("Failed to update status");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Error updating status");
      if (error.response?.status === 401) {
        localStorage.removeItem('adminToken');
        window.location.reload();
      }
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, []);

  if (loading) return <div className="loading-spinner">Loading...</div>;

  return (
    <div className='order add'>
      <h3>Order Page</h3>
      <div className="order-list">
        {orders.map((order, index) => (
          <div key={index} className="order-item">
            <img src={assets.parcel_icon} alt="" />
            <div>
              <p className='order-item-food'>
                {order.items.map((item, index) => {
                  if (index === order.items.length - 1) {
                    return item.name + " x " + item.quantity;
                  } else {
                    return item.name + " x " + item.quantity + ", ";
                  }
                })}
              </p>
              <p className='order-item-name'>
                {order.address.firstName + " " + order.address.lastName}
                <br />
                <small>{order.userEmail}</small>
              </p>
              <div className="order-item-address">
                <p>{order.address.street + ","}</p>
                <p>{order.address.city + ", " + order.address.state + ", " + order.address.country + ", " + order.address.zipcode}</p>
              </div>
              <p className='order-item-phone'>{order.address.phone}</p>
              {order.promoCode && (
                <p className='order-item-promo'>
                  Promo: {order.promoCode.code} (-₹{order.promoCode.discountAmount})
                </p>
              )}
            </div>
            <p>Items: {order.items.length}</p>
            <p>
              ₹{(order.discountedAmount + order.deliveryFee + order.tax).toFixed(2)}
              {order.promoCode && (
                <span className="original-price">
                  <del>₹{order.amount.toFixed(2)}</del>
                </span>
              )}
            </p>
            <select onChange={(event) => statusHandler(event, order._id)} value={order.status}>
              <option value="Awaiting Confirmation">Awaiting Confirmation</option>
              <option value="Placed">Placed</option>
              <option value="Food Processing">Food Processing</option>
              <option value="Out for delivery">Out for delivery</option>
              <option value="Delivered">Delivered</option>
            </select>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;