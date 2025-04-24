import express from "express";
import {
    createHelpRequest, verifyOrRejectHelpRequest, assignHelpRequest, getAllRequests
    , getAllRejectedHelpRequests,
    getAssignedRequestsForResponder
} from "../controllers/helpRequest.controller.js";
import { authenticate, authorizeRoles } from "../middleware/auth.middleware.js";
import { acceptHelpRequest, completeHelpRequest } from "../controllers/helpRequest.controller.js";

const router = express.Router();

// Normal users create help requests
router.post("/request", authenticate, authorizeRoles('None'), createHelpRequest);

// Admin-only routes
router.get("/rejected", authenticate, authorizeRoles("Admin"), getAllRejectedHelpRequests);
router.get("/pending", authenticate, authorizeRoles("Admin"), getAllRequests);
router.put("/verify/:id", authenticate, authorizeRoles("Admin"), verifyOrRejectHelpRequest);
router.put("/assign/:id", authenticate, authorizeRoles("Admin"), assignHelpRequest);

// Responder-only routes
router.get("/assigned", authenticate, authorizeRoles("None"), getAssignedRequestsForResponder);
router.put("/accept/:id", authenticate, authorizeRoles("None"), acceptHelpRequest);
router.put("/complete/:id", authenticate, authorizeRoles("None"), completeHelpRequest);

export default router;
