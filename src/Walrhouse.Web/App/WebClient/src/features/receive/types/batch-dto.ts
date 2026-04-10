export interface BatchDto {
  batchNumber: string;
  itemCode: string;
  expiryDate: string; // ISO date string
  status: number; // Enum: 0=Pending, 1=Active, 2=Expired, 3=Closed, 4=Inactive
  binNo: string;
}
