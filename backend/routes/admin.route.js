import express from "express";
import { getPendingUsers, approveUser, rejectUser ,getAllResponders , getAllVerifiedGovernmentAndNgo } from "../controllers/admin.controller.js";
import { authenticate , authorizeRoles} from "../middleware/auth.middleware.js"

const router = express.Router();

router.get("/pending-users", authenticate ,authorizeRoles('Admin'), getPendingUsers);
router.put("/approve-user/:id", authenticate , authorizeRoles('Admin'), approveUser);
router.put("/reject-user/:id", authenticate , authorizeRoles('Admin'), rejectUser);
router.get("/getAllResponders", authenticate ,authorizeRoles("Admin"), getAllResponders)
router.get("/getAllVerifiedGovernmentAndNgo", authenticate ,authorizeRoles("Admin"), getAllVerifiedGovernmentAndNgo)

export default router;
