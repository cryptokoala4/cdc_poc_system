import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { ObjectType, Field, ID, Float } from '@nestjs/graphql';
import { OrderItem } from './shared-types';

export type BillDocument = Bill & Document;

@ObjectType()
@Schema()
export class Bill {
  @Field(() => ID)
  _id: MongooseSchema.Types.ObjectId;

  @Field(() => ID)
  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'Table' })
  tableId: MongooseSchema.Types.ObjectId;

  @Field()
  @Prop({ required: true })
  username: string;

  @Field(() => [ID])
  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Order' }] })
  orderIds: MongooseSchema.Types.ObjectId[];

  @Field(() => [OrderItem])
  @Prop({ type: [{ itemId: MongooseSchema.Types.ObjectId, quantity: Number }] })
  orderItems: OrderItem[];

  @Field(() => Float)
  @Prop({ required: true })
  totalAmount: number;

  @Field()
  @Prop({ required: true, enum: ['Open', 'Closed', 'Paid'], default: 'Open' })
  status: string;

  @Field(() => Date, { nullable: true })
  @Prop()
  paidAt?: Date;

  @Field({ nullable: true })
  @Prop()
  paymentMethod?: string;

  @Field(() => Date)
  @Prop({ default: Date.now })
  createdAt: Date;

  @Field(() => Date)
  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const BillSchema = SchemaFactory.createForClass(Bill);
