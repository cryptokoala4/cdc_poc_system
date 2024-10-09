import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MenuItem } from '../models/menu-item.model';

@Injectable()
export class MenuItemsService {
  constructor(
    @InjectModel('MenuItem') private menuItemModel: Model<MenuItem>,
  ) {}

  async findAll(): Promise<MenuItem[]> {
    return this.menuItemModel.find().exec();
  }
}
