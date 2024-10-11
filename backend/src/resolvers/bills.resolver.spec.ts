import { Test, TestingModule } from '@nestjs/testing';
import { BillsResolver } from './bills.resolver';
import { BillsService } from '../services/bills.service';
import { Bill } from '../entities/bill.entity';
import { CreateBillDto } from '../dto/create-bill.dto';
import { UpdateBillDto } from '../dto/update-bill.dto';
import { Types } from 'mongoose';

describe('BillsResolver', () => {
  let resolver: BillsResolver;

  const mockBill: Partial<Bill> = {
    _id: new Types.ObjectId('000000000000000000000001'),
    tableId: new Types.ObjectId('000000000000000000000002'),
    username: 'user1',
    orderIds: [new Types.ObjectId('000000000000000000000003')],
    totalAmount: 100,
    status: 'Open',
  };

  const mockBillsService = {
    findAllBills: jest.fn().mockResolvedValue({
      success: true,
      data: [mockBill],
      message: 'Bills found',
    }),
    findBillById: jest.fn().mockResolvedValue({
      success: true,
      data: mockBill,
      message: 'Bill found',
    }),
    getCurrentBillForTable: jest.fn().mockResolvedValue(mockBill),
    createBill: jest.fn().mockResolvedValue({
      success: true,
      data: mockBill,
      message: 'Bill created',
    }),
    updateBill: jest.fn().mockResolvedValue({
      success: true,
      data: mockBill,
      message: 'Bill updated',
    }),
    settleBill: jest.fn().mockResolvedValue({
      success: true,
      data: mockBill,
      message: 'Bill settled',
    }),
    removeOrderFromBill: jest.fn().mockResolvedValue({
      success: true,
      data: mockBill,
      message: 'Order removed from bill',
    }),
    deleteBill: jest
      .fn()
      .mockResolvedValue({ success: true, message: 'Bill deleted' }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BillsResolver,
        { provide: BillsService, useValue: mockBillsService },
      ],
    }).compile();

    resolver = module.get<BillsResolver>(BillsResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('bills', () => {
    it('should return an array of bills', async () => {
      const result = await resolver.bills();
      expect(result).toEqual([mockBill]);
    });
  });

  describe('bill', () => {
    it('should return a single bill', async () => {
      const result = await resolver.bill(mockBill._id.toString());
      expect(result).toEqual({
        success: true,
        message: expect.anything(),
        bill: mockBill,
      });
    });
  });

  describe('getCurrentBillForTable', () => {
    it('should return the current bill for a table', async () => {
      const result = await resolver.getCurrentBillForTable(
        mockBill.tableId.toString(),
      );
      expect(result).toEqual(mockBill);
    });
  });

  describe('createBill', () => {
    it('should create a bill', async () => {
      const createBillDto: CreateBillDto = {
        tableId: mockBill.tableId.toString(),
        username: 'user1',
        orderItems: [],
      };
      const result = await resolver.createBill(createBillDto);
      expect(result).toEqual({
        success: true,
        message: expect.anything(),
        bill: mockBill,
      });
    });
  });

  describe('updateBill', () => {
    it('should update a bill', async () => {
      const updateBillDto: UpdateBillDto = { status: 'Closed' };
      const result = await resolver.updateBill(
        mockBill._id.toString(),
        updateBillDto,
      );
      expect(result).toEqual({
        success: true,
        message: expect.anything(),
        bill: mockBill,
      });
    });
  });

  describe('settleBill', () => {
    it('should settle a bill', async () => {
      const result = await resolver.settleBill(mockBill._id.toString());
      expect(result).toEqual({
        success: true,
        message: expect.anything(),
        bill: mockBill,
      });
    });
  });

  describe('removeOrderFromBill', () => {
    it('should remove an order from a bill', async () => {
      const result = await resolver.removeOrderFromBill(
        mockBill._id.toString(),
        mockBill.orderIds[0].toString(),
      );
      expect(result).toEqual({
        success: true,
        message: expect.anything(),
        bill: mockBill,
      });
    });
  });

  describe('deleteBill', () => {
    it('should delete a bill', async () => {
      const result = await resolver.deleteBill(mockBill._id.toString());
      expect(result).toEqual({
        success: true,
        message: expect.anything(),
        bill: null,
      });
    });
  });
});
