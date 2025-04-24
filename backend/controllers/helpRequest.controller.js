// controllers/helpRequest.controller.js
import HelpRequest from "../models/helpRequest.model.js";
import cloudinary from "cloudinary";
import { io, getReceiverSocketId } from "../config/socket.js";
import { sendNotificationToPerson } from "./notification.controller.js";

// Create Help Request
export const createHelpRequest = async (req, res) => {
  try {

    const { latitude, longitude, reason, urgency } = req.body;

    if (!latitude || !longitude || !urgency || !reason) {
      console.log("Enter all the details")
      return res.status(400).json({ success: false, message: "Location and reason are required." });
    }

    // Check daily report limit
    //  const startOfDay = new Date();
    //  startOfDay.setHours(0, 0, 0, 0);

    //  const endOfDay = new Date();
    //  endOfDay.setHours(23, 59, 59, 999);

    //  const todayRequests = await HelpRequest.countDocuments({
    //    user: req.user._id,
    //    createdAt: { $gte: startOfDay, $lte: endOfDay }
    //  });

    //  if (todayRequests > 0) {

    //    return res.status(429).json({
    //      success: false,
    //      message: "You can only ask for help 1 time in a day"
    //    });
    //  }



    let photoUrl = "";

    // Optional image upload to Cloudinary
    if (req.files && req.files.photo) {
      const result = await cloudinary.uploader.upload(req.files.photo.tempFilePath, {
        folder: "pralaysetu/helpRequests",
      });
      photoUrl = result.secure_url;
    }
    const helpRequest = await HelpRequest.create({
      user: req.user._id,
      latitude,
      longitude,
      reason,
      urgency,
      photo: photoUrl,
    })
    const newHelpRequest = await HelpRequest.findById(helpRequest._id).populate('user', "firstName lastName")

    // EMIT socket event to admin
    io.emit("newHelpRequest", newHelpRequest); // You can send full object or just _id, up to you
    res.status(201).json({
      success: true,
      message: "Help request created successfully.",
      helpRequest,
    });

  } catch (error) {
    console.error("Error creating help request:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get all pending help requests
export const getAllRequests = async (req, res) => {
  try {
    const requests = await HelpRequest.find().populate("user", "firstName lastName email").populate("assignedTo", "firstName lastName email");;
    res.status(200).json({ success: true, requests });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error fetching requests" });
  }
};

// Verify a help request
export const verifyOrRejectHelpRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // expected: "verified" or "rejected"

    if (!["verified", "rejected"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status. Must be 'verified' or 'rejected'.",
      });
    }

    const request = await HelpRequest.findById(id);
    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Help request not found.",
      });
    }

    request.status = status;
    await request.save();

    //  Real-time notify the user
    const userSocketId = getReceiverSocketId(request.user._id);
    if (userSocketId) {
      io.to(userSocketId).emit("helpRequestStatusChanged", {
        title: `Help Request ${status}`,
        message: `Your request has been ${status} by admin.`,
        purpose: "request-status",
        request,
      });
    }



    // try {
    //   // Send notification to all users - using the updated function with lock mechanism
    //   const notificationResult = await sendNotificationToPerson(
    //     `Request ${status}!`,
    //     `The request has been ${status} by the admin.`,
    //     { requestId: request._id, type: "request_status" , userId: request.user}
    //   );

    //   console.log("Notification result:", notificationResult);
    // } catch (notificationError) {
    //   // Log the error but don't fail the entire request
    //   console.error("Failed to send notifications:", notificationError);
    // }

    res.status(200).json({
      success: true,
      message: `Help request ${status} successfully.`,
      request,
    });
  } catch (error) {
    console.error("Error verifying/rejecting request:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Assign request to responder
export const assignHelpRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { responderId } = req.body;
    let request = await HelpRequest.findById(id);
    if (!request) return res.status(404).json({ success: false, message: "Request not found" });

    request.status = "assigned";
    request.assignedTo = responderId;
    await request.save();


    const populatedRequest = await HelpRequest.findById(id)
      .populate("assignedTo")
      .populate("user");


    //  Notify responder
    const responderSocketId = getReceiverSocketId(responderId);
    if (responderSocketId) {
      io.to(responderSocketId).emit("assignedHelpRequest", {
        title: "New Request Assignment",
        message: `You have been assigned a help request by admin.`,
        purpose: "assignment",
        request: populatedRequest,
      });
    }

    //  Notify user their request was assigned
    const userSocketId = getReceiverSocketId(populatedRequest.user._id);
    if (userSocketId) {
      io.to(userSocketId).emit("helpRequestStatusChanged", {
        title: "Request Assigned",
        message: `Your request has been assigned to a responder.`,
        purpose: "request-status",
        request: populatedRequest,
      });
    }

    res.status(200).json({ success: true, message: "Request assigned", request: populatedRequest });
  } catch (err) {
    console.log(err)
    res.status(500).json({ success: false, message: "Error assigning request" });
  }
};

export const getAllRejectedHelpRequests = async (req, res) => {
  try {
    const rejectedRequests = await HelpRequest.find({ status: "rejected" }).populate("user", "name email");
    res.status(200).json({
      success: true,
      requests: rejectedRequests,
    });
  } catch (error) {
    console.error("Error fetching rejected help requests:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Accept help request (responder)
//below are the function for the respnoder

export const getAssignedRequestsForResponder = async (req, res) => {
  try {
    const requests = await HelpRequest.find({ assignedTo: req.user._id }).populate("user", " firstName lastName email").populate("assignedTo", "firstName lastName email");
    res.status(200).json({
      success: true,
      requests,
    });
  } catch (error) {
    console.error("Error fetching assigned requests:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const acceptHelpRequest = async (req, res) => {
  try {
    const { id } = req.params; // Help request ID
    const request = await HelpRequest.findById(id);

    if (!request || request.status !== "assigned") {
      return res.status(400).json({ success: false, message: "Invalid or unassigned request" });
    }

    if (request.assignedTo.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Not authorized to accept this request" });
    }


    // const responderSocketId = getReceiverSocketId(responderId);
    // if (responderSocketId) {
      //   io.to(responderSocketId).emit("assignedHelpRequest", {
        //     title: "New Request Assignment",
        //     message: `You have been assigned a help request by admin.`,
        //     purpose: "assignment",
        //     request: populatedRequest,
        //   });
        // }
        
        // //  Notify user their request was assigned
        //  Notify user
    const userSocketId = getReceiverSocketId(request.user._id);
    console.log("Notifiyig " , userSocketId)
    if (userSocketId) {
      io.to(userSocketId).emit("helpRequestStatusChanged", {
        title: "On the way to help you",
        message: `Your request has been accepted by responder.`,
        purpose: "request-status",
        request: request,
      });
    }
    request.status = "accepted";
    await request.save();
    res.status(200).json({ success: true, message: "Request accepted", request });
  } catch (err) {
    console.error("Error accepting request:", err);
    res.status(500).json({ success: false, message: "Error accepting request" });
  }
};

export const completeHelpRequest = async (req, res) => {
  try {
    const { id } = req.params;

    const request = await HelpRequest.findById(id);

    if (!request || request.status !== "accepted") {
      return res.status(400).json({ success: false, message: "Invalid request" });
    }

    if (request.assignedTo.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    request.status = "completed";
    await request.save();

    res.status(200).json({ success: true, message: "Request marked as completed", request });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error marking as completed" });
  }
};



