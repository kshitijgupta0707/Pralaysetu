import Stripe from "stripe";
import Donation from "../models/donation.model.js";
import dotenv from "dotenv";
dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-10-16", // or latest supported version
});
 const createCheckoutSession = async (req, res) => {
  const { amount } = req.body;
console.log("Amount received:", amount);
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'inr',
          product_data: {
            name: 'Disaster Relief Donation',
          },
          unit_amount: amount * 100, // Convert to paisa
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: 'http://localhost:5173/success',
      cancel_url: 'http://localhost:5173/cancel',
    });
    console.log("Stripe session created:", session);
    res.json({ id: session.id });
  } catch (error) {
    console.error('Stripe Error:', error.message);
    res.status(500).json({ error: error.message });
  }
};




// controllers/stripe.webhook.js

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

const stripeWebhookHandler = async(req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;
  
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error("Webhook error:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
  
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    
    // Example metadata you added during checkout
    const { ngoId } = session.metadata;
    
    // Save donation in DB
    await Donation.create({
      ngoId,
      donorEmail: session.customer_email,
      amount: session.amount_total / 100,
      stripeSessionId: session.id,
    });
    
    console.log("✅ Donation recorded:", session.id);
  }

  res.status(200).send("Received");
}

  export {createCheckoutSession , stripeWebhookHandler}