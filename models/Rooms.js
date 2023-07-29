const mongoose = require("mongoose");
const { Schema } = mongoose;

const RoomSchema = new Schema(
  {
    title: { type: String, required: true },
    price: { type: Number, required: true },
    maxPeople: { type: Number, required: true },
    desc: { type: String, required: true },
    roomNumbers: [{ type: Number, required: true }],
    bookings: [{ type: Object }],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Room", RoomSchema);
