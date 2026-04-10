import { useQuery } from '@tanstack/react-query';
import {
  getUoMGroup,
  getUoMGroups,
  type GetUoMGroupsRequest,
} from '@/features/uom-group/api/uom-group.service';

export function useUoMGroups(params?: GetUoMGroupsRequest) {
  return useQuery({
    queryKey: ['uom-groups', 'list', params ?? {}],
    queryFn: async () => {
      const res = await getUoMGroups(params);
      return res.data;
    },
  });
}

export function useUoMGroup(id: number, enabled: boolean = true) {
  return useQuery({
    queryKey: ['uom-groups', 'item', id],
    queryFn: async () => {
      const res = await getUoMGroup(id);
      return res.data;
    },
    enabled,
  });
}

export default { useUoMGroups, useUoMGroup };
