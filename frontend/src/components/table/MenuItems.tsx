import { MenuItem } from "../../types";

interface MenuItemsProps {
  menuItems: MenuItem[];
  onAddItem: (item: MenuItem) => void;
}

const MenuItems = ({ menuItems, onAddItem }: MenuItemsProps) => {
  return (
    <section className="mb-6">
      <h3 className="text-xl font-semibold mb-2 text-white">Menu Items</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {menuItems.map((item) => (
          <button
            key={item._id}
            onClick={() => onAddItem(item)}
            className="bg-gray-700 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded w-42 h-24 flex flex-col items-center justify-center text-center transition-colors duration-200"
          >
            <span className="text-sm mb-2">{item.name}</span>
            <span className="text-lg">${item.price.toFixed(2)}</span>
          </button>
        ))}
      </div>
    </section>
  );
};

export default MenuItems;