// routes/help.routes.js
import express from "express";
import { createHelpRequest , verifyOrRejectHelpRequest , getAllVerifiedHelpRequests, assignHelpRequest , getAllRequests
    ,getAllRejectedHelpRequests ,
    getAssignedRequestsForResponder
} from "../controllers/helpRequest.controller.js";
import { authenticate , authorizeRoles } from "../middleware/auth.middleware.js";
import { acceptHelpRequest   , completeHelpRequest } from "../controllers/helpRequest.controller.js";



const router = express.Router();

// Normal users create help requests
router.post("/request", authenticate, authorizeRoles('None') ,createHelpRequest);

router.get("/rejected", authenticate, authorizeRoles("Admin"), getAllRejectedHelpRequests);

// Admin-only routes
// Admins can view all pending requests, verify them, and assign them to responders

router.get("/pending", authenticate, authorizeRoles("Admin"), getAllRequests);
router.put("/verify/:id", authenticate, authorizeRoles("Admin"), verifyOrRejectHelpRequest);

router.get("/verified", authenticate, authorizeRoles("Admin"), getAllVerifiedHelpRequests);



router.put("/assign/:id", authenticate, authorizeRoles("Admin"), assignHelpRequest);








//get all assigned requests for a specific responder
router.get("/assigned", authenticate, authorizeRoles("None" ,"Government", "Responder"), getAssignedRequestsForResponder);


router.put("/accept/:id", authenticate, authorizeRoles("None","Government", "Responder"), acceptHelpRequest);
router.put("/complete/:id", authenticate, authorizeRoles("None","Government", "Responder"), completeHelpRequest);


export default router;
