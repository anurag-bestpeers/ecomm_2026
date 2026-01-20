import mongoose from "mongoose";

export const DB=async()=>{
  try {
     await mongoose.connect(process.env.MONGO_URI);
    console.log("Mongoose connection success");
  } catch (error) {
    console.log("Mongoose connection error",error.message);
    process.exit(1);
  }
}