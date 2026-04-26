const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.DATABASE_URL);
    console.log(`MongoDB Atlas Connected ✅: ${conn.connection.host}`);
  } catch (err) {
    console.error("DB Connection Error ❌", err);
    process.exit(1);
  }
};

module.exports = connectDB;
