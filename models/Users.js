const mongoose = require("mongoose");
const { Schema } = mongoose;

const UserSchema = new Schema(
  {
    name: { type: String, required: true },
    password: { type: String, required: true },
    fullName: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    isAdmin: { type: Boolean },
  },
  {
    timestamps: true,
  }
);

UserSchema.methods.toAuthJSON = function () {
  return {
    _id: this._id,
    name: this.name,
    email: this.email,
    fullName: this.fullName,
    phoneNumber: this.phoneNumber,
    token: `${this.email} ${this.password}`,
  };
};

module.exports = mongoose.model("User", UserSchema);
