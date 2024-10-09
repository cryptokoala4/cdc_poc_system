
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

export interface CreateMenuItemInput {
    description: string;
    name: string;
    price: number;
}

export interface UpdateMenuItemInput {
    _id: string;
    description?: Nullable<string>;
    name?: Nullable<string>;
    price?: Nullable<number>;
}

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
    description: string;
    name: string;
    price: number;
}

export interface IMutation {
    createMenuItem(createMenuItemInput: CreateMenuItemInput): MenuItem | Promise<MenuItem>;
    removeMenuItem(_id: string): MenuItem | Promise<MenuItem>;
    updateMenuItem(updateMenuItemInput: UpdateMenuItemInput): MenuItem | Promise<MenuItem>;
}

export interface IQuery {
    bill(_id: string): Bill | Promise<Bill>;
    bills(): Bill[] | Promise<Bill[]>;
    menuItem(_id: string): MenuItem | Promise<MenuItem>;
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
