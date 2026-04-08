import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  createWarehouse,
  updateWarehouse,
  deleteWarehouse,
  type CreateWarehouseRequest,
  type UpdateWarehouseRequest,
} from '@/features/warehouse/api';

export function useCreateWarehouse() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateWarehouseRequest) => {
      const res = await createWarehouse(data);
      return res.data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['warehouses', 'list'] }),
  });
}

export function useUpdateWarehouse() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      warehouseCode,
      data,
    }: {
      warehouseCode: string;
      data: UpdateWarehouseRequest;
    }) => {
      const res = await updateWarehouse(warehouseCode, data);
      return res.data;
    },
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: ['warehouses', 'list'] });
      qc.invalidateQueries({ queryKey: ['warehouses', 'item', vars.warehouseCode] });
    },
  });
}

export function useDeleteWarehouse() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (warehouseCode: string) => {
      const res = await deleteWarehouse(warehouseCode);
      return res.data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['warehouses', 'list'] }),
  });
}
