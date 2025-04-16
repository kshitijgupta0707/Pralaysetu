// import { instance } from "../config/payment.js";
// import crypto from "crypto";
// import { Payment } from "../models/payment.model.js";

// export const checkout = async (req, res) => {
//   try {

//     const { amount } = req.body;

//     const options = {
//       amount: Number(amount * 100),
//       currency: "INR",
//       receipt: "order_rcptid_11",
//     };
//     const order = await instance.orders.create(options);
//     res.status(200).json(order);
//   }
//   catch (err) {
//     console.log(err);
//   }
// }

// export const paymentVerification = async (req, res) => {
//   try {
//     const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
//     const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_API_SECRET);
//     hmac.update(razorpay_order_id + "|" + razorpay_payment_id);
//     const generatedSignature = hmac.digest('hex');

//     if (generatedSignature === razorpay_signature) {
//       // Payment verification successful
//       await Payment.create({ razorpay_order_id, razorpay_payment_id, razorpay_signature });
//       res.redirect(`http://localhost:5173/paymentsuccess?reference=${razorpay_payment_id}`);
//     }
//     else {
//       // Payment verification failed
//       res.status(400).json({ message: 'Invalid signature' });
//     }
//   }
//   catch (err) {
//     console.log(err);
//   }
// }