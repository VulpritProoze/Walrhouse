import { useQuery } from '@tanstack/react-query';
import { getUser } from '@/features/user/api/user.service';

export function useUser(id: string, enabled: boolean = true) {
  return useQuery({
    queryKey: ['users', 'item', id],
    queryFn: async () => {
      const res = await getUser(id);
      return res.data;
    },
    enabled: enabled,
    staleTime: 30_000,
  });
}
