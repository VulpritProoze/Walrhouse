import { useQuery } from '@tanstack/react-query';
import {
  getSalesOrder,
  getSalesOrders,
  type GetSalesOrdersRequest,
} from '@/features/sales-order/api/sales-order.service';

export function useSalesOrders(params?: GetSalesOrdersRequest) {
  return useQuery({
    queryKey: ['sales-orders', 'list', params ?? {}],
    queryFn: async () => {
      const res = await getSalesOrders(params);
      return res.data;
    },
    staleTime: 30_000,
  });
}

export function useSalesOrder(id: number, enabled: boolean = true) {
  return useQuery({
    queryKey: ['sales-orders', 'item', id],
    queryFn: async () => {
      const res = await getSalesOrder(id);
      return res.data;
    },
    enabled: enabled,
    staleTime: 30_000,
  });
}
