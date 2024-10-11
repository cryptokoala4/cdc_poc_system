import { Model } from 'mongoose';
import { Staff, StaffDocument } from '../entities/staff.entity';

const STAFF_DATA: Omit<Staff, '_id'>[] = [
  {
    name: 'Hiroshi Tanaka',
    username: 'htanaka',
    role: 'Waiter',
    password: 'pass01',
  },
  {
    name: 'Yuki Sato',
    username: 'ysato',
    role: 'Waiter',
    password: 'pass02',
  },
  {
    name: 'Kenji Nakamura',
    username: 'knakamura',
    role: 'Waiter',
    password: 'pass03',
  },
  {
    name: 'Akiko Yamamoto',
    username: 'ayamamoto',
    role: 'Waiter',
    password: 'pass04',
  },
  {
    name: 'Takeshi Suzuki',
    username: 'tsuzuki',
    role: 'Manager',
    password: 'pass05',
  },
];

export async function seedStaff(
  staffModel: Model<StaffDocument>,
): Promise<void> {
  try {
    console.log('Starting staff seed process...');
    const count = await staffModel.countDocuments();
    console.log(`Current staff count: ${count}`);

    if (count === 0) {
      console.log('Staff collection is empty, seeding data...');
      await staffModel.insertMany(STAFF_DATA);
      console.log(`Seeded ${STAFF_DATA.length} staff members`);
    } else {
      console.log('Staff already exist, skipping seed');
    }
  } catch (error) {
    console.error('Error during staff seeding:', error);
    throw error;
  }
}
