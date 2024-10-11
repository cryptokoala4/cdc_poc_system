import { create } from "zustand";
import { persist } from "zustand/middleware";
import { StaffStore } from "./types";

export const useStaffStore = create(
  persist<StaffStore>(
    (set) => ({
      currentStaff: null,
      setCurrentStaff: (staff) => set({ currentStaff: staff }),
      logout: () => set({ currentStaff: null }),
    }),
    {
      name: "staff-storage",
    }
  )
);
