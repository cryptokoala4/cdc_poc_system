import { Resolver, Query, Args } from '@nestjs/graphql';
import { BillsService } from '../services/bills.service';
import { Bill } from '../entities/bill.entity';

@Resolver(() => Bill)
export class BillsResolver {
  constructor(private billsService: BillsService) {}

  @Query(() => [Bill])
  async bills(): Promise<Bill[]> {
    return this.billsService.findAll();
  }

  @Query(() => Bill)
  async bill(@Args('_id') _id: string): Promise<Bill> {
    return this.billsService.findOne(_id);
  }
}
