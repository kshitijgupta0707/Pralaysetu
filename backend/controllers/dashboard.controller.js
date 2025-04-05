// controllers/dashboard.controller.js
import {User} from "../models/user.model.js";
import { Report } from "../models/report.model.js";

import HelpRequest from "../models/helpRequest.model.js";

export const getAdminDashboard = async (req, res) => {
  try {
    console.log("Admin dashboard accessed by:", req.user);
    const users = await User.countDocuments();
    const reports = await Report.countDocuments();
    const helpRequests = await HelpRequest.countDocuments();

    res.status(200).json({
      success: true,
      data: {
        totalUsers: users,
        totalReports: reports,
        totalHelpRequests: helpRequests,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Admin dashboard error" });
  }
};

export const getGovDashboard = async (req, res) => {
  try {
    const assigned = await HelpRequest.find({ assignedTo: req.user._id }).countDocuments();
    const pending = await HelpRequest.find({ status: "pending" }).countDocuments();

    res.status(200).json({
      success: true,
      data: {
        assignedRequests: assigned,
        pendingRequests: pending,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Government dashboard error" });
  }
};

export const getUserDashboard = async (req, res) => {
  try {
    const reports = await Report.find({ user: req.user._id });
    const helpRequests = await HelpRequest.find({ user: req.user._id });

    res.status(200).json({
      success: true,
      data: {
        reports,
        helpRequests,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "User dashboard error" });
  }
};
