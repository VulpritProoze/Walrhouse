title: WebClient API — client-side API file format
summary: Short guide describing the WebClient `api` folder layout and canonical `*.service.ts`, `index.ts` formats.
audience: developers, agents
format: short
---

# WebClient API (short)

One-line summary
- Canonical layout and minimal examples for client-side API files used by WebClient features.

Purpose
- Standardize `WebClient` feature API files so agents and devs write consistent services.

When to use
- Add this when creating a new feature under `Web/App/WebClient/src/features/[feature]/api`.

Folder layout (convention)
- Root: Web/App/WebClient/src/features/[feature]/api/
- Files per feature:
  - `[feature].service.ts` — service functions / HTTP calls
  - `index.ts` — re-exports (service)

Service file format (canonical)
```ts
// [feature].service.ts
import { api } from '@/lib/axios'; // shared axios instance


export interface EndpointRequest {
    // ...fields here
}

/**
 * Endpoint description
 *
 * @remarks
 * Endpoint remarks (optional)
 *
 * @returns endpoint response.
 * @throws exceptions or HTTP status code errors
 *
 * @example
 * const { data } = await endpointName();
 * console.log(data.field, data.field_2);
 */
export const endpointName(data: EndpointRequest) => await api.get('/api/feature', { params });
// and other methods...
```

index.ts (re-exports)
```ts
export * from './feature.service';
```

Example invocation (pattern)
- Call service method from UI: `const { data } = await endpointName({ page: 1 });`

Related notes
- Keep services thin: delegate URL construction and auth headers to a shared `api` wrapper (`@/lib/axios`).
- Do not catch errors in service files; let callers handle exceptions or use a global axios interceptor.

Change / PR note
- Add this file when creating a new WebClient API feature. Small, non-breaking doc — include feature-specific examples in the feature folder if needed.
