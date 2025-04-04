

// routes/report.routes.js
import express from "express";
import { createReport, getAllReports , verifyReport } from "../controllers/report.controller.js";
import { isAuthenticated , authorizeRoles } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/createReport", isAuthenticated, createReport); // User submits report
router.get("/getAllReports", isAuthenticated, getAllReports); // All reports (admin will filter verified later)
router.put("/verifyReport", isAuthenticated, authorizeRoles("admin"), verifyReport); // ✅ Only admins can verify

export default router;
