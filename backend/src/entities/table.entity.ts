import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Bill } from './bill.entity';

export type TableDocument = Table & Document;

@ObjectType()
@Schema()
export class Table {
  @Field(() => ID)
  _id: string;

  @Field()
  @Prop({ required: true, unique: true })
  number: number;

  @Field(() => Bill, { nullable: true })
  @Prop({ type: Types.ObjectId, ref: 'Bill' })
  currentBill: Types.ObjectId;

  @Field()
  @Prop({ required: true, default: false })
  isOccupied: boolean;
}

export const TableSchema = SchemaFactory.createForClass(Table);
