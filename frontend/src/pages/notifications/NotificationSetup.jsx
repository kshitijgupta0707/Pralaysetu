import { useEffect } from "react";
import { requestNotificationPermission } from "@/utils/RequestPermission";
import { useAuthStore } from "@/store/useAuthstore";
import { onMessage, messaging } from "@/firebase";

const NotificationSetup = () => {
  const { authUser } = useAuthStore();

  useEffect(() => {
    if (authUser) {
      console.log("request for notifcaiton persmisson from notidicaiton setup page")
      requestNotificationPermission(authUser);
    }
  }, [authUser]);

  useEffect(() => {
    const unsubscribe = onMessage(messaging, (payload) => {
      console.log("🔔 Foreground notification:", payload);
      // You can show a toast/alert here using your UI lib
    });

    return () => unsubscribe();
  }, []);

  return null;
};

export default NotificationSetup;
