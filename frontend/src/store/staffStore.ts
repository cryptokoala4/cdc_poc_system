import { create } from "zustand";
import { StaffStore } from "./types";

export const useStaffStore = create<StaffStore>((set) => ({
  staff: [],
  // currentStaff: null,
  // TODO: use hardcoded staff from db
  currentStaff:   {
    _id: "aaa",
    name: 'Yuki Sato',
    username: 'ysato',
    role: 'Waiter',
  },
  setCurrentStaff: (staff) => set({ currentStaff: staff }),
}));
