
// src/utils/requestPermission.js

import { messaging, getToken } from "@/firebase";
import { axiosInstance } from "@/lib/axios";

export const requestNotificationPermission = async (authUser) => {
  try { 
    const permission = await Notification.requestPermission();

    if (permission === "granted") {
      const fcmToken = await getToken(messaging, {
        vapidKey: import.meta.env.VITE_VAPID_KEY,
      });

      if (fcmToken) {
        console.log("✅ FCM Token:", fcmToken);

        if (authUser?._id) {
          await axiosInstance.post("/notification/save-token", {
            userId: authUser._id,
            token: fcmToken,
          });

          console.log("🎯 Token saved to DB");
        } else {
          console.warn("⚠️ No authenticated user found");
        }
      } else {
        console.warn("⚠️ Failed to get FCM token");
      }
    } else {
      console.warn("❌ Notification permission denied");
    }
  } catch (error) {
    console.error("❌ Error getting permission/token:", error);
  }
};
