import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const DB_URI = process.env.URI || "";
    if (!DB_URI) throw new Error("MongoDB URI is missing in .env");

    await mongoose.connect(DB_URI);
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    process.exit(1);
  }
};