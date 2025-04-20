import mongoose from "mongoose";

export const connectDB = async () => {
    await mongoose.connect('mongodb+srv://patelvinit724:ixIiso2sTgDo1Mu5@cluster0.2ayjurh.mongodb.net/food-del').then(()=>console.log("DB Connected"));
}


