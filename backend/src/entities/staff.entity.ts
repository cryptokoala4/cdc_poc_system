import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@ObjectType()
@Schema()
export class Staff {
  @Field(() => ID)
  @Prop({ type: Types.ObjectId, auto: true })
  _id: Types.ObjectId;

  @Field()
  @Prop({ required: true, trim: true })
  name: string;

  @Field()
  @Prop({ required: true, trim: true, unique: true })
  username: string;

  @Prop({ required: true })
  password: string;

  @Field()
  @Prop({ required: true, trim: true, enum: ['Waiter', 'Manager'] })
  role: string;
}

export type StaffDocument = Staff & Document;
export const StaffSchema = SchemaFactory.createForClass(Staff);
