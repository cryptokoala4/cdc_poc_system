import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Table } from '../models/table.model';

@Injectable()
export class TablesService {
  constructor(@InjectModel('Table') private tableModel: Model<Table>) {}

  async findAll(): Promise<Table[]> {
    return this.tableModel.find().exec();
  }

  async findOne(id: string): Promise<Table> {
    return this.tableModel.findById(id).exec();
  }
}
