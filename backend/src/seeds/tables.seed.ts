import { Model } from 'mongoose';
import { Table, TableDocument } from '../entities/table.entity';

const TABLES_DATA: Omit<Table, '_id'>[] = [
  ...Array.from({ length: 10 }, (_, i) => ({
    number: i + 1,
    seats: 2,
    isOccupied: false,
    currentBillId: null,
    lockedBy: null,
    lockedAt: null,
  })),
  ...Array.from({ length: 4 }, (_, i) => ({
    number: i + 11,
    seats: 4,
    isOccupied: false,
    currentBillId: null,
    lockedBy: null,
    lockedAt: null,
  })),
  ...Array.from({ length: 2 }, (_, i) => ({
    number: i + 15,
    seats: 6,
    isOccupied: false,
    currentBillId: null,
    lockedBy: null,
    lockedAt: null,
  })),
];

export async function seedTables(
  tableModel: Model<TableDocument>,
): Promise<void> {
  try {
    console.log('Starting tables seed process...');
    const count = await tableModel.countDocuments();
    console.log(`Current table count: ${count}`);

    if (count === 0) {
      console.log('Tables collection is empty, seeding data...');
      await tableModel.insertMany(TABLES_DATA);
      console.log(`Seeded ${TABLES_DATA.length} tables`);
    } else {
      console.log('Tables already exist, skipping seed');
    }
  } catch (error) {
    console.error('Error during tables seeding:', error);
    throw error;
  }
}
