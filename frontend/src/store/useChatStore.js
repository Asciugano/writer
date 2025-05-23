import { create } from "zustand";
import { axiosInstace } from "../lib/axios";
import toast from "react-hot-toast";

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUserLoading: false,
  isMessagesLoading: false,

  getUsers: async () => {
    set({ isUserLoading: true });
    try {
      const res = await axiosInstace.get("/messages/users");
      console.log("res: ", res);
      set({ users: res.data.filteredUsers });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isUserLoading: false });
    }
  },

  getMessages: async (userID) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstace.get(`messages/${userID}`);
      set({ messages: res.data.messages });
    } catch (error) {
      toast.error(error?.response?.data?.message || "something went wrong");
      console.error(error)
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  setSelectedUser: (user) => set({ selectedUser: user }),

  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();

    try {
      const res = await axiosInstace.post(
        `/messages/send/${selectedUser._id}`,
        messageData
      );

      set({ messages: [...messages, res.data] });
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },
}));