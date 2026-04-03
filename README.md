# Walrhouse

A modern warehouse management and scan verification system designed for high-performance item tracking and verification.

## Technical Stack

### WebClient (Frontend)
- *Located within Walrhouse.Web/Client*
- **Runtime & Framework**: React 19 / Vite 7
- **Language**: TypeScript (using `verbatimModuleSyntax`)
- **Styling**: Tailwind CSS 4.0
- **UI Architecture**: Shadcn UI (integrated with `@base-ui/react`)
- **State & Data**: TanStack Query (React Query) v5 & Axios
- **Routing**: React Router 7
- **Animations**: Framer Motion 12
- **Validation**: Zod
- **Icons**: Lucide React
- **Security Handling**: Cookie-based authentication with ASP.NET Core Identity.

### Server (Backend)
- **Runtime**: .NET 10.0
- **Architecture**: Clean Architecture
  - **Walrhouse.Domain**: Enterprise logic and entities.
  - **Walrhouse.Application**: Use cases and business rules.
  - **Walrhouse.Infrastructure**: Data access (EF Core) and external services.
  - **Walrhouse.Web**: API endpoints and configuration.
- **Database**: PostgreSQL (Npgsql)
- **ORM**: Entity Framework Core 10
- **API Specification**: Scalar / OpenAPI (Swagger replacement)
- **Security**: ASP.NET Core Identity

## Setup & Development

1. Run `dotnet build` at root
2. Run `dotnet run --project src/Walrhouse.AppHost --launch-profile http`
3. Navigate to launched Aspire application and find **walrhouse_webclient** url. Client and server runs at the same time. Client proxies to server url

## License

This project is licensed under the **GNU Affero General Public License v3 (AGPL-3.0)**. See the [LICENSE](LICENSE) file for details.
