
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

export interface CreateBillDto {
    orderItems: OrderItemInput[];
    tableId: string;
    username: string;
}

export interface CreateOrderInput {
    items: OrderItemInput[];
    tableId: string;
    totalAmount?: Nullable<number>;
    username: string;
}

export interface OrderItemInput {
    itemId: string;
    quantity: number;
}

export interface UpdateBillDto {
    orderId?: Nullable<string>;
    paidAt?: Nullable<DateTime>;
    paymentMethod?: Nullable<string>;
    status?: Nullable<string>;
    totalAmount?: Nullable<number>;
}

export interface UpdateOrderDto {
    items?: Nullable<OrderItemInput[]>;
    status?: Nullable<string>;
    totalAmount?: Nullable<number>;
}

export interface Bill {
    _id: string;
    createdAt: DateTime;
    orderIds: string[];
    orderItems: OrderItem[];
    paidAt?: Nullable<DateTime>;
    paymentMethod?: Nullable<string>;
    status: string;
    tableId: string;
    totalAmount: number;
    updatedAt: DateTime;
    username: string;
}

export interface BillOperationResult {
    bill?: Nullable<Bill>;
    message: string;
    success: boolean;
}

export interface MenuItem {
    _id: string;
    category: string;
    createdAt: DateTime;
    description: string;
    name: string;
    price: number;
    updatedAt: DateTime;
}

export interface MenuItemOperationResult {
    menuItem?: Nullable<MenuItem>;
    message: string;
    success: boolean;
}

export interface IMutation {
    closeOrder(id: string): OrderOperationResult | Promise<OrderOperationResult>;
    createBill(createBillInput: CreateBillDto): BillOperationResult | Promise<BillOperationResult>;
    createOrder(createOrderInput: CreateOrderInput, username: string): OrderOperationResult | Promise<OrderOperationResult>;
    deleteBill(id: string): BillOperationResult | Promise<BillOperationResult>;
    lockTable(tableId: string, username: string): TableOperationResult | Promise<TableOperationResult>;
    settleBill(id: string): BillOperationResult | Promise<BillOperationResult>;
    unlockTable(tableId: string, username: string): TableOperationResult | Promise<TableOperationResult>;
    updateBill(id: string, updateBillInput: UpdateBillDto): BillOperationResult | Promise<BillOperationResult>;
    updateOrder(id: string, updateOrderDto: UpdateOrderDto): OrderOperationResult | Promise<OrderOperationResult>;
}

export interface Order {
    _id: string;
    createdAt: DateTime;
    items: OrderItem[];
    status: string;
    tableId: string;
    totalAmount: number;
    updatedAt: DateTime;
    username: string;
}

export interface OrderItem {
    itemId: string;
    quantity: number;
}

export interface OrderOperationResult {
    message: string;
    order?: Nullable<Order>;
    success: boolean;
}

export interface IQuery {
    bill(id: string): BillOperationResult | Promise<BillOperationResult>;
    bills(): Bill[] | Promise<Bill[]>;
    getAllStaff(): Staff[] | Promise<Staff[]>;
    getStaff(id: string): StaffOperationResult | Promise<StaffOperationResult>;
    menuItem(id: string): MenuItemOperationResult | Promise<MenuItemOperationResult>;
    menuItems(): MenuItem[] | Promise<MenuItem[]>;
    order(id: string): OrderOperationResult | Promise<OrderOperationResult>;
    orders(): Order[] | Promise<Order[]>;
    table(id: string): Table | Promise<Table>;
    tables(): Table[] | Promise<Table[]>;
}

export interface Staff {
    _id: string;
    name: string;
    role: string;
    username: string;
}

export interface StaffOperationResult {
    message: string;
    staff?: Nullable<Staff>;
    success: boolean;
}

export interface Table {
    _id: string;
    currentBillId?: Nullable<string>;
    isOccupied: boolean;
    lockedAt?: Nullable<DateTime>;
    lockedBy?: Nullable<string>;
    number: number;
    seats: number;
}

export interface TableOperationResult {
    message: string;
    success: boolean;
    table?: Nullable<Table>;
}

export type DateTime = any;
type Nullable<T> = T | null;
