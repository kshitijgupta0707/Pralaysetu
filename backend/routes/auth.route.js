
import express from "express";
import { sendOtp , signup , login , logout , forgotPassword , resetPassword } from "../controllers/auth.controller.js";
const router = express.Router();


router.post("/signup", signup);
router.post("/sendotp", sendOtp);
router.post("/login", login);
router.post("/logout", logout);
// router.post("/verifyotp", verifyOtp);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);


export default router;
