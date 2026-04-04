---
title: Web endpoints templates
summary: Templates and guidance for Web endpoint files (minimal API endpoint group patterns).
audience: developers, agents
format: detailed
---

# Web Endpoints

One-line summary
----------------
Copyable minimal-API endpoint templates and guidance for creating per-entity endpoint files under `src/Walrhouse.Web/Endpoints`.

Purpose
-------
Provide a consistent endpoint file template and usage notes so agents and developers can scaffold HTTP endpoints that match project conventions.

When to use
-----------
- Scaffolding a new REST endpoint file for an entity (create/read/update/delete).
- Converting controller-style routes to minimal API endpoint groups.

Quick run / usage commands
-------------------------
- Create the Endpoints folder and a new entity file (PowerShell):

```powershell
# from repo root
New-Item -ItemType Directory -Path src/Walrhouse.Web/Endpoints -Force
New-Item -ItemType File -Path src/Walrhouse.Web/Endpoints/<Entity>.cs -Force
```

Template (minimal, based on `Users.cs`)
-------------------------------------

Use this template when creating a new `src/Walrhouse.Web/Endpoints/<Entity>.cs` file. This example omits MapIdentityApi and shows common verbs and DI usage.

```csharp
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Walrhouse.Application.<EntityPlural>.Commands.Create<Entity>;
using Walrhouse.Application.<EntityPlural>.Queries.Get<Entity>ById;

namespace Walrhouse.Web.Endpoints;

public class <Entity>Endpoints : IEndpointGroup
{
    public static void Map(RouteGroupBuilder groupBuilder)
    {
        groupBuilder.MapPost("", Create<Entity>).RequireAuthorization();
        groupBuilder.MapGet("{id}", Get<Entity>ById).RequireAuthorization();
        groupBuilder.MapPut("{id}", Update<Entity>).RequireAuthorization();
        groupBuilder.MapDelete("{id}", Delete<Entity>).RequireAuthorization();
    }

    [EndpointName(nameof(Create<Entity>))]
    [EndpointSummary("Create a new <Entity>.")]
    public static async Task<Results<Created, BadRequestHttpResult>> Create<Entity>(
        ISender sender,
        Create<Entity>Command request
    )
    {
        var id = await sender.Send(request);
        return TypedResults.Created($"/api/<entity>/{id}", id);
    }

    [EndpointName(nameof(Get<Entity>ById))]
    [EndpointSummary("Get a <Entity> by identifier")]
    public static async Task<Results<Ok<<Entity>Dto>, NotFoundHttpResult>> Get<Entity>ById(
        ISender sender,
        [FromRoute] string id
    )
    {
        var result = await sender.Send(new Get<Entity>ByIdQuery(id));
        return result == null ? TypedResults.NotFound() : TypedResults.Ok(result);
    }

    [EndpointName(nameof(Update<Entity>))]
    [EndpointSummary("Update an existing <Entity>")]
    public static async Task<Results<NoContent, NotFoundHttpResult, BadRequestHttpResult>> Update<Entity>(
        ISender sender,
        [FromRoute] string id,
        [FromBody] Update<Entity>Command request
    )
    {
        // load/validate/apply handled by Application layer
        await sender.Send(request);
        return TypedResults.NoContent();
    }

    [EndpointName(nameof(Delete<Entity>))]
    [EndpointSummary("Soft-delete an existing <Entity>")]
    public static async Task<Results<NoContent, NotFoundHttpResult>> Delete<Entity>(
        ISender sender,
        [FromRoute] string id
    )
    {
        await sender.Send(new Delete<Entity>Command(id));
        return TypedResults.NoContent();
    }
}
```

Return type guidance
--------------------
- Prefer `Task<IResult>` (or a concrete `Task<Ok<T>>`, `Task<NoContent>`, etc.) when your endpoint only ever returns a single HTTP result.
- Use `Results<...>` only when the endpoint can return multiple different HTTP results (success + different error responses). Keep the number of variants small and explicit.

Common `Results<>` choices
-------------------------
Possible result values you may use inside `Results<>`:

- `Ok<T>`
- `Created<T>`
- `NoContent`
- `Accepted`
- `BadRequest<T>`
- `NotFound<T>`
- `Unauthorized`
- `Forbidden`
- `Conflict<T>`
- `UnprocessableEntity<T>`

When in doubt, prefer the simpler `IResult`/single-result signature and document the expected responses in the endpoint summary.

Notes & conventions
-------------------
- File location: `src/Walrhouse.Web/Endpoints/<Entity>.cs`.
- Naming: prefer pluralized folders/queries in the Application layer (e.g., `<EntityPlural>`), single-entity query named `Get<Entity>ByIdQuery`.
- Authorization: add `.RequireAuthorization()` where endpoints need auth. Adjust per-route policies as needed.
- DI: use `ISender` (MediatR) for handlers; keep endpoint logic thin and delegate to application handlers.

Example invocations (agent prompts)
----------------------------------
- "Scaffold endpoints for `Warehouse` with Create and GetById handlers. Create file `src/Walrhouse.Web/Endpoints/Warehouse.cs` using the Web endpoints template; require auth on all routes." 
- "Add MapPut and MapDelete to `src/Walrhouse.Web/Endpoints/Warehouse.cs` following the endpoint template. Use `WarehouseCode` as identifier in route parameter." 

Related files / links
---------------------
- DTO conventions: [docs/ai/application/dtos-cqrs.md](docs/ai/application/dtos-cqrs.md)
- Example endpoint file: [src/Walrhouse.Web/Endpoints/Users.cs](src/Walrhouse.Web/Endpoints/Users.cs)
- Canonical Warehouse endpoint: [src/Walrhouse.Web/Endpoints/Warehouse.cs](src/Walrhouse.Web/Endpoints/Warehouse.cs)
- Application query example: [src/Walrhouse.Application/Warehouses/Queries/GetWarehouses.cs](src/Walrhouse.Application/Warehouses/Queries/GetWarehouses.cs)
- DTO conventions: [docs/ai/application/dtos-cqrs.md](docs/ai/application/dtos-cqrs.md)

Change / PR note
----------------
Add `docs/ai/web/endpoints.md` in a docs-only PR with message: `docs(ai): add web endpoints template`.

If you want, I can scaffold an example endpoint file for a specific entity now (e.g., `Item` or `Warehouse`).
