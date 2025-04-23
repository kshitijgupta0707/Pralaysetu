import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { axiosInstance } from "@/lib/axios";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

export default function DonationPage() {
    const [amount, setAmount] = useState("");

    const handleDonate = async () => {
        if (!amount || amount <= 0) return alert("Enter valid amount");

        const res = await axiosInstance.post("/stripe/create-checkout-session", { amount })

        // const res = await fetch("http://localhost:5000/api/stripe/create-checkout-session", {
        //   method: "POST",
        //   headers: { "Content-Type": "application/json" },
        //   body: JSON.stringify({ amount }),
        // });

        console.log(res);
        const stripe = await stripePromise;
        console.log(stripe);
        await stripe.redirectToCheckout({ sessionId: res.data.id });
    };

    return (
        <div className="flex flex-col items-center justify-center p-8">
            <h1 className="text-3xl font-bold mb-4">Help Flood Victims</h1>
            <p className="text-gray-600 mb-4">Target: ₹100,000</p>
            <input
                type="number"
                placeholder="Enter amount in INR"
                className="border p-2 rounded mb-4 w-64"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
            />
            <button
                onClick={handleDonate}
                className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
            >
                Donate Now
            </button>
        </div>
    );
}
