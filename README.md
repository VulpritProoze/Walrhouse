# Walrhouse

A modern warehouse management and scan verification system designed for high-performance item tracking and verification.

## Technical Stack

- Backend: .NET 10, ASP.NET Core (Minimal API)
- Application Architecture: Clean Architecture + CQRS (MediatR-style handlers/behaviors)
- Frontend: React (served via Walrhouse.Web client app)
- Data Access: Entity Framework Core
- Database: PostgreSQL
- Cloud/Hosting: Azure Container Apps (via .NET Aspire AppHost)
- IaC/Provisioning: Bicep + Azure Developer CLI (azd)
- Secrets/Config: Azure Key Vault + azd environment management
- API Docs: OpenAPI + Scalar UI

## Architecture

Walrhouse follows a Clean Architecture layout with clear boundaries between domain, application, infrastructure, and web delivery concerns.

- `src/Walrhouse.Domain`: Core business rules, entities, value objects, domain events
- `src/Walrhouse.Application`: Use cases, commands/queries, validators, behaviors, DTO mappings
- `src/Walrhouse.Infrastructure`: Persistence, identity, external integrations, EF Core implementation details
- `src/Walrhouse.Web`: HTTP API, middleware, endpoint wiring, static web host and API surface
- `src/Walrhouse.AppHost`: .NET Aspire orchestration, service composition, deployment-time environment mapping

This structure keeps business logic independent from delivery and infrastructure details, enabling cleaner testing and easier long-term maintenance.

## Acknowledgements

This project is heavily inspired by and references Jason Taylor's Clean Architecture template and guidance.

Special thanks to Jason Taylor for shaping most of the architectural patterns and development practices used in this repository.

## Setup & Development

1. Run `dotnet build` at root
2. Run `dotnet run --project src/Walrhouse.AppHost --launch-profile http`
3. Navigate to launched Aspire application and find **walrhouse_webclient** url. Client and server runs at the same time. Client proxies to server url

## License

This project is licensed under the **GNU Affero General Public License v3 (AGPL-3.0)**. See the [LICENSE](LICENSE) file for details.
