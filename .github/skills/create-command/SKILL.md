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
