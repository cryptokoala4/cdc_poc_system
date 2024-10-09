import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Bill, BillDocument } from '../entities/bill.entity';

@Injectable()
export class BillsService {
  constructor(@InjectModel(Bill.name) private billModel: Model<BillDocument>) {}

  async findAll(): Promise<Bill[]> {
    return this.billModel.find().exec();
  }

  async findOne(_id: string): Promise<Bill> {
    return this.billModel.findById(_id).exec();
  }
}
