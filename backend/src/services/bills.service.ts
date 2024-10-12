import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Bill, BillDocument } from '../entities/bill.entity';
import { Table } from '../entities/table.entity';
import { ServiceResponse } from '../interfaces/service-response.interface';
import { CreateBillDto } from '../dto/create-bill.dto';
import { UpdateBillDto } from '../dto/update-bill.dto';
import { MenuItem } from '../entities/menu-item.entity';
import { Order, OrderDocument } from '../entities/order.entity';

@Injectable()
export class BillsService {
  constructor(
    @InjectModel(Bill.name) private billModel: Model<BillDocument>,
    @InjectModel(Table.name) private tableModel: Model<Table>,
    @InjectModel(MenuItem.name) private menuItemModel: Model<MenuItem>,
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
  ) {}

  async getCurrentBillForTable(tableId: string): Promise<Bill | null> {
    try {
      const bill = await this.billModel
        .findOne({
          tableId: new Types.ObjectId(tableId),
          status: 'Open',
        })
        .exec();

      console.log('Found bill:', JSON.stringify(bill, null, 2));

      if (bill) {
        const populatedOrders = await this.orderModel
          .find({ _id: { $in: bill.orderIds } })
          .exec();

        bill.orders = populatedOrders;
      }

      // TODO: handle null bill when table bill is cleared
      return bill;
    } catch (error) {
      console.error('Error in getCurrentBillForTable:', error);
      return null;
    }
  }

  async createBill(
    createBillDto: CreateBillDto,
  ): Promise<ServiceResponse<Bill>> {
    const { tableId, username, orderItems } = createBillDto;

    const totalAmount = await this.calculateTotalAmount(orderItems);

    const createdBill = new this.billModel({
      tableId,
      username,
      orderItems,
      totalAmount,
      status: 'Open',
    });
    const savedBill = await createdBill.save();

    await this.tableModel.findByIdAndUpdate(tableId, {
      isOccupied: true,
      currentBillId: savedBill._id,
    });

    return {
      success: true,
      message: 'Bill created successfully',
      data: savedBill,
    };
  }

  async updateBill(
    _id: string,
    updateBillDto: UpdateBillDto,
  ): Promise<ServiceResponse<Bill>> {
    const { orderId, totalAmount, status, paymentMethod } = updateBillDto;

    const updateData: {
      $push?: { orderIds: string };
      totalAmount?: number;
      status?: string;
      paymentMethod?: string;
    } = {};

    if (orderId) {
      updateData.$push = { orderIds: orderId };
    }
    if (totalAmount !== undefined) updateData.totalAmount = totalAmount;
    if (status) updateData.status = status;
    if (paymentMethod) updateData.paymentMethod = paymentMethod;

    const updatedBill = await this.billModel
      .findByIdAndUpdate(_id, updateData, { new: true })
      .exec();

    if (!updatedBill) {
      return {
        success: false,
        message: `Bill with ID ${_id} not found`,
        data: null,
      };
    }

    return {
      success: true,
      message: 'Bill updated successfully',
      data: updatedBill,
    };
  }

  async settleBill(billId: string): Promise<ServiceResponse<Bill>> {
    const bill = await this.billModel.findByIdAndUpdate(
      billId,
      { status: 'Closed', paidAt: new Date() },
      { new: true },
    );

    if (!bill) {
      return {
        success: false,
        message: 'Bill not found',
        data: null,
      };
    }

    await this.tableModel.findByIdAndUpdate(bill.tableId, {
      isOccupied: false,
      currentBillId: null,
    });

    return {
      success: true,
      message: 'Bill settled successfully',
      data: bill,
    };
  }

  async findAllBills(): Promise<ServiceResponse<Bill[]>> {
    const bills = await this.billModel.find().exec();
    return {
      success: true,
      message: 'Bills retrieved successfully',
      data: bills,
    };
  }

  async findBillById(_id: string): Promise<ServiceResponse<Bill>> {
    const bill = await this.billModel.findById(_id).exec();
    if (!bill) {
      return {
        success: false,
        message: `Bill with ID ${_id} not found`,
        data: null,
      };
    }
    return {
      success: true,
      message: 'Bill found successfully',
      data: bill,
    };
  }

  async removeOrderFromBill(
    billId: string,
    orderId: string,
  ): Promise<ServiceResponse<Bill>> {
    try {
      const bill = await this.billModel.findById(billId);
      if (!bill) {
        return { success: false, message: 'Bill not found', data: null };
      }

      const orderIndex = bill.orderIds.indexOf(new Types.ObjectId(orderId));
      if (orderIndex === -1) {
        return {
          success: false,
          message: 'Order not found in this bill',
          data: null,
        };
      }

      bill.orderIds.splice(orderIndex, 1);

      const orders = await this.orderModel.find({
        _id: { $in: bill.orderIds },
      });
      bill.totalAmount = orders.reduce(
        (total, order) => total + order.totalAmount,
        0,
      );

      await bill.save();

      return {
        success: true,
        message: 'Order removed from bill successfully',
        data: bill,
      };
    } catch (error) {
      console.error('Error removing order from bill:', error);
      return {
        success: false,
        message: 'Failed to remove order from bill',
        data: null,
      };
    }
  }

  async deleteBill(_id: string): Promise<ServiceResponse<null>> {
    const result = await this.billModel.deleteOne({ _id: _id }).exec();
    if (result.deletedCount === 0) {
      return {
        success: false,
        message: `Bill with ID ${_id} not found`,
        data: null,
      };
    }
    return {
      success: true,
      message: 'Bill deleted successfully',
      data: null,
    };
  }

  private async calculateTotalAmount(
    orderItems: { itemId: string; quantity: number }[],
  ): Promise<number> {
    const totalAmount = await orderItems.reduce(async (accPromise, item) => {
      const acc = await accPromise;
      const menuItem = await this.menuItemModel.findById(item.itemId);
      return acc + (menuItem ? menuItem.price * item.quantity : 0);
    }, Promise.resolve(0));

    return totalAmount;
  }
}
