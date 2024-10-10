import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MenuItem, MenuItemDocument } from '../entities/menu-item.entity';
import { Staff, StaffDocument } from '../entities/staff.entity';
import { Table, TableDocument } from '../entities/table.entity';
import { seedMenuItems } from './menu-items.seed';
import { seedStaff } from './staff.seed';
import { seedTables } from './tables.seed';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const menuItemModel = app.get<Model<MenuItemDocument>>(
    getModelToken(MenuItem.name),
  );
  const staffModel = app.get<Model<StaffDocument>>(getModelToken(Staff.name));
  const tableModel = app.get<Model<TableDocument>>(getModelToken(Table.name));

  await seedMenuItems(menuItemModel);
  await seedStaff(staffModel);
  await seedTables(tableModel);

  await app.close();
}

bootstrap();
