const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: { type: String }, 
  email: { type: String, required: true, unique: true },
  password: { type: String }, 
  role: { type: String, enum: ["user", "admin", "government", "ngo"], default: "user" },
  location: { type: String, default: "Not Set" }, // User-selected address
  language: { type: String, default: "en" },
  isVerified: { type: Boolean, default: false }, // Email verification status
  otp: { type: String }, // OTP for email verification
}, { timestamps: true });

module.exports = mongoose.model("User", UserSchema);
