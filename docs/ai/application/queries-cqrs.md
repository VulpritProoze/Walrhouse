---
title: Queries templates CQRS
summary: Templates for Application-layer Query handlers and validators (paginated and single-entity).
audience: developers, agents
format: detailed
---

# Queries Templates CQRS

One-line summary
----------------
Paginated list and single-entity query templates with mapping and handler patterns.

Purpose
-------
Standardize query scaffolding for batch (paginated) and single-entity reads.

Canonical example
-----------------
These templates use `Warehouse` as the canonical example (see `src/Walrhouse.Application/Warehouses/Queries` for concrete implementations).

When to use
-----------
- Creating list endpoints (paginated) and read-by-id queries.
- Ensuring queries use projection (`ProjectTo`) and avoid tracking.

Quick run / usage commands
-------------------------

```powershell
New-Item -ItemType Directory -Path src/Walrhouse.Application/<Entity>/Queries -Force
```

Paginated list template
-----------------------

```csharp
// src/Walrhouse.Application/<Entity>/Queries/Get<Entity>s/Get<Entity>s.cs
using Walrhouse.Application.Common.Interfaces;
using Walrhouse.Application.Common.Models;
using AutoMapper;
using AutoMapper.QueryableExtensions;

public record Get<Entity>sQuery(int PageNumber = 1, int PageSize = 100) : IRequest<PaginatedList<<Entity>Dto>>;

public class Get<Entity>sQueryHandler : IRequestHandler<Get<Entity>sQuery, PaginatedList<<Entity>Dto>>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;

    public Get<Entity>sQueryHandler(IApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<PaginatedList<<Entity>Dto>> Handle(Get<Entity>sQuery request, CancellationToken cancellationToken)
    {
        var pageNumber = request.PageNumber < 1 ? 1 : request.PageNumber;
        var pageSize = request.PageSize < 1 ? 100 : Math.Min(request.PageSize, 100);

        return await _context
            .<Entities>.AsNoTracking()
            .ProjectTo<<Entity>Dto>(_mapper.ConfigurationProvider)
            .OrderBy(e => e.DefaultSortProperty)
            .PaginatedListAsync(pageNumber, pageSize, cancellationToken);
    }
}
```

Single-entity template
----------------------

```csharp
// src/Walrhouse.Application/<Entity>/Queries/Get<Entity>ById/Get<Entity>ById.cs
public record Get<Entity>ByIdQuery(string Id) : IRequest<<Entity>Dto?>;

public class Get<Entity>ByIdQueryHandler : IRequestHandler<Get<Entity>ByIdQuery, <Entity>Dto?>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;

    public Get<Entity>ByIdQueryHandler(IApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<<Entity>Dto?> Handle(Get<Entity>ByIdQuery request, CancellationToken cancellationToken)
    {
        var entity = await _context.<Entities>.FindAsync(new object[] { request.Id }, cancellationToken);
        return entity == null ? null : _mapper.Map<<Entity>Dto>(entity);
    }
}
```

Validator example
-----------------

```csharp
// src/Walrhouse.Application/<Entity>/Queries/Get<Entity>ById/Get<Entity>ByIdValidator.cs
using FluentValidation;

public class Get<Entity>ByIdValidator : AbstractValidator<Get<Entity>ByIdQuery>
{
    public Get<Entity>ByIdValidator()
    {
        RuleFor(x => x.Id).NotEmpty();
    }
}
```

Example files referenced
------------------------
- [src/Walrhouse.Application/Warehouses/Queries/GetWarehouses.cs](src/Walrhouse.Application/Warehouses/Queries/GetWarehouses.cs)
    (see `Warehouse` query examples in `src/Walrhouse.Application/Warehouses/Queries`)

Change / PR note
----------------
Add `docs/ai/application/queries-cqrs.md` in a docs-only PR with message:

```
docs(ai): add queries templates CQRS
```
