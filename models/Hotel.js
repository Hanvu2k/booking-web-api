const mongoose = require("mongoose");
const { Schema } = mongoose;

const HotelSchema = new Schema(
  {
    name: { type: String, required: true },
    type: { type: String, required: true },
    city: { type: String, required: true },
    address: { type: String, required: true },
    distance: { type: Number, required: true },
    photos: { type: String, required: true },
    desc: { type: String, required: true },
    rating: { type: Number, required: true },
    featured: { type: String, required: true },
    rooms: { type: Schema.Types.ObjectId, ref: "Room", required: true },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Hotel", HotelSchema);
