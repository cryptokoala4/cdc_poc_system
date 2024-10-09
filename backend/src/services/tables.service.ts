import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Table, TableDocument } from '../entities/table.entity';

@Injectable()
export class TablesService {
  constructor(
    @InjectModel(Table.name) private tableModel: Model<TableDocument>,
  ) {}

  async findAll(): Promise<Table[]> {
    return this.tableModel.find().exec();
  }

  async findOne(_id: string): Promise<Table> {
    return this.tableModel.findById(_id).exec();
  }
}
