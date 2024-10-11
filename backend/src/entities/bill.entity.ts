import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ObjectType, Field, ID, Float } from '@nestjs/graphql';
import { Order } from './order.entity';

@ObjectType()
@Schema()
export class Bill {
  @Field(() => ID)
  _id: Types.ObjectId;

  @Field(() => ID)
  @Prop({ type: Types.ObjectId, ref: 'Table', required: true })
  tableId: Types.ObjectId;

  @Field()
  @Prop({ required: true })
  username: string;

  @Field(() => [ID])
  @Prop({ type: [{ type: Types.ObjectId, ref: 'Order' }] })
  orderIds: Types.ObjectId[];

  @Field(() => [Order])
  orders: Order[];

  @Field(() => Float)
  @Prop({ required: true, default: 0 })
  totalAmount: number;

  @Field()
  @Prop({ required: true, enum: ['Open', 'Closed'], default: 'Open' })
  status: string;
}

export type BillDocument = Bill & Document;
export const BillSchema = SchemaFactory.createForClass(Bill);
