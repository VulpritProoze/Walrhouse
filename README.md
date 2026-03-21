# Walrhouse

A modern warehouse management and scan verification system designed for high-performance item tracking and verification.

## Project Structure

The codebase is divided into two primary directories:

- **`client/WebClient`**: The frontend React application.
- **`server`**: The backend .NET solution following Clean Architecture patterns.

## Technical Stack

### WebClient (Frontend)
- **Runtime & Framework**: React 19 / Vite 7
- **Language**: TypeScript (using `verbatimModuleSyntax`)
- **Styling**: Tailwind CSS 4.0
- **UI Architecture**: Shadcn UI (integrated with `@base-ui/react`)
- **State & Data**: TanStack Query (React Query) v5 & Axios
- **Routing**: React Router 7
- **Animations**: Framer Motion 12
- **Validation**: Zod
- **Icons**: Lucide React
- **Security Handling**: Cookie-based authentication with ASP.NET Core Identity (ignore token-based configs in the project)

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

### Backend
1. Navigate to the `server` directory.
2. Ensure a PostgreSQL instance is running and configured.
3. Run the API:
   ```bash
   dotnet run --project Walrhouse.Web
   ```

### Frontend
1. Navigate to `client/WebClient`.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## License

This project is licensed under the **GNU Affero General Public License v3 (AGPL-3.0)**. See the [LICENSE](LICENSE) file for details.
