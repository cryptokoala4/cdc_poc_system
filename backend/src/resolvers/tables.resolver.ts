import {
  Resolver,
  Query,
  Mutation,
  Args,
  ID,
  ObjectType,
  Field,
} from '@nestjs/graphql';
import { TablesService } from '../services/tables.service';
import { Table } from '../entities/table.entity';
import { NotFoundException } from '@nestjs/common';

@ObjectType()
class TableOperationResult {
  @Field()
  success: boolean;

  @Field()
  message: string;

  @Field(() => Table, { nullable: true })
  table: Table | null;
}

@Resolver(() => Table)
export class TablesResolver {
  constructor(private tablesService: TablesService) {}

  @Query(() => [Table])
  async tables() {
    const response = await this.tablesService.findAll();
    return response.data;
  }

  @Query(() => Table)
  async table(@Args('id', { type: () => ID }) id: string) {
    const response = await this.tablesService.findOne(id);
    return response.data;
  }

  @Mutation(() => TableOperationResult)
  async lockTable(
    @Args('tableId', { type: () => ID }) tableId: string,
    @Args('customerId', { type: () => ID }) customerId: string,
  ): Promise<TableOperationResult> {
    try {
      const response = await this.tablesService.lockTable(tableId, customerId);
      console.log(response.message);
      return {
        success: response.success,
        message: response.message,
        table: response.data,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        return {
          success: false,
          message: `Table not found: ${error.message}`,
          table: null,
        };
      }
      throw error;
    }
  }

  @Mutation(() => TableOperationResult)
  async unlockTable(
    @Args('tableId', { type: () => ID }) tableId: string,
  ): Promise<TableOperationResult> {
    try {
      const response = await this.tablesService.unlockTable(tableId);
      console.log(response.message);
      return {
        success: response.success,
        message: response.message,
        table: response.data,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        return {
          success: false,
          message: `Table not found: ${error.message}`,
          table: null,
        };
      }
      throw error;
    }
  }
}
