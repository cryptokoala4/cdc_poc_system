import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Staff, StaffDocument } from '../entities/staff.entity';

@Injectable()
export class StaffService {
  constructor(@InjectModel('Staff') private staffModel: Model<StaffDocument>) {}

  async findAll(): Promise<Staff[]> {
    return this.staffModel.find().exec();
  }

  async findOne(id: string): Promise<Staff | null> {
    return this.staffModel.findById(id).exec();
  }

  async create(createStaffInput: Partial<Staff>): Promise<Staff> {
    const newStaff = new this.staffModel(createStaffInput);
    return newStaff.save();
  }

  async update(
    id: string,
    updateStaffInput: Partial<Staff>,
  ): Promise<Staff | null> {
    return this.staffModel
      .findByIdAndUpdate(id, updateStaffInput, { new: true })
      .exec();
  }

  async remove(id: string): Promise<Staff | null> {
    return this.staffModel.findByIdAndDelete(id).exec();
  }
}
