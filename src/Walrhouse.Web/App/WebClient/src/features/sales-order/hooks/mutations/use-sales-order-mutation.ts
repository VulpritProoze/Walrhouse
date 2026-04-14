import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  createSalesOrder,
  updateSalesOrder,
  deleteSalesOrder,
  type CreateSalesOrderRequest,
  type UpdateSalesOrderRequest,
} from '@/features/sales-order/api/sales-order.service';

export function useCreateSalesOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateSalesOrderRequest) => {
      const res = await createSalesOrder(data);
      return res.data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['sales-orders', 'list'] }),
  });
}

export function useUpdateSalesOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: UpdateSalesOrderRequest }) => {
      const res = await updateSalesOrder(id, data);
      return res.data;
    },
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: ['sales-orders', 'list'] });
      qc.invalidateQueries({ queryKey: ['sales-orders', 'item', vars.id] });
    },
  });
}

export function useDeleteSalesOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const res = await deleteSalesOrder(id);
      return res.data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['sales-orders', 'list'] }),
  });
}
