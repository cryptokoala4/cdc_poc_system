import { Model } from 'mongoose';
import { MenuItem, MenuItemDocument } from '../entities/menu-item.entity';

const MENU_ITEMS: Partial<MenuItem>[] = [
  {
    name: 'Tonkatsu',
    description: 'Golden-crusted pork perfection with savory crunch',
    price: 15.99,
    category: 'Main',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/Tonkatsu_of_Kimukatsu.jpg/500px-Tonkatsu_of_Kimukatsu.jpg',
  },
  {
    name: 'Sushi Platter',
    description: "Ocean's finest treasures on artisanal rice beds",
    price: 22.99,
    category: 'Main',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/6/64/Hiroshige_Bowl_of_Sushi.jpg',
  },
  {
    name: 'Ramen',
    description: 'Silky noodles swimming in umami-rich broth bliss',
    price: 14.99,
    category: 'Main',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/4/42/The_Japanese-style_Chinese_noodle_RAMEN_of_the_restaurant_RAIRAIKEN_at_Yutenji_Tokyo.jpg',
  },
  {
    name: 'Teriyaki Salmon',
    description: 'Flame-kissed salmon glazed in sweet harmony',
    price: 18.99,
    category: 'Main',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/4/40/Salmon_Teriyaki_at_restaurant_Same_Same_But_Different.jpg',
  },
  {
    name: 'Edamame',
    description: 'Jade pods of wholesome, salty delight',
    price: 5.99,
    category: 'Appetizer',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/e/e7/Edamame_by_Zesmerelda_in_Chicago.jpg',
  },
  {
    name: 'Gyoza',
    description: 'Crispy-bottomed pockets of savory joy',
    price: 7.99,
    category: 'Appetizer',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/e/ed/Noodlecat_-_Lee_Anne_Wong_-_%22Lucky_Dumpring_Jiao_Zi%22_%286739677033%29.jpg',
  },
  {
    name: 'Mochi Ice Cream',
    description: 'Pillowy delights encasing frosty flavor explosions',
    price: 6.99,
    category: 'Dessert',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/3/3c/Li-Hing_mango_mochi_ice_cream_%286825643734%29.jpg',
  },
  {
    name: 'Matcha Cheesecake',
    description: 'Velvety green tea indulgence on buttery base',
    price: 8.99,
    category: 'Dessert',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/2/25/Matcha_and_Redbean_Cake.jpg',
  },
  {
    name: 'Sake',
    description: 'Ancient rice elixir with modern soul',
    price: 9.99,
    category: 'Alcohol',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/b/b8/Unfiltered_Sake_at_Gyu-Kaku.jpg',
  },
  {
    name: 'Asahi Beer',
    description: 'Crisp, golden nectar of Japanese refreshment',
    price: 7.99,
    category: 'Alcohol',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/9/9b/Asahi_001.JPG',
  },
];

export async function seedMenuItems(
  menuItemModel: Model<MenuItemDocument>,
): Promise<void> {
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
    throw error;
  }
}
