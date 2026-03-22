# Design principles — Walrhouse

Purpose
-------
Provide concise visual and UX guidance for a modern warehouse web app. Focus on aesthetics, clarity, and scan-first workflows rather than low-level implementation details.

Visual language
---------------
- Clean, neutral base (soft grays) with a single bright accent for primary CTAs.
- High contrast for important data; subtle contrast for secondary chrome.
- Use generous whitespace and consistent card-based grouping to reduce cognitive load.

Layout & spacing
-----------------
- Mobile-first, single-column on small screens; modular multi-column cards on desktop.
- Tight vertical rhythm for lists; larger touch targets for scanner/handheld use.
- Align controls predictably: filters and actions top, primary task area centered.

Typography
----------
- One readable sans for UI; larger sizes for main actions and scanned readouts.
- Clear hierarchy: headings, concise subheadings, body, and small meta text.

Color & accents
---------------
- Neutral palette for backgrounds and surfaces; reserve color for status (ok/warn/error) and a single brand accent.
- Avoid decorative color use—color must convey meaning when used.

Components & patterns
----------------------
- Use compact, consistent form controls and lists. Prefer tokens for spacing, radius, and elevation.
- Primary actions: solid accent button. Secondary: low-contrast outline or ghost.
- Cards for inventory items with clear SKU, qty, and location lines.

Interactions & motion
---------------------
- Subtle motion to indicate state change (200–300ms). Avoid heavy animations during scanning.
- Immediate, optimistic UI for quick feedback; reconcile with server state in background.

Scan‑first workflows
--------------------
- Screen layouts prioritize the scanner input and most-likely next action.
- Minimize fields and taps: auto-focus scanner input, show large confirmation and error states.

Accessibility & content
-----------------------
- Aim for WCAG AA contrast and keyboard/scanner navigability.
- Clear, concise microcopy for actions and errors; prefer verbs and measurable outcomes.

Error states & recovery
-----------------------
- Show clear error messages and a single obvious recovery action.
- Keep context: preserve scanned data and allow quick retry or override with confirmation.

Tone & copy
-----------
- Direct, task-oriented. Example: "Confirm putaway — 12 items to Location A3." Keep labels short.

Quick checklist
---------------
- Mobile-first, scan‑focused screens.
- Neutral base + single bright accent.
- Large, legible scan/readout area.
- Predictable control placement and minimal steps.
- Accessible and keyboard/scanner friendly.

Technicality
------------
- Always make sure to check `components/ui` for existing shadcn components before adding a new component.
- If the component does not exist, prompt the user/team to run `npx shadcn` to add it.
- Reference: https://ui.shadcn.com/docs
