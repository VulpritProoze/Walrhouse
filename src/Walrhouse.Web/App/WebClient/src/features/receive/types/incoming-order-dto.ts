import { OrderStatus } from '@/features/sales-order/types';

export { OrderStatus as IncomingOrderStatus };

export interface IncomingOrderLineDto {
  docEntry?: string;
  batchNumbers: string[];
}

export interface IncomingOrderDto {
  id: number;
  dueDate: string | null;
  status: OrderStatus | null;
  closedBy: string | null;
  customerName: string | null;
  remarks: string | null;
  orderLines: IncomingOrderLineDto[];
}
