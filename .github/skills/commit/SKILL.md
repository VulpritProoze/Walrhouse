---
name: commit
description: "Create atomic commits from changes following docs/ai/commits.md."
user-invocable: true
argument-hint: "mode: dry-run|auto|minimal-auto; allowPush: boolean"
---

# Commit Skill

Purpose: Create atomic Conventional Commits per `docs/ai/commits.md`.

Modes:
- `dry-run`: Propose commits/patches; no changes.
- `auto`: Propose, await approval, then commit.
- `minimal-auto`: Commit automatically; output hash and message only.

Steps:
1. Ensure Git root and branch != `main`.
2. Review `docs/ai/commits.md` rules.
3. Group changes into atomic feature/fix sets.
4. For each set:
   - Generate `type(scope): description` (≤100 chars).
   - If `minimal-auto`, commit immediately and skip step 5.
5. If not `minimal-auto`, present proposal and await approval.
6. Apply patches and commit.
7. If `allowPush:true` and approved, push branch.

Guardrails:
- No commits to `main` (branch first).
- Infra/schema changes require PR and human approval.
- Respect `.gitignore`.
