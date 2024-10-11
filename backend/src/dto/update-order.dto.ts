import { InputType, Field, Float } from '@nestjs/graphql';
import { OrderItemInput } from './order-item.input';

@InputType()
export class UpdateOrderDto {
  @Field(() => [OrderItemInput], { nullable: true })
  items?: OrderItemInput[];

  @Field(() => Float, { nullable: true })
  totalAmount?: number;

  @Field({ nullable: true })
  status?: string;
}
