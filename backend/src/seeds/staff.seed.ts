import { Model } from 'mongoose';
import { Staff, StaffDocument } from '../entities/staff.entity';

const STAFF_DATA: Partial<Staff>[] = [
  { name: 'Hiroshi Tanaka', role: 'Waiter' },
  { name: 'Yuki Sato', role: 'Waiter' },
  { name: 'Kenji Nakamura', role: 'Waiter' },
  { name: 'Akiko Yamamoto', role: 'Waiter' },
  { name: 'Takeshi Suzuki', role: 'Manager' },
];

export async function seedStaff(staffModel: Model<StaffDocument>) {
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
  }
}
