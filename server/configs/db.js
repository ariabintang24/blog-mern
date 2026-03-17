import mongoose from "mongoose";

const connectDB = async () => {
  try {
    console.log("Connecting to MongoDB...");

    await mongoose.connect(`${process.env.MONGODB_URI}/quickblog`);

    console.log("MongoDB Connected");
  } catch (err) {
    console.error("MongoDB ERROR:", err.message);
    process.exit(1); // ⬅️ penting, biar server tidak jalan setengah
  }
};

export default connectDB;
