import { ObjectType, Field, ID, Int } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

@ObjectType()
@Schema()
export class Table {
  @Field(() => ID)
  _id: string;

  @Field(() => Int)
  @Prop()
  number: number;

  @Field(() => Int)
  @Prop()
  capacity: number;

  @Field()
  @Prop({ default: false })
  isOccupied: boolean;

  @Field(() => ID, { nullable: true })
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Bill', default: null })
  currentBillId: string | null;

  @Field(() => ID, { nullable: true })
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Customer', default: null })
  customerId: string | null;
}

export type TableDocument = Table & Document;
export const TableSchema = SchemaFactory.createForClass(Table);
