import { Test, TestingModule } from '@nestjs/testing';
import { OrdersResolver } from './orders.resolver';
import { OrdersService } from '../services/orders.service';
import { TablesService } from '../services/tables.service';
import { Order } from '../entities/order.entity';
import { CreateOrderInput } from '../dto/create-order.input';
import { UpdateOrderDto } from '../dto/update-order.dto';
import { Types } from 'mongoose';

describe('OrdersResolver', () => {
  let resolver: OrdersResolver;

  const mockOrder: Partial<Order> = {
    _id: new Types.ObjectId('000000000000000000000001'),
    tableId: new Types.ObjectId('000000000000000000000002'),
    username: 'user1',
    items: [],
    totalAmount: 0,
    status: 'Open',
  };

  const mockOrdersService = {
    findAllOrders: jest.fn().mockResolvedValue({
      success: true,
      data: [mockOrder],
      message: 'Orders found',
    }),
    findOrderById: jest.fn().mockResolvedValue({
      success: true,
      data: mockOrder,
      message: 'Order found',
    }),
    createOrder: jest.fn().mockResolvedValue({
      success: true,
      data: mockOrder,
      message: 'Order created',
    }),
    updateOrder: jest.fn().mockResolvedValue({
      success: true,
      data: mockOrder,
      message: 'Order updated',
    }),
    closeOrder: jest.fn().mockResolvedValue({
      success: true,
      data: mockOrder,
      message: 'Order closed',
    }),
  };

  const mockTablesService = {
    findOne: jest
      .fn()
      .mockResolvedValue({ success: true, data: { lockedBy: null } }),
    lockTable: jest.fn().mockResolvedValue({ success: true }),
    unlockTable: jest.fn().mockResolvedValue({ success: true }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrdersResolver,
        { provide: OrdersService, useValue: mockOrdersService },
        { provide: TablesService, useValue: mockTablesService },
      ],
    }).compile();

    resolver = module.get<OrdersResolver>(OrdersResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('orders', () => {
    it('should return an array of orders', async () => {
      const result = await resolver.orders();
      expect(result).toEqual([mockOrder]);
    });
  });

  describe('order', () => {
    it('should return a single order', async () => {
      const result = await resolver.order(mockOrder._id.toString());
      expect(result).toEqual({
        success: true,
        message: expect.anything(),
        order: mockOrder,
      });
    });
  });

  describe('createOrder', () => {
    it('should create an order', async () => {
      const createOrderInput: CreateOrderInput = {
        tableId: mockOrder.tableId.toString(),
        username: 'user1',
        items: [],
      };
      const result = await resolver.createOrder(createOrderInput, 'user1');
      expect(result).toEqual({
        success: true,
        message: expect.anything(),
        order: mockOrder,
      });
    });
  });

  describe('updateOrder', () => {
    it('should update an order', async () => {
      const updateOrderDto: UpdateOrderDto = { items: [] };
      const result = await resolver.updateOrder(
        mockOrder._id.toString(),
        updateOrderDto,
      );
      expect(result).toEqual({
        success: true,
        message: expect.anything(),
        order: mockOrder,
      });
    });
  });

  describe('closeOrder', () => {
    it('should close an order', async () => {
      const result = await resolver.closeOrder(mockOrder._id.toString());
      expect(result).toEqual({
        success: true,
        message: expect.anything(),
        order: mockOrder,
      });
    });
  });
});
