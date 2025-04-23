// stores/useDonationStore.js
import { create } from 'zustand';
import { axiosInstance } from '../lib/axios';
import toast from 'react-hot-toast';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

export const useDonationStore = create((set, get) => ({
  donations: [],
  loading: false,
  error: null,
  success: false,

  // Set loading state
  setLoading: (loading) => set({ loading }),

  // Set error state
  setError: (error) => set({ error }),

  // Process payment via Stripe
  processPayment: async (paymentData) => {
    set({ loading: true, error: null, success: false });

    try {
      // Validate payment data
      const { amount, ngoId, fundraiserId, donorEmail } = paymentData;

      if (!amount || amount <= 0) {
        toast.error('Please enter a valid donation amount');
        return;
      }

      if (!donorEmail) {
        toast.error('Email is required');
        return;
      }

      if (!ngoId || !fundraiserId) {
        toast.error('Invalid fundraiser information');
        return;
      }
      console.log("processing the payment :", paymentData)

      // Create Stripe checkout session
      const response = await axiosInstance.post('/payment/create-checkout-session', {
        amount: Number(amount),
        ngoId,
        fundraiserId,
        donorEmail
      });
      console.log(response);

      // Handle successful session creation
      if (response.data && response.data.id) {
        console.log('Payment session response:', response.data);
        console.log(response);
        const stripe = await stripePromise;
        console.log(stripe);
        await stripe.redirectToCheckout({ sessionId: response.data.id });

        set({ success: true, loading: false });
        return response.data;
      } else {
        toast.error('Failed to create payment session');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Payment processing failed';
      toast.error(errorMessage);
      set({ error: errorMessage, loading: false });
      return null;
    }
  },

  // Fetch donation history for a donor (if needed)
  fetchDonationsByEmail: async (email) => {
    if (!email) return;

    set({ loading: true });
    try {
      const response = await axiosInstance.get(`/donations/donor/${email}`);
      set({ donations: response.data, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  // Fetch all donations (admin only)
  fetchAllDonations: async () => {
    set({ loading: true });
    try {
      const response = await axiosInstance.get('/donations');
      set({ donations: response.data, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  // Fetch donations by fundraiser
  fetchDonationsByFundraiser: async (fundraiserId) => {
    if (!fundraiserId) return;

    set({ loading: true });
    try {
      const response = await axiosInstance.get(`/donations/fundraiser/${fundraiserId}`);
      set({ donations: response.data, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  // Check payment status (for success page)
  verifyPaymentStatus: async (sessionId) => {
    set({ loading: true });
    try {
      const response = await axiosInstance.get(`/payment/verify/${sessionId}`);
      set({ loading: false });
      return response.data.status;
    } catch (error) {
      set({ error: error.message, loading: false });
      return 'failed';
    }
  },

  // Reset states
  reset: () => set({ loading: false, error: null, success: false })
}));