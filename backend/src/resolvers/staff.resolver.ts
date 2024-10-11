import { Resolver, Query, Args, ID, ObjectType, Field } from '@nestjs/graphql';
import { StaffService } from '../services/staff.service';
import { Staff } from '../entities/staff.entity';

@ObjectType()
class StaffOperationResult {
  @Field(() => Boolean)
  success: boolean;

  @Field(() => String)
  message: string;

  @Field(() => Staff, { nullable: true })
  staff: Staff | null;
}

@Resolver(() => Staff)
export class StaffResolver {
  constructor(private readonly staffService: StaffService) {}

  @Query(() => [Staff], { name: 'getAllStaff' })
  async findAll() {
    const response = await this.staffService.findAll();
    return response.data || [];
  }

  @Query(() => StaffOperationResult, { name: 'getStaff' })
  async findOne(
    @Args('id', { type: () => ID }) id: string,
  ): Promise<StaffOperationResult> {
    const response = await this.staffService.findOne(id);
    return {
      success: !!response.data,
      message: response.data
        ? 'Staff found successfully'
        : `Staff with ID ${id} not found`,
      staff: response.data,
    };
  }
}
