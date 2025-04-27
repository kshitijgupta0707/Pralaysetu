// controllers/report.controller.js
import { Report } from "../models/report.model.js";
import { getReceiverSocketId, io } from "../config/socket.js";
import { uploadImageToCloudinary } from "../utils/imageUploader.js";
import { sendNotificationToAll } from "./notification.controller.js";
import { sendNotificationToPerson } from "./notification.controller.js";
import { sendNotificationToAdmins } from "./notification.controller.js";
export const createReport = async (req, res) => {
  try {
    const { disasterType, latitude, longitude, description } = req.body;
    if (!disasterType || !latitude || !longitude || !description) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }
    if (latitude == 0 || longitude == 0) {
      return res.status(500).json({
        success: false,
        message: "Please send us the location"
      })
    }
    let report;
    try {


      //  // Check daily report limit
      //  const startOfDay = new Date();
      //  startOfDay.setHours(0, 0, 0, 0);

      //  const endOfDay = new Date();
      //  endOfDay.setHours(23, 59, 59, 999);

      //  const todayReports = await Report.countDocuments({
      //    user: req.user._id,
      //    createdAt: { $gte: startOfDay, $lte: endOfDay }
      //  });

      //  if (todayReports >= 2) {
      //    return res.status(429).json({
      //      success: false,
      //      message: "You can only submit 2 reports per day"
      //    });
      //  }


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
      report = await Report.create({
        user: req.user._id,
        disasterType,
        latitude,
        longitude,
        description,
        imageUrl: mediaUrl,
      });

      // EMIT event to admin
      io.emit("newDisasterReport", report);

      // Send notification to all users - using the updated function with lock mechanism
      // const notificationResult = await sendNotificationToAll(
      //   `Report Submitted!`,
      //   `The report regarding "${report.disasterType}" has been submitted to admin.`,
      //   { reportId: report.id.toString(), type: "report_status" }
      // );
      const notificationResult = await sendNotificationToAdmins(
        `Report Submitted!`,
        `The report regarding ${report.disasterType} has been submitted at PralaySetu.`,
        { reportId: report.id.toString(), type: "report_status" }
      );


     

      console.log("Notification result:", notificationResult);
    } catch (notificationError) {
      // Log the error but don't fail the entire request
      console.error("Failed to send notifications:", notificationError);
    }
    
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
    const reports = await Report.find().populate("user");
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
    report.verifiedBy = req.user._id; // Admin who verified
    await report.save();



    try {
      console.log("report verify contooler is callled");
      console.log("Notifyig that oerson");
       const notifyPerson = await sendNotificationToPerson(
        `Report ${status}!`,
        `Your report regarding "${report.disasterType}" has been ${status}.`,
        {userId: report.user._id, reportId: reportId.toString(), type: "report_status" }
      );

      // Send notification to all users - using the updated function with lock mechanism
      if(status == "verified"){
        const notificationResult = await sendNotificationToAll(
          `Report ${status}!`,
          `The report regarding "${report.disasterType}" has been published.`,
          { reportId: reportId.toString(), type: "report_status" }
        );
  
        console.log("Notification result:", notificationResult);
      }
      else{
        console.log("not sending notificaiton as report is rejected")
      }
    } catch (notificationError) {
      // Log the error but don't fail the entire request
      console.error("Failed to send notifications:", notificationError);
    }



    // Send real-time notification to the perosn
    const receiverSocketId = getReceiverSocketId(report.user._id);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("reportStatusUpdate", {

        title: `Report ${status}`,
        message: `Your report has been ${status} by admin`,
        purpose: "report-status",
        report,

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
