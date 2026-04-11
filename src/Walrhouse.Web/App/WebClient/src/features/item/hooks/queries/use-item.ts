import { useQuery } from '@tanstack/react-query';
import { getItem, getItems, type GetItemsRequest } from '@/features/item/api/item.service';

export function useItems(params?: GetItemsRequest) {
  return useQuery({
    queryKey: ['items', 'list', params ?? {}],
    queryFn: async () => {
      const res = await getItems(params);
      return res.data;
    },
    staleTime: 30_000,
  });
}

export function useItem(itemCode: string, enabled: boolean = true) {
  return useQuery({
    queryKey: ['items', 'item', itemCode],
    queryFn: async () => {
      const res = await getItem(itemCode);
      return res.data;
    },
    enabled: enabled,
    staleTime: 30_000,
  });
}

export default { useItems, useItem };
