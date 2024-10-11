import { InputType, Field, ID, Float } from '@nestjs/graphql';
import { IsString, IsNumber, Min } from 'class-validator';

@InputType()
export class OrderItemInput {
  @Field(() => ID)
  @IsString()
  itemId: string;

  @Field(() => Float)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  quantity: number;
}
