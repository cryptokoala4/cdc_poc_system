import { Resolver, Query, Args } from '@nestjs/graphql';
import { TablesService } from '../services/tables.service';
import { Table } from '../entities/table.entity';

@Resolver(() => Table)
export class TablesResolver {
  constructor(private tablesService: TablesService) {}

  @Query(() => [Table])
  async tables(): Promise<Table[]> {
    return this.tablesService.findAll();
  }

  @Query(() => Table)
  async table(@Args('_id') _id: string): Promise<Table> {
    return this.tablesService.findOne(_id);
  }
}
