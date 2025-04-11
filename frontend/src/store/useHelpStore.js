import { create } from 'zustand';
import { axiosInstance } from '@/lib/axios';
import toast from 'react-hot-toast';

export const useHelpStore = create((set, get) => ({
  loading: false,
  error: null,
  success: null,
  requests: [],
  requestsAssigned: [],

  // Create Help Request
  createHelpRequest: async (data) => {
    try {
      set({ loading: true, error: null, success: null });

      const res = await axiosInstance.post('/help/request', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      set({ success: res.data.message, loading: false });
      toast.success(res.data.message);

      console.log("request submitted");
    } catch (err) {
      console.log("error in creating request")

      set({ loading: false });
      toast.error(err)


    }
  },

  // Fetch requests based on status
  fetchHelpRequests: async () => {
    try {
      set({ loading: true });

      const res = await axiosInstance.get("/help/pending");

      set({ requests: res.data.requests, loading: false });
    } catch (err) {
      console.log(err)
      set({ loading: false });
    }
  },

  // Verify or Reject Help Request
  verifyOrRejectRequest: async (id, status) => {
    try {
      set({ loading: true, error: null });

      const res = await axiosInstance.put(`/help/verify/${id}`, { status });
      set({ loading: false });


      // Update state after successful API call
      set((state) => ({
        requests: state.requests.map(request =>
          request._id === id ? { ...request, status } : request
        )
      }));

      toast.success(res.data.message);
    } catch (err) {
      set({ error: "Failed to update request status", loading: false });
      toast.error(err)
    }
  },

  // Assign Help Request
  assignHelpRequest: async (id, responderId) => {
    try {
      set({ loading: true, error: null });

      const res = await axiosInstance.put(`/help/assign/${id}`, { responderId });
      set({ loading: false });
      // Update state after successful API call
      set((state) => ({
        requests: state.requests.map(request =>
          request._id === id ? { ...request, status } : request
        )
      }));

      toast.success(res.data.message)
    } catch (err) {
      set({ error: "Assignment failed", loading: false });
      toast.error(err)
    }
  },



  // Accept Help Request
  acceptHelpRequest: async (id) => {
    try {
      set({ loading: true, error: null });

      const res = await axiosInstance.put(`/help/accept/${id}`);
      set({ loading: false });
      toast.success(res.data.message)

    } catch (err) {
      set({ loading: false });
      toast.error(err)
    }
  },


  // Accept Help Request
getAllHelpRequest: async () => {
  try {
    set({ loading: true, error: null });

    const res = await axiosInstance.get(`/help/assigned`);
    set({ loading: false });

  
    // Set all requests
    set({ requestsAssigned: res.data.requests });
    
    toast.success("Requests are fetched successfully ")
  } catch (err) {
    set({ loading: false });
    toast.error(err.message || "Something went wrong");
  }
},


  // Complete Help Request
  completeHelpRequest: async (id) => {
    try {
      set({ loading: true, error: null });

      const res = await axiosInstance.put(`/help/complete/${id}`);
      set({ loading: false });
      toast.success(res.data.message)
    } catch (err) {
      set({ loading: false });
      toast.error(err)
    }
  }
}));

