export type TableStatus = 'available' | 'locked';

export interface Table {
  _id: string;
  number: number;
  capacity: number;
  isOccupied: boolean;
  currentBillId: string | null;
  customerId: string | null;
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
  _id: number;
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
  createdAt: Date;
  updatedAt: Date;
}