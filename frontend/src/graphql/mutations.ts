import { gql } from "@apollo/client";

export const LOCK_TABLE = gql`
  mutation LockTable($tableId: ID!, $username: String!) {
    lockTable(tableId: $tableId, username: $username) {
      success
      message
      table {
        _id
        number
        seats
        isOccupied
        currentBillId
        lockedBy
        lockedAt
      }
    }
  }
`;

export const UNLOCK_TABLE = gql`
  mutation UnlockTable($tableId: ID!, $username: String!) {
    unlockTable(tableId: $tableId, username: $username) {
      success
      message
      table {
        _id
        number
        seats
        isOccupied
        currentBillId
        lockedBy
        lockedAt
      }
    }
  }
`;

export const UPDATE_TABLE = gql`
  mutation UpdateTable(
    $_id: ID!
    $isOccupied: Boolean
    $currentBillId: ID
    $customerId: ID
  ) {
    updateTable(
      _id: $_id
      isOccupied: $isOccupied
      currentBillId: $currentBillId
      customerId: $customerId
    ) {
      _id
      number
      seats
      isOccupied
      currentBillId
      customerId
    }
  }
`;

export const CREATE_ORDER = gql`
  mutation CreateOrder(
    $createOrderInput: CreateOrderInput!
    $username: String!
  ) {
    createOrder(createOrderInput: $createOrderInput, username: $username) {
      success
      message
      order {
        _id
        tableId
        username
        items {
          itemId
          quantity
        }
        totalAmount
        status
        createdAt
      }
    }
  }
`;

export const UPDATE_ORDER = gql`
  mutation UpdateOrder($_id: ID!, $updateOrderInput: UpdateOrderInput!) {
    updateOrder(_id: $_id, updateOrderInput: $updateOrderInput) {
      _id
      tableId
      username
      items {
        itemId
        quantity
      }
      totalAmount
      status
      updatedAt
    }
  }
`;

export const CREATE_BILL = gql`
  mutation CreateBill($tableId: ID!, $orderId: ID!, $username: String!) {
    createBill(tableId: $tableId, orderId: $orderId, username: $username) {
      _id
      tableId
      orderId
      username
      totalAmount
      status
      createdAt
    }
  }
`;

export const UPDATE_BILL = gql`
  mutation UpdateBill($_id: ID!, $status: BillStatus!) {
    updateBill(_id: $_id, status: $status) {
      _id
      tableId
      orderId
      username
      totalAmount
      status
      updatedAt
    }
  }
`;
