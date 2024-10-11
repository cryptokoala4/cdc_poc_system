import { create } from "zustand";
import { Table } from "../types";
import { client } from "../lib/apolloClient";
import { GET_TABLES } from "../graphql/queries";
import { LOCK_TABLE, UNLOCK_TABLE } from "../graphql/mutations";
import { useStaffStore } from "./staffStore";

interface TableStore {
  tables: Table[];
  isLoading: boolean;
  error: string | null;
  currentTable: string | null;
  fetchTables: () => Promise<void>;
  setCurrentTable: (tableId: string | null) => Promise<void>;
  unlockTable: (tableId: string) => Promise<void>;
  clearError: () => void;
}

export const useTableStore = create<TableStore>((set, get) => ({
  tables: [],
  isLoading: false,
  error: null,
  currentTable: null,

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
    if (tableId) {
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
        } else {
          throw new Error(
            data?.lockTable?.message || "Server couldn't lock the table"
          );
        }
      } catch (error) {
        console.error("Error locking table:", error);
        set({
          error:
            error instanceof Error
              ? error.message
              : "Failed to lock table. Please try again.",
        });
      }
    } else {
      set({ currentTable: null });
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

        await get().fetchTables();
      } else {
        throw new Error(
          data?.unlockTable?.message || "Server couldn't unlock the table"
        );
      }
    } catch (error) {
      console.error("Error unlocking table:", error);
      set({
        error:
          error instanceof Error
            ? error.message
            : "Failed to unlock table. Please try again.",
      });
    }
  },

  clearError: () => set({ error: null }),
}));
