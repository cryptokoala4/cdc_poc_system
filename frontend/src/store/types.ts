import { Table, MenuItem, Staff, OrderItem } from '../types';

export type Orders = Record<string, OrderItem[]>;

export interface TableStore {
  tables: Table[];
  isLoading: boolean;
  error: string | null;
  currentTable: string | null;
  fetchTables: () => Promise<void>;
  setCurrentTable: (tableId: string | null) => void;
  unlockTable: (tableId: string) => Promise<void>;
}

export interface MenuStore {
  menuItems: MenuItem[];
  isLoading: boolean;
  error: string | null;
  fetchMenuItems: () => Promise<void>;
}

export interface StaffStore {
  staff: Staff[];
  currentStaff: Staff | null;
  setCurrentStaff: (staff: Staff | null) => void;
}

export interface OrderStore {
  orders: Orders;
  addOrderItem: (tableId: string, item: OrderItem) => void;
  removeOrderItem: (tableId: string, itemId: string) => void;
  setOrders: (orders: Orders) => void;
}

export interface AppStore extends TableStore, MenuStore, StaffStore, OrderStore {}