import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";
import { io } from "socket.io-client";
import { Activity } from "lucide-react";
import { deleteToken, messaging } from "@/firebase.js";
import { useNgoStore } from "./useNgoStore.js";

const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:5000/" : "https://pralaysetu-backend.onrender.com/";
export const useAuthStore = create((set, get) => ({
  authUser: null,
  formData: null,
  isSendingOtp: false,
  isSigningUp: false,
  isLoggingIn: false,
  //when you refresh the page check ki loggin in hain?
  isCheckingAuth: true,
  onlineUsers: [],
  socket: null,
  actingAs: null,
  isResettingPassword: false,
  isSendingLink: false,
  setFormData: (data) => set({ formData: data }),
  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check");
      console.log(res)
      set({ authUser: res.data });
      get().connectSocket();
      console.log("connected to the socket")

    } catch (error) {
      console.log(error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },
  sendOtp: async (data, navigate) => {
    console.log("Sending OTP with data:", data); // Log the data being sent
    set({ isSendingOtp: true });
    try {
      const res = await axiosInstance.post("/auth/sendOtp", data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      })
      toast.success("Otp Send on mail");
      set({ isSendingOtp: false });
      // Save FormData to Zustand store
      get().setFormData(data);
      setTimeout(() => {
        // Use React Router's navigate function to redirect and pass state
        console.log("Navigating to otp verification");
        navigate("/otp-verification");
      }, 2000); // Adjust delay as needed
      // get().connectSocket();
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isSendingOtp: false });

    }
  },
  signup: async (data, navigate) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/auth/signup", data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      //so that the user get authenticated soon after the signup
      // set({ authUser: res.data });
      toast.success(res.data.message);
      set({ isSigningUp: false });
      setTimeout(() => {
        // Use React Router's navigate function to redirect and pass state
        navigate("/login");
      }, 1000); // Adjust delay as needed
      // get().connectSocket();
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isSigningUp: false });

    }
  },
  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      
      const res = await axiosInstance.post("/auth/login", data);
      if(res.data.responseUser.registerAs === "NGO"){ 
        // i will delete on thing
        const ngoData = await useNgoStore.getState().getNGOById(res.data.responseUser.ngoId);
        await useNgoStore.getState().setNGOs(ngoData)
        console.log(ngoData)
        set({ authUser: { ...res.data.responseUser, ngoData } });
      }
      else{
        set({ authUser: res.data.responseUser });
      }

      toast.success("Logged in successfully ");
      get().connectSocket();
      console.log("connected to the socket")
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isLoggingIn: false });
    }
  },
  loginwithOAuth: async (data) => {
    set({ isLoggingIn: true });
    try {
      console.log(data);
      const res = await axiosInstance.post("/auth/loginwithOAuth", data);
      set({ authUser: res.data.responseUser });

      toast.success("Logged in successfully ");
      get().connectSocket();
      console.log("connected to the socket")
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isLoggingIn: false });
    }
  },
  setActingAs: (data) => {
    set({ actingAs: data })
  },
  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");


      // Delete local FCM token from Firebase
      // await deleteToken(messaging);
      // console.log(" FCM token deleted");
      // await axiosInstance.post("/notification/remove-token" , {userId: get().authUser._id})
      // console.log("removed from local storage")
      localStorage.removeItem("loggedInAs");
      get().setActingAs(null)
      toast.success("Logged out successfully");
      get().disconnectSocket();
      set({ authUser: null });

      //removing it for the user
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },
  sendResetLink: async (data, navigate) => {
    console.log(data); // Log the data being sent
    set({ isSendingLink: true });
    try {
      const res = await axiosInstance.post("/auth/forgot-password", data)
      toast.success("Reset password link send on your mail");
      set({ isSendingLink: false });

      setTimeout(() => {
        // Use React Router's navigate function to redirect and pass state
        // console.log("Navigating to otp verification");
        navigate('/login')
      }, 1000); // Adjust delay as needed
      get().connectSocket();
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isSendingLink: false });

    }
  },
  resetPassword: async (data, navigate) => {
    // console.log(data); // Log the data being sent
    console.log("request comes here");

    set({ isResettingPassword: true });
    try {
      const res = await axiosInstance.post("/auth/reset-password", data)
      toast.success("Reset password link send on your mail");
      set({ isResettingPassword: false });

      setTimeout(() => {
        // Use React Router's navigate function to redirect and pass state
        // console.log("Navigating to otp verification");
        navigate('/login')
      }, 1000); // Adjust delay as needed
      // get().connectSocket();
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isResettingPassword: false });

    }
  },
  connectSocket: () => {
    const { authUser } = get();
    //alreadyConnected or not autheticated - not do it
    if (!authUser || get().socket?.connected) return;

    const socket = io(BASE_URL, {
      // i am sending some data to the backend 
      // sending the userId to know who is online
      query: {
        userId: authUser._id,
        userName: authUser.firstName,
        registerAs: authUser.registerAs == "None" ? "User" : authUser.registerAs,
        workAsResponder: authUser.workAsResponder == true ? "Yes" : "No"
      },
    }
    );
    //connection established by the user with io so it give notification to the backend 
    //and you have written what to do now in backend
    socket.connect();

    set({ socket: socket });

    socket.on("getOnlineUsers", (userIds) => {
      set({ onlineUsers: userIds });
    });
  },
  disconnectSocket: () => {
    if (get().socket?.connected) get().socket.disconnect();
  },
}));
