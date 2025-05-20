import { create } from "zustand";
import { axiosInstace } from "../lib/axios.js";
import toast from "react-hot-toast";

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

  singup: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstace.post("/auth/signup", data);

      set({ authUser: res.data });
      toast.success("Account create successfully");
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isSigningUp: false });
    }
  },
}));