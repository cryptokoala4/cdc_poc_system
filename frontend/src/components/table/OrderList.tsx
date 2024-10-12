import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { OrderItem } from "../../types";

interface OrderListProps {
  order: OrderItem[];
  onRemoveItem: (itemId: string) => void;
  total: number;
}

const OrderList: React.FC<OrderListProps> = ({
  order,
  onRemoveItem,
  total,
}) => {
  if (order.length === 0) {
    return <p className="text-gray-400 p-4">No items in the current order.</p>;
  }

  return (
    <div className="bg-gray-700 rounded-lg p-4">
      <AnimatePresence>
        {order.map((item, index) => (
          <motion.div
            key={`${item.itemId || item._id || index}`}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="flex justify-between items-center mb-2"
          >
            <span className="text-white">
              {item.name || `Item ${item.itemId || index + 1}`} x{item.quantity}
            </span>
            <div className="flex items-center">
              <span className="text-green-500 mr-2">
                ${(item.price * item.quantity).toFixed(2)}
              </span>
              <button
                onClick={() => onRemoveItem(item.itemId || item._id)}
                className="text-red-500 hover:text-red-600 transition-colors"
              >
                Remove
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
      <div className="mt-4 pt-2 border-t border-gray-600">
        <div className="flex justify-between items-center">
          <span className="text-white font-bold">Total:</span>
          <span className="text-green-500 font-bold">${total.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};

export default OrderList;
