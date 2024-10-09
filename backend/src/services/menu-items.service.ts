import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MenuItem } from '../entities/menu-item.entity';
import { CreateMenuItemInput } from '../dto/create-menu-item.input';
import { UpdateMenuItemInput } from '../dto/update-menu-item.input';

@Injectable()
export class MenuItemsService {
  constructor(
    @InjectModel(MenuItem.name) private menuItemModel: Model<MenuItem>,
  ) {}

  async create(createMenuItemInput: CreateMenuItemInput): Promise<MenuItem> {
    const createdMenuItem = new this.menuItemModel(createMenuItemInput);
    return createdMenuItem.save();
  }

  async findAll(): Promise<MenuItem[]> {
    return this.menuItemModel.find().exec();
  }

  async findOne(_id: string): Promise<MenuItem> {
    return this.menuItemModel.findById(_id).exec();
  }

  async update(
    _id: string,
    updateMenuItemInput: UpdateMenuItemInput,
  ): Promise<MenuItem> {
    return this.menuItemModel
      .findByIdAndUpdate(_id, updateMenuItemInput, { new: true })
      .exec();
  }

  async remove(_id: string): Promise<MenuItem> {
    const deletedItem = await this.menuItemModel.findByIdAndDelete(_id).exec();
    return deletedItem;
  }
}
