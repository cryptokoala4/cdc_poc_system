import { Model } from 'mongoose';
import { TableDocument } from '../entities/table.entity';

export async function seedTables(tableModel: Model<TableDocument>) {
  try {
    console.log('Starting tables seed process...');
    const count = await tableModel.countDocuments();
    console.log(`Current table count: ${count}`);

    if (count === 0) {
      console.log('Tables collection is empty, seeding data...');
      const tablesToCreate = Array.from({ length: 15 }, (_, i) => ({
        number: i + 1,
        capacity: Math.random() < 0.5 ? 2 : 4, // 50% chance of 2 or 4 seats
        isOccupied: false,
        currentBillId: null,
      }));
      await tableModel.insertMany(tablesToCreate);
      console.log('Seeded 15 tables');
    } else {
      console.log('Tables already exist, skipping seed');
    }
  } catch (error) {
    console.error('Error during tables seeding:', error);
  }
}
