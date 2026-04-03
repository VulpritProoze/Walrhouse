Copilot instructions — Walrhouse (condensed)

Purpose: Guide Copilot for this `Walrhouse` workspace (root project).

Scope: Applies to this repository root only. Respect `.gitignore`; do not read or modify ignored files.

Run (dev):
```
dotnet watch run --project src/Walrhouse.AppHost
```

Architecture: Follow Jason Taylor's Clean Architecture (AppHost orchestrates; Web = API + React; Infrastructure = EF Core). Inspect `Program.cs` and `ApplicationDbContext` for entry points.

Guardrails: Never apply migrations, change infra, or update production secrets without explicit human approval. Open a PR for schema, dependency, or infra changes.

Commit rules: For agent-made edits create a commit per prompt; include only the files this agent edited; do not perform destructive commits; commit only your edited code. See `(project_root)/docs/ai/commits.md` for details.

Discovery triggers (use when): "scaffold endpoint", "add migration", "create handler", "run tests".

Behavior: Prefer root-cause fixes; return entity Ids for commands; propose PRs for non-trivial changes and require approvals for infra.
