import foodModel from "../models/foodModel.js";
import fs from 'fs'


// add food item
const addFood = async (req, res) => {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "Image is required" });
    }
  
    if (req.body.offerPrice && Number(req.body.offerPrice) >= Number(req.body.price)) {
      return res.status(400).json({
        success: false,
        message: "Offer price must be less than regular price"
      });
    }
  
    let image_filename = `${req.file.filename}`;
  
    try {
      const food = new foodModel({
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        offerPrice: req.body.offerPrice || undefined,
        category: req.body.category,
        image: image_filename
      });
  
      await food.save();
      res.json({ success: true, message: "Food Added" });
    } catch (error) {
      console.log(error);
      res.json({ success: false, message: "Error adding food item" });
    }
  }

// all food list
const listFood = async (req,res) => {
    try {
        const foods = await foodModel.find({});
        res.json({success:true,data:foods})
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Error"})        
    }
}


// remove food item
const removeFood = async (req,res) => {
    try {
        const food = await foodModel.findById(req.body.id);
        fs.unlink(`uploads/${food.image}`,()=>{})

        await foodModel.findByIdAndDelete(req.body.id);
        res.json({success:true,message:"Food Removed"})
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Error"})        
    }
}

const getFoodById = async (req, res) => {
  try {
    const food = await foodModel.findById(req.params.id);
    if (!food) {
      return res.status(404).json({ success: false, message: "Food not found" });
    }
    res.json({ success: true, data: food });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};


const updateFood = async (req, res) => {
  try {
    const { id, name, description, price, offerPrice, category } = req.body;
    
    if (offerPrice && Number(offerPrice) >= Number(price)) {
      return res.status(400).json({
        success: false,
        message: "Offer price must be less than regular price"
      });
    }

    const updateData = {
      name,
      description,
      price,
      offerPrice: offerPrice || undefined,
      category
    };

    if (req.file) {
      // Remove old image if new one is uploaded
      const oldFood = await foodModel.findById(id);
      if (oldFood.image) {
        fs.unlink(`uploads/${oldFood.image}`, () => {});
      }
      updateData.image = req.file.filename;
    }

    const updatedFood = await foodModel.findByIdAndUpdate(id, updateData, { new: true });

    res.json({ 
      success: true, 
      message: "Food Updated", 
      data: updatedFood 
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error updating food item" });
  }
};

export { addFood, listFood, removeFood, getFoodById, updateFood };