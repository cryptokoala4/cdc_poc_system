import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@ObjectType()
@Schema()
export class Staff {
  @Field(() => ID)
  _id: string;

  @Field()
  @Prop()
  name: string;

  @Field()
  @Prop()
  role: string;
}

export type StaffDocument = Staff & Document;
export const StaffSchema = SchemaFactory.createForClass(Staff);
