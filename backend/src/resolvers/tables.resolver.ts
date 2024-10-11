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
  @Field(() => Boolean)
  success: boolean;

  @Field(() => String)
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
    return response.data || [];
  }

  @Query(() => Table)
  async table(@Args('id', { type: () => ID }) id: string) {
    const response = await this.tablesService.findOne(id);
    if (!response.data) {
      throw new NotFoundException(`Table with ID ${id} not found`);
    }
    return response.data;
  }

  @Mutation(() => TableOperationResult)
  async lockTable(
    @Args('tableId', { type: () => ID }) tableId: string,
    @Args('username', { type: () => String }) username: string,
  ): Promise<TableOperationResult> {
    try {
      const response = await this.tablesService.lockTable(tableId, username);
      console.log(`Resolver: Lock table response:`, response);
      return {
        success: response.success,
        message: response.message,
        table: response.data,
      };
    } catch (error) {
      console.error(`Resolver: Error locking table:`, error);
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
    @Args('username', { type: () => String }) username: string,
  ): Promise<TableOperationResult> {
    try {
      const response = await this.tablesService.unlockTable(tableId, username);
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
  async updateTable(
    @Args('_id', { type: () => ID }) _id: string,
    @Args('isOccupied', { type: () => Boolean, nullable: true })
    isOccupied?: boolean,
    @Args('currentBillId', { type: () => ID, nullable: true })
    currentBillId?: string,
  ): Promise<TableOperationResult> {
    try {
      const response = await this.tablesService.updateTable(_id, {
        isOccupied,
        currentBillId,
      });
      return {
        success: response.success,
        message: response.message,
        table: response.data,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Failed to update table',
        table: null,
      };
    }
  }
}
