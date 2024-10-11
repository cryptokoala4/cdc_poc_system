import { MenuItem } from "../types";

export const calculateTotal = (order: (MenuItem & { quantity: number })[]) => {
  return order.reduce((total, item) => {
    return total + (item.price || 0) * (item.quantity || 0);
  }, 0);
};
