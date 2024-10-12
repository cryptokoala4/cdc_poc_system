import { OrderItem } from "../types";

export const calculateTotal = (order: (OrderItem & { quantity: number })[]) => {
  return order.reduce((total, item) => {
    return total + (item.price || 0) * (item.quantity || 0);
  }, 0);
};
