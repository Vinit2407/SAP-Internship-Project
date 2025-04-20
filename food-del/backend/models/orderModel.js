import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  userEmail: { type: String, required: true },
  items: { type: Array, required: true },
  amount: { type: Number, required: true },
  subtotal: { type: Number, required: true },
  deliveryFee: { type: Number, required: true },
  tax: { type: Number, required: true },
  address: {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    phone: { type: String, required: true },
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipcode: { type: String, required: true },
    country: { type: String, required: true }
  },
  status: {
    type: String,
    enum: ["Await Confirmation", "Placed", "Food Processing", "Out for Delivery", "Delivered"],
    default: "Await Confirmation"
  },
  date: { type: Date, default: Date.now },
  payment: { type: Boolean, default: false },
  paymentMode: { type: String, required: true, enum: ["online", "cod"] },
  // New promo code fields
  promoCode: {
    code: String,
    discountAmount: Number,
    description: String
  },
  discountedAmount: Number
});

const orderModel = mongoose.models.order || mongoose.model("order", orderSchema);
export default orderModel;