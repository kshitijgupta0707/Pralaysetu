// models/helpRequest.model.js
import mongoose from "mongoose";

const helpRequestSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    location: {
      type: {
        lat: Number,
        lng: Number,
      },
      required: true,
    },
    reason: {
      type: String,
      required: true,
    },
    urgency: {
      type: String,
      enum: ["low", "medium", "high", "critical"],
      default: "medium",
    },
    photo: {
      type: String, // Cloudinary image URL
    },
    status: {
      type: String,
      enum: ["pending", "verified" , "rejected", "assigned", "completed", "accepted"],
      default: "pending",
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export default mongoose.model("HelpRequest", helpRequestSchema);
