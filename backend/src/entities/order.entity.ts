import { ObjectType, Field, ID, Float } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { OrderItem } from './shared-types';

@ObjectType()
@Schema({ timestamps: true })
export class Order {
  @Field(() => ID)
  _id: MongooseSchema.Types.ObjectId;

  @Field(() => ID)
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Table', required: true })
  tableId: MongooseSchema.Types.ObjectId;

  @Field(() => String)
  @Prop({ type: String, required: true, trim: true })
  username: string;

  @Field(() => [OrderItem])
  @Prop([
    {
      itemId: { type: MongooseSchema.Types.ObjectId, ref: 'Item' },
      quantity: Number,
    },
  ])
  items: OrderItem[];

  @Field(() => Float)
  @Prop({ type: Number, required: true, default: 0, min: 0 })
  totalAmount: number;

  @Field(() => String)
  @Prop({
    type: String,
    required: true,
    default: 'Open',
    enum: ['Open', 'Closed', 'Cancelled'],
  })
  status: string;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;
}

export type OrderDocument = Order & Document;
export const OrderSchema = SchemaFactory.createForClass(Order);
