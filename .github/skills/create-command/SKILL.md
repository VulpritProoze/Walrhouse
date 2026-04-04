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

Crucial
--------
Always prefer operating on non–soft-deleted entities by filtering with the `IsDeleted` flag (e.g. include `.Where(e => !e.IsDeleted)` in reads and checks). Do not delete or update soft-deleted entities unless the user explicitly requests it.
For updates: do not apply updates to entities where `IsDeleted == true`.
Hard deletes should be reserved for `purge` commands/actions only.

Test
--------
- Run `dotnet build src/Walrhouse.AppHost` to ensure generated code compiles.