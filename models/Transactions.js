const mongoose = require("mongoose");
const { Schema } = mongoose;

const TransactionSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    hotel: { type: Schema.Types.ObjectId, ref: "Hotel", required: true },
    room: [{ type: Schema.Types.ObjectId, ref: "Room", required: true }],
    dateStart: { type: Date, required: true },
    dateEnd: { type: Date, required: true },
    price: { type: Number, required: true },
    payment: { type: String, enum: ["Credit Card", "Cash"], required: true },
    status: {
      type: String,
      enum: ["Booked", "Checkin", "Checkout"],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Transaction", TransactionSchema);
