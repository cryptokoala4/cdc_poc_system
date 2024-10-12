import React from "react";
import { Bill, OrderItem } from "../types";

interface BillSummaryProps {
  bill: Bill;
  currentOrder: OrderItem[];
  onRemoveOrder: (orderId: string) => void;
}

const BillSummary: React.FC<BillSummaryProps> = ({
  bill,
  currentOrder,
  onRemoveOrder,
}) => {
  const currentOrderTotal = currentOrder.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const totalAmount = bill.totalAmount + currentOrderTotal;

  return (
    <div className="mb-4 bg-gray-800 p-4 rounded-lg text-white">
      <h3 className="font-semibold mb-2 text-xl">Current Bill</h3>
      <p className="mb-2">Staff: {bill.username}</p>
      <p className="mb-4 text-lg font-bold">Total: ${totalAmount.toFixed(2)}</p>

      {bill.orders.map((order) => (
        <div key={order._id} className="mb-4 p-3 bg-gray-700 rounded">
          <div className="flex justify-between items-center mb-2">
            <h4 className="font-semibold text-lg">
              Order {order._id.slice(-4)}
            </h4>
            <span className="text-sm">Staff: {order.username}</span>
          </div>
          <ul className="mt-2 space-y-1">
            {order.items.map((item) => (
              <li
                key={item.itemId}
                className="flex justify-between items-center"
              >
                <span>
                  {item.name} x {item.quantity}
                </span>
                <span className="font-medium">
                  ${(item.price * item.quantity).toFixed(2)}
                </span>
              </li>
            ))}
          </ul>
          <div className="mt-3 flex justify-between items-center">
            <span className="font-medium">
              Order Total: ${order.totalAmount.toFixed(2)}
            </span>
            <button
              onClick={() => onRemoveOrder(order._id)}
              className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
            >
              Remove Order
            </button>
          </div>
        </div>
      ))}

      {currentOrder.length > 0 && (
        <div className="mt-4 p-3 bg-blue-700 rounded">
          <h4 className="font-semibold text-lg mb-2">
            Current Order (Unsaved)
          </h4>
          <ul className="space-y-1">
            {currentOrder.map((item, index) => (
              <li
                key={`${item.itemId || item._id}-${index}`}
                className="flex justify-between items-center"
              >
                <span>
                  {item.name || `Item ${item.itemId || index + 1}`} x{" "}
                  {item.quantity}
                </span>
                <span className="font-medium">
                  ${(item.price * item.quantity).toFixed(2)}
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-3 font-semibold text-right">
            Subtotal: ${currentOrderTotal.toFixed(2)}
          </p>
        </div>
      )}
    </div>
  );
};

export default BillSummary;
