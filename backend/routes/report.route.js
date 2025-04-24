

// routes/report.routes.js
import express from "express";
import { createReport, getAllReports , getVerifiedReports, verifyReport } from "../controllers/report.controller.js";
import {  authenticate ,  authorizeRoles } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/createReport", authenticate, createReport); // User submits report
router.get("/getAllReports", authenticate, getAllReports); // All reports 
router.get("/getVerifiedReports", getVerifiedReports);  
router.put("/verifyReport", authenticate, authorizeRoles("Admin"), verifyReport); //  Only admins can verify

export default router;
