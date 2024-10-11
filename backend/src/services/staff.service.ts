import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Staff, StaffDocument } from '../entities/staff.entity';
import { ServiceResponse } from '../interfaces/service-response.interface';

@Injectable()
export class StaffService {
  constructor(
    @InjectModel(Staff.name) private staffModel: Model<StaffDocument>,
  ) {}

  async findAll(): Promise<ServiceResponse<Staff[]>> {
    try {
      const staff = await this.staffModel.find().exec();
      return {
        success: true,
        message: 'Staff members retrieved successfully',
        data: staff,
      };
    } catch {
      return {
        success: false,
        message: 'Failed to retrieve staff members',
        data: [],
      };
    }
  }

  async findOne(_id: string): Promise<ServiceResponse<Staff | null>> {
    try {
      const staff = await this.staffModel
        .findById(new Types.ObjectId(_id))
        .exec();
      if (!staff) {
        return {
          success: false,
          message: `Staff member with ID ${_id} not found`,
          data: null,
        };
      }
      return {
        success: true,
        message: 'Staff member found successfully',
        data: staff,
      };
    } catch {
      return {
        success: false,
        message: `Failed to find staff member with ID ${_id}`,
        data: null,
      };
    }
  }

  async findByUsername(
    username: string,
  ): Promise<ServiceResponse<Staff | null>> {
    try {
      const staff = await this.staffModel.findOne({ username }).exec();
      if (!staff) {
        return {
          success: false,
          message: `Staff member with username ${username} not found`,
          data: null,
        };
      }
      return {
        success: true,
        message: 'Staff member found successfully',
        data: staff,
      };
    } catch {
      return {
        success: false,
        message: `Failed to find staff member with username ${username}`,
        data: null,
      };
    }
  }

  async validateStaff(
    username: string,
    password: string,
  ): Promise<ServiceResponse<Staff | null>> {
    try {
      const staff = await this.staffModel.findOne({ username }).exec();
      if (!staff || staff.password !== password) {
        return {
          success: false,
          message: 'Invalid username or password',
          data: null,
        };
      }
      return {
        success: true,
        message: 'Staff member validated successfully',
        data: staff,
      };
    } catch {
      return {
        success: false,
        message: 'Failed to validate staff member',
        data: null,
      };
    }
  }

  async login(
    username: string,
    password: string,
  ): Promise<ServiceResponse<Staff | null>> {
    try {
      const staff = await this.staffModel
        .findOne({ username, password })
        .exec();
      if (!staff) {
        return {
          success: false,
          message: 'Invalid username or password',
          data: null,
        };
      }
      return {
        success: true,
        message: 'Login successful',
        data: staff,
      };
    } catch {
      return {
        success: false,
        message: 'Login failed',
        data: null,
      };
    }
  }
}
