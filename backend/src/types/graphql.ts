
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

export interface Bill {
    _id: string;
    createdAt: DateTime;
    finalizedAt?: Nullable<DateTime>;
    isFinalized: boolean;
    items: BillItem[];
    tableNumber: number;
}

export interface BillItem {
    menuItem: MenuItem;
    quantity: number;
}

export interface MenuItem {
    _id: string;
    category: string;
    description: string;
    name: string;
    price: number;
}

export interface IQuery {
    bill(_id: string): Bill | Promise<Bill>;
    bills(): Bill[] | Promise<Bill[]>;
    getAllStaff(): Staff[] | Promise<Staff[]>;
    getStaff(id: string): Nullable<Staff> | Promise<Nullable<Staff>>;
    menuItem(_id: string): Nullable<MenuItem> | Promise<Nullable<MenuItem>>;
    menuItems(): MenuItem[] | Promise<MenuItem[]>;
    table(_id: string): Table | Promise<Table>;
    tables(): Table[] | Promise<Table[]>;
}

export interface Staff {
    _id: string;
    name: string;
    role: string;
}

export interface Table {
    _id: string;
    capacity: number;
    currentBillId?: Nullable<string>;
    isOccupied: boolean;
    number: number;
}

export type DateTime = any;
type Nullable<T> = T | null;
