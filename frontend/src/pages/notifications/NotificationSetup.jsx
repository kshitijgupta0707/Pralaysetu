import { useEffect, useRef } from "react";
import { requestNotificationPermission } from "@/utils/RequestPermission";
import { useAuthStore } from "@/store/useAuthstore";
import { onMessage, messaging } from "@/firebase";

const NotificationSetup = () => {
  const { authUser } = useAuthStore();
  const permissionRequested = useRef(false); // new addition

  useEffect(() => {
    if (authUser && !permissionRequested.current) {
      console.log("Requesting notification permission from NotificationSetup...");
      requestNotificationPermission(authUser);
      permissionRequested.current = true; // Mark as requested
    }
  }, [authUser]);



  return null;
};

export default NotificationSetup;
