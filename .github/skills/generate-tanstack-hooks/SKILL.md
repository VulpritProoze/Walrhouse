---
name: generate-tanstack-hooks
description: "Use when: scaffolding or extending TanStack Query hooks (mutations and queries) for a feature. Handles c/u/d mutations and fetch/batch fetch queries using the standardized Walrhouse format. Use trigger words: 'scaffold hook', 'create mutation', 'generate query'."
argument-hint: "feature name (e.g. sales-order)"
---

# Generate TanStack Query Hooks

Follow this standardized workflow to create or extend TanStack Query hooks for any feature in the Walrhouse WebClient.

## Prerequisites
- Feature must have an API service file at `src/features/<feature>/api/<feature>.service.ts`.
- Refer to [docs/ai/web/tanstack-hooks-format.md](../../../docs/ai/web/tanstack-hooks-format.md) for the exact code templates.

## Workflow

### 1. Identify Scope
Determine if the user needs:
- **Mutations**: Create (C), Update (U), or Delete (D).
- **Queries**: Single item fetch or Paginated/List batch fetch.

### 2. File Organization
Hooks must be placed in specific subfolders based on their type:
- **Path**: `src/features/<feature>/hooks/<mutations | queries>/<file>.ts`
- **Barrel Exports**: Ensure `src/features/<feature>/hooks/<type>/index.ts` exists and exports the new hook.

### 3. Implementation Patterns

#### For Queries (Fetching)
- Name: `use<Feature>s` (list) or `use<Feature>` (item).
- Key Format: `['<feature-kebab>', 'list' | 'item', id/params]`.
- Default `staleTime`: 30,000ms.
- Always include an `enabled` parameter for single item hooks.

#### For Mutations (C/U/D)
- Name: `useCreate<Feature>`, `useUpdate<Feature>`, `useDelete<Feature>`.
- Invalidation:
  - `onSuccess` must invalidate the `['<feature-kebab>', 'list']` key.
  - `useUpdate` must also invalidate the specific item key: `['<feature-kebab>', 'item', vars.id]`.

### 4. Integration
- Consumers should import hooks from `@/features/<feature>/hooks/<mutations | queries>`.
- Verify that `index.ts` in the feature root (if present) exports the hooks for higher-level access.

## Example Triggers
- "Scaffold queries for the warehouse feature"
- "Add a delete mutation hook for SalesOrders"
- "Create hooks for fetching a single item by ID"
