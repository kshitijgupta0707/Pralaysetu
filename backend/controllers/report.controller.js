// controllers/report.controller.js
import { Report } from "../models/report.model.js";
import { getReceiverSocketId, io } from "../config/socket.js";
import { uploadImageToCloudinary } from "../utils/imageUploader.js";

export const createReport = async (req, res) => {
  try {
    console.log(req.body)
    const { disasterType, latitude ,longitude, description } = req.body;
    if(!disasterType || !latitude || !longitude || !description ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }
      let media = req.files?.media;
      
  


    let mediaUrl = null;
    if (media) {
      const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
      if (!allowedTypes.includes(media.mimetype)) {
        return res.status(400).json({ message: "Only JPG and PNG files are allowed" });
      }
      // only 200kb photo rquired
      if (media.size > 200 * 1024) {
        return res.status(400).json({ message: "Media size must be less than 200Kb" });
      }

      const uploadResponse = await uploadImageToCloudinary(media, "PralaySetu");
      mediaUrl = uploadResponse.secure_url;
    }
    const report = await Report.create({
      user: req.user.id,
      disasterType,
      latitude ,
      longitude,
      description,
      imageUrl: mediaUrl,
    });

    res.status(201).json({
      success: true,
      message: "Disaster report submitted",
      report,
    });
  } catch (error) {
    console.error("Error creating report:", error);
    res.status(500).json({ success: false, message: "Failed to submit report" });
  }
};
export const getAllReports = async (req, res) => {
  try {
    const reports = await Report.find().populate("user", "name email role");
    res.status(200).json({ success: true, reports });
  } catch (error) {
    res.status(500).json({ success: false, message: "Unable to fetch reports" });
  }
};


// Get all verified reports for public view
export const getVerifiedReports = async (req, res) => {
  try {
    const reports = await Report.find({ status: "verified" }).populate("user", "name email");
    res.status(200).json({ success: true, reports });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch verified reports" });
  }
};

export const verifyReport = async (req, res) => {
  try {
    const { reportId, status } = req.body;

    if (!["verified", "rejected"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status. Must be either 'verified' or 'rejected'.",
      });
    }

    const report = await Report.findById(reportId).populate("user");
    if (!report) {
      return res.status(404).json({
        success: false,
        message: "Report not found",
      });
    }

    report.status = status;
    report.verifiedBy = req.user.id; // Admin who verified
    await report.save();

    // Send real-time notification
    const receiverSocketId = getReceiverSocketId(report.user._id.toString());
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("reportStatusUpdate", {
        reportId: report._id,
        status: report.status,
        message: `Your report has been ${status}`,
      });
    }

    res.status(200).json({
      success: true,
      message: `Report marked as ${status}`,
      report,
    });
  } catch (error) {
    console.error("Verify Report Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
  

