import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  createUoMGroup,
  updateUoMGroup,
  deleteUoMGroup,
  type CreateUoMGroupRequest,
  type UpdateUoMGroupRequest,
} from '@/features/uom-group/api/uom-group.service';

export function useCreateUoMGroup() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateUoMGroupRequest) => {
      const res = await createUoMGroup(data);
      return res.data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['uom-groups', 'list'] }),
  });
}

export function useUpdateUoMGroup() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: UpdateUoMGroupRequest }) => {
      const res = await updateUoMGroup(id, data);
      return res.data;
    },
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: ['uom-groups', 'list'] });
      qc.invalidateQueries({ queryKey: ['uom-groups', 'item', vars.id] });
    },
  });
}

export function useDeleteUoMGroup() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const res = await deleteUoMGroup(id);
      return res.data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['uom-groups', 'list'] }),
  });
}
