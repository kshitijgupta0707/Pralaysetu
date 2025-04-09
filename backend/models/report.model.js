import mongoose from "mongoose";

const reportSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  disasterType: { type: String, required: true }, // e.g. flood, fire, earthquake
  description: { type: String },
  imageUrl: { type: String },
  latitude: {
    type: Number
    , required: true
  }
  ,
  longitude: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ["pending", "verified", "rejected"],
    default: "pending",
  },
  createdAt: { type: Date, default: Date.now },
  verifiedBy: {
    type: String,
    default: "Admin"
  }
});

export const Report = mongoose.model("Report", reportSchema);
