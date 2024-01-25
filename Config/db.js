import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.DB_URL);
    console.log("conected");
  } catch (error) {
    console.log("error in connected");
  }
};

export default connectDB;