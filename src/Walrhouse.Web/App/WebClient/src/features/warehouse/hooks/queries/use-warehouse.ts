import { useQuery } from '@tanstack/react-query';
import { getWarehouse, getWarehouses, type GetWarehousesRequest } from '@/features/warehouse/api';

export function useWarehouses(params?: GetWarehousesRequest) {
  return useQuery({
    queryKey: ['warehouses', 'list', params ?? {}],
    queryFn: async () => {
      const res = await getWarehouses(params);
      return res.data;
    },
    staleTime: 30_000,
  });
}

export function useWarehouse(warehouseCode: string, enabled: boolean = true) {
  return useQuery({
    queryKey: ['warehouses', 'item', warehouseCode],
    queryFn: async () => {
      const res = await getWarehouse(warehouseCode);
      return res.data;
    },
    enabled: enabled,
    staleTime: 30_000,
  });
}

export default { useWarehouses, useWarehouse };
