---
title: Commit Guidelines
audience: agents, developers
format: short
---

# Commit Guidelines (short)

Purpose: Standardize commits for humans and agents. Follow Conventional Commits and make atomic, traceable changes.

Rules
- Use Conventional Commits: `type(scope): description` (description < 100 chars).
- Keep commits atomic: one logical change per commit. Commit each edit/change you make (not every file), and include only files you edited.
- Always check branch: never commit directly to `main` — create/checkout a feature or task branch first.
- Priority naming for scope: `feature e.g. fix(warehouse)` - `project e.g. feat(application)` - `[specific] e.g. docs(commands-cqrs)` or can also combine `fix(application-warehouse)` on some cases only.

Commit message structure
- Header: `type(scope): short description`  
	- `type` examples: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `chore`.
	- `scope` is optional (e.g., `Items`, `Warehouses`).
- Blank line
- Body (optional): one or two short paragraphs explaining rationale, migration notes, or steps to review.
- Keep message concise yet meaningful. Prefer a more specific message, and separate commit if needed.

Example
- `feat(Warehouses): add CreateWarehouse command handler`  

Agent rules
- Agents must create a single commit per prompt/action and include only files they modified.
- Agents must never perform destructive commits or modify files outside their edit scope.
- For infra, schema, or dependency changes: propose a PR and request human approval before committing.

Quick checklist before committing
1. Ensure branch is not `main`.
2. Verify changes are atomic and related.
3. Run tests/lint if applicable.
4. Commit with Conventional Commit format and push branch, then open a PR.

