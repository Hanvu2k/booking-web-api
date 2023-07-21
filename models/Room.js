const mongoose = require("mongoose");
const { Schema } = mongoose;

const RoomSchema = new Schema(
  {
    title: { type: String, required: true },
    price: { type: Number, required: true },
    maxPeople: { type: Number, required: true },
    desc: { type: String, required: true },
    roomNumbers: { type: Number, required: true },
    hotel_id: { type: Schema.Types.ObjectId, ref: "Hotel", required: true },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Room", RoomSchema);
