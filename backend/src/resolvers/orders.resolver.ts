import {
  Resolver,
  Query,
  Mutation,
  Args,
  ID,
  ObjectType,
  Field,
} from '@nestjs/graphql';
import { OrdersService } from '../services/orders.service';
import { TablesService } from '../services/tables.service';
import { Order } from '../entities/order.entity';
import { CreateOrderInput } from '../dto/create-order.input';
import { UpdateOrderDto } from '../dto/update-order.dto';

@ObjectType()
export class OrderOperationResult {
  @Field(() => Boolean)
  success: boolean;

  @Field(() => String)
  message: string;

  @Field(() => Order, { nullable: true })
  order: Order | null;
}

@Resolver(() => Order)
export class OrdersResolver {
  constructor(
    private ordersService: OrdersService,
    private tablesService: TablesService,
  ) {}

  @Query(() => [Order])
  async orders() {
    const response = await this.ordersService.findAllOrders();
    if (!response.success) {
      console.error('Failed to fetch orders:', response.message);
    }
    return response.data || [];
  }

  @Query(() => OrderOperationResult)
  async order(
    @Args('id', { type: () => ID }) id: string,
  ): Promise<OrderOperationResult> {
    try {
      const response = await this.ordersService.findOrderById(id);
      return {
        success: response.success,
        message: response.message,
        order: response.data,
      };
    } catch (error) {
      console.error('Error fetching order:', error);
      return {
        success: false,
        message: `Failed to fetch order: ${error instanceof Error ? error.message : 'Unknown error'}`,
        order: null,
      };
    }
  }

  @Mutation(() => OrderOperationResult)
  async createOrder(
    @Args('createOrderInput') createOrderInput: CreateOrderInput,
    @Args('username') username: string,
  ): Promise<OrderOperationResult> {
    console.log(
      'Received createOrderInput:',
      JSON.stringify(createOrderInput, null, 2),
    );

    try {
      const tableResponse = await this.tablesService.findOne(
        createOrderInput.tableId,
      );
      if (!tableResponse.success) {
        return {
          success: false,
          message: tableResponse.message || 'Table not found',
          order: null,
        };
      }

      const table = tableResponse.data;

      if (table.lockedBy && table.lockedBy !== username) {
        return {
          success: false,
          message: 'Table is currently in use by another user',
          order: null,
        };
      }

      if (!table.lockedBy) {
        const lockResponse = await this.tablesService.lockTable(
          createOrderInput.tableId,
          username,
        );
        if (!lockResponse.success) {
          return {
            success: false,
            message: lockResponse.message || 'Failed to lock the table',
            order: null,
          };
        }
      }

      const orderResponse = await this.ordersService.createOrder(
        createOrderInput,
        username,
      );
      if (!orderResponse.success) {
        if (!table.lockedBy) {
          await this.tablesService.unlockTable(
            createOrderInput.tableId,
            username,
          );
        }
        return {
          success: false,
          message: orderResponse.message || 'Failed to create order',
          order: null,
        };
      }

      return {
        success: true,
        message: 'Order created successfully',
        order: orderResponse.data,
      };
    } catch (error) {
      console.error(
        'Error creating order:',
        error instanceof Error ? error.message : 'Unknown error',
      );
      console.error(
        'Error stack:',
        error instanceof Error ? error.stack : 'No stack trace available',
      );

      return {
        success: false,
        message: `Failed to create order: ${error instanceof Error ? error.message : 'Unknown error'}`,
        order: null,
      };
    }
  }

  @Mutation(() => OrderOperationResult)
  async updateOrder(
    @Args('id', { type: () => ID }) id: string,
    @Args('updateOrderDto') updateOrderDto: UpdateOrderDto,
  ): Promise<OrderOperationResult> {
    try {
      const response = await this.ordersService.updateOrder(id, updateOrderDto);
      return {
        success: response.success,
        message: response.message,
        order: response.data,
      };
    } catch (error) {
      console.error('Error updating order:', error);
      return {
        success: false,
        message: `Failed to update order: ${error instanceof Error ? error.message : 'Unknown error'}`,
        order: null,
      };
    }
  }

  @Mutation(() => OrderOperationResult)
  async closeOrder(
    @Args('id', { type: () => ID }) id: string,
  ): Promise<OrderOperationResult> {
    try {
      const orderResponse = await this.ordersService.closeOrder(id);
      if (!orderResponse.success) {
        return {
          success: false,
          message: orderResponse.message || 'Failed to close order',
          order: null,
        };
      }

      if (orderResponse.data && orderResponse.data.tableId) {
        const unlockResponse = await this.tablesService.unlockTable(
          orderResponse.data.tableId.toString(),
          orderResponse.data.username,
        );
        if (!unlockResponse.success) {
          return {
            success: false,
            message: `Order closed but failed to unlock table: ${unlockResponse.message}`,
            order: orderResponse.data,
          };
        }
      }

      return {
        success: true,
        message: 'Order closed and table unlocked successfully',
        order: orderResponse.data,
      };
    } catch (error) {
      console.error('Error closing order:', error);
      return {
        success: false,
        message: `Failed to close order: ${error instanceof Error ? error.message : 'Unknown error'}`,
        order: null,
      };
    }
  }
}
