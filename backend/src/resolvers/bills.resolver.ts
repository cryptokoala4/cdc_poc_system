import {
  Resolver,
  Query,
  Mutation,
  Args,
  ID,
  ObjectType,
  Field,
} from '@nestjs/graphql';
import { BillsService } from '../services/bills.service';
import { Bill } from '../entities/bill.entity';
import { CreateBillDto } from '../dto/create-bill.dto';
import { UpdateBillDto } from '../dto/update-bill.dto';

@ObjectType()
class BillOperationResult {
  @Field()
  success: boolean;

  @Field()
  message: string;

  @Field(() => Bill, { nullable: true })
  bill: Bill | null;
}

@Resolver(() => Bill)
export class BillsResolver {
  constructor(private billsService: BillsService) {}

  @Query(() => [Bill])
  async bills() {
    const response = await this.billsService.findAllBills();
    return response.data;
  }

  @Query(() => BillOperationResult)
  async bill(
    @Args('id', { type: () => ID }) id: string,
  ): Promise<BillOperationResult> {
    const response = await this.billsService.findBillById(id);
    return {
      success: response.success,
      message: response.message,
      bill: response.data,
    };
  }

  @Mutation(() => BillOperationResult)
  async createBill(
    @Args('createBillInput') createBillDto: CreateBillDto,
  ): Promise<BillOperationResult> {
    const response = await this.billsService.createBill(createBillDto);
    return {
      success: response.success,
      message: response.message,
      bill: response.data,
    };
  }

  @Mutation(() => BillOperationResult)
  async updateBill(
    @Args('id', { type: () => ID }) id: string,
    @Args('updateBillInput') updateBillDto: UpdateBillDto,
  ): Promise<BillOperationResult> {
    const response = await this.billsService.updateBill(id, updateBillDto);
    return {
      success: response.success,
      message: response.message,
      bill: response.data,
    };
  }

  @Mutation(() => BillOperationResult)
  async settleBill(
    @Args('id', { type: () => ID }) id: string,
  ): Promise<BillOperationResult> {
    const response = await this.billsService.settleBill(id);
    return {
      success: response.success,
      message: response.message,
      bill: response.data,
    };
  }

  @Mutation(() => BillOperationResult)
  async deleteBill(
    @Args('id', { type: () => ID }) id: string,
  ): Promise<BillOperationResult> {
    const response = await this.billsService.deleteBill(id);
    return {
      success: response.success,
      message: response.message,
      bill: null,
    };
  }
}
