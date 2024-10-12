import { gql } from "@apollo/client";

export const GET_MENU_ITEMS = gql`
  query GetMenuItems {
    menuItems {
      _id
      name
      description
      price
      category
    }
  }
`;

export const GET_STAFF = gql`
  query GetStaff {
    staff {
      _id
      name
      username
      role
    }
  }
`;

export const GET_TABLES = gql`
  query GetTables {
    tables {
      _id
      number
      seats
      isOccupied
      currentBillId
      lockedBy
      lockedAt
    }
  }
`;

export const GET_TABLE = gql`
  query GetTable($id: ID!) {
    table(id: $id) {
      _id
      number
      seats
      isOccupied
      currentBillId
      lockedBy
      lockedAt
    }
  }
`;

export const GET_CURRENT_BILL = gql`
  query GetCurrentBill($tableId: ID) {
    getCurrentBillForTable(tableId: $tableId) {
      _id
      tableId
      username
      orders {
        _id
        items {
          itemId
          quantity
          price
        }
        totalAmount
      }
      totalAmount
      status
    }
  }
`;

export const GET_CURRENT_ORDER = gql`
  query GetCurrentOrder($billId: ID!) {
    bill(id: $billId) {
      _id
      totalAmount
      status
      orders {
        _id
        items {
          _id
          name
          price
          quantity
        }
        totalAmount
        status
      }
    }
  }
`;
