import express from "express"
const router = express.Router();
// import { createCheckoutSession } from "../controllers/stripe.controller";
// const { createCheckoutSession } = i('../controllers/stripe.controller');
// import { createCheckoutSession } from "../controllers/stripe.controller";
import { createCheckoutSession } from "../controllers/stripe.controller.js";
router.post('/create-checkout-session', createCheckoutSession);

export default router
