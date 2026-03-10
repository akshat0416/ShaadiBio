const mongoose = require("mongoose");

async function connectDb(mongoUri) {
  try {
    mongoose.set("strictQuery", true);
    await mongoose.connect(mongoUri || process.env.MONGO_URI);

    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    process.exit(1);
  }
}

module.exports = { connectDb };