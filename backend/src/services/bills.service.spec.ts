import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { BillsService } from './bills.service';
import { Bill } from '../entities/bill.entity';
import { Table } from '../entities/table.entity';
import { MenuItem } from '../entities/menu-item.entity';
import { Order } from '../entities/order.entity';

describe('BillsService', () => {
  let service: BillsService;

  const mockBill = {
    _id: '5f7d7e9b9b9b9b9b9b9b9b9e',
    tableId: '5f7d7e9b9b9b9b9b9b9b9b9c',
    username: 'user1',
    orderIds: ['5f7d7e9b9b9b9b9b9b9b9b9d'],
    totalAmount: 20,
    status: 'Open',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BillsService,
        {
          provide: getModelToken(Bill.name),
          useValue: {
            findOne: jest.fn().mockReturnValue({
              exec: jest.fn().mockResolvedValue(mockBill),
            }),
          },
        },
        {
          provide: getModelToken(Table.name),
          useValue: {},
        },
        {
          provide: getModelToken(MenuItem.name),
          useValue: {},
        },
        {
          provide: getModelToken(Order.name),
          useValue: {
            find: jest.fn().mockReturnValue({
              exec: jest.fn().mockResolvedValue([]),
            }),
          },
        },
      ],
    }).compile();

    service = module.get<BillsService>(BillsService);
  });

  it('should get the current bill for a table', async () => {
    const tableId = '5f7d7e9b9b9b9b9b9b9b9b9c';
    const result = await service.getCurrentBillForTable(tableId);
    expect(result).toBeDefined();
    expect(result).toEqual(
      expect.objectContaining({
        _id: expect.any(String),
        tableId: tableId,
        status: 'Open',
      }),
    );
  });
});
