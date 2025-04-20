import mongoose from "mongoose";

const promoSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  discountAmount: { type: Number, required: true },
  minOrderValue: { type: Number, required: true },
  validFrom: { type: Date, default: Date.now },
  validUntil: { type: Date },
  maxUses: { type: Number },
  usedCount: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true }
});

const PromoModel = mongoose.models.Promo || mongoose.model("Promo", promoSchema);
export default PromoModel;