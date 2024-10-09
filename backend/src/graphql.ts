
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

export interface MenuItem {
    id: string;
    name: string;
    price: number;
    description?: Nullable<string>;
}

export interface BillItem {
    menuItem: MenuItem;
    quantity: number;
}

export interface Bill {
    id: string;
    items: BillItem[];
    totalAmount: number;
    tableNumber: number;
    createdAt: DateTime;
    paidAt?: Nullable<DateTime>;
}

export interface Table {
    id: string;
    tableNumber: number;
    capacity: number;
    isOccupied: boolean;
    currentBillId?: Nullable<string>;
}

export interface IQuery {
    getMenuItems(): MenuItem[] | Promise<MenuItem[]>;
    bills(): Bill[] | Promise<Bill[]>;
    bill(id: string): Bill | Promise<Bill>;
    tables(): Table[] | Promise<Table[]>;
    table(id: string): Table | Promise<Table>;
}

export type DateTime = any;
type Nullable<T> = T | null;
