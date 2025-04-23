import mongoose from "mongoose";

const ngoSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: String,
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phone: String,
  address: String,
  registeredBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Who created this NGO
  },
  totalFundsReceived: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("NGO", ngoSchema);
