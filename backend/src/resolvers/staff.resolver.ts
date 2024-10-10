import { Resolver, Query, Args, ID } from '@nestjs/graphql';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Staff, StaffDocument } from '../entities/staff.entity';

@Resolver(() => Staff)
export class StaffResolver {
  constructor(@InjectModel('Staff') private staffModel: Model<StaffDocument>) {}

  @Query(() => [Staff], { name: 'getAllStaff' })
  async findAll() {
    return this.staffModel.find().exec();
  }

  @Query(() => Staff, { name: 'getStaff', nullable: true })
  async findOne(@Args('id', { type: () => ID }) id: string) {
    return this.staffModel.findById(id).exec();
  }
}
