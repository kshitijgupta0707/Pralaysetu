// routes/help.routes.js
import express from "express";
import { createHelpRequest , verifyOrRejectHelpRequest , getAllVerifiedHelpRequests, assignHelpRequest , getAllPendingRequests
    ,getAllRejectedHelpRequests ,
    getAssignedRequestsForResponder
} from "../controllers/helpRequest.controller.js";
import { authenticate , authorizeRoles } from "../middleware/auth.middleware.js";
import { acceptHelpRequest , rejectHelpRequest , completeHelpRequest } from "../controllers/helpRequest.controller.js";



const router = express.Router();

// Normal users create help requests
router.post("/request", authenticate, authorizeRoles('User') ,createHelpRequest);

router.get("/rejected", authenticate, authorizeRoles("Admin"), getAllRejectedHelpRequests);

// Admin-only routes
// Admins can view all pending requests, verify them, and assign them to responders

router.get("/pending", authenticate, authorizeRoles("Admin"), getAllPendingRequests);
router.put("/verify/:id", authenticate, authorizeRoles("Admin"), verifyOrRejectHelpRequest);

router.get("/verified", authenticate, getAllVerifiedHelpRequests);
router.put("/assign/:id", authenticate, authorizeRoles("Admin"), assignHelpRequest);

//get all assigned requests for a specific responder
router.get("/assigned", authenticate, authorizeRoles("Government", "Responder"), getAssignedRequestsForResponder);


router.put("/accept/:id", authenticate, authorizeRoles("Government", "Responder"), acceptHelpRequest);
router.put("/reject/:id", authenticate, authorizeRoles("Government", "Responder"), rejectHelpRequest);
router.put("/complete/:id", authenticate, authorizeRoles("Government", "Responder"), completeHelpRequest);


export default router;
