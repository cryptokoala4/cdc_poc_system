import { ObjectType, InputType, Field, ID, Float } from '@nestjs/graphql';
import { Types } from 'mongoose';
import { IsNumber, IsString, Min } from 'class-validator';

@ObjectType()
export class OrderItem {
  @Field(() => ID)
  itemId: Types.ObjectId;

  @Field(() => Float)
  quantity: number;

  @Field(() => Float, { nullable: true })
  price: number;

  @Field(() => String, { nullable: true })
  name: string;
}

@InputType()
export class OrderItemInput {
  @Field(() => ID)
  @IsString()
  itemId: string;

  @Field(() => Float)
  @IsNumber()
  @Min(1)
  quantity: number;

  @Field(() => Float)
  @IsNumber()
  @Min(1)
  price: number;

  @Field(() => String)
  name: string;
}
