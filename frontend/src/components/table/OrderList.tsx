import { OrderItem } from "../../types";

interface OrderListProps {
  order: OrderItem[];
  onRemoveItem: (itemId: string) => void;
  total: number;
}

const OrderList = ({ order, onRemoveItem, total }: OrderListProps) => {
  return (
    <section className="mb-6 text-white">
      <h3 className="text-xl font-semibold mb-2">Current Order</h3>
      {order.length === 0 ? (
        <p className="text-gray-400">No items in the order yet.</p>
      ) : (
        <>
          <ul className="space-y-2 mb-4">
            {order.map((item) => (
              <li key={item._id.toString()} className="flex justify-between items-center">
                <span>
                  {item.name} x {item.quantity} - $
                  {(item.price * item.quantity).toFixed(2)}
                </span>
                <button
                  onClick={() => onRemoveItem(item._id.toString())}
                  className="text-red-500 hover:text-red-700"
                  aria-label={`Remove ${item.name} from order`}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
          <p className="text-xl font-bold">Total: ${total.toFixed(2)}</p>
        </>
      )}
    </section>
  );
};

export default OrderList;