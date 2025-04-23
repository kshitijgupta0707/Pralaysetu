import mongoose from "mongoose";

const fundraiserSchema = new mongoose.Schema({
  ngoId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "NGO",
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: String,
  goalAmount: {
    type: Number,
    required: true,
  },
  raisedAmount: {
    type: Number,
    default: 0,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  deadline: {
    type: Date,
    required: true,
  },  
  isExpired: {
    type: Boolean,
    default: false,
  },
});

export default mongoose.model("Fundraiser", fundraiserSchema);
