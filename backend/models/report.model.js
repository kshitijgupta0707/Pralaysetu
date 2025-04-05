import mongoose from "mongoose";

const reportSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  disasterType: { type: String, required: true }, // e.g. flood, fire, earthquake
  description: { type: String },
  imageUrl: { type: String },
  location: {
    latitude: { type: Number },
    longitude: { type: Number },
  },
  status: {
    type: String,
    enum: ["pending", "verified", "rejected"],
    default: "pending",
  },
  createdAt: { type: Date, default: Date.now },
});

export const Report = mongoose.model("Report", reportSchema);
