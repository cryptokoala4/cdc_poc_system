import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ObjectType, Field, ID, Float } from '@nestjs/graphql';

@ObjectType()
@Schema()
export class MenuItem {
  @Field(() => ID)
  @Prop({ type: String })
  _id: string;

  @Field()
  @Prop({ required: true })
  name: string;

  @Field(() => Float)
  @Prop({ required: true })
  price: number;
}

export type MenuItemDocument = MenuItem & Document;
export const MenuItemSchema = SchemaFactory.createForClass(MenuItem);
