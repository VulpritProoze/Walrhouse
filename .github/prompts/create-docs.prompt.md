---
name: create docs
description: "Use when: create agent-reference documentation. Generates a markdown doc under `docs/ai` describing a concept, tool, or workflow for agents to reference."
inputs:
  - topic: The short topic or title for the doc (required)
  - fileName: Optional file name (slug). If omitted, agent should create a safe slug from topic.
  - audience: Optional (developers | agents | reviewers). Default: developers.
  - format: Optional (short|detailed). Default: detailed.
outputs:
  - createdFilePath: Path of the created markdown file under `docs/ai`.
---

Goal
----
Create a clear, copyable markdown document under `docs/ai` that agents and developers can reference.

Constraints
-----------
- Place generated docs in `docs/ai` and return the created path.
- Respect `.gitignore` (do not read or reference ignored files).
- Keep content Markdown-friendly and include frontmatter metadata when appropriate.

Steps
-----
1. Read inputs. If `fileName` missing, create a slug from `topic` (kebab-case).
2. Produce a markdown file with: Title, One-line summary, Purpose, When to use, Quick run/usage commands, Example invocations, Related files/links, and a short Change/PR note.
3. Use `audience` and `format` to control depth (short = 1–3 sections, detailed = 6–8 sections with examples).
4. Output the suggested file path as `docs/ai/<fileName>.md` and the full file contents as the result.

Examples
--------
- Input: topic="Scaffold API Endpoint" format=short → creates `docs/ai/scaffold-api-endpoint.md` with quick steps and example prompt.

Followups
---------
- Ask the user to confirm the final filename before writing if ambiguity exists.
