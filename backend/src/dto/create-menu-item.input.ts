import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateMenuItemInput {
  @Field()
  name: string;

  @Field()
  description: string;

  @Field()
  price: number;
}
