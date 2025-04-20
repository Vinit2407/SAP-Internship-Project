// import React, { useContext, useState } from "react";
// import "./Cart.css";
// import { StoreContext } from "../../context/StoreContext";
// import { useNavigate } from 'react-router-dom';

// const Cart = () => {
//   // Add addToCart to the destructured context values
//   const { 
//     cartItems, 
//     food_list, 
//     removeFromCart, 
//     addToCart, 
//     getTotalCartAmount, 
//     url, 
//     getDeliveryFee, 
//     getFinalAmount, 
//     applyPromoCode,
//     promoCode,
//     discount
//   } = useContext(StoreContext);

//   const navigate = useNavigate();
//   const [inputPromoCode, setInputPromoCode] = useState("");

//   const handleApplyPromo = () => {
//     const success = applyPromoCode(inputPromoCode);
//     if (!success) {
//       alert("Invalid promo code or order value too low");
//       setInputPromoCode("");
//     }
//   };

//   const handleProceedToCheckout = () => {
//     // Verify promo code is still valid
//     const subtotal = getTotalCartAmount();
//     let isValid = false;
    
//     if (promoCode === "CSD" && subtotal > 300) isValid = true;
//     else if (promoCode === "VINIT" && subtotal > 500) isValid = true;
//     else if (promoCode === "BIGDEAL" && subtotal > 700) isValid = true;
//     else if (!promoCode) isValid = true; // No promo code is also valid
    
//     if (promoCode && !isValid) {
//       alert("Promo code no longer valid with current cart value");
//       return;
//     }
    
//     // Save to localStorage before navigating
//     localStorage.setItem('currentPromoCode', promoCode);
//     localStorage.setItem('currentDiscount', discount.toString());
//     navigate('/order');
//   };


//   return (
//     <div className="cart">
//       <div className="cart-items">
//         <div className="cart-items-title">
//           <p>Items</p>
//           <p>Title</p>
//           <p>Price</p>
//           <p>Quantity</p>
//           <p>Total</p>
//           <p>Remove</p>
//         </div>
//         <br />
//         <hr />
//         {food_list.map((item, index) => {
//           if (cartItems[item._id] > 0) {
//             return (
//               <div key={index}>
//                 <div className="cart-items-title cart-items-item">
//                   <img src={url+"/images/"+item.image} alt="" />
//                   <p>{item.name}</p>
//                   <p>₹{item.price}</p>
//                   <div className="quantity-controls">
//                     <button onClick={() => removeFromCart(item._id)}>-</button>
//                     <span>{cartItems[item._id]}</span>
//                     <button onClick={() => addToCart(item._id)}>+</button>
//                   </div>
//                   <p>₹{(item.price * cartItems[item._id]).toFixed(2)}</p>
//                   <button 
//                     onClick={() => removeFromCart(item._id, true)} 
//                     className="remove-btn"
//                   >
//                     X
//                   </button>
//                 </div>
//                 <hr />
//               </div>
//             );
//           }
//         })}
//       </div>
//       <div className="cart-bottom">
//         <div className="cart-total">
//           <h2>Cart Totals</h2>
//           <div>
//             <div className="cart-total-details">
//               <p>Subtotal</p>
//               <p>₹{getTotalCartAmount().toFixed(2)}</p>
//             </div>
//             <hr />
//             <div className="cart-total-details">
//               <p>Delivery Fee</p>
//               <p>{getTotalCartAmount() > 250 ? "Free Delivery" : `₹${getDeliveryFee().toFixed(2)}`}</p>
//             </div>
//             <hr />
//             <div className="cart-total-details">
//               <p>GST (5%)</p>
//               <p>₹{(getTotalCartAmount() * 0.05).toFixed(2)}</p>
//             </div>
//             <hr />
//             <div className="cart-total-details">
//               <p>Discount</p>
//               <p>-₹{discount.toFixed(2)}</p>
//             </div>
//             <hr />
//             <div className="cart-total-details">
//               <b>Total</b>
//               <b>₹{getFinalAmount().toFixed(2)}</b>
//             </div>
//           </div>
//           <button onClick={handleProceedToCheckout}>PROCEED TO CHECKOUT</button>
//         </div>
//         <div className="cart-promocode">
//           <div>
//             <p>Apply Promo Code</p>
//             <div className="cart-promocode-input">
//               <input 
//                 type="text" 
//                 placeholder="Promo Code" 
//                 value={inputPromoCode}
//                 onChange={(e) => setInputPromoCode(e.target.value.toUpperCase())}
//               />
//               <button onClick={handleApplyPromo}>Apply</button>
//             </div>
//             {promoCode && (
//               <p className="applied-promo">Applied: {promoCode} (-₹{discount.toFixed(2)})</p>
//             )}
//             <div className="available-promos">
//               <p>Available Promos:</p>
//               <ul>
//                 <li>CSD - ₹50 off on orders above ₹300</li>
//                 <li>VINIT - ₹80 off on orders above ₹500</li>
//                 <li>BIGDEAL - ₹100 off on orders above ₹700</li>
//               </ul>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Cart;


import React, { useContext, useState, useEffect } from "react";
import "./Cart.css";
import { StoreContext } from "../../context/StoreContext";
import { useNavigate } from 'react-router-dom';
import { assets } from '../../assets/assets';

