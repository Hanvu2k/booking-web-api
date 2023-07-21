require("dotenv").config();
const mongoose = require("mongoose");

async function connect() {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Connect to db success!");
  } catch (error) {
    console.log(`Failed to connect db!`);
    process.exit(1);
  }
}

module.exports = { connect };
