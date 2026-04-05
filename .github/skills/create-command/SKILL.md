---
name: create-command
description: "Scaffold Application-layer Command handlers and validators (concise). See docs for details."
user-invocable: true
argument-hint: "entity: string (required); commandType: create|update|delete|purge (default: create); idParameter: string (optional)"
compatibility: v1
---

# create-command Skill (concise)

Purpose
-------
Scaffold a Command handler and — when parameters are present — a separate validator.

See the canonical templates and examples here: [docs/ai/application/commands-cqrs.md](../../../docs/ai/application/commands-cqrs.md)

Behavior (short)
----------------
- Prompt for `entity`, `commandType`, and `idParameter` when missing (ask which identifier to use, e.g., `Id`, `ItemCode`).
- Create `src/Walrhouse.Application/<Entity>/Commands/<CommandName>/` and the files:
  - `<CommandName>.cs`
  - `<CommandName>Validator.cs` (if command has parameters)
- Return `createdFiles` and a brief `summary`.

Notes
-----
- Do not commit automatically; use the `commit` skill to create commits.
- Follow `Walrhouse.Application` naming and mapping conventions.
- Check `GlobalUsings.cs` for commonly used namespaces to include in the generated files.
 - Use Ardalis.GuardClauses instead of throwing classic exceptions if possible.
 - If a field references another entity (e.g., `WarehouseCode`), query it first, `Guard.Against.Null` if missing, then assign.

Crucial
--------
Always prefer non–soft-deleted entities (`Where(e => !e.IsDeleted)`). Do not modify soft-deleted entities unless requested.
- Create: if match exists and `IsDeleted == true`, restore it (reset fields, update collections, set `IsDeleted = false`).
- Update: require only the identifier; other fields optional — null means "no change".
- Collections: modify the existing navigation collection (clear+add or sync); don't replace it.
Hard deletes are for `purge` actions only.

Test
--------
- Run `dotnet build src/Walrhouse.AppHost` to ensure generated code compiles.