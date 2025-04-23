import express from "express"
const router = express.Router();
import { stripeWebhookHandler } from "../controllers/stripe.controller.js";
import { createCheckoutSession } from "../controllers/stripe.controller.js";
router.post('/create-checkout-session', createCheckoutSession);

// When using stripe.webhooks.constructEvent, Stripe needs the raw request body, not the parsed JSON.
router.post("/webhook", express.raw({ type: "application/json" }), stripeWebhookHandler);


export default router
