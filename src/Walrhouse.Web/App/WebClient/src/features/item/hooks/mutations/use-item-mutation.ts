import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  createItem,
  updateItem,
  deleteItem,
  type CreateItemRequest,
  type UpdateItemRequest,
} from '@/features/item/api/item.service';

export function useCreateItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateItemRequest) => {
      const res = await createItem(data);
      return res.data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['items', 'list'] }),
  });
}

export function useUpdateItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ itemCode, data }: { itemCode: string; data: UpdateItemRequest }) => {
      const res = await updateItem(itemCode, data);
      return res.data;
    },
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: ['items', 'list'] });
      qc.invalidateQueries({ queryKey: ['items', 'item', vars.itemCode] });
    },
  });
}

export function useDeleteItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (itemCode: string) => {
      const res = await deleteItem(itemCode);
      return res.data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['items', 'list'] }),
  });
}
