import { axiosInstance } from "@/lib/axios";
import { create } from "zustand";
import toast from "react-hot-toast";


export const useAdminStore = create((set) => ({
  pendingUsers: [],
  responders: [],
  verifiedEntities: [],
  loading: false,


  // Fetch pending users
  fetchPendingUsers: async () => {
    try {
      set({ loading: true })
      const res = await axiosInstance.get('/admin/pending-users')
      set({ pendingUsers: res.data })
    } catch (err) {
      toast.error("Failed to fetch pending users")
    } finally {
      set({ loading: false })
    }
  },

  // Approve user
  approveUser: async (id) => {
    try {
      const res = await axiosInstance.put(`/admin/approve-user/${id}`)
      toast.success(res.data.message || "User approved")
      // Remove approved user from pendingUsers
      set((state) => ({
        pendingUsers: state.pendingUsers.filter(user => user._id !== id)
      }));
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to approve user")
    }
  },

  // Reject user
  rejectUser: async (id) => {
    try {
      const res = await axiosInstance.put(`/admin/reject-user/${id}`)
      toast.success(res.data.message || "User rejected")
      // Remove rejected user from pendingUsers
      set((state) => ({
        pendingUsers: state.pendingUsers.filter(user => user._id !== id)
      }));
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to reject user")
    }
  },

  // Get all responders
  fetchAllResponders: async () => {
    try {
      set({ loading: true })
      const res = await axiosInstance.get('/admin/getAllResponders')
      // console.log("all the responders ",res.data)
      set({ responders: res.data })
    } catch (err) {
      toast.error("Failed to fetch responders")
    } finally {
      set({ loading: false })
    }
  },

  // Get all verified Government & NGOs
  fetchAllVerifiedEntities: async () => {
    try {
      set({ loading: true })
      const res = await axiosInstance.get('/admin/getAllVerifiedGovernmentAndNgo')
      set({ verifiedEntities: res.data })
    } catch (err) {
      toast.error("Failed to fetch verified entities")
    } finally {
      set({ loading: false })
    }
  },
}))

