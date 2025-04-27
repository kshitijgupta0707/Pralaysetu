// notification.controller.js
import { JWT } from 'google-auth-library';
import axios from "axios";

import { User } from "../models/user.model.js"



// import serviceAccount from "../service-account.json" assert { type: "json" };
import { readFile } from "fs/promises";
const serviceAccount = JSON.parse(
  await readFile(new URL("../service-account.json", import.meta.url))
);
serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');

const getAccessToken = async () => {
  const client = new JWT({
    email: serviceAccount.client_email,
    key: serviceAccount.private_key,
    scopes: ["https://www.googleapis.com/auth/firebase.messaging"],
  });

  const { access_token } = await client.authorize();
  return access_token;
};
let isProcessingNotifications = false;

export const sendNotificationToAll = async (title, body, data = {}) => {
  try {
    // Prevent concurrent execution
    if (isProcessingNotifications) {
      console.log("⚠️ Notification sending already in progress. Skipping this request.");
      return { skipped: true };
    }

    isProcessingNotifications = true;

    // Fetch all tokens from database
    const tokenRecords = await Token.find({});

    if (tokenRecords.length === 0) {
      console.log("No FCM tokens found. Skipping notification.");
      isProcessingNotifications = false;
      return { success: false, reason: "no-tokens" };
    }

    console.log(`Sending notification to ${tokenRecords.length} devices`);

    // Send notification to each token individually
    const sendPromises = tokenRecords.map(async (tokenRecord) => {
      try {
        console.log("calling send notification function")

        await sendNotification(tokenRecord.token, title, body, data);
        return { success: true, token: tokenRecord.token };
      } catch (error) {
        // If a token is invalid, we might want to remove it from our database
        if (error.response?.data?.error?.message === 'The registration token is not a valid FCM registration token') {
          console.log(`Removing invalid token: ${tokenRecord.token}`);
          await Token.findByIdAndDelete(tokenRecord._id);
        }
        return { success: false, token: tokenRecord.token, error: error.message };
      }
    });

    const results = await Promise.all(sendPromises);

    const successful = results.filter(r => r.success).length;
    console.log(`✅ Successfully sent notifications to ${successful}/${tokenRecords.length} devices`);

    // Release the lock
    isProcessingNotifications = false;

    return { success: true, sentCount: successful, totalCount: tokenRecords.length };
  } catch (error) {
    console.error("❌ Error sending notifications to all devices:", error);
    // Make sure to release the lock even if there's an error
    isProcessingNotifications = false;
    throw error;
  }
};

export const sendNotificationToAdmins = async (title, body, data = {}) => {
  try {
    if (isProcessingNotifications) {
      console.log("⚠️ Notification sending already in progress. Skipping this request.");
      return { skipped: true };
    }

    isProcessingNotifications = true;

    // Step 1: Fetch all admin users
    const users = await User.find({ registerAs: "Admin" });
    console.log("✅ Admin users fetched:", users.length);

    if (users.length === 0) {
      console.log("⚠️ No Admin users found. Skipping notification.");
      isProcessingNotifications = false;
      return { skipped: true };
    }

    let allTokens = [];

    // Step 2: Collect all tokens for all admins
    for (const user of users) {
      const tokens = await Token.find({ userId: user._id });
      if (tokens.length > 0) {
        allTokens.push(...tokens);
      }
    }

    if (allTokens.length === 0) {
      console.log("⚠️ No FCM tokens found for admins. Skipping notification.");
      isProcessingNotifications = false;
      return { skipped: true };
    }

    console.log(`📤 Sending notifications to ${allTokens.length} devices`);

    // Step 3: Send notification to all tokens
    const sendPromises = allTokens.map(async (tokenRecord) => {
      try {
        await sendNotification(tokenRecord.token, title, body, data);
        return { success: true, token: tokenRecord.token };
      } catch (error) {
        if (error.response?.data?.error?.message === 'The registration token is not a valid FCM registration token') {
          console.log(`🗑️ Removing invalid token: ${tokenRecord.token}`);
          await Token.findByIdAndDelete(tokenRecord._id);
        }
        return { success: false, token: tokenRecord.token, error: error.message };
      }
    });

    const results = await Promise.all(sendPromises);

    const successful = results.filter(r => r.success).length;

    console.log(`✅ Notifications successfully sent to ${successful}/${allTokens.length} devices.`);

    isProcessingNotifications = false;
    return { success: true, sentCount: successful, totalCount: allTokens.length };

  } catch (error) {
    console.error("❌ Error sending notifications:", error);
    isProcessingNotifications = false;
    throw error;
  }
};

