import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Table {
  @Field(() => ID)
  id: string;

  @Field()
  tableNumber: number;

  @Field()
  capacity: number;

  @Field()
  isOccupied: boolean;

  @Field({ nullable: true })
  currentBillId?: string;
}
