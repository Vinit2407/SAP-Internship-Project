import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
  const [cartItems, setCartItems] = useState({});
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [promoError, setPromoError] = useState("");
  const url = "https://swigato-backend-25my.onrender.com";
  const [token, setToken] = useState("");
  const [food_list, setFoodList] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  

  const setAuthToken = (newToken) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
    if (newToken) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  };

  const clearCart = async () => {
    try {
      if (token) {
        await axios.post(`${url}/api/cart/clear`, {}, { headers: { token } });
      }
      setCartItems({});
    } catch (error) {
      console.error("Error clearing cart:", error);
      // Still clear the local cart even if backend fails
      setCartItems({});
    }
  };

  const addToCart = async (itemId) => {
    try {
      const newCart = {...cartItems};
      newCart[itemId] = (newCart[itemId] || 0) + 1;
      setCartItems(newCart);

      const cartIcon = document.querySelector('.cart-item-count');
      if (cartIcon) cartIcon.classList.add('added');
      setTimeout(() => {
        if (cartIcon) cartIcon.classList.remove('added');
      }, 500);

      if (token) {
        await axios.post(`${url}/api/cart/add`, { itemId });
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      // Revert on error
      setCartItems(cartItems);
      throw error; // Re-throw to handle in component
    }
  };


  const removeFromCart = async (itemId, removeAll = false) => {
    try {
      const newCart = {...cartItems};
      if (removeAll || newCart[itemId] <= 1) {
        delete newCart[itemId];
      } else {
        newCart[itemId] -= 1;
      }
      setCartItems(newCart);

      if (token) {
        await axios.post(`${url}/api/cart/remove`, { itemId, removeAll });
      }
    } catch (error) {
      console.error("Error removing from cart:", error);
      setCartItems(cartItems);
      throw error;
    }
  };


  const getTotalCartAmount = () => {
    let totalAmount = 0;
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        let itemInfo = food_list.find((product) => product._id === item);
        // Use offerPrice if available, otherwise use regular price
        totalAmount += (itemInfo.offerPrice || itemInfo.price) * cartItems[item];
      }
    }
    return totalAmount;
  };

  const getDeliveryFee = () => {
    const subtotal = getTotalCartAmount();
    return subtotal > 250 ? 0 : 40;
  };

  const applyPromoCode = async (code) => {
    try {
      const subtotal = getTotalCartAmount();
      const response = await axios.post(`${url}/api/promo/validate`, {
        code,
        subtotal
      }, { headers: { token } });

      if (response.data.success) {
        setAppliedPromo({
          ...response.data,
          minOrderValue: response.data.minOrderValue 
        });
        setPromoError("");
        return true;
      }
    } catch (error) {
      setPromoError(error.response?.data?.message || "Invalid promo code");
      return false;
    }
  };

  const removePromoCode = () => {
    setAppliedPromo(null);
    setPromoError("");
  };

  const fetchFoodList = async () => {
    try {
      const response = await axios.get(url + "/api/food/list");
      console.log("Food list response:", response.data);
      if (response.data.success) {
        setFoodList(response.data.data);
      } else {
        console.error("Failed to fetch food list");
      }
    } catch (error) {
      console.error("Error fetching food list:", error);
    }
  }

  const loadUserData = async (token) => {
    try {
      const response = await axios.post(url+"/api/user/get-user", {}, {
        headers: { token }
      });
      if (response.data.success) {
        setUser(response.data.user);
      }
    } catch (error) {
      console.error("Error loading user data:", error);
    }
  }

  const loadCartData = async (token) => {
    try {
      const response = await axios.get(`${url}/api/cart/get`, { // Changed to GET
        headers: { 
          // 'Authorization': `Bearer ${token}`,
          setToken: setAuthToken,
          'Content-Type': 'application/json'
        }
      });
      console.log("Cart data response:", response.data);
      if (response.data.success) {
        setCartItems(response.data.cartData || {});
      }
    } catch (error) {
      console.error("Error loading cart:", error);
      // Initialize empty cart if not found
      setCartItems({});
    }
  };

  const fetchUserProfile = async () => {
    try {
      const response = await axios.get(`${url}/api/user/profile`);
      return response.data.profile || {};
    } catch (error) {
      console.error("Error fetching profile:", error);
      return {};
    }
  };

  useEffect(() => {
    if (appliedPromo) {
      const currentSubtotal = getTotalCartAmount();
      if (currentSubtotal < appliedPromo.minOrderValue) {
        removePromoCode();
        toast.warning(`Promo code removed as order value is below ₹${appliedPromo.minOrderValue}`);
      }
    }
  }, [cartItems, appliedPromo]); 


  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Fetch food list
        const foodResponse = await axios.get(`${url}/api/food/list`);
        setFoodList(foodResponse.data.data || []);

        // 2. Check for token
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
          setAuthToken(storedToken);
          
          // 3. Fetch user data
          const [userResponse, profile] = await Promise.all([
            axios.get(`${url}/api/user`),
            fetchUserProfile()
          ]);
          
          setUser({
            ...userResponse.data.user,
            profile: profile
          });

          // 4. Load cart
          const cartResponse = await axios.get(`${url}/api/cart/get`);
          setCartItems(cartResponse.data.cartData || {});
        }
      } catch (error) {
        console.error("Initial data loading error:", error);
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          setAuthToken("");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url]);


  const contextValue = {
    food_list,
    cartItems,
    setCartItems,
    addToCart,
    removeFromCart,
    clearCart,
    getTotalCartAmount,
    url,
    token,
    setToken: setAuthToken,
    user,
    setUser,
    getDeliveryFee,
    loadCartData,
    loadUserData,
    fetchFoodList,
    loading,
    // Promo code functions
    applyPromoCode,
    removePromoCode,
    appliedPromo,
    promoError
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {!loading && props.children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;
