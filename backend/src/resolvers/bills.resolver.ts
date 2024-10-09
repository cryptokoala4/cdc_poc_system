import { Resolver, Query, Args } from '@nestjs/graphql';
import { BillsService } from '../services/bills.service';
import { Bill } from '../models/bill.model';

@Resolver(() => Bill)
export class BillsResolver {
  constructor(private billsService: BillsService) {}

  @Query(() => [Bill])
  async bills(): Promise<Bill[]> {
    return this.billsService.findAll();
  }

  @Query(() => Bill)
  async bill(@Args('id') id: string): Promise<Bill> {
    return this.billsService.findOne(id);
  }
}
