import { Table } from '../entities/table.entity';

export interface TableOperationResponse {
  success: boolean;
  message: string;
  table: Table | null;
}
