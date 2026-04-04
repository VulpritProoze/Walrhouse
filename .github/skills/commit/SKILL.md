---
name: commit
description: "Use when: create atomic commits from unstaged or uncommitted changes following docs/ai/commits.md. Continuously sift changes and build patch-based atomic commits."
user-invocable: true
argument-hint: "mode: dry-run|auto; allowPush: boolean (optional)"
---

# Commit Skill

Purpose
-------
Create small, atomic commits from the current workspace changes following `docs/ai/commits.md` (Conventional Commits, atomic edits, branch checks). Designed for interactive agent workflows where the agent proposes and optionally performs commits.

Use When
--------
- You have unstaged or uncommitted changes and want them committed atomically.
- You want the agent to interactively build patch commits using `git add -p` semantics.

Safety & Guardrails
-------------------
- Never modify or read files listed in `.gitignore`.
- Do not commit directly to `main`. If on `main`, create or ask to switch to a feature branch first.
- For infra/schema/dependency changes: propose a PR and request human approval before committing or pushing.
- By default this skill runs in `dry-run` mode and only proposes commits. `auto` mode requires explicit `allowPush:true` to push.

Behavior / Steps
----------------
1. Validate environment: ensure Git is available and workspace root is the `Walrhouse` repository.
2. Read `docs/ai/commits.md` and in-memory apply rules (Conventional Commit header format, atomicity, branch check).
3. Inspect Git status and list unstaged, staged, and uncommitted files. Exclude `.gitignore` entries.
4. Group changes into logical sets using heuristics (file path, change hunks, common edits). Suggested grouping:
   - Single-file small change → single commit
   - Multi-file logically related edits (same feature) → single commit
   - Large unrelated changes → break into multiple commits using patch selection
5. For each proposed commit:
   a. Generate a Conventional Commit header suggestion: `type(scope): short description` (≤100 chars).
   b. Create a short body describing rationale and review notes.
   c. Build a git patch list (hunks) to include; prefer `git add -p` style selection.
6. Present the list of proposed commits to the user/maintainer (commit message + files/hunks). If `mode=dry-run`, stop here and return the proposal.
7. On approval, for each approved commit:
   a. Apply the patch selections (`git add -p` equivalent) to stage only chosen hunks.
   b. Commit with the Conventional Commit message. Do not amend other authorship data.
   c. Record commit sha and summary in `commitsPerformed` output.
8. If `allowPush:true` and user requested push, and current branch != `main`, push the branch and return remote details. Otherwise, do not push automatically.

Inputs & Examples
------------------
- Example invocation (proposal): `mode=dry-run` → returns proposed commits.
- Example invocation (perform): `mode=auto, allowPush=false` → perform commits locally after confirmation, do not push.

Followups
---------
- After proposing commits, ask the user to confirm each commit or modify commit messages/hunks.
- If a commit touches infra or schema files, automatically mark it as requiring human approval and do not commit until explicitly approved.
