import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MenuItem, MenuItemDocument } from '../entities/menu-item.entity';

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
}
