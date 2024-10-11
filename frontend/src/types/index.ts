export type TableStatus = 'available' | 'locked';

export interface Table {
  _id: string;
  number: number;
  seats: number;
  isOccupied: boolean;
  currentBillId: string | null;
  lockedBy: string;
}

export interface MenuItem {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
}

export interface Staff {
  _id: string;
  name: string;
  username: string;
  role: string;
}

export interface OrderItem {
  _id: string;
  itemId?: number;
  name: string;
  price: number;
  quantity: number;
}

export interface Order {
  _id: string;
  tableId: string;
  items: OrderItem[];
  totalAmount: number;
  status: 'pending' | 'completed' | 'cancelled';
}

export interface Bill {
  _id: number;
  tableId: string;
  username: string;
  orders: Order[];
  totalAmount: number;
  status: string;
}