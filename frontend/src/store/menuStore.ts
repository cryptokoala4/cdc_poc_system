import { create } from "zustand";
import { MenuStore } from "./types";
import { GET_MENU_ITEMS } from "../graphql/queries";
import { client } from "../lib/apolloClient";

export const useMenuStore = create<MenuStore>((set) => ({
  menuItems: [],
  isLoading: false,
  error: null,

  fetchMenuItems: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await client.query({
        query: GET_MENU_ITEMS,
        fetchPolicy: "network-only",
      });
      console.log(data)
      set({ menuItems: data.menuItems, isLoading: false });
    } catch (error) {
      console.error("Error fetching menu items:", error);
      set({
        error:
          error instanceof Error ? error.message : "Failed to fetch menu items",
        isLoading: false,
      });
    }
  },

  clearError: () => set({ error: null }),
}));
