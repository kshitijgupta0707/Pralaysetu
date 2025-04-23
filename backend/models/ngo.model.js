// models/ngo.model.js
import mongoose from "mongoose";

const ngoSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  name: String,
  description: String,
  location: String,
  contact: String,
  totalReceived: {
    type: Number,
    default: 0
  }
});

export default mongoose.model("NGO", ngoSchema);
