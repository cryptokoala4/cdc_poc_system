import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { OrdersService } from './orders.service';
import { Order } from '../entities/order.entity';
import { Table } from '../entities/table.entity';
import { Bill } from '../entities/bill.entity';

describe('OrdersService', () => {
  let service: OrdersService;

  const mockModel = {
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    create: jest.fn(),
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrdersService,
        {
          provide: getModelToken(Order.name),
          useValue: mockModel,
        },
        {
          provide: getModelToken(Table.name),
          useValue: mockModel,
        },
        {
          provide: getModelToken(Bill.name),
          useValue: mockModel,
        },
      ],
    }).compile();

    service = module.get<OrdersService>(OrdersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should attempt to create an order', async () => {
    const createOrderInput = {
      tableId: '5f7d7e9b9b9b9b9b9b9b9b9c',
      username: 'user1',
      items: [{ itemId: '5f7d7e9b9b9b9b9b9b9b9b9d', quantity: 2 }],
      totalAmount: 20,
    };

    const result = await service.createOrder(createOrderInput, 'user1');

    expect(result).toBeDefined();
    expect(result).toHaveProperty('success');
    expect(result).toHaveProperty('message');
    expect(result).toHaveProperty('data');
  });

  it('should attempt to update an order', async () => {
    const updateOrderDto = {
      items: [
        {
          itemId: '5f7d7e9b9b9b9b9b9b9b9b9d',
          quantity: 3,
          price: 10,
          name: 'sushi',
        },
      ],
    };

    const result = await service.updateOrder(
      '5f7d7e9b9b9b9b9b9b9b9b9b',
      updateOrderDto,
    );

    expect(result).toBeDefined();
    expect(result).toHaveProperty('success');
    expect(result).toHaveProperty('message');
    expect(result).toHaveProperty('data');
  });
});
