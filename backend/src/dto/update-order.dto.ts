import { InputType, Field } from '@nestjs/graphql';
import { IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { OrderItemInput } from '../entities/shared-types';

@InputType()
export class UpdateOrderDto {
  @Field(() => [OrderItemInput])
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemInput)
  items: OrderItemInput[];
}
