import { motion } from "framer-motion";
import { MenuItem } from "../../types";
import Image from "next/image";

interface MenuItemsProps {
  menuItems: MenuItem[];
  onAddItem: (item: MenuItem) => void;
}

const MenuItems = ({ menuItems, onAddItem }: MenuItemsProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
      {menuItems.map((item) => (
        <motion.div
          key={item._id}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-gray-800 rounded-lg shadow-md cursor-pointer overflow-hidden flex flex-col"
          onClick={() => onAddItem(item)}
        >
          <div className="relative h-32 sm:h-36">
            <Image
              src={item.imageUrl}
              alt={item.name}
              layout="fill"
              objectFit="cover"
            />
          </div>
          <div className="p-2 flex flex-col flex-grow">
            <h3 className="text-sm sm:text-base font-semibold text-white mb-1 truncate">
              {item.name}
            </h3>
            <p className="text-gray-400 text-xs sm:text-sm mb-2 flex-grow line-clamp-2">
              {item.description}
            </p>
            <p className="text-green-500 font-bold text-base sm:text-lg">
              ${item.price.toFixed(2)}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default MenuItems;
