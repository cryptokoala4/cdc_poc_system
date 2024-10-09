import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MenuItem, MenuItemDocument } from '../entities/menu-item.entity';

export const MENU_ITEMS: MenuItem[] = [
  { _id: '1', name: 'Sushi', price: 12 },
  { _id: '2', name: 'Ramen', price: 10 },
  { _id: '3', name: 'Tempura', price: 8 },
  { _id: '4', name: 'Takoyaki', price: 6 },
  { _id: '5', name: 'Udon', price: 9 },
  { _id: '6', name: 'Sashimi', price: 15 },
  { _id: '7', name: 'Onigiri', price: 4 },
  { _id: '8', name: 'Miso Soup', price: 3 },
  { _id: '9', name: 'Yakitori', price: 7 },
  { _id: '10', name: 'Matcha Ice Cream', price: 5 },
];

@Injectable()
export class MenuItemsService {
  constructor(
    @InjectModel('MenuItem') private menuItemModel: Model<MenuItemDocument>,
  ) {}

  async findAll(): Promise<MenuItem[]> {
    return this.menuItemModel.find().exec();
  }

  async findOne(_id: string): Promise<MenuItem | null> {
    return this.menuItemModel.findOne({ _id }).exec();
  }

  async seedInitialData() {
    try {
      console.log('Starting seed process...');
      const count = await this.menuItemModel.countDocuments();
      console.log(`Current document count: ${count}`);

      if (count === 0) {
        console.log('Collection is empty, seeding data...');
        const result = await this.menuItemModel.insertMany(MENU_ITEMS);
        console.log(`Seeded ${result.length} menu items`);
        console.log('First seeded item:', result[0]);
      } else {
        console.log('Menu items already exist, skipping seed');
        const firstItem = await this.menuItemModel.findOne();
        console.log('First existing item:', firstItem);
      }
    } catch (error) {
      console.error('Error during seeding:', error);
    }
  }
}
