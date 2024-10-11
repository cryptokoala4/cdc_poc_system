import { ObjectType, Field, ID, Int } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@ObjectType()
@Schema()
export class Table {
  @Field(() => ID)
  @Prop({ type: Types.ObjectId, auto: true })
  _id: Types.ObjectId;

  @Field(() => Int)
  @Prop({ required: true, unique: true, min: 1 })
  number: number;

  @Field(() => Int)
  @Prop({ required: true, min: 1 })
  seats: number;

  @Field(() => Boolean)
  @Prop({ default: false })
  isOccupied: boolean;

  @Field(() => ID, { nullable: true })
  @Prop({ type: Types.ObjectId, ref: 'Bill', default: null })
  currentBillId: Types.ObjectId | null;

  @Field(() => String, { nullable: true })
  @Prop({ type: String, default: null })
  lockedBy: string | null;

  @Field(() => Date, { nullable: true })
  @Prop({ type: Date, default: null })
  lockedAt: Date | null;
}

export type TableDocument = Table & Document;
export const TableSchema = SchemaFactory.createForClass(Table);
