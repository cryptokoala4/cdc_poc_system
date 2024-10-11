import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { MenuItem, MenuItemDocument } from '../entities/menu-item.entity';
import { ServiceResponse } from '../interfaces/service-response.interface';

@Injectable()
export class MenuItemsService {
  constructor(
    @InjectModel(MenuItem.name) private menuItemModel: Model<MenuItemDocument>,
  ) {}

  async findAll(): Promise<ServiceResponse<MenuItem[]>> {
    try {
      const menuItems = await this.menuItemModel.find().exec();
      return {
        success: true,
        message: 'Menu items retrieved successfully',
        data: menuItems,
      };
    } catch {
      return {
        success: false,
        message: 'Error retrieving menu items',
        data: [],
      };
    }
  }

  async findOne(_id: string): Promise<ServiceResponse<MenuItem | null>> {
    try {
      const menuItem = await this.menuItemModel
        .findById(new Types.ObjectId(_id))
        .exec();
      if (!menuItem) {
        return {
          success: false,
          message: `Menu item with ID ${_id} not found`,
          data: null,
        };
      }
      return {
        success: true,
        message: 'Menu item found successfully',
        data: menuItem,
      };
    } catch {
      return {
        success: false,
        message: `Error finding menu item with ID ${_id}`,
        data: null,
      };
    }
  }
}
