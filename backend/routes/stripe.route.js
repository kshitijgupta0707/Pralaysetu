import express from "express"
const router = express.Router();
import { stripeWebhookHandler } from "../controllers/stripe.controller.js";
import { createCheckoutSession } from "../controllers/stripe.controller.js";
router.post('/create-checkout-session', createCheckoutSession);



export default router
