import Stripe from "stripe";
import Donation from "../models/donation.model.js";
import Fundraiser from "../models/fundraiser.model.js";
import dotenv from "dotenv";
dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-10-16", // or latest supported version
});
const createCheckoutSession = async (req, res) => {
  const { amount, ngoId, donorEmail, fundraiserId } = req.body;
  if (!amount || !ngoId || !donorEmail || !fundraiserId) {
    return res.status(400).json({ error: "Missing required fields" });
  }
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
      success_url: 'https://pralaysetu.vercel.app/success',
      cancel_url: 'https://pralaysetu.vercel.app/cancel',
      customer_email: donorEmail, // Optional: pre-fill email
      metadata: {
        ngoId, // Pass NGO ID for later use in webhook
        fundraiserId
      },
    });
    res.json({ id: session.id });
  } catch (error) {
    console.error('Stripe Error:', error.message);
    res.status(500).json({ error: error.message });
  }
};
// controllers/stripe.webhook.js

const stripeWebhookHandler = async (req, res) => {
  console.log("Webhook received:");

  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error("Webhook error:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }


  if (event.type === "checkout.session.completed") {
    const session = event.data.object;

    // Example metadata you added during checkout
    const { ngoId, fundraiserId } = session.metadata;

    // Save donation in DB
    const donation = await Donation.create({
      ngoId,
      fundraiserId,
      donorEmail: session.customer_email,
      amount: session.amount_total / 100,
      stripeSessionId: session.id,
    });
    //update the fundraiser amount
    const fundraiser = await Fundraiser.findById(fundraiserId);
    fundraiser.raisedAmount += session.amount_total / 100;
    await fundraiser.save();
  }

  res.status(200).send("Received");
}
export { createCheckoutSession, stripeWebhookHandler }