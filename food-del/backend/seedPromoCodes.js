import PromoModel from "./models/promoCodeModel.js";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const promoCodes = [
  {
    code: "FOOD",
    description: "₹50 off on orders above ₹250",
    discountAmount: 50,
    minOrderValue: 250
  },
  {
    code: "CSD",
    description: "₹80 off on orders above ₹500",
    discountAmount: 80,
    minOrderValue: 500
  },
  {
    code: "VINIT",
    description: "₹100 off on orders above ₹750",
    discountAmount: 100,
    minOrderValue: 750
  },
  {
    code: "BIGDEAL",
    description: "₹120 off on orders above ₹1000",
    discountAmount: 120,
    minOrderValue: 1000
  }
];

const seedPromoCodes = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    
    for (const promo of promoCodes) {
      await PromoModel.updateOne(
        { code: promo.code },
        { $set: promo },
        { upsert: true }
      );
      console.log(`Promo code ${promo.code} seeded`);
    }
    
    process.exit();
  } catch (error) {
    console.error("Error seeding promo codes:", error);
    process.exit(1);
  }
};

seedPromoCodes();