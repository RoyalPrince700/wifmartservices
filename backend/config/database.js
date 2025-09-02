// filepath: backend/config/database.js
import mongoose from "mongoose";

let isConnected = 0; // 0 = disconnected, 1 = connected

const connectDB = async () => {
  if (isConnected) {
    return mongoose.connection;
  }

  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    throw new Error("MONGODB_URI is not set");
  }

  try {
    const conn = await mongoose.connect(mongoUri);
    isConnected = 1;
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error("Database connection error:", error.message);
    throw error;
  }
};

export default connectDB;
