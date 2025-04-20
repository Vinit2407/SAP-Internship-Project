import React, { useContext, useEffect, useState } from "react";
import "./MyOrders.css";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";
import parcel_icon from "../../assets/parcel_icon.png";
import { assets } from "../../assets/assets";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";

const MyOrders = () => {
  const { url, token, user } = useContext(StoreContext);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const [showSuccessNotification, setShowSuccessNotification] = useState(false);
  const [newOrderId, setNewOrderId] = useState(null); 

  const fetchOrders = async () => {
    try {
      const response = await axios.post(
        url + "/api/order/userorders",
        { userId: user?._id },
        { headers: { token } }
      );
      
      if (response.data.success) {
        // Calculate final amount for each order
        const ordersWithCorrectAmount = response.data.data.map(order => ({
          ...order,
          displayAmount: order.promoCode 
            ? (order.discountedAmount + order.deliveryFee + order.tax)
            : order.amount
        }));
        setData(ordersWithCorrectAmount);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      if (error.response?.status === 401) navigate('/');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (location.state?.orderSuccess) {
      setShowSuccessNotification(true);
      setNewOrderId(location.state.newOrderId);
      fetchOrders();
      window.history.replaceState({}, document.title);

      const timer = setTimeout(() => {
        setShowSuccessNotification(false);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [location.state]);

  useEffect(() => {
    if (token) {
      fetchOrders();
    } else {
      setLoading(false);
      navigate("/");
    }
  }, [token, user?._id]); // Added user._id as dependency

  if (loading) return <div className="loading-spinner"></div>;

  return (
    <div className="my-orders">
      <div className="orders-header">
        <button className="back-button-myorders" onClick={() => navigate("/")}>
          <img src={assets.back_icon} alt="Back" />
        </button>
        <h2>My Orders</h2>
      </div>

      {showSuccessNotification && (
        <div className="order-success-notification">
          <p>Order #{newOrderId} placed successfully!</p>
        </div>
      )}

      <div className="order-list">
        {loading ? (
          <div className="loading-spinner"></div>
        ) : data.length > 0 ? (
          data.map((order, index) => (
            <div key={index} className="order-item">
              <img src={parcel_icon} alt="Parcel" />
              <div className="order-item-info">
                <p className="order-item-name">
                  {order.items.map(
                    (item, i) =>
                      `${item.name} x ${item.quantity}${
                        i === order.items.length - 1 ? "" : ", "
                      }`
                  )}
                </p>
                <p className="order-item-email">
                  {order.userEmail || user?.email || "Not available"}
                </p>
              </div>
              <p className="order-item-price">
              ₹{order.displayAmount?.toFixed(2) || order.amount.toFixed(2)}
              {order.promoCode && (
                <small className="promo-applied">
                  (Saved ₹{order.promoCode.discountAmount})
                </small>
              )}
              </p>
              <p className="order-item-quantity">Items: {order.items.length}</p>
              <div className="order-item-status">
                <span>•</span>
                <b>{order.status}</b>
              </div>
              <button className="order-item-refresh" onClick={fetchOrders}>
                Track Order
              </button>
            </div>
          ))
        ) : (
          <div className="no-orders">
            <p>You have no orders yet</p>
            <button onClick={() => navigate("/")}>Continue Shopping</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;
