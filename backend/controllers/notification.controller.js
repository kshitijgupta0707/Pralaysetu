// notification.controller.js
import pkg from 'google-auth-library';
const { google } = pkg;

import { JWT } from 'google-auth-library';
import axios from "axios";

// import serviceAccount from "../service-account.json" assert { type: "json" };
import { readFile } from "fs/promises";
const serviceAccount = JSON.parse(
  await readFile(new URL("../service-account.json", import.meta.url))
);

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
// const getAccessToken = async () => {
//   const jwtClient = new JWT(
//     process.env.CLIENT_EMAIL,
//     null,
//     process.env.PRIVATE_KEY.replace(/\\n/g, '\n'),
//     ["https://www.googleapis.com/auth/firebase.messaging"]
//   );

//   const tokens = await jwtClient.authorize();
//   return tokens.access_token;
// };



// async function getAccessToken() {
//   const jwtClient = new google.auth.JWT(
//     CLIENT_EMAIL,
//     null,
//     PRIVATE_KEY,
//     SCOPES
//   );

//   const tokens = await jwtClient.authorize();
//   return tokens.access_token;
// }

// export const sendNotification = async (title, body, data = {}) => {
//   try {
//     // Fetch all tokens from database
//     const tokenRecords = await Token.find({});
    
//     if (tokenRecords.length === 0) {
//       console.log("No FCM tokens found. Skipping notification.");
//       return;
//     }
    
//     console.log(`Sending notification to ${tokenRecords.length} devices`);
    
//     // Send notification to each token individually
//     const sendPromises = tokenRecords.map(async (tokenRecord) => {
//       try {
//         await sendNotification(tokenRecord.token, title, body, data);
//         return { success: true, token: tokenRecord.token };
//       } catch (error) {
//         // If a token is invalid, we might want to remove it from our database
//         if (error.response?.data?.error?.message === 'The registration token is not a valid FCM registration token') {
//           console.log(`Removing invalid token: ${tokenRecord.token}`);
//           await Token.findByIdAndDelete(tokenRecord._id);
//         }
//         return { success: false, token: tokenRecord.token, error: error.message };
//       }
//     });
    
//     const results = await Promise.allSettled(sendPromises);
    
//     const successful = results.filter(r => r.status === 'fulfilled' && r.value.success).length;
//     console.log(`✅ Successfully sent notifications to ${successful}/${tokenRecords.length} devices`);
    
//     return results;
//   } catch (error) {
//     console.error("❌ Error sending notifications to all devices:", error);
//     throw error;
//   }
// };
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
export const sendNotification = async(token, title, body, data = {}) => {
  try {
    // const accessToken = await getAccessToken();

    // console.log("Got access token for FCM");

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

    if (!userId || !token) {
      return res.status(400).json({ msg: "Missing userId or token" });
    }

    // Check if token already exists
    const existing = await Token.findOne({ token });

    if (existing) {
      return res.status(200).json({ msg: "Token already exists" });
    }

    await Token.create({ userId, token });
    console.log("token saved")
    res.status(201).json({ msg: "Token saved" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
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