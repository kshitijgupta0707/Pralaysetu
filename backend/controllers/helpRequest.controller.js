// controllers/helpRequest.controller.js
import HelpRequest from "../models/helpRequest.model.js";
import cloudinary from "cloudinary";
import { io, getReceiverSocketId } from "../config/socket.js";

// Create Help Request
export const createHelpRequest = async (req, res) => {
    try {
      console.log(1)
      console.log("creating the help request")  
      console.log("Creating help request:", req.body);
      const { latitude , longitude, reason, urgency } = req.body;
      
      if (!latitude || !longitude || !urgency || !reason) {
        console.log("Enter all the details")
        return res.status(400).json({ success: false, message: "Location and reason are required." });
      }
      
      let photoUrl = "";
      
      // Optional image upload to Cloudinary
      if (req.files && req.files.photo) {
        console.log("i am not inside the if block")
        const result = await cloudinary.uploader.upload(req.files.photo.tempFilePath, {
          folder: "pralaysetu/helpRequests",
        });
        photoUrl = result.secure_url;
      }
      console.log("user id", req.user)
      const helpRequest = await HelpRequest.create({
        user: req.user._id,
        latitude,
        longitude,
        reason,
        urgency,
        photo: photoUrl,
      });
      console.log(2)
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
        const requests = await HelpRequest.find().populate("user", "firstName lastName email").populate("assignedTo","firstName lastName email");;
         console.log(requests)
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

      console.log(" Yaha tak aa gaya")
  
      request.status = status;
      await request.save();
  
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
// controllers/helpRequest.controller.js

export const getAllVerifiedHelpRequests = async (req, res) => {
    try {
      const verifiedRequests = await HelpRequest.find({ status: "verified" })
        .populate("user", "name email");
  
      res.status(200).json({
        success: true,
        requests: verifiedRequests,
      });
    } catch (error) {
      console.error("Error fetching verified help requests:", error);
      res.status(500).json({ success: false, message: "Server error" });
    }
  };
  

// Assign request to responder
export const assignHelpRequest = async (req, res) => {
    try {
       console.log("i am assigning the help request")
        const { id } = req.params;
        const { responderId } = req.body;
    console.log(id , responderId);
        let request = await HelpRequest.findById(id);
        if (!request) return res.status(404).json({ success: false, message: "Request not found" });

        request.status = "assigned";
        request.assignedTo = responderId;
        await request.save();

        // TODO: Emit real-time socket event here
        // After saving request
        // const responderSocketId = getReceiverSocketId(responderId);
        // if (responderSocketId) {
        //     io.to(responderSocketId).emit("helpAssigned", {
        //         message: "You have been assigned a new help request.",
        //         request,
        //     });
        // }
        const populatedRequest = await HelpRequest.findById(id)
        .populate("assignedTo")
        .populate("user");
        console.log(populatedRequest)
       console.log("request is assigned");
        res.status(200).json({ success: true, message: "Request assigned", request:populatedRequest});
    } catch (err) {
      console.log(err)
        res.status(500).json({ success: false, message: "Error assigning request" });
    }
};
// controllers/helpRequest.controller.js

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


export const getAssignedRequestsForResponder = async (req, res) => {
  try {


    const requests = await HelpRequest.find({ assignedTo: req.user._id }).populate("user", "name email").populate("assignedTo", "name email");

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

      console.log("Request accepted by user:", req.user._id);

  
      request.status = "accepted";
      await request.save();
      console.log("Request accepted:", request);
      
  
      res.status(200).json({ success: true, message: "Request accepted", request });
    } catch (err) {
        console.error("Error accepting request:", err);
      res.status(500).json({ success: false, message: "Error accepting request" });
    }
  };

export const rejectHelpRequest = async (req, res) => {
try {
    const { id } = req.params;

    const request = await HelpRequest.findById(id);

    if (!request || request.status !== "assigned") {
    return res.status(400).json({ success: false, message: "Invalid request" });
    }

    if (request.assignedTo.toString() !== req.user._id.toString()) {
    return res.status(403).json({ success: false, message: "Not authorized" });
    }

    request.status = "verified"; // Back to verified state to reassign
    request.assignedTo = null;
    await request.save();

    res.status(200).json({ success: true, message: "Request rejected", request });
} catch (err) {
    res.status(500).json({ success: false, message: "Error rejecting request" });
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
  
  
  
