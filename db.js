const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
  if (!process.env.DATABASE_URL) {
    console.error("❌ CRITICAL ERROR: DATABASE_URL is not defined in the environment variables! Please set it in your Render dashboard.");
    process.exit(1);
  }
  try {
    const conn = await mongoose.connect(process.env.DATABASE_URL);
    console.log(`MongoDB Atlas Connected ✅: ${conn.connection.host}`);
  } catch (err) {
    console.error("DB Connection Error ❌", err);
    process.exit(1);
  }
};

module.exports = connectDB;
