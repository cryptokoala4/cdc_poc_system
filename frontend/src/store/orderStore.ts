import { create } from "zustand";
import { MenuItem } from "../types";
import { calculateTotal } from "../utils/orderUtils";

interface OrderItem extends MenuItem {
  quantity: number;
}

interface OrderState {
  orders: { [tableId: string]: OrderItem[] };
  addOrderItem: (tableId: string, item: MenuItem) => void;
  removeOrderItem: (tableId: string, itemId: string) => void;
  clearOrder: (tableId: string) => void;
  getTotal: (tableId: string) => number;
  getOrderItems: (tableId: string) => OrderItem[];
}

const useOrderStore = create<OrderState>((set, get) => ({
  orders: {},

  addOrderItem: (tableId: string, item: MenuItem) =>
    set((state) => {
      const tableOrder = state.orders[tableId] || [];
      const existingItemIndex = tableOrder.findIndex(
        (orderItem) => orderItem._id === item._id
      );

      let newTableOrder;
      if (existingItemIndex > -1) {
        newTableOrder = tableOrder.map((orderItem, index) =>
          index === existingItemIndex
            ? { ...orderItem, quantity: orderItem.quantity + 1 }
            : orderItem
        );
      } else {
        newTableOrder = [...tableOrder, { ...item, quantity: 1 }];
      }

      return {
        orders: {
          ...state.orders,
          [tableId]: newTableOrder,
        },
      };
    }),

  removeOrderItem: (tableId: string, itemId: string) =>
    set((state) => {
      const tableOrder = state.orders[tableId] || [];
      const newTableOrder = tableOrder
        .map((item) =>
          item._id === itemId ? { ...item, quantity: item.quantity - 1 } : item
        )
        .filter((item) => item.quantity > 0);

      return {
        orders: {
          ...state.orders,
          [tableId]: newTableOrder,
        },
      };
    }),

  clearOrder: (tableId: string) =>
    set((state) => ({
      orders: {
        ...state.orders,
        [tableId]: [],
      },
    })),

  getTotal: (tableId: string) => {
    const state = get();
    const tableOrder = state.orders[tableId] || [];
    return calculateTotal(tableOrder);
  },

  getOrderItems: (tableId: string) => {
    const state = get();
    return state.orders[tableId] || [];
  },
}));

export default useOrderStore;
