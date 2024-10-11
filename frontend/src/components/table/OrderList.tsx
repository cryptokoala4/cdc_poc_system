import { motion, AnimatePresence } from "framer-motion";
import { MenuItem } from "../../types";

interface OrderListProps {
  order: MenuItem[];
  onRemoveItem: (itemId: string) => void;
  total: number;
}

const OrderList = ({ order, onRemoveItem, total }: OrderListProps) => {
  return (
    <div className="bg-gray-700 rounded-lg p-4">
      <AnimatePresence>
        {order.map((item) => (
          <motion.div
            key={item._id}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="flex justify-between items-center mb-2"
          >
            <span className="text-white">
              {item.name} x{item.quantity}
            </span>
            <div className="flex items-center">
              <span className="text-green-500 mr-2">
                ${(item.price * item.quantity).toFixed(2)}
              </span>
              <button
                onClick={() => onRemoveItem(item._id)}
                className="text-red-500 hover:text-red-600"
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
