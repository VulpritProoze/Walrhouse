# TanStack Query Hooks Format

One-line summary: Standardized patterns for TanStack Query mutations and queries within the Walrhouse WebClient.

## Purpose
To ensure consistent data fetching, caching, and state invalidation across all frontend features using TanStack Query.


## Mutation Format
Mutations should handle optimistic updates or invalidations to keep the UI in sync.

```typescript
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  create<Feature>, 
  update<Feature>, 
  delete<Feature>,
  type Create<Feature>Request,
  type Update<Feature>Request 
} from '@/features/<feature>/api/<feature>.service';

export function useCreate<Feature>() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: Create<Feature>Request) => {
      const res = await create<Feature>(data);
      return res.data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['<feature-kebab>', 'list'] }),
  });
}

export function useUpdate<Feature>() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Update<Feature>Request }) => {
      const res = await update<Feature>(id, data);
      return res.data;
    },
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: ['<feature-kebab>', 'list'] });
      qc.invalidateQueries({ queryKey: ['<feature-kebab>', 'item', vars.id] });
    },
  });
}

export function useDelete<Feature>() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const res = await delete<Feature>(id);
      return res.data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['<feature-kebab>', 'list'] }),
  });
}
```

## Query Format
Queries should provide sensible defaults for caching and support optional enablement.

```typescript
import { useQuery } from '@tanstack/react-query';
import {
  get<Feature>,
  get<Feature>s,
  type Get<Feature>sRequest,
} from '@/features/<feature>/api/<feature>.service';

export function use<Feature>s(params?: Get<Feature>sRequest) {
  return useQuery({
    queryKey: ['<feature-kebab>', 'list', params ?? {}],
    queryFn: async () => {
      const res = await get<Feature>s(params);
      return res.data;
    },
    staleTime: 30_000,
  });
}

export function use<Feature>(id: number, enabled: boolean = true) {
  return useQuery({
    queryKey: ['<feature-kebab>', 'item', id],
    queryFn: async () => {
      const res = await get<Feature>(id);
      return res.data;
    },
    enabled: enabled,
    staleTime: 30_000,
  });
}
```

## Related
- [Endpoints Docs](docs/ai/web/endpoints.md)
- [WebClient API Docs](docs/ai/web/webclient-api.md)

## Change Note
Initial documentation for TanStack hook standards to improve repository consistency during AI-assisted scaffolding.
