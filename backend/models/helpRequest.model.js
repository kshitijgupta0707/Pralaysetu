// models/helpRequest.model.js
import mongoose from "mongoose";

const helpRequestSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    latitude: {
      type: Number,
      required: true
    },
    longitude: {
      type: Number,
      required: true
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
      type: String, 
    },
    //for responder there are only two option completed or accepted
     // rest are for admin after assigned by admin to assignedTo
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

