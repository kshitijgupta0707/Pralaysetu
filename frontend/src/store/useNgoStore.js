// stores/useStore.js
import {create} from 'zustand';
import { axiosInstance } from '../lib/axios'; // Adjust the import path as necessary
import toast from 'react-hot-toast';
export const useNgoStore = create((set) => ({
  ngo: {},
  fundraisers: [],
  loading: false,
  error: null, // To capture any errors during API calls

  // Set NGOs
  setNGO: (ngo) => set({ ngo}),

  // Set Fundraisers
  setFundraisers: (fundraisers) => set({ fundraisers }),

  // Set loading state
  setLoading: (loading) => set({ loading }),

  // Set error state
  setError: (error) => set({ error }),

  // Create an NGO
  createNGO: async (ngoData) => {
    set({ loading: true });
    try {
      const response = await axiosInstance.post('/ngo/create', ngoData);
      set((state) => ({
        ngos: [...state.ngos, response.data],
        loading: false,
      }));
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  // Get all NGOs
  fetchNGOs: async () => {
    set({ loading: true });
    try {
      const response = await axiosInstance.get('/ngo');
      set({ ngos: response.data, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  // Get a single NGO by ID
  fetchNGOById: async (id) => {
    set({ loading: true });
    try {
      const response = await axiosInstance.get(`/ngo/${id}`);
      set({ ngo: { ...response.data}, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  // Update an NGO
  updateNGO: async (id, updatedData) => {
    set({ loading: true });
    try {
      const response = await axiosInstance.put(`/ngo/${id}`, updatedData);
      set((state) => ({
        ngos: state.ngos.map((ngo) =>
          ngo._id === id ? response.data : ngo
        ),
        loading: false,
      }));
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },



  // Create a Fundraiser
  createFundraiser: async (fundraiserData) => {
    set({ loading: true });
    try {
      const response = await axiosInstance.post('/fundraiser/create', fundraiserData);
      set((state) => ({
        fundraisers: [...state.fundraisers, response.data],
        loading: false,
      }));
      return response.data;
    } catch (error) {
      toast.error(error.response.data.message);
      set({ error: error.message, loading: false });
    }
  },

  // Get all Fundraisers
  fetchFundraisers: async () => {
    set({ loading: true });
    try {
      const response = await axiosInstance.get('/fundraiser');
      console.log("fundraisers are ", response.data)
      // console.log(response.data)
      set({ fundraisers: response.data, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  // Get Fundraisers by NGO ID
  fetchFundraisersByNgoId: async (ngoId) => {
    set({ loading: true });
    try {
      const response = await axiosInstance.get(`/fundraiser/ngo/${ngoId}`);
      set({ fundraisers: response.data, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  // Get a single Fundraiser by ID
  fetchFundraiserById: async (id) => {
    set({ loading: true });
    try {
      const response = await axiosInstance.get(`/fundraiser/${id}`);
      set({ fundraisers: [response.data], loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  // Update a Fundraiser
  updateFundraiser: async (id, updatedData) => {
    set({ loading: true });
    try {
      const response = await axiosInstance.put(`/fundraiser/${id}`, updatedData);
      set((state) => ({
        fundraisers: state.fundraisers.map((fundraiser) =>
          fundraiser._id === id ? response.data : fundraiser
        ),
        loading: false,
      }));
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

}));

