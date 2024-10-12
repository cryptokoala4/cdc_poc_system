import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ObjectType, Field, ID, Float } from '@nestjs/graphql';

@ObjectType()
@Schema({ timestamps: true })
export class MenuItem {
  @Field(() => ID)
  @Prop({ type: Types.ObjectId, auto: true })
  _id: Types.ObjectId;

  @Field()
  @Prop({ required: true, trim: true })
  name: string;

  @Field()
  @Prop({ required: true, trim: true })
  description: string;

  @Field(() => Float)
  @Prop({ required: true, min: 0 })
  price: number;

  @Field()
  @Prop({ required: true, trim: true })
  category: string;

  @Field()
  @Prop({ required: true, trim: true })
  imageUrl: string;
}

export type MenuItemDocument = MenuItem & Document;
export const MenuItemSchema = SchemaFactory.createForClass(MenuItem);
