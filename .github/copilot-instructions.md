# GitHub Copilot Instructions for Walrhouse

Purpose
-------
This file gives the AI agent (Copilot/assistant) quick, actionable context for working in this repository so it can be productive immediately.

Key principles
--------------
- Be concise and only add or modify files when necessary.
- Prefer root-cause fixes over superficial patches.
- Preserve existing project conventions and minimal style changes.
- **Aspire First:** This is a .NET Aspire project. Use the AppHost for orchestration.

Repository overview
-------------------
All source code is located in the `src/` directory:
- **Orchestration:** `src/Walrhouse.AppHost` – The entry point for the entire application.
- **Frontend/API:** `src/Walrhouse.Web` – ASP.NET Core project containing the API endpoints and the React frontend.
- **React Frontend:** `src/Walrhouse.Web/App/WebClient` – Vite + React + TypeScript + Tailwind CSS.
- **Core Logic:** 
  - `src/Walrhouse.Domain`: Domain entities and core logic.
  - `src/Walrhouse.Application`: Commands, Queries, and Business logic (MediatR).
  - `src/Walrhouse.Infrastructure`: Data access (EF Core), external services, and migrations.
- **Shared:** `src/Walrhouse.Shared` and `src/Walrhouse.ServiceDefaults`.

Quick start (dev)
------------------
- **Local Development (Full Stack):**
  - From repository root: `dotnet run --project src/Walrhouse.AppHost`
  - This starts the Aspire dashboard, the Web API, and the React frontend.
- **React Frontend Only:**
  - `cd src/Walrhouse.Web/App/WebClient`
  - `npm run dev`
- **Infrastructure/Deployment:**
  - `azd up` to provision and deploy to Azure.
  - `azd pipeline config` for CI/CD setup.

Where to look first
-------------------
- **App Orchestation:** [src/Walrhouse.AppHost/Program.cs](../src/Walrhouse.AppHost/Program.cs)
- **API Endpoints:** [src/Walrhouse.Web/Endpoints](../src/Walrhouse.Web/Endpoints)
- **Frontend Entry:** [src/Walrhouse.Web/App/WebClient/src/main.tsx](../src/Walrhouse.Web/App/WebClient/src/main.tsx)
- **Database Context:** [src/Walrhouse.Infrastructure/Data/ApplicationDbContext.cs](../src/Walrhouse.Infrastructure/Data/ApplicationDbContext.cs)
- **Dependency Injection:** [src/Walrhouse.Infrastructure/DependencyInjection.cs](../src/Walrhouse.Infrastructure/DependencyInjection.cs) and [src/Walrhouse.Application/DependencyInjection.cs](../src/Walrhouse.Application/DependencyInjection.cs)

Common tasks for the assistant
------------------------------
- Add features using **Clean Architecture** patterns: Domain ⇢ Application ⇢ Infrastructure ⇢ Web.
- Use **MediatR** for commands and queries in the Application layer.
- Add or update API endpoints in `src/Walrhouse.Web/Endpoints`.
- Implement UI components in `src/Walrhouse.Web/App/WebClient/src/components`.

Infrastructure & CI/CD
----------------------
- Deployment is handled via **Azure Developer CLI (azd)**.
- CI/CD workflow is defined in [.github/workflows/azure-dev.yml](workflows/azure-dev.yml).
- Infrastructure as Code (Bicep) is in the [infra/](../infra/) directory.

Build/test commands
-------------------
- **Full Solution Build:** `dotnet build Walrhouse.slnx`
- **Frontend Lint:** `cd src/Walrhouse.Web/App/WebClient && npm run lint`

Conventions & pitfalls
----------------------
- **Namespace:** Root namespace is `Walrhouse`.
- **Migrations:** Run migrations from the `Walrhouse.Infrastructure` project or via the AppHost.
- **Path Handling:** Be mindful of the nested frontend path: `src/Walrhouse.Web/App/WebClient`.

If uncertain
----------
Ask for clarity on desired scope before making large changes (e.g., database migrations, schema changes, or architectural refactors).
