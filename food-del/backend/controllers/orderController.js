import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from "stripe";
import PromoModel from "../models/promoCodeModel.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const placeOrder = async (req, res) => {
  const frontend_url = "http://localhost:5174";
  
  try {
    const user = await userModel.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const { items, paymentMode, promoCode } = req.body;
    
    // Calculate subtotal
    const subtotal = items.reduce((sum, item) => {
      const price = item.offerPrice || item.price;
      return sum + (price * item.quantity);
    }, 0);

    // Validate and apply promo code
    let discountAmount = 0;
    let promoDetails = null;
    
    if (promoCode) {
      const promo = await PromoModel.findOne({ code: promoCode, isActive: true });
      if (promo && subtotal >= promo.minOrderValue) {
        discountAmount = promo.discountAmount;
        promoDetails = {
          code: promo.code,
          discountAmount: promo.discountAmount,
          description: promo.description
        };
      }
    }

    const deliveryFee = subtotal > 250 ? 0 : 40;
    const tax = (subtotal - discountAmount) * 0.05;
    const totalAmount = (subtotal - discountAmount) + deliveryFee + tax;

    const userProfile = user.profile || {};
    const userAddress = userProfile.address || {};

    const orderData = {
      userId: user._id,
      userEmail: user.email,
      items,
      amount: totalAmount,
      subtotal,
      deliveryFee,
      tax,
      discountedAmount: subtotal - discountAmount,
      address: {
        firstName: user.profile?.firstName || "",
        lastName: user.profile?.lastName || "",
        phone: user.profile?.phone || "",
        street: user.profile?.address?.street || "",
        city: user.profile?.address?.city || "",
        state: user.profile?.address?.state || "",
        zipcode: user.profile?.address?.zipcode || "",
        country: user.profile?.address?.country || ""
      },
      paymentMode,
      status: "Await Confirmation",
      payment: paymentMode === "online",
      ...(promoDetails && { promoCode: promoDetails })
    };

    const newOrder = new orderModel(orderData);
    await newOrder.save();

    if (paymentMode === "cod") {
      await userModel.findByIdAndUpdate(user._id, { cartData: {} });
      return res.json({
        success: true,
        cod: true,
        orderId: newOrder._id,
        message: "Order placed successfully with COD"
      });
    }

    // Stripe payment logic
    const line_items = items.map((item) => ({
      price_data: {
        currency: "inr",
        product_data: { name: item.name },
        unit_amount: Math.round((item.offerPrice || item.price) * 100),
      },
      quantity: item.quantity,
    }));

    // Add discount as negative line item if applicable
    if (discountAmount > 0) {
      line_items.push({
        price_data: {
          currency: "inr",
          product_data: { name: `Promo Code (${promoDetails.code})` },
          unit_amount: -Math.round(discountAmount * 100),
        },
        quantity: 1,
      });
    }

    // Add tax and delivery if needed
    line_items.push({
      price_data: {
        currency: "inr",
        product_data: { name: "GST (5%)" },
        unit_amount: Math.round(tax * 100),
      },
      quantity: 1,
    });

    if (subtotal <= 250) {
      line_items.push({
        price_data: {
          currency: "inr",
          product_data: { name: "Delivery Charges" },
          unit_amount: 40 * 100,
        },
        quantity: 1,
      });
    }

    const session = await stripe.checkout.sessions.create({
      line_items,
      mode: "payment",
      success_url: `${frontend_url}/verify?success=true&orderId=${newOrder._id}&userId=${req.user._id}`,
      cancel_url: `${frontend_url}/verify?success=false&orderId=${newOrder._id}`,
    });

    res.json({ success: true, session_url: session.url });

  } catch (error) {
    console.error('Order placement error:', error);
    res.status(500).json({ success: false, message: "Error placing order" });
  }
};

const verifyOrder = async (req, res) => {
  const { orderId, success } = req.body;
  
  try {
    const order = await orderModel.findById(orderId);
    if (!order) return res.json({ success: false, message: "Order not found" });

    if (success === "true") {
      if (order.paymentMode === "online") {
        await orderModel.findByIdAndUpdate(orderId, { payment: true });
      }
      // Clear cart for the user
      await userModel.findByIdAndUpdate(order.userId, { cartData: {} });

      return res.json({ success: true, message: "Payment Successful", order: order, cartCleared: true });
    } else {
      await orderModel.findByIdAndDelete(orderId);
      return res.json({ success: false, message: "Payment Failed, Order Cancelled" });
    }
  } catch (error) {
    console.log('Order verification error:', error);
    res.json({ success: false, message: "Error verifying order" });
  }
};

const userOrders = async (req, res) => {
  try {
    // Use req.user._id (from middleware) OR fallback to req.query.userId (old way)
    const userId = req.user?._id || req.query.userId;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required"
      });
    }

    const orders = await orderModel.find({ userId }).sort({ date: -1 });

    if (!orders || orders.length === 0) {
      return res.json({
        success: true,
        data: [],
        message: "No orders found for this user"
      });
    }

    res.json({ success: true, data: orders });
  } catch (error) {
    console.error("Error in userOrders:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching orders",
      error: error.message
    });
  }
};

const listOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({});
    res.json({success: true, data: orders})
  } catch (error) {
    console.log(error);
    res.json({success: false, message: "Error"})
  }
}

const updateStatus = async (req, res) => {
  try {
    const order = await orderModel.findById(req.body.orderId);
    if (!order) return res.json({ success: false, message: "Order not found" });

    order.status = req.body.status;

    if (order.paymentMode === "cod" && req.body.status.toLowerCase() === "delivered") {
      order.payment = true;
    }

    await order.save();
    res.json({ success: true, message: "Status Updated" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error updating status" });
  }
  
};


export { placeOrder, verifyOrder, userOrders, listOrders, updateStatus }