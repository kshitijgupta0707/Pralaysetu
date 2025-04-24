// stores/useStore.js
import {create} from 'zustand';
import { axiosInstance } from '../lib/axios'; // Adjust the import path as necessary
import toast from 'react-hot-toast';
// import { c } from 'vite/dist/node/moduleRunnerTransport.d-CXw_Ws6P';
export const useNgoStore = create((set ,get) => ({
  ngo: {},
  ngos: [],
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
      console.log("updating ngo with id ", id)
      const response = await axiosInstance.put(`/ngo/${id}`, updatedData);
      console.log("updated ngo is ", response.data)
      set((state) => ({
        ngos: state.ngos.map((ng) =>
          ng._id === id ? response.data : ng
        ),
        ngo: response.data, // optionally update the currently selected NGO as well
        loading: false,
      }));
      
       toast.success("NGO updated successfully");
      console.log(get().fundraisers)
    } catch (error) {
      toast.error("Error in updating NGO");
      console.log("error is ", error)
      set({ error: error.message, loading: false });
    }
  },



  // Create a Fundraiser
  createFundraiser: async (fundraiserData) => {
    set({ loading: true });
    try {
      // i am sharing the expanded ngoid
      const response = await axiosInstance.post('/fundraiser/create', fundraiserData);
      console.log("created fundraiser is ", response.data)
      set((state) => ({
        fundraisers: [ response.data,...state.fundraisers],
        loading: false,
      }));
      console.log(get().fundraisers)
      console.log("Fundraiser created successfully");
      toast.success("Fundraiser created successfully");
      return response.data;
    } catch (error) {

      toast.error("Error in creating fundraiser");
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
      
      console.log("updated fundraiser is ", response.data)
      
      // Update the fundraisers in the store to update the UI
      set((state) => ({
        fundraisers: state.fundraisers.map((fundraiser) =>
          fundraiser._id === id ? response.data : fundraiser
        ),
      }));

      console.log(get().fundraisers)
      toast.success("Fundraiser updated successfully");
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

}));

