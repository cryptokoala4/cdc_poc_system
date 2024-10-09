
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
    name: string;
    price: number;
}

export interface IQuery {
    bill(_id: string): Bill | Promise<Bill>;
    bills(): Bill[] | Promise<Bill[]>;
    menuItem(_id: string): Nullable<MenuItem> | Promise<Nullable<MenuItem>>;
    menuItems(): MenuItem[] | Promise<MenuItem[]>;
    table(_id: string): Table | Promise<Table>;
    tables(): Table[] | Promise<Table[]>;
}

export interface Table {
    _id: string;
    currentBill?: Nullable<Bill>;
    isOccupied: boolean;
    number: number;
}

export type DateTime = any;
type Nullable<T> = T | null;
