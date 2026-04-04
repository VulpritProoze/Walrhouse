---
name: create-query
description: "Scaffold Application-layer Query handlers (paginated lists and single-entity) and validators. See docs for examples."
user-invocable: true
argument-hint: "entity: string (required); queryType: list|single (default: list); idParameter: string (optional; e.g. Id, ItemCode)"
compatibility: v1
---

# create-query Skill (concise)

Purpose
-------
Scaffold Query handlers using the project's CQRS templates. Batch/list queries are paginated by default; single-entity queries prompt for the identifier to use.

References
----------
- Queries templates: [docs/ai/application/queries-cqrs.md](../../../docs/ai/application/queries-cqrs.md)
- DTO guidelines: [docs/ai/application/dtos-cqrs.md](../../../docs/ai/application/dtos-cqrs.md)

Behavior (short)
----------------
- If `queryType` is `list` (default): generate a paginated `Get<Entity>s` query and handler.
- If `queryType` is `single`: ask which identifier to use (e.g., `Id`, `ItemCode`, `Sku`) if `idParameter` is not provided, then generate `Get<Entity>ById` query and handler and a simple validator.
- Create folder `src/Walrhouse.Application/<Entity>/Queries/<QueryName>/` and files:
  - `<QueryName>.cs` (handler + record)
  - `<QueryName>Validator.cs` (for single-entity queries or when parameters exist)
- Return `createdFiles` and a short `summary`.

Notes
-----
- Always use projection (`ProjectTo`) and `AsNoTracking()` for list queries.
- Do not commit automatically; use the `commit` skill to create commits.
- Check `GlobalUsings.cs` for commonly used namespaces to include in the generated files.

Crucial
--------
Always prefer operating on non–soft-deleted entities by filtering with the `IsDeleted` flag (e.g. include `.Where(e => !e.IsDeleted)` in read handlers). Do not return or act on soft-deleted entities unless the user explicitly requests it.
For updates: do not apply updates to entities where `IsDeleted == true`.
Only a `purge` command or action may perform a hard delete.

Test
--------
- Run `dotnet build src/Walrhouse.AppHost` to ensure generated code compiles.
