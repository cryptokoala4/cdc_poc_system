import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Order, OrderDocument } from '../entities/order.entity';
import { Table } from '../entities/table.entity';
import { Bill, BillDocument } from '../entities/bill.entity';
import { ServiceResponse } from '../interfaces/service-response.interface';
import { UpdateOrderDto } from '../dto/update-order.dto';

interface CreateOrderInput {
  tableId: string;
  username: string;
  items: { itemId: string; quantity: number }[];
  totalAmount?: number;
}

@Injectable()
export class OrdersService {
  private readonly logger = new Logger(OrdersService.name);
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    @InjectModel(Table.name) private tableModel: Model<Table>,
    @InjectModel(Bill.name) private billModel: Model<BillDocument>,
  ) {}

  async createOrder(
    createOrderInput: CreateOrderInput,
    username: string,
  ): Promise<ServiceResponse<Order>> {
    try {
      this.logger.debug(
        `Creating order for table: ${createOrderInput.tableId}`,
      );

      const tableId = new Types.ObjectId(createOrderInput.tableId);
      const table = await this.tableModel.findById(tableId);

      if (!table) {
        return { success: false, message: 'Table not found', data: null };
      }

      let bill: BillDocument;

      if (!table.isOccupied) {
        bill = new this.billModel({
          tableId: table._id,
          username,
          orderIds: [],
          totalAmount: 0,
          status: 'Open',
        });
        await bill.save();

        await this.tableModel.findByIdAndUpdate(table._id, {
          isOccupied: true,
          currentBillId: bill._id,
        });
      } else {
        bill = await this.billModel.findById(table.currentBillId);
        if (!bill) {
          return {
            success: false,
            message: 'Current bill not found',
            data: null,
          };
        }
      }

      const newOrder = new this.orderModel({
        tableId,
        username,
        items: createOrderInput.items.map((item) => ({
          ...item,
          itemId: new Types.ObjectId(item.itemId),
        })),
        totalAmount: createOrderInput.totalAmount || 0,
      });

      const savedOrder = await newOrder.save();

      this.logger.debug(`Saved order: ${JSON.stringify(savedOrder)}`);
      // TODO: Fix
      // bill.orders.push(savedOrder);
      bill.totalAmount += savedOrder.totalAmount;
      await bill.save();

      return {
        success: true,
        message: 'Order created successfully',
        data: savedOrder,
      };
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error occurred';
      this.logger.error(`Error in createOrder: ${errorMessage}`);
      return {
        success: false,
        message: `Failed to create order: ${errorMessage}`,
        data: null,
      };
    }
  }

  async findAllOrders(): Promise<ServiceResponse<Order[]>> {
    try {
      const orders = await this.orderModel.find().exec();
      return {
        success: true,
        message: 'Orders retrieved successfully',
        data: orders,
      };
    } catch {
      return {
        success: false,
        message: 'Failed to retrieve orders',
        data: [],
      };
    }
  }

  async findOrderById(_id: string): Promise<ServiceResponse<Order>> {
    try {
      const order = await this.orderModel
        .findById(new Types.ObjectId(_id))
        .exec();
      if (!order) {
        return {
          success: false,
          message: `Order with ID ${_id} not found`,
          data: null,
        };
      }
      return {
        success: true,
        message: 'Order found successfully',
        data: order,
      };
    } catch {
      return {
        success: false,
        message: `Failed to find order with ID ${_id}`,
        data: null,
      };
    }
  }

  async updateOrder(
    _id: string,
    updateOrderDto: UpdateOrderDto,
  ): Promise<ServiceResponse<Order>> {
    try {
      const order = await this.orderModel.findById(new Types.ObjectId(_id));
      if (!order) {
        return {
          success: false,
          message: `Order with ID ${_id} not found`,
          data: null,
        };
      }

      // Calculate the new total amount
      const newTotalAmount = updateOrderDto.items.reduce(
        (total, item) => total + item.price * item.quantity,
        0,
      );

      // Update the order
      const updatedOrder = await this.orderModel
        .findByIdAndUpdate(
          new Types.ObjectId(_id),
          {
            ...updateOrderDto,
            totalAmount: newTotalAmount,
          },
          { new: true },
        )
        .exec();

      // Update the associated bill
      const bill = await this.billModel.findOne({ orderIds: order._id });
      if (bill) {
        bill.totalAmount =
          bill.totalAmount - order.totalAmount + newTotalAmount;
        await bill.save();
      }

      return {
        success: true,
        message: 'Order updated successfully',
        data: updatedOrder,
      };
    } catch (error) {
      this.logger.error(`Failed to update order with ID ${_id}:`, error);
      return {
        success: false,
        message: `Failed to update order with ID ${_id}: ${error.message}`,
        data: null,
      };
    }
  }

  async closeOrder(_id: string): Promise<ServiceResponse<Order>> {
    try {
      const closedOrder = await this.orderModel
        .findByIdAndUpdate(
          new Types.ObjectId(_id),
          { status: 'Closed' },
          { new: true },
        )
        .exec();
      if (!closedOrder) {
        return {
          success: false,
          message: `Order with ID ${_id} not found`,
          data: null,
        };
      }
      return {
        success: true,
        message: 'Order closed successfully',
        data: closedOrder,
      };
    } catch {
      return {
        success: false,
        message: `Failed to close order with ID ${_id}`,
        data: null,
      };
    }
  }
}
