// store/useNotificationStore.js
import { create } from "zustand";
import axios from "axios";
// export const useNotificationStore = create((set) => ({
//   message: "",
//   title: "",
//   show: false,
//   duration: 5000,
//   triggerNotification: ({ title, message, duration = 5000 }) => {
//     set({ title, message, show: true, duration });

//     setTimeout(() => {
//       set({ show: false });
//     }, duration);    
//   },
// }));


// In useNotificationStore.js
export const useNotificationStore = create((set) => ({
  title: '',
  message: '',
  show: false,
  purpose: '',

  showNotification: (title, message ,purpose) => {
    console.log("noificsion show")
    set({ title, message, show: true , purpose })
  },
  hideNotification: () => set({ show: false }),


  //push notification

  saveFCMToken: async (currentUser, currentToken) => {
    try {
      const res = await axios.post('/api/notification/save-token', {
        userId: currentUser._id,
        token: currentToken,
      });

      console.log("Token saved:", res.data);
    } catch (err) {
      console.error("Error saving token:", err.response?.data || err.message);
    }
  }

}));
