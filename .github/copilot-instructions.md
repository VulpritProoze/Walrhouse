Copilot instructions — Walrhouse (condensed)

Purpose: Guide Copilot for this `Walrhouse` workspace (root project).

Scope: Applies to this repository and all subfolders. Respect `.gitignore`; do not read or modify ignored files.

Run (dev):
```
dotnet watch run --project src/Walrhouse.AppHost
```

Architecture: Follow Jason Taylor's Clean Architecture (AppHost orchestrates; Web = API + React; Infrastructure = EF Core). Inspect `Program.cs` and `ApplicationDbContext` for entry points.

Guardrails: Never apply migrations, change infra, or update production secrets without explicit human approval. Open a PR for schema, dependency, or infra changes.

Commit rules: The agent will not create commits unless explicitly instructed to do so via the commit skill.

Discovery triggers (use when): "scaffold endpoint", "add migration", "create handler", "run tests".

Behavior: Prefer root-cause fixes; return entity Ids for commands; propose PRs for non-trivial changes and require approvals for infra.
