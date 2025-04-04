// models/report.model.js
import mongoose from "mongoose";

const reportSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    disasterType: {
      type: String,
      enum: ["earthquake", "flood", "cyclone", "landslide", "tsunami", "fire", "other"],
      required: true,
    },
    location: {
      latitude: { type: Number, required: true },
      longitude: { type: Number, required: true },
      address: { type: String },
    },
    description: {
      type: String,
      required: true,
    },
    media: {
      type: [String], // Store image/video URLs (S3 or local for now)
      default: [],
    },
    status: {
      type: String,
      enum: ["pending", "verified", "rejected"],
      default: "pending",
    },
    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export const Report = mongoose.model("Report", reportSchema);
