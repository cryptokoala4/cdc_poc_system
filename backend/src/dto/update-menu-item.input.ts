import { InputType, Field, ID } from '@nestjs/graphql';

@InputType()
export class UpdateMenuItemInput {
  @Field(() => ID)
  _id: string;

  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  description?: string;

  @Field({ nullable: true })
  price?: number;
}
