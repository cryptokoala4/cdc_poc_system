import { Module, OnModuleInit } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { BillSchema } from './entities/bill.entity';
import { TableSchema } from './entities/table.entity';
import { MenuItemSchema } from './entities/menu-item.entity';
import { StaffSchema } from './entities/staff.entity';
import { MenuItemsService } from './services/menu-items.service';
import { BillsService } from './services/bills.service';
import { TablesService } from './services/tables.service';
import { StaffService } from './services/staff.service';
import { MenuItemsResolver } from './resolvers/menu-items.resolver';
import { BillsResolver } from './resolvers/bills.resolver';
import { TablesResolver } from './resolvers/tables.resolver';
import { StaffResolver } from './resolvers/staff.resolver';
import { seedMenuItems } from './seeds/menu-items.seed';
import { seedStaff } from './seeds/staff.seed';
import { seedTables } from './seeds/tables.seed';
import { Model } from 'mongoose';
import { MenuItemDocument } from './entities/menu-item.entity';
import { StaffDocument } from './entities/staff.entity';
import { TableDocument } from './entities/table.entity';
import { InjectModel } from '@nestjs/mongoose';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGODB_URI, {
      connectionFactory: (connection) => {
        connection.on('connected', () => {
          console.log('Connected to MongoDB Atlas');
        });
        connection.on('error', (error: any) => {
          console.error('MongoDB connection error:', error);
        });
        return connection;
      },
    }),
    MongooseModule.forFeature([
      { name: 'MenuItem', schema: MenuItemSchema },
      { name: 'Bill', schema: BillSchema },
      { name: 'Table', schema: TableSchema },
      { name: 'Staff', schema: StaffSchema },
    ]),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/graphql/schema.gql'),
      definitions: {
        path: join(process.cwd(), 'src/types/graphql.ts'),
      },
      sortSchema: true,
    }),
  ],
  providers: [
    MenuItemsService,
    BillsService,
    TablesService,
    StaffService,
    MenuItemsResolver,
    BillsResolver,
    TablesResolver,
    StaffResolver,
  ],
})
export class AppModule implements OnModuleInit {
  constructor(
    @InjectModel('MenuItem') private menuItemModel: Model<MenuItemDocument>,
    @InjectModel('Staff') private staffModel: Model<StaffDocument>,
    @InjectModel('Table') private tableModel: Model<TableDocument>,
  ) {}

  async onModuleInit() {
    console.log('AppModule initialized');
    await this.seedData();
  }

  private async seedData() {
    try {
      await seedMenuItems(this.menuItemModel);
      await seedStaff(this.staffModel);
      await seedTables(this.tableModel);
      console.log('Data seeding completed');
    } catch (error) {
      console.error('Error during data seeding:', error);
    }
  }
}
