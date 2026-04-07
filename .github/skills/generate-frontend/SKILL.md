---
name: generate-frontend
description: "Scaffold a frontend page or component using shadcn UI patterns. Creates feature folder components and a page that imports them. Prompts to install shadcn if components are missing."
user-invocable: true
argument-hint: "feature: string (required); type: page|component (default: page); name: string (required)"
compatibility: v1
---

# generate-frontend Skill

Purpose
-------
Create a small, ready-to-edit frontend feature: either a page that composes UI components, or a single component. Always prefer composing from existing `src/components/ui` shadcn components. If a required shadcn component does not exist, prompt the user to install `shadcn/ui` via the recommended installer command.

Behavior (short)
----------------
- Prompt for `feature` and `name` when missing.
- `type=page`: create `src/webclient/features/<feature>/components/` and `src/webclient/features/<feature>/<Feature>Page.{tsx|jsx|tsx}` (choose framework based on repo convention). The page should import and use the generated components.
- `type=component`: create component files in `src/webclient/components/<feature>/` and export them from an `index` file.
- Use `shadcn` components from `src/components/ui` for primitives (Buttons, Inputs, Card, etc.). If a referenced component is missing, add a clear instruction: run `npx shadcn@latest init` or `npx shadcn add <component>`.
- Follow the project's component naming, file placement, and style conventions. Keep generated code minimal and editable.

Arguments
---------
- `feature` (required): feature or area name, e.g., `verification`.
- `type`: `page` or `component`. Defaults to `page`.
- `name` (required): PascalCase component or page name, e.g., `ScanConfirm`.

Files Created
-------------
- For `type=page`:
  - `src/webclient/features/<feature>/components/<Name>.tsx` (or .jsx)
  - `src/webclient/features/<feature>/index.ts` (exports)
  - `src/webclient/features/<feature>/<Name>Page.tsx` (page using components)
- For `type=component`:
  - `src/webclient/components/<feature>/<Name>.tsx`
  - `src/webclient/components/<feature>/index.ts`

Templates & Conventions
-----------------------
- Prefer functional React components with clear props and default exports.
- Use `src/components/ui` shadcn primitives. Example imports:
  - `import { Button } from 'src/components/ui/button'`
- If the repo uses a different path (e.g., `src/components/ui` vs `components/ui`), detect and use the existing path.
- Icons use `lucide-react`
- Always use the `<CommonLayout>` wrapper for pages; extract user.roles from AuthContext and pass to layout;

Shadcn guidance
---------------
- Always consult https://ui.shadcn.com/docs for available components and usage patterns.
- If a requested shadcn primitive is not found in `src/components/ui`, instruct the user to install it and provide the command suggestions:

  - `npx shadcn@latest init` — initialize shadcn in the project
  - `npx shadcn add button input card` — add specific components

Quality checks
--------------
- Files must compile (syntactic) with the project's frontend build tool — don't assume backend compilation.
- The page must import generated components from the local feature exports.
- Keep generated code small (one component per file) and add a high-level comment at top with purpose.

Examples
--------
- Prompt the skill with: `feature=verification type=page name=ScanConfirm` → creates `features/verification/components/ScanConfirm.tsx` and `features/verification/ScanConfirmPage.tsx` that imports those components.
- Prompt: `feature=controls type=component name=CompactCard` → creates `components/controls/CompactCard.tsx` and index export.

References
----------
- Project design considerations: [DESIGN.md](../../../src/Walrhouse.Web/App/WebClient/DESIGN.md)
- Shadcn UI docs: https://ui.shadcn.com/docs

Notes
-----
- This skill only scaffolds files; it does not run package installers. When shadcn primitives are missing, it will prompt the user with exact `npx` commands to run.
- If the repo uses a non-React frontend, prompt the user to confirm framework target before scaffolding.
- Navigate to `src/Walrhouse.Web/App/WebClient` for client-side commands and file paths.