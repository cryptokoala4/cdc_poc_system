import { Bill, OrderItem } from "../types";

interface BillSummaryProps {
  bill: Bill | null;
  currentOrder: OrderItem[];
  onRemoveOrder: (orderId: string) => void;
  onRemoveItem: (itemId: string) => void;
}

const BillSummary = ({
  bill,
  currentOrder,
  onRemoveOrder,
  onRemoveItem,
}: BillSummaryProps) => {
  const currentOrderTotal = currentOrder.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const totalAmount = (bill?.totalAmount || 0) + currentOrderTotal;

  return (
    <div className="bg-gray-800 p-4 rounded-lg text-white">
      <h3 className="font-semibold mb-2 text-xl">Current Bill</h3>
      {bill && <p className="mb-2">Staff: {bill.username}</p>}
      <p className="mb-4 text-lg font-bold">Total: ${totalAmount.toFixed(2)}</p>

      {bill &&
        bill.orders.map((order) => (
          <div key={order._id} className="mb-4 p-3 bg-gray-700 rounded">
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-semibold text-lg">
                Order # {order._id.slice(-8)}
              </h4>
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

      <div className="mt-4 p-3 bg-blue-700 rounded">
        <h4 className="font-semibold text-lg mb-2">
          Current Order {currentOrder.length === 0 ? "(Empty)" : "(Unsaved)"}
        </h4>
        {currentOrder.length > 0 ? (
          <>
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
                  <div>
                    <span className="font-medium mr-2">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                    <button
                      onClick={() => onRemoveItem(item.itemId || item._id)}
                      className="text-red-500 hover:text-red-600 transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                </li>
              ))}
            </ul>
            <p className="mt-3 font-semibold text-right">
              Subtotal: ${currentOrderTotal.toFixed(2)}
            </p>
          </>
        ) : (
          <p className="text-gray-300">No items in the current order.</p>
        )}
      </div>
    </div>
  );
};

export default BillSummary;
