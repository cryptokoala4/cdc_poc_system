import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Table, TableDocument } from '../entities/table.entity';
import { ServiceResponse } from 'src/interfaces/service-response.interface';

@Injectable()
export class TablesService {
  constructor(
    @InjectModel(Table.name) private tableModel: Model<TableDocument>,
  ) {}

  async getTableStatus(
    tableId: string,
  ): Promise<ServiceResponse<Table | null>> {
    try {
      const table = await this.tableModel.findById(tableId).exec();
      if (!table) {
        return {
          success: false,
          message: `Table with ID ${tableId} not found`,
          data: null,
        };
      }
      return {
        success: true,
        message: 'Table status retrieved successfully',
        data: table,
      };
    } catch (error) {
      return {
        success: false,
        message: `Error retrieving table status: ${error.message}`,
        data: null,
      };
    }
  }

  async findAll(): Promise<ServiceResponse<Table[]>> {
    try {
      const tables = await this.tableModel.find().exec();
      return {
        success: true,
        message: 'All tables retrieved successfully',
        data: tables,
      };
    } catch (error) {
      return {
        success: false,
        message: `Error retrieving tables: ${error.message}`,
        data: [],
      };
    }
  }

  async findOne(_id: string): Promise<ServiceResponse<Table | null>> {
    try {
      const table = await this.tableModel
        .findById(new Types.ObjectId(_id))
        .exec();
      if (!table) {
        return {
          success: false,
          message: `Table with ID ${_id} not found`,
          data: null,
        };
      }
      return {
        success: true,
        message: 'Table found successfully',
        data: table,
      };
    } catch (error) {
      return {
        success: false,
        message: `Error finding table: ${error.message}`,
        data: null,
      };
    }
  }

  async lockTable(
    tableId: string,
    username: string,
  ): Promise<ServiceResponse<Table | null>> {
    try {
      const table = await this.tableModel
        .findById(new Types.ObjectId(tableId))
        .exec();
      if (!table) {
        return {
          success: false,
          message: `Table with ID ${tableId} not found`,
          data: null,
        };
      }

      if (table.lockedBy) {
        if (table.lockedBy === username) {
          return {
            success: true,
            message: 'As locker, you can modify this table',
            data: table,
          };
        } else {
          return {
            success: false,
            message: 'Table is already in use by another user',
            data: null,
          };
        }
      }

      table.lockedBy = username;
      table.lockedAt = new Date();
      await table.save();

      return {
        success: true,
        message: 'Table locked successfully',
        data: table,
      };
    } catch (error) {
      return {
        success: false,
        message: `Error locking table: ${error.message}`,
        data: null,
      };
    }
  }

  async unlockTable(
    tableId: string,
    username: string,
  ): Promise<ServiceResponse<Table | null>> {
    try {
      const table = await this.tableModel
        .findById(new Types.ObjectId(tableId))
        .exec();
      if (!table) {
        return {
          success: false,
          message: `Table with ID ${tableId} not found`,
          data: null,
        };
      }

      if (!table.lockedBy || table.lockedBy !== username) {
        return {
          success: false,
          message: 'Table is not locked by you',
          data: null,
        };
      }

      table.lockedBy = null;
      table.lockedAt = null;
      table.isOccupied = false;
      await table.save();

      return {
        success: true,
        message: 'Table unlocked and marked as unoccupied successfully',
        data: table,
      };
    } catch (error) {
      return {
        success: false,
        message: `Error unlocking table: ${error.message}`,
        data: null,
      };
    }
  }

  async updateTable(
    _id: string,
    updateData: {
      isOccupied?: boolean;
      currentBillId?: string | null;
    },
  ): Promise<ServiceResponse<Table>> {
    try {
      const updatedTable = await this.tableModel.findByIdAndUpdate(
        _id,
        {
          ...(updateData.isOccupied !== undefined && {
            isOccupied: updateData.isOccupied,
          }),
          ...(updateData.currentBillId !== undefined && {
            currentBillId: updateData.currentBillId
              ? new Types.ObjectId(updateData.currentBillId)
              : null,
          }),
        },
        { new: true },
      );

      if (!updatedTable) {
        return {
          success: false,
          message: 'Error, generic',
          data: null,
        };
      }

      return {
        success: true,
        message: 'Table updated successfully',
        data: updatedTable,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Failed to update table',
        data: null,
      };
    }
  }
}
