import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ObjectType, Field, ID } from '@nestjs/graphql';
import { MenuItem } from './menu-item.entity';

export type BillDocument = Bill & Document;

@ObjectType()
@Schema()
export class Bill {
  @Field(() => ID)
  _id: string;

  @Field()
  @Prop({ required: true })
  tableNumber: number;

  @Field(() => [BillItem])
  @Prop([
    {
      menuItem: { type: Types.ObjectId, ref: 'MenuItem' },
      quantity: { type: Number, required: true },
    },
  ])
  items: BillItem[];

  @Field()
  @Prop({ required: true, default: false })
  isFinalized: boolean;

  @Field()
  @Prop({ required: true, default: Date.now })
  createdAt: Date;

  @Field({ nullable: true })
  @Prop()
  finalizedAt?: Date;
}

@ObjectType()
class BillItem {
  @Field(() => MenuItem)
  menuItem: MenuItem;

  @Field()
  quantity: number;
}

export const BillSchema = SchemaFactory.createForClass(Bill);
