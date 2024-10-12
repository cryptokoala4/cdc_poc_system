import { create } from "zustand";
import { Table } from "../types";
import { client } from "../lib/apolloClient";
import { GET_TABLES } from "../graphql/queries";
import { LOCK_TABLE, UNLOCK_TABLE } from "../graphql/mutations";
import { useStaffStore } from "./staffStore";
import useOrderStore from "./orderStore";

interface TableOperationResult {
  success: boolean;
  message: string;
  table: Table | null;
}

interface TableState {
  tables: Table[];
  isLoading: boolean;
  error: string | null;
  currentTable: string | null;
}

interface TableActions {
  fetchTables: () => Promise<void>;
  setCurrentTable: (tableId: string | null) => Promise<TableOperationResult>;
  unlockTable: (tableId: string) => Promise<TableOperationResult>;
  clearError: () => void;
}

type TableStore = TableState & TableActions;

const initialState: TableState = {
  tables: [],
  isLoading: false,
  error: null,
  currentTable: null,
};

export const useTableStore = create<TableStore>((set, get) => ({
  ...initialState,

  fetchTables: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await client.query({
        query: GET_TABLES,
        fetchPolicy: "network-only",
      });
      set({ tables: data.tables, isLoading: false });
    } catch (error) {
      console.error("Error fetching tables:", error);
      set({
        error:
          error instanceof Error ? error.message : "Failed to fetch tables",
        isLoading: false,
      });
    }
  },

  setCurrentTable: async (tableId) => {
    if (!tableId) {
      set({ currentTable: null });
      useOrderStore.getState().clearAllOrders();
      return { success: true, message: "Table selection cleared", table: null };
    }

    try {
      const username = useStaffStore.getState().currentStaff?.username || "";
      const { data } = await client.mutate({
        mutation: LOCK_TABLE,
        variables: { tableId, username },
      });

      if (data?.lockTable?.success) {
        set((state) => ({
          tables: state.tables.map((t) =>
            t._id === tableId ? { ...t, ...data.lockTable.table } : t
          ),
          currentTable: tableId,
        }));
      }
      return data.lockTable;
    } catch (error) {
      console.error("Error locking table:", error);
      set({
        error:
          error instanceof Error
            ? error.message
            : "Failed to lock table. Please try again.",
      });
      return {
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to lock table",
        table: null,
      };
    }
  },

  unlockTable: async (tableId) => {
    try {
      const username = useStaffStore.getState().currentStaff?.username || "";
      const { data } = await client.mutate({
        mutation: UNLOCK_TABLE,
        variables: { tableId, username },
      });

      if (data?.unlockTable?.success) {
        set((state) => ({
          tables: state.tables.map((t) =>
            t._id === tableId ? { ...t, ...data.unlockTable.table } : t
          ),
          currentTable: null,
        }));

        useOrderStore.getState().clearOrder(tableId);
        await get().fetchTables();
      }
      return data.unlockTable;
    } catch (error) {
      console.error("Error unlocking table:", error);
      set({
        error:
          error instanceof Error
            ? error.message
            : "Failed to unlock table. Please try again.",
      });
      return {
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to unlock table",
        table: null,
      };
    }
  },

  clearError: () => set({ error: null }),
}));
