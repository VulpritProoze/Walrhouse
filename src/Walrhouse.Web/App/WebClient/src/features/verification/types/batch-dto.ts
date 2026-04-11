import type { BatchStatus } from '@/features/batch/types';

export interface BatchDto {
  batchNumber: string;
  itemCode: string;
  expiryDate: string; // ISO datetime
  status?: BatchStatus;
  binNo?: string;
}
