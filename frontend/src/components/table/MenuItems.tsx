import { motion } from "framer-motion";
import { MenuItem } from "../../types";

interface MenuItemsProps {
  menuItems: MenuItem[];
  onAddItem: (item: MenuItem) => void;
}

const MenuItems = ({ menuItems, onAddItem }: MenuItemsProps) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
      {menuItems.map((item) => (
        <motion.div
          key={item._id}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-gray-800 p-4 rounded-lg shadow-md cursor-pointer"
          onClick={() => onAddItem(item)}
        >
          <h3 className="text-lg font-semibold text-white mb-2">{item.name}</h3>
          <p className="text-gray-400 mb-2">{item.description}</p>
          <p className="text-green-500 font-bold">${item.price.toFixed(2)}</p>
        </motion.div>
      ))}
    </div>
  );
};

export default MenuItems;
