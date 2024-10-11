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
  mutation UpdateTable($_id: ID!, $isOccupied: Boolean, $currentBillId: ID) {
    updateTable(
      _id: $_id
      isOccupied: $isOccupied
      currentBillId: $currentBillId
    ) {
      success
      message
      table {
        _id
        number
        seats
        isOccupied
        currentBillId
      }
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
      }
    }
  }
`;

export const UPDATE_ORDER = gql`
  mutation UpdateOrder($_id: ID!, $updateOrderDto: UpdateOrderDto!) {
    updateOrder(_id: $_id, updateOrderDto: $updateOrderDto) {
      success
      message
      order {
        _id
        tableId
        username
        items {
          itemId
          quantity
          price
        }
        totalAmount
        status
      }
    }
  }
`;

export const CREATE_BILL = gql`
  mutation CreateBill($createBillInput: CreateBillDto!) {
    createBill(createBillInput: $createBillInput) {
      success
      message
      bill {
        _id
        tableId
        username
        totalAmount
        status
      }
    }
  }
`;

export const UPDATE_BILL = gql`
  mutation UpdateBill($id: ID!, $updateBillInput: UpdateBillDto!) {
    updateBill(id: $id, updateBillInput: $updateBillInput) {
      success
      message
      bill {
        _id
        tableId
        orderIds
        username
        totalAmount
        status
      }
    }
  }
`;

export const REMOVE_ORDER_FROM_BILL = gql`
  mutation RemoveOrderFromBill($billId: ID!, $orderId: ID!) {
    removeOrderFromBill(billId: $billId, orderId: $orderId) {
      success
      message
      bill {
        _id
        orderIds
        totalAmount
      }
    }
  }
`;

export const SETTLE_BILL = gql`
  mutation SettleBill($id: ID!) {
    settleBill(id: $id) {
      success
      message
      bill {
        _id
        status
        # paidAt
      }
    }
  }
`;
