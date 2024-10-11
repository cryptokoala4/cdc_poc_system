import { Bill } from '../types';

interface BillSummaryProps {
  bill: Bill;
  onRemoveOrder: (orderId: string) => void;
}

const BillSummary = ({ bill, onRemoveOrder }: BillSummaryProps) => {
  return (
    <div className="mb-4">
      <h3 className=" font-semibold mb-2">Current Bill</h3>
      <p className="mb-2">Total: ${bill.totalAmount.toFixed(2)}</p>
      {bill.orders.map((order) => (
        <div key={order._id} className="mb-2 p-2 bg-gray-700 rounded">
          <h4 className="font-semibold">Order {order._id}</h4>
          <ul>
            {order.items.map((item) => (
              <li key={item.itemId}>
                {item.itemId} x {item.quantity} - ${(item.price * item.quantity).toFixed(2)}
              </li>
            ))}
          </ul>
          <button
            onClick={() => onRemoveOrder(order._id)}
            className="mt-2 px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Remove Order
          </button>
        </div>
      ))}
    </div>
  );
};

export default BillSummary;