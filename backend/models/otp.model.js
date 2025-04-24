import mongoose from "mongoose";
const otpSchema = mongoose.Schema({
  email: { type: String, required: true },
  otp: { type: String, required: true },
  createdAt: {
    type: Date,
    default: Date.now,
    expires:  5 * 60, // OTP expires in 5 minutes
  },
});

const OTP = mongoose.model("OTP", otpSchema);
export { OTP };