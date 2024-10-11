import { InputType, Field, ID, Float } from '@nestjs/graphql';

@InputType()
export class UpdateBillDto {
  @Field(() => ID, { nullable: true })
  orderId?: string;

  @Field(() => Float, { nullable: true })
  totalAmount?: number;

  @Field({ nullable: true })
  status?: string;

  @Field(() => Date, { nullable: true })
  paidAt?: Date;

  @Field({ nullable: true })
  paymentMethod?: string;
}
