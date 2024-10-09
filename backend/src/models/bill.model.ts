import { Field, ID, ObjectType, Float } from '@nestjs/graphql';
import { MenuItem } from './menu-item.model';

@ObjectType()
export class BillItem {
  @Field(() => MenuItem)
  menuItem: MenuItem;

  @Field()
  quantity: number;
}

@ObjectType()
export class Bill {
  @Field(() => ID)
  id: string;

  @Field(() => [BillItem])
  items: BillItem[];

  @Field(() => Float)
  totalAmount: number;

  @Field()
  tableNumber: number;

  @Field()
  createdAt: Date;

  @Field({ nullable: true })
  paidAt?: Date;
}
