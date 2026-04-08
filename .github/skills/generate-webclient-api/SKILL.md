---
name: generate-webclient-api
description: 'Scaffold or extend WebClient feature API services from endpoint files (e.g., Warehouse.cs). Use when creating src/[feature]/api/[feature].service.ts and index.ts with @/lib/axios, no try/catch, and endpoint-aligned methods.'
argument-hint: 'feature/entity (e.g., Item, Verification); endpoint reference (e.g., #file:Warehouse.cs); what to do (scaffold all endpoints or add one method)'
---

# Generate WebClient API

Create or update WebClient feature API files by reading backend endpoints and producing a concise, consistent service layer.

## Inputs
- Feature/entity name: e.g., `Item`, `Verification`, `Warehouse`
- Endpoint reference: e.g., `#file:Warehouse.cs`
- Action: scaffold full service or add one API method

## Output
- See the canonical formats and examples in [webclient-api reference](../../../docs/ai/web/webclient-api.md).

## Procedure
1. Read the endpoint file and map routes, verbs, route params, and query/body inputs.
2. Convert endpoint names into service method names.
3. Generate or update `src/[feature]/api/[feature].service.ts`:
   - One method per selected endpoint.
   - Use `api.get/post/put/delete` with typed request payloads when clear.
   - Keep methods thin and endpoint-focused.
   - Add documentation comments summarizing the endpoint purpose and inputs.
4. Generate or update `src/[feature]/api/index.ts`:
   - `export * from './[feature].service';`
5. If action is “add one endpoint”, append only that method and preserve existing file style.
6. Verify imports, route strings, and exported symbols are consistent.

<!-- Refer to the linked canonical doc for service/index patterns -->

## Quality Checks
- Follow the checks in the referenced doc: use `@/lib/axios` (`api`), avoid try/catch in services, do not generate `errors.ts`, and ensure route/verb parity with backend endpoints.

## Example Invocations
- `/generate-webclient-api feature=Warehouse endpoint=#file:Warehouse.cs action=scaffold all`
- `/generate-webclient-api feature=Verification endpoint=#file:Verification.cs action=add create method`

## Notes
- When endpoint DTOs are not fully clear, create minimal request interfaces and mark uncertain fields for confirmation.
- Prefer incremental updates for existing services to avoid unrelated changes.
