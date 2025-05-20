import { create } from "zustand";
import { axiosInstace } from "../lib/axios.js";

export const useAuthStore = create((set) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,

  isCheckingAuth: true,

  checkAuth: async () => {
    try {
      const res = axiosInstace.get("auth/check");
      set({ authUser: res.data });
    } catch (error) {
      set({ authUser: null });
      console.error("error in useAuthStore", error.message);
    } finally {
      set({ isCheckingAuth: false });
    }
  },
}));