const mongoose = require("mongoose");
const { Schema } = mongoose;

const UserSchema = new Schema(
  {
    name: { type: String, required: true },
    password: { type: String, required: true },
    fullName: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    isAdimin: { type: Boolean },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", UserSchema);
