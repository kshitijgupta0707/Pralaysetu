import { User } from "../models/user.model.js";
import { mailSender } from "../utils/mailSender.js";
import { registrationDeniedTemplate, registrationSuccessTemplate } from "../templates/register.template.js";
export const getPendingUsers = async (req, res) => {
  try {
    const users = await User.find({ registrationStatus: "pending" }).populate("ngoId");
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: "Error fetching users", error: err.message });
  }
};

export const approveUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.registrationStatus = "approved";
    user.isVerified = true;

    mailSender(user.email, "Registration Request", registrationSuccessTemplate(user.email))
    await user.save();

    res.status(200).json({ message: "User approved successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error approving user", error: err.message });
  }
};

export const rejectUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) return res.status(404).json({ message: "User not found" });

    user.registrationStatus = "rejected";
    user.isVerified = false;
    await user.save();

    mailSender(user.email, "Registration Request", registrationDeniedTemplate(user.email))

    res.status(200).json({ message: "User rejected successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error rejecting user", error: err.message });
  }
};
export const getAllResponders = async (req, res) => {
  try {
    const responders = await User.find({
      workAsResponder: true,
    }).select("-password"); // exclude password
    res.status(200).json(responders);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch responders", error: err.message });
  }
};
export const getAllVerifiedGovernmentAndNgo = async (req, res) => {
  try {
    const responders = await User.find({
      registerAs: { $in: ["Government", "NGO"] },
      registrationStatus: "approved",
      isVerified: true,
    }).populate("ngoId").select("-password"); // exclude password

    res.status(200).json(responders);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch responders", error: err.message });
  }
};
