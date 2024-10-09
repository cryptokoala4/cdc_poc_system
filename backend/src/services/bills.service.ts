import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Bill } from '../models/bill.model';

@Injectable()
export class BillsService {
  constructor(@InjectModel('Bill') private billModel: Model<Bill>) {}

  async findAll(): Promise<Bill[]> {
    return this.billModel.find().exec();
  }

  async findOne(id: string): Promise<Bill> {
    return this.billModel.findById(id).exec();
  }
}
