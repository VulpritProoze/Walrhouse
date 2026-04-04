---
name: create-endpoint
description: "Scaffold or extend Web endpoint files (minimal API) for an entity. See docs for template."
user-invocable: true
argument-hint: "entity: string (required); verb: create|read|update|delete (default: create); idParameter: string (optional for single-entity reads)"
compatibility: v1
---

# create-endpoint Skill (concise)

Purpose
-------
Create or extend minimal-API endpoint files under `src/Walrhouse.Web/Endpoints` using the project template.

See canonical template: [docs/ai/web/endpoints.md](../../../docs/ai/web/endpoints.md)

Behavior (short)
----------------
- Prompt for `entity` and `verb` if missing. For single-entity `read` ask which identifier to use (e.g., `Id`, `WarehouseCode`).
- If `src/Walrhouse.Web/Endpoints/<Entity>.cs` does not exist, create it using the endpoints template and add the Map calls in `Map`.
- If file exists, append the new endpoint method and add the route mapping inside the `Map` method (preserve existing code style and `RequireAuthorization()` decisions).
- For batch reads, generate paginated query usage (use `ISender` and expect an `<Entity>Dto`). For single reads, create `Get<Entity>ById` route using the chosen id parameter.
- Return `createdFiles` and a short `summary` of changes.

Notes
-----
- Do not commit automatically; use the `commit` skill to create commits.
- Follow `docs/ai/web/endpoints.md` and Application-layer naming conventions when referencing queries/commands/DTOs.
- Check `GlobalUsings.cs` for commonly used namespaces to include in the generated files.