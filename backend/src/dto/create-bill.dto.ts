import { InputType, Field, ID } from '@nestjs/graphql';
import { IsString, IsArray, ValidateNested, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';
import { OrderItemInput } from './order-item.input';

@InputType()
export class CreateBillDto {
  @Field(() => ID)
  @IsString()
  @IsNotEmpty()
  tableId: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  username: string;

  @Field(() => [OrderItemInput])
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemInput)
  orderItems: OrderItemInput[];
}
