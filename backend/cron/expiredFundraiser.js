import cron from "node-cron";
import Fundraiser from "../models/fundraiser.model.js"; // Adjust the path as necessary

// Run every day at midnight
cron.schedule("0 0 * * *", async () => {
  try {
    const now = new Date();
    const expiredFundraisers = await Fundraiser.find({ deadline: { $lt: now } });

    for (let fund of expiredFundraisers) {
      await Fundraiser.findByIdAndUpdate(fund._id, { isExpired: true });
      console.log(` Expired fundraiser removed from display: ${fund.title}`);
    }
  } catch (err) {
    console.error("Error in cron job:", err.message);
  }
});
