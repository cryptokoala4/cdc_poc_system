import { Module, OnModuleInit } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { BillSchema } from './entities/bill.entity';
import { TableSchema } from './entities/table.entity';
import { MenuItemsService } from './services/menu-items.service';
import { BillsService } from './services/bills.service';
import { TablesService } from './services/tables.service';
import { MenuItemsResolver } from './resolvers/menu-items.resolver';
import { BillsResolver } from './resolvers/bills.resolver';
import { TablesResolver } from './resolvers/tables.resolver';
import { MenuItemSchema } from './entities/menu-item.entity';

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
    MenuItemsResolver,
    BillsResolver,
    TablesResolver,
  ],
})
export class AppModule implements OnModuleInit {
  constructor(private readonly menuItemsService: MenuItemsService) {}

  async onModuleInit() {
    console.log('AppModule initialized');
    await this.menuItemsService.seedInitialData();
  }
}
