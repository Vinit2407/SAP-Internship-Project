import React, { useContext, useEffect, useState } from 'react';
import './PlaceOrder.css';
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { assets } from '../../assets/assets';
import { toast } from "react-toastify";

const PlaceOrder = () => {
  const {
    getTotalCartAmount,
    token,
    food_list,
    cartItems,
    url,
    getDeliveryFee,
    user,
    appliedPromo, 
    removePromoCode,
    clearCart
  } = useContext(StoreContext);

  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    phone: ""
  });

  const [paymentMode, setPaymentMode] = useState("online");
  const navigate = useNavigate();

useEffect(() => {
  const fetchUserData = async () => {
    if (!token) {
      navigate('/cart');
      return;
    }

    if (getTotalCartAmount() === 0) {
      navigate('/cart');
      return;
    }

    try {
      // First try to get from context
      if (user && user.profile) {
        setData({
          firstName: user.profile.firstName || "",
          lastName: user.profile.lastName || "",
          email: user.email || "",
          street: user.profile.address?.street || "",
          city: user.profile.address?.city || "",
          state: user.profile.address?.state || "",
          zipcode: user.profile.address?.zipcode || "",
          country: user.profile.address?.country || "",
          phone: user.profile.phone || ""
        });
      } else {
        // Fallback to API if context data is incomplete
        const [userResponse, profileResponse] = await Promise.all([
          axios.post(url + "/api/user/get-user", {}, { headers: { token } }),
          axios.get(url + "/api/user/profile", { headers: { token } })
        ]);

        const userData = userResponse.data.user;
        const profileData = profileResponse.data.profile || {};

        setData({
          firstName: profileData.firstName || "",
          lastName: profileData.lastName || "",
          email: userData.email || "",
          street: profileData.address?.street || "",
          city: profileData.address?.city || "",
          state: profileData.address?.state || "",
          zipcode: profileData.address?.zipcode || "",
          country: profileData.address?.country || "",
          phone: profileData.phone || ""
        });
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      // Proceed with empty form if there's an error
    }
  };

  fetchUserData();
}, [token, navigate, url, getTotalCartAmount, user]);


  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setData(prev => ({ ...prev, [name]: value }));
  };


  const placeOrder = async (event) => {
    event.preventDefault();
    
    try {
      const orderItems = food_list
        .filter(item => cartItems[item._id] > 0)
        .map(item => ({
          _id: item._id,
          name: item.name,
          price: item.price,
          offerPrice: item.offerPrice,
          quantity: cartItems[item._id],
          image: item.image,
          category: item.category
        }));
  
      const subtotal = getTotalCartAmount();
      const deliveryFee = getDeliveryFee();
      const discountAmount = appliedPromo?.discountAmount || 0;
      const tax = (subtotal - discountAmount) * 0.05;
      const totalAmount = (subtotal - discountAmount) + deliveryFee + tax;
  
      const tokenPayload = JSON.parse(atob(token.split('.')[1]));
      const userId = tokenPayload.id;
  
      const orderData = {
        userId: userId,
        userEmail: data.email || user.email,
        items: orderItems,
        amount: totalAmount,
        subtotal: subtotal,
        deliveryFee: deliveryFee,
        discountedAmount: subtotal - discountAmount,
        tax: tax,
        address: {
          firstName: data.firstName,
          lastName: data.lastName,
          phone: data.phone,
          street: data.street,
          city: data.city,
          state: data.state,
          zipcode: data.zipcode,
          country: data.country
        },
        paymentMode: paymentMode,
        promoCode: appliedPromo?.code,
      };

      // Final validation before placing order
      if (appliedPromo && getTotalCartAmount() < appliedPromo.minOrderValue) {
        removePromoCode();
        toast.error("Promo code is no longer valid for this order value");
        return;
      }
  
      const response = await axios.post(url + "/api/order/place", orderData, {
        headers: { token }
      });
  
      if (response.data.success) {
        if (paymentMode === "online") {
          window.location.replace(response.data.session_url);
        } else {
          // For COD orders
          await axios.post(url + "/api/order/verify", {
            success: "true",
            orderId: response.data.orderId
          }, {
            headers: { token }
          });

          // clearCart();
          
          navigate('/myorders', { 
            state: { 
              orderSuccess: true,
              newOrderId: response.data.orderId 
            },
            replace: true
          });

          setTimeout(() => {
            clearCart();
          }, 0);
          
        }
      } else {
        alert("Order Error: " + (response.data.message || "Unknown error"));
      }
    } catch (error) {
      console.error("Order placement error:", error);
      alert("Failed to place order");
    }
  };

  return (
    <form onSubmit={placeOrder}>
      <div className="order-header">
        <button
          type="button"
          className="back-button-placeorder"
          onClick={() => navigate('/cart')}
        >
          <img src={assets.back_icon} alt="Back" />
        </button>
        <h1>Checkout</h1>
      </div>

    <div className="place-order">
    <div className="place-order-left">
        <p className='title'>Delivery Information</p>
        
        <div className="multi-fields">
          <input 
            required 
            name='firstName' 
            onChange={onChangeHandler} 
            value={data.firstName} 
            type="text" 
            placeholder='First Name' 
          />
          <input 
            required 
            name='lastName' 
            onChange={onChangeHandler} 
            value={data.lastName} 
            type="text" 
            placeholder='Last Name' 
          />
        </div>
        
        <input 
          required 
          name='email' 
          onChange={onChangeHandler} 
          value={data.email} 
          type="email" 
          placeholder='Email Address' 
          readOnly 
        />
        
        <input 
          required 
          name='street' 
          onChange={onChangeHandler} 
          value={data.street} 
          type="text" 
          placeholder='Street' 
        />
        
        <div className="multi-fields">
          <input 
            required 
            name='city' 
            onChange={onChangeHandler} 
            value={data.city} 
            type="text" 
            placeholder='City' 
          />
          <input 
            required 
            name='state' 
            onChange={onChangeHandler} 
            value={data.state} 
            type="text" 
            placeholder='State' 
          />
        </div>
        
        <div className="multi-fields">
          <input 
            required 
            name='zipcode' 
            onChange={onChangeHandler} 
            value={data.zipcode} 
            type="text" 
            placeholder='Pin Code' 
          />
          <input 
            required 
            name='country' 
            onChange={onChangeHandler} 
            value={data.country} 
            type="text" 
            placeholder='Country' 
          />
        </div>
        
        <input 
          required 
          name='phone' 
          onChange={onChangeHandler} 
          value={data.phone} 
          type="tel" 
          placeholder='Phone' 
        />
      </div>

      <div className="place-order-right">
        <div className="cart-total">
          <h2>Cart Total</h2>
          <div>
            <div className="cart-total-details">
              <p>Subtotal</p>
              <p>₹{getTotalCartAmount().toFixed(2)}</p>
            </div>
            <hr />
            {appliedPromo && (
              <>
                <div className="cart-total-details promo-discount">
                  <p>Promo Discount ({appliedPromo.code})</p>
                  <p>-₹{appliedPromo.discountAmount.toFixed(2)}</p>
                </div>
                <hr />
              </>
            )}
            <div className="cart-total-details">
              <p>Delivery Fee</p>
              <p>{getTotalCartAmount() > 250 ? "Free Delivery" : `₹${getDeliveryFee().toFixed(2)}`}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>GST (5%)</p>
              <p>₹{(getTotalCartAmount() - (appliedPromo?.discountAmount || 0)) * 0.05.toFixed(2)}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <b>Total</b>
              <b>
                ₹{(
                  (getTotalCartAmount() - (appliedPromo?.discountAmount || 0)) +
                  getDeliveryFee() +
                  (getTotalCartAmount() - (appliedPromo?.discountAmount || 0)) * 0.05
                ).toFixed(2)}
              </b>
            </div>
          </div>
          
          <div className="payment-mode">
            <h3>Payment Method</h3>
            <div className="payment-options">
              <label className={`payment-option ${paymentMode === "online" ? "selected" : ""}`}>
                <input
                  type="radio"
                  name="paymentMode"
                  value="online"
                  checked={paymentMode === "online"}
                  onChange={() => setPaymentMode("online")}
                />
                Online Payment
              </label>
              <label className={`payment-option ${paymentMode === "cod" ? "selected" : ""}`}>
                <input
                  type="radio"
                  name="paymentMode"
                  value="cod"
                  checked={paymentMode === "cod"}
                  onChange={() => setPaymentMode("cod")}
                />
                Cash on Delivery
              </label>
            </div>
          </div>
          
          <button type='submit'>PROCEED TO PAYMENT</button>
        </div>
      </div>
    </div>
      
    </form>
  );
};

export default PlaceOrder;