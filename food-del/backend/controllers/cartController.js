import userModel from "../models/userModel.js"


const addToCart = async (req, res) => {
  try {
    const user = await userModel.findById(req.user._id); // Changed from req.body.userId
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: "User not found" 
      });
    }

    if (!user.cartData) {
      user.cartData = {};
    }

    const itemId = req.body.itemId;
    user.cartData[itemId] = (user.cartData[itemId] || 0) + 1;

    await user.save();

    res.json({ 
      success: true, 
      message: "Added to cart" 
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ 
      success: false, 
      message: "Error adding to cart" 
    });
  }
};


// remove items from user cart
const removeFromCart = async (req, res) => {
  try {
    const user = await userModel.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const { itemId, removeAll } = req.body;
    
    if (!user.cartData) {
      user.cartData = {};
    }

    if (removeAll || !user.cartData[itemId] || user.cartData[itemId] <= 1) {
      delete user.cartData[itemId]; // Complete removal
    } else {
      user.cartData[itemId] -= 1; // Decrement quantity
    }

    await user.save();

    res.json({ 
      success: true, 
      message: "Removed from cart",
      cartData: user.cartData 
    });
  } catch (error) {
    console.error("Error removing from cart:", error);
    res.status(500).json({ 
      success: false, 
      message: "Error removing from cart" 
    });
  }
};

// fetch user cart data
// const getCart = async (req, res) => {
//     try {
//       let userData = await userModel.findById(req.user._id);
//       if (!userData) {
//         return res.status(404).json({ success: false, message: "User not found" });
//       }
  
//       // Initialize cartData if it doesn't exist
//       if (!userData.cartData) {
//         userData.cartData = {};
//       }
  
//       res.json({ 
//         success: true, 
//         cartData: userData.cartData || {} 
//       });
//     } catch (error) {
//       console.log(error);
//       res.status(500).json({ success: false, message: "Error fetching cart" });
//     }
//   };



const getCart = async (req, res) => {
  try {
    const user = await userModel.findById(req.user._id); // Changed from req.body.userId to req.user._id
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: "User not found" 
      });
    }

    res.json({
      success: true,
      cartData: user.cartData || {}
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ 
      success: false, 
      message: "Error fetching cart" 
    });
  }
};

const clearCart = async (req, res) => {
  try {
    await userModel.findByIdAndUpdate(req.user._id, { cartData: {} });
    res.json({ success: true, message: "Cart cleared" });
  } catch (error) {
    console.error("Error clearing cart:", error);
    res.status(500).json({ success: false, message: "Error clearing cart" });
  }
};

export {addToCart, removeFromCart, getCart, clearCart}