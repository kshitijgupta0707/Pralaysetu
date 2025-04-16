
import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";
// import { io } from "socket.io-client";







export const useReportStore = create((set) => ({
  reports: [],
  // verifiedReports: [],
  isCreatingReport: false,
  isFetchingReports: false,
  isVerifyingReport: false,

  // 1. Create Report
  createReport: async (formData) => {
    set({ isCreatingReport: true });
    try {
      const res = await axiosInstance.post('/reports/createReport', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      toast.success(res.data.message);
      return res.data.report;
    } catch (err) {
      
      toast.error(err.response?.data?.message || 'Failed to create report');
    } finally {
      set({ isCreatingReport: false });
    }
  },

  // 2. Get All Reports (Admin)
  getAllReports: async () => {
    set({ isFetchingReports: true });
    // console.log("get all reports called");
    try {
      const res = await axiosInstance.get('/reports/getAllReports');
      set({ reports: res.data.reports || [] });
      // console.log(res.data.reports);
    } catch (err) {
      toast.error('Failed to fetch all reports');
      console.error(err);
    } finally {
        set({ isFetchingReports: false });
    }
},

// 3. Get Verified Reports (All Users)
// getVerifiedReports: async () => {
//     set({ isFetchingReports: true });
//     try {
//         const res = await axiosInstance.get('/reports/getVerifiedReports');
//         set({ verifiedReports: res.reports || [] });

//     } catch (err) {
//         console.error(err);
//         toast.error('Failed to fetch verified reports');
//     } finally {
//         set({ isFetchingReports: false });
//     }
// },

// 4. Verify a Report (Admin)
verifyReport: async (reportId, status = 'verified') => {
    set({ isVerifyingReport: true });
    try {
        const res = await axiosInstance.put('/reports/verifyReport', { reportId, status });
        toast.success(res.data.message);
        // Optional: Re-fetch updated reports
        await useReportStore.getState().getAllReports();
    } catch (err) {
        console.error(err);
        toast.error('Failed to verify report');
    } finally {
        set({ isVerifyingReport: false });
    }
},

addNewReport: (newReport) => {
  set((state) => ({
    reports: [newReport, ...state.reports],  // add to top
  }));
},
}));

