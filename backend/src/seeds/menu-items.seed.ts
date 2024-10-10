import { Model } from 'mongoose';
import { MenuItem, MenuItemDocument } from '../entities/menu-item.entity';

const MENU_ITEMS: Partial<MenuItem>[] = [
  // Main dishes
  {
    name: 'Tonkatsu',
    description: 'Deep-fried breaded pork cutlet',
    price: 15.99,
    category: 'Main',
  },
  {
    name: 'Sushi Platter',
    description: 'Assorted sushi rolls and nigiri',
    price: 22.99,
    category: 'Main',
  },
  {
    name: 'Ramen',
    description: 'Noodle soup with pork, egg, and vegetables',
    price: 14.99,
    category: 'Main',
  },
  {
    name: 'Teriyaki Salmon',
    description: 'Grilled salmon with teriyaki sauce',
    price: 18.99,
    category: 'Main',
  },

  // Appetizers
  {
    name: 'Edamame',
    description: 'Steamed soybeans with sea salt',
    price: 5.99,
    category: 'Appetizer',
  },
  {
    name: 'Gyoza',
    description: 'Pan-fried dumplings filled with pork and vegetables',
    price: 7.99,
    category: 'Appetizer',
  },

  // Desserts
  {
    name: 'Mochi Ice Cream',
    description: 'Assorted flavors of ice cream wrapped in mochi',
    price: 6.99,
    category: 'Dessert',
  },
  {
    name: 'Matcha Cheesecake',
    description: 'Green tea flavored cheesecake',
    price: 8.99,
    category: 'Dessert',
  },

  // Alcoholic drinks
  {
    name: 'Sake',
    description: 'Traditional Japanese rice wine',
    price: 9.99,
    category: 'Alcohol',
  },
  {
    name: 'Asahi Beer',
    description: 'Japanese lager beer',
    price: 7.99,
    category: 'Alcohol',
  },
];

export async function seedMenuItems(menuItemModel: Model<MenuItemDocument>) {
  try {
    console.log('Starting menu seed process...');
    const count = await menuItemModel.countDocuments();
    console.log(`Current menu item count: ${count}`);

    if (count === 0) {
      console.log('Menu collection is empty, seeding data...');
      await menuItemModel.insertMany(MENU_ITEMS);
      console.log(`Seeded ${MENU_ITEMS.length} menu items`);
    } else {
      console.log('Menu items already exist, skipping seed');
    }
  } catch (error) {
    console.error('Error during menu seeding:', error);
  }
}
