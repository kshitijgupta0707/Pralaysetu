const express = require("express");
const { sendOtp, verifyOtpAndRegister, login } = require("../controllers/authController");
const router = express.Router();
router.post("/send-otp", sendOtp);
router.post("/register", verifyOtpAndRegister);
router.post("/login", login);

module.exports = router;