export const sendNotificationToPerson = async (title, body, data = {}) => {
  try {
    // Prevent concurrent execution
    if (isProcessingNotifications) {
      console.log("⚠️ Notification sending already in progress. Skipping this request.");
      return { skipped: true };
    }

    isProcessingNotifications = true;

    // Fetch all tokens from database
    let tokenRecords = []
    let userId = data.userId
    console.log("User id is", data.userId)
    // User id is new ObjectId('680d2434c760d97a23118141')
    if (userId) {
      tokenRecords = await Token.find({ userId });
    } else return;


    if (tokenRecords.length === 0) {
      console.log("No FCM tokens found. Skipping notification.");
      isProcessingNotifications = false;
      return { success: false, reason: "no-tokens" };
    }

    console.log(`Sending notification to ${tokenRecords.length} devices`);

    // Send notification to each token individually
    const sendPromises = tokenRecords.map(async (tokenRecord) => {
      try {
        await sendNotification(tokenRecord.token, title, body, data);
        return { success: true, token: tokenRecord.token };
      } catch (error) {
        // If a token is invalid, we might want to remove it from our database
        if (error.response?.data?.error?.message === 'The registration token is not a valid FCM registration token') {
          console.log(`Removing invalid token: ${tokenRecord.token}`);
          await Token.findByIdAndDelete(tokenRecord._id);
        }
        return { success: false, token: tokenRecord.token, error: error.message };
      }
    });

    const results = await Promise.all(sendPromises);

    const successful = results.filter(r => r.success).length;
    console.log(`✅ Successfully sent notifications to ${successful}/${tokenRecords.length} devices`);

    // Release the lock
    isProcessingNotifications = false;

    return { success: true, sentCount: successful, totalCount: tokenRecords.length };
  } catch (error) {
    console.error("❌ Error sending notifications to all devices:", error);
    // Make sure to release the lock even if there's an error
    isProcessingNotifications = false;
    throw error;
  }
};

// Modify your sendNotification function to include better error handling
export const sendNotification = async (token, title, body, data = {}) => {
  try {
    console.log(" i am getting called send ntoifictoain")
    const accessToken = await getAccessToken();


    const message = {
      message: {
        token,
        notification: {
          title,
          body,
        },
        data,
      },
    };

    const response = await axios.post(
      `https://fcm.googleapis.com/v1/projects/${serviceAccount.project_id}/messages:send`,
      message,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    return { success: true, messageId: response.data.name };
  } catch (error) {
    console.error("❌ Error sending message:", error.response?.data || error.message);
    throw error; // Re-throw the error so it can be caught by the caller
  }
}

// Example usage
// const targetToken = "YOUR_CLIENT_DEVICE_FCM_TOKEN";
// sendNotification(targetToken, "🚨 Alert!", "Disaster warning in your area!", {
//   type: "disaster",
//   severity: "high",
// });









import { Token } from "../models/token.model.js";

export const saveFcmToken = async (req, res) => {
  try {
    const { userId, token } = req.body;
    console.log("Token is saved")
    console.log(token)
    console.log(userId)
    if (!userId || !token) {
      console.log("missing")
      return res.status(400).json({ msg: "Missing userId or token" });
    }

    // Check if token already exists
    const existing = await Token.findOne({ token ,userId });
    console.log("yha aya")
    console.log("yha aya")

    if (existing) {
      console.log("existing")
      return res.status(200).json({ msg: "Token already exists" });
    }

    await Token.create({ userId, token });
    console.log("created new token")
    console.log("token saved")
    res.status(201).json({ msg: "Token saved" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};
export const removeToken = async (req, res) => {
  const { userId } = req.body;
  console.log("yha tak aya")

  try {
    const result = await Token.deleteMany({ userId });
    console.log("token reomved")
    res.status(200).json({ success: true, message: "Token(s) removed", result });
  } catch (error) {
    console.error("Error removing token:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


// export const sendNotification = async (title, body) => {
//   try {
//     // Step 1: Get all FCM tokens from the FcmToken collection
//     const fcmTokens = await Token.find({}); // Fetch all tokens, or add a filter if needed

//     // Step 2: Extract the token values
//     const tokens = fcmTokens.map(fcmToken => fcmToken.token);

//     if (tokens.length === 0) {
//       console.log("No FCM tokens found. Skipping notification.");
//       return;
//     }

//     // Step 3: Prepare the payload for FCM
//     const payload = {
//       registration_ids: tokens, // Use array of tokens
//       notification: {
//         title,
//         body,
//         icon: "/logo.png", // Optional: Add a notification icon
//       },
//     };

//     // Step 4: Send the notification via FCM
//     const response = await axios.post("https://fcm.googleapis.com/fcm/send", payload, {
//       headers: {
//         Authorization: `key=${process.env.FCM_SERVER_KEY}`, // Use your Firebase server key
//         "Content-Type": "application/json",
//       },
//     });

//     console.log("✅ Notification sent:", response.data);
//   } catch (err) {
//     console.error("❌ Error sending notification:", err?.response?.data || err.message);
//   }
// };


export const testAuth = async () => {
  // try {
  //   // console.log(process.env.CLIENT_EMAIL)
  //   // console.log(process.env.PRIVATE_KEY.replace(/\\n/g, '\n'))
  //   const client = new JWT({
  //     email: serviceAccount.client_email,
  //     key: serviceAccount.private_key,
  //     scopes: ["https://www.googleapis.com/auth/firebase.messaging"],
  //   });




  //   const tokens = await client.authorize();
  //   console.log("✅ Authorized:", tokens);
  // } catch (err) {
  //   console.error("❌ Auth Error:", err.response?.data || err.message);
  // }
};