const mongoose = require("mongoose");
const { Schema } = mongoose;

const TransactionSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    hotel: { type: Schema.Types.ObjectId, ref: "Hotel", required: true },
    room: { type: Schema.Types.ObjectId, ref: "Room", required: true },
    dateStart: { type: String, required: true },
    dateEnd: { type: String, required: true },
    price: { type: Schema.Types.ObjectId, ref: "Room", required: true },
    payment: { type: String, required: true },
    status: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Transaction", TransactionSchema);
