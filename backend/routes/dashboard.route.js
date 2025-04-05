// routes/dashboard.routes.js
import express from "express";
import {
  getAdminDashboard,
  getGovDashboard,
  getUserDashboard,
} from "../controllers/dashboard.controller.js";
import { isAuthenticated ,authorizeRoles , authenticate } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/admin", authenticate, authorizeRoles("Admin"), getAdminDashboard);
router.get("/government", authenticate, authorizeRoles("Government"), getGovDashboard);
router.get("/user", authenticate, authorizeRoles("User"), getUserDashboard);

export default router;