const Cart = () => {
  const {
    cartItems,
    food_list,
    removeFromCart,
    addToCart,
    getTotalCartAmount,
    url,
    getDeliveryFee,
    loading,
    applyPromoCode,
    removePromoCode,
    appliedPromo,
    promoError
  } = useContext(StoreContext);

  const [localLoading, setLocalLoading] = useState(true);
  const [promoCode, setPromoCode] = useState("");
  const navigate = useNavigate();

  // Additional code for not showing UI
  useEffect(() => {
    if (food_list && food_list.length > 0 && !loading) {
      setLocalLoading(false);
    }
  }, [food_list], [loading]);

  if (!food_list || food_list.length === 0) {
    return (
      <div className='loading-container'>
        <div className='loading-spinner'>Loading...</div>
      </div>
    )
  }

  const cartHasItems = Object.keys(cartItems).some(itemId => cartItems[itemId] > 0);

  if (!cartHasItems) {
    return (
      <div className='empty-cart'>
        <p>Your cart is empty</p>
        <button onClick={() => navigate('/')}>Continue Shopping</button>
      </div>
    );
  }
  // END

  const handleApplyPromo = async () => {
    if (!promoCode.trim()) return;
    await applyPromoCode(promoCode);
  };

  const handleProceedToCheckout = () => {
    navigate("/order", {
      state: {
        appliedPromo: appliedPromo ? {
          code: appliedPromo.code,
          discountAmount: appliedPromo.discountAmount
        } : null
      }
    });
  };

  // Modify your quantity change handlers to include promo validation
  const handleDecreaseQuantity = async (itemId) => {
    await removeFromCart(itemId);
    validatePromoCode();
  };

  const handleIncreaseQuantity = async (itemId) => {
    await addToCart(itemId);
    validatePromoCode();
  };

  const validatePromoCode = () => {
    if (appliedPromo) {
      const currentSubtotal = getTotalCartAmount();
      if (currentSubtotal < appliedPromo.minOrderValue) {
        removePromoCode();
      }
    }
  };

  const subtotal = getTotalCartAmount();
  const deliveryFee = getDeliveryFee();
  const tax = (subtotal - (appliedPromo?.discountAmount || 0)) * 0.05;
  const totalAmount = (subtotal - (appliedPromo?.discountAmount || 0)) + deliveryFee + tax;

  return (
    <div className="cart">
      <div className="cart-header">
        <button className="back-button-cart" onClick={() => navigate('/')}>
          <img src={assets.back_icon} alt="Back" />
        </button>
        <h1>Your Cart</h1>
      </div>
      <div className="cart-items">
        <div className="cart-items-title">
          <p>Items</p>
          <p>Title</p>
          <p>Price</p>
          <p>Quantity</p>
          <p>Total</p>
          <p>Remove</p>
        </div>
        <br />
        <hr />
        {food_list.map((item, index) => {
          if (cartItems[item._id] > 0) {
            return (
              <div key={index}>
                <div className="cart-items-title cart-items-item">
                  <img src={url+"/images/"+item.image} alt="" />
                  <p>{item.name}</p>
                  <p>₹{item.price}</p>
                  <div className="quantity-controls">
                    <button onClick={() => handleDecreaseQuantity(item._id)}>-</button>
                    <span>{cartItems[item._id]}</span>
                    <button onClick={() => handleIncreaseQuantity(item._id)}>+</button>
                  </div>
                  <p>₹{(item.price * cartItems[item._id]).toFixed(2)}</p>
                  <button
                    onClick={() => removeFromCart(item._id, true)}
                    className="remove-btn"
                  >
                    X
                  </button>
                </div>
                <hr />
              </div>
            );
          }
        })}
      </div>
      <div className="cart-bottom">
        <div className="cart-total">
          <h2>Cart Totals</h2>
          <div>
            <div className="cart-total-details">
              <p>Subtotal</p>
              <p>₹{subtotal.toFixed(2)}</p>
            </div>
            
            {appliedPromo && (
              <div className="cart-total-details promo-discount">
                <p>Promo Discount ({appliedPromo.code})</p>
                <p>-₹{appliedPromo.discountAmount.toFixed(2)}</p>
              </div>
            )}
            
            <hr />
            <div className="cart-total-details">
              <p>Delivery Fee</p>
              <p>{subtotal > 250 ? "Free Delivery" : `₹${deliveryFee.toFixed(2)}`}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>GST (5%)</p>
              <p>₹{tax.toFixed(2)}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <b>Total</b>
              <b>₹{totalAmount.toFixed(2)}</b>
            </div>
          </div>
          <button onClick={handleProceedToCheckout}>PROCEED TO CHECKOUT</button>
        </div>

        <div className="cart-promocode">
          <div>
            <p>Have a promo code?</p>
            <div className="cart-promocode-input">
              <input
                type="text"
                placeholder="Promo Code"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
              />
              <button onClick={handleApplyPromo}>Apply</button>
            </div>
            {promoError && <div className="promo-error">{promoError}</div>}
            {appliedPromo && (
              <div className="applied-promo">
                <span>{appliedPromo.description}</span>
                <button onClick={removePromoCode}>Remove</button>
              </div>
            )}
            {promoError && (
              <div className="promo-error">
                {promoError}
                {appliedPromo && getTotalCartAmount() < appliedPromo.minOrderValue && (
                  <span> (Current order value: ₹{getTotalCartAmount()})</span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;