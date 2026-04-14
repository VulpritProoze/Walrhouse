import { OrderStatus } from '@/features/sales-order/types';

export interface SalesOrderDto {
  id: number;
  status: OrderStatus | null;
  customerName: string | null;
  remarks: string | null;
  orderLines: OrderLineDto[];
}

export interface OrderLineDto {
  docEntry?: string;
  itemCode: string;
  unitOfMeasure: string;
  orderedQty: number;
  pickedQty?: number;
}
