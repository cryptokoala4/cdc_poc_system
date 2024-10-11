import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { TablesService } from './tables.service';
import { Table } from '../entities/table.entity';

describe('TablesService', () => {
  let service: TablesService;

  const mockTable = {
    _id: new Types.ObjectId('5f7d7e9b9b9b9b9b9b9b9b9b'),
    number: 1,
    seats: 4,
    isOccupied: false,
    lockedBy: null,
    lockedAt: null,
    currentBillId: null,
    save: jest.fn().mockResolvedValue(this),
  };

  const mockTableModel = {
    findById: jest.fn().mockReturnValue({
      exec: jest.fn().mockResolvedValue(mockTable),
    }),
    findByIdAndUpdate: jest.fn().mockResolvedValue(mockTable),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TablesService,
        {
          provide: getModelToken(Table.name),
          useValue: mockTableModel,
        },
      ],
    }).compile();

    service = module.get<TablesService>(TablesService);
  });

  it('should lock an available table', async () => {
    mockTableModel.findById().exec.mockResolvedValue({
      ...mockTable,
      save: jest.fn().mockResolvedValue({
        ...mockTable,
        lockedBy: 'user1',
        lockedAt: new Date(),
      }),
    });

    const result = await service.lockTable(mockTable._id.toString(), 'user1');

    expect(result.success).toBe(true);
    expect(result.data.lockedBy).toBe('user1');
  });

  it('should not lock an already locked table', async () => {
    mockTableModel.findById().exec.mockResolvedValue({
      ...mockTable,
      lockedBy: 'user2',
    });

    const result = await service.lockTable(mockTable._id.toString(), 'user1');

    expect(result.success).toBe(false);
  });

  it('should unlock a table', async () => {
    mockTableModel.findById().exec.mockResolvedValue({
      ...mockTable,
      lockedBy: 'user1',
      save: jest.fn().mockResolvedValue({
        ...mockTable,
        lockedBy: null,
        lockedAt: null,
        isOccupied: false,
      }),
    });

    const result = await service.unlockTable(mockTable._id.toString(), 'user1');

    expect(result.success).toBe(true);
    expect(result.data.lockedBy).toBeNull();
  });

  it('should update table properties', async () => {
    const updatedTable = {
      ...mockTable,
      isOccupied: true,
      currentBillId: new Types.ObjectId('5f7d7e9b9b9b9b9b9b9b9b9c'),
    };
    mockTableModel.findByIdAndUpdate.mockResolvedValue(updatedTable);

    const result = await service.updateTable(mockTable._id.toString(), {
      isOccupied: true,
      currentBillId: '5f7d7e9b9b9b9b9b9b9b9b9c',
    });

    expect(result.success).toBe(true);
    expect(result.data.isOccupied).toBe(true);
  });
});
