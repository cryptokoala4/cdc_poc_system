import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type BillDocument = Bill & Document;

@Schema()
export class Bill {
  @Prop({ required: true })
  tableNumber: number;

  @Prop([
    {
      menuItem: { type: Types.ObjectId, ref: 'MenuItem' },
      quantity: { type: Number, required: true },
    },
  ])
  items: { menuItem: Types.ObjectId; quantity: number }[];

  @Prop({ required: true, default: false })
  isFinalized: boolean;

  @Prop({ required: true, default: Date.now })
  createdAt: Date;

  @Prop()
  finalizedAt?: Date;
}

export const BillSchema = SchemaFactory.createForClass(Bill);
