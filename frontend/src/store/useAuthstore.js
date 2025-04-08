import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";
import { io } from "socket.io-client";


const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:5000/api" : "/";
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
  setFormData: (data) => set({ formData: data }),
  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check");
      console.log(res)
      set({ authUser: res.data });
      // get().connectSocket();
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
      const res = await axiosInstance.post("/auth/sendOtp", data, { headers: {
        'Content-Type': 'multipart/form-data',
      }})
      toast.success("Otp Send on mail");
      set({ isSendingOtp: false });
       // Save FormData to Zustand store
      get().setFormData(data);
      setTimeout(() => {
        // Use React Router's navigate function to redirect and pass state
        console.log("Navigating to otp verification"  );
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
      const res = await axiosInstance.post("/auth/signup", data , {
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
      console.log(data);
      const res = await axiosInstance.post("/auth/login", data);
      set({ authUser: res.data.responseUser });

      toast.success("Logged in successfully ");
    //   get().connectSocket();
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isLoggingIn: false });
    }
  },
  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      set({ authUser: null });
      localStorage.removeItem("loggedInAs");
      toast.success("Logged out successfully");
    //   get().disconnectSocket();
    } catch (error) {
      toast.error(error.response.data.message);
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
        userName: authUser.firstName
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
