import express from "express";
import { sendOtp , signup , login , logout , forgotPassword , resetPassword , checkAuth , loginwithOAuth} from "../controllers/auth.controller.js";
import {authenticate} from "../middleware/auth.middleware.js"

const router = express.Router();

router.post("/signup", signup);
router.post("/sendotp", sendOtp);
router.post("/login", login);
router.post("/loginwithOAuth", loginwithOAuth);
//added authenticate so i have user for deleting token
router.post("/logout", authenticate, logout);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.get('/check' , authenticate ,  checkAuth )


export default router;
