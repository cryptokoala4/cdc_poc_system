import { Resolver, Query, Args } from '@nestjs/graphql';
import { TablesService } from '../services/tables.service';
import { Table } from '../models/table.model';

@Resolver(() => Table)
export class TablesResolver {
  constructor(private tablesService: TablesService) {}

  @Query(() => [Table])
  async tables(): Promise<Table[]> {
    return this.tablesService.findAll();
  }

  @Query(() => Table)
  async table(@Args('id') id: string): Promise<Table> {
    return this.tablesService.findOne(id);
  }
}
