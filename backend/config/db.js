import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("Connection successful");
  } catch (err) {
    console.error("Connection error:", err);
  }
};

export default connectDB;
