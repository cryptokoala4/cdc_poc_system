import { Module, OnModuleInit } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import { BillSchema } from './entities/bill.entity';
import { TableSchema } from './entities/table.entity';
import { MenuItemSchema } from './entities/menu-item.entity';
import { StaffSchema } from './entities/staff.entity';
import { OrderSchema } from './entities/order.entity';

import { MenuItemsService } from './services/menu-items.service';
import { BillsService } from './services/bills.service';
import { TablesService } from './services/tables.service';
import { StaffService } from './services/staff.service';
import { OrdersService } from './services/orders.service';

import { MenuItemsResolver } from './resolvers/menu-items.resolver';
import { BillsResolver } from './resolvers/bills.resolver';
import { TablesResolver } from './resolvers/tables.resolver';
import { StaffResolver } from './resolvers/staff.resolver';
import { OrdersResolver } from './resolvers/orders.resolver';

import { seedMenuItems } from './seeds/menu-items.seed';
import { seedStaff } from './seeds/staff.seed';
import { seedTables } from './seeds/tables.seed';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([
      { name: 'MenuItem', schema: MenuItemSchema },
      { name: 'Bill', schema: BillSchema },
      { name: 'Table', schema: TableSchema },
      { name: 'Staff', schema: StaffSchema },
      { name: 'Order', schema: OrderSchema },
    ]),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/graphql/schema.gql'),
      playground: process.env.NODE_ENV !== 'production',
    }),
  ],
  providers: [
    MenuItemsService,
    BillsService,
    TablesService,
    StaffService,
    OrdersService,
    MenuItemsResolver,
    BillsResolver,
    TablesResolver,
    StaffResolver,
    OrdersResolver,
  ],
})
export class AppModule implements OnModuleInit {
  constructor(
    @InjectModel('MenuItem') private menuItemModel: Model<any>,
    @InjectModel('Staff') private staffModel: Model<any>,
    @InjectModel('Table') private tableModel: Model<any>,
  ) {}

  async onModuleInit() {
    console.log('AppModule initialized');
    await this.seedData();
  }

  private async seedData() {
    try {
      await Promise.all([
        seedMenuItems(this.menuItemModel),
        seedStaff(this.staffModel),
        seedTables(this.tableModel),
      ]);
      console.log('Data seeding completed');
    } catch (error) {
      console.error('Error during data seeding:', error);
    }
  }
}
