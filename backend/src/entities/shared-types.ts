import { ObjectType, InputType, Field, ID, Int, Float } from '@nestjs/graphql';
import { Schema as MongooseSchema } from 'mongoose';
import { IsNumber, IsString, Min } from 'class-validator';

@ObjectType()
export class OrderItem {
  @Field(() => ID)
  itemId: MongooseSchema.Types.ObjectId;

  @Field(() => Float)
  quantity: number;
}

@InputType()
export class OrderItemInput {
  @Field(() => ID)
  @IsString()
  itemId: string;

  @Field(() => Int)
  @IsNumber()
  @Min(1)
  quantity: number;
}
