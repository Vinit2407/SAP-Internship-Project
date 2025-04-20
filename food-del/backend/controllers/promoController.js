import PromoModel from "../models/promoCodeModel.js";

export const validatePromoCode = async (req, res) => {
  const { code, subtotal } = req.body;
  
  try {
    const promo = await PromoModel.findOne({ code, isActive: true });
    
    if (!promo) {
      return res.status(404).json({ success: false, message: "Invalid promo code" });
    }
    
    if (subtotal < promo.minOrderValue) {
      return res.status(400).json({ 
        success: false, 
        message: `Minimum order value of ₹${promo.minOrderValue} required` 
      });
    }
    
    if (promo.validUntil && new Date() > promo.validUntil) {
      return res.status(400).json({ success: false, message: "Promo code expired" });
    }
    
    if (promo.maxUses && promo.usedCount >= promo.maxUses) {
      return res.status(400).json({ success: false, message: "Promo code limit reached" });
    }
    
    res.json({
      success: true,
      discountAmount: promo.discountAmount,
      code: promo.code,
      description: promo.description,
      minOrderValue: promo.minOrderValue
    });
    
  } catch (error) {
    console.error("Promo code validation error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};