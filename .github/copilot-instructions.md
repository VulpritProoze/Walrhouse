# GitHub Copilot Instructions for Walrhouse

Purpose
-------
This file gives the AI agent (Copilot/assistant) quick, actionable context for working in this repository so it can be productive immediately.

Key principles
--------------
- Be concise and only add or modify files when necessary.
- Prefer root-cause fixes over superficial patches.
- Preserve existing project conventions and minimal style changes.

Repository overview
-------------------
- Frontend: [client/WebClient](client/WebClient) — Vite + React + TypeScript.
- Backend: [server/Walrhouse.Web](server/Walrhouse.Web) — ASP.NET Core minimal API, solution at `server/Walrhouse.sln`.
- Server-side application and domain projects live under `server/` (Application, Domain, Infrastructure, Web).

Quick start (dev)
------------------
- Frontend (development):
  - `cd client/WebClient`
  - `npm install`
  - `npm run dev` (runs Vite dev server)
- Frontend (build):
  - `npm run build` (runs TypeScript build and `vite build`)
- Backend (development):
  - From repository root: `dotnet run --project server/Walrhouse.Web`
  - Or build solution: `dotnet build server/Walrhouse.sln`

Where to look first
-------------------
- Frontend entry: [client/WebClient/src/main.tsx](client/WebClient/src/main.tsx)
- Backend entry: [server/Walrhouse.Web/Program.cs](server/Walrhouse.Web/Program.cs)
- Dependency injection setup: [server/Walrhouse.Application/DependencyInjection.cs](server/Walrhouse.Application/DependencyInjection.cs) and [server/Walrhouse.Infrastructure/DependencyInjection.cs](server/Walrhouse.Infrastructure/DependencyInjection.cs)
- API endpoints: [server/Walrhouse.Web/Endpoints](server/Walrhouse.Web/Endpoints)

Common tasks for the assistant
------------------------------
- Add or update small feature handlers or endpoints under `server/Walrhouse.Web/Endpoints`.
- Implement application layer commands/queries under `server/Walrhouse.Application/Items` and wire mappings in `Mappings`.
- Implement UI components in `client/WebClient/src/components` and pages in `client/WebClient/src/pages`.
- When changing public APIs, update both frontend usages and any OpenAPI/MapOpenApi references.

Build/test commands to include in PRs
----------------------------------
- Frontend lint: `cd client/WebClient && npm run lint`
- Backend build: `dotnet build server/Walrhouse.sln`

Conventions & pitfalls
----------------------
- Keep changes minimal and scoped to the task; avoid broad reformatting.
- Follow existing folder structure: Application ⇢ Domain ⇢ Infrastructure ⇢ Web.
- The repo is developed on Windows; mind path handling and line endings.

Example prompts for the agent
-----------------------------
- "Add an endpoint to create an Item with validation and a matching frontend form."
- "Refactor the item query to use pagination in `Walrhouse.Application`. Update the API endpoint and client call." 
- "Add unit tests for `Item` domain behaviors and a CI command to run them." 

Next recommended agent customizations
-----------------------------------
- Create a short agent hook `apply-to-frontend` that limits edits to `client/WebClient/src`.
- Create `apply-to-backend` that limits edits to `server/**` and runs `dotnet build` afterwards.

If uncertain
----------
Ask for clarity on desired scope before making large changes (e.g., database migrations, schema changes, or architectural refactors).
