import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Table, TableDocument } from '../entities/table.entity';
import { ServiceResponse } from '../interfaces/service-response.interface';

@Injectable()
export class TablesService {
  constructor(
    @InjectModel(Table.name) private tableModel: Model<TableDocument>,
  ) {}

  async findAll(): Promise<ServiceResponse<Table[]>> {
    const tables = await this.tableModel.find().exec();
    return {
      success: true,
      message: 'Tables retrieved successfully',
      data: tables,
    };
  }

  async findOne(_id: string): Promise<ServiceResponse<Table>> {
    const table = await this.tableModel
      .findById(new Types.ObjectId(_id))
      .exec();
    if (!table) {
      throw new NotFoundException(`Table with ID ${_id} not found`);
    }
    return {
      success: true,
      message: `Table ${table.number} found successfully`,
      data: table,
    };
  }

  async lockTable(
    tableId: string,
    customerId: string,
  ): Promise<ServiceResponse<Table>> {
    const table = await this.tableModel
      .findById(new Types.ObjectId(tableId))
      .exec();

    if (!table) {
      throw new NotFoundException(`Table with ID ${tableId} not found`);
    }

    if (table.isOccupied) {
      return {
        success: false,
        message: `Table ${table.number} is already occupied`,
        data: table,
      };
    }

    table.isOccupied = true;
    table.customerId = customerId;
    const updatedTable = await table.save();

    return {
      success: true,
      message: `Table ${table.number} has been successfully locked and assigned to a customer`,
      data: updatedTable,
    };
  }

  async unlockTable(tableId: string): Promise<ServiceResponse<Table>> {
    const table = await this.tableModel
      .findById(new Types.ObjectId(tableId))
      .exec();

    if (!table) {
      throw new NotFoundException(`Table with ID ${tableId} not found`);
    }

    const updatedTable = await this.tableModel
      .findOneAndUpdate(
        { _id: new Types.ObjectId(tableId) },
        { isOccupied: false, customerId: null, currentBillId: null },
        { new: true },
      )
      .exec();

    return {
      success: true,
      message: `Table ${table.number} has been successfully unlocked`,
      data: updatedTable,
    };
  }
}
