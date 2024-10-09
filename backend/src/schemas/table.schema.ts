import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type TableDocument = Table & Document;

@Schema()
export class Table {
  @Prop({ required: true, unique: true })
  number: number;

  @Prop({ type: Types.ObjectId, ref: 'Bill' })
  currentBill: Types.ObjectId;

  @Prop({ required: true, default: false })
  isOccupied: boolean;
}

export const TableSchema = SchemaFactory.createForClass(Table);
