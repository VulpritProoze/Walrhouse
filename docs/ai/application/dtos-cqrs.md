---
title: DTOs templates CQRS
summary: DTO template and mapping guidance for Application-layer queries.
audience: developers, agents
format: detailed
---

# DTOs Templates CQRS

One-line summary
----------------
DTO scaffolding and mapping profile example to support queries and projection.

Purpose
-------
Standardize DTOs placed under `Queries` with nested AutoMapper `Profile` mapping classes.

When to use
-----------
- Creating DTOs for projection in queries.
- Ensuring mapping profiles follow conventions used across the project.

Quick run / usage commands
-------------------------

Place DTO under `src/Walrhouse.Application/<Entity>/Queries/`.

DTO template
------------

```csharp
// src/Walrhouse.Application/<Entity>/Queries/<Entity>Dto.cs
using AutoMapper;
using Walrhouse.Application.Common.Mappings;
using Walrhouse.Domain.Entities;

public class <Entity>Dto : IMapFrom<<Entity>>
{
    public string Id { get; set; } = string.Empty;
    public string? Name { get; set; }

    public class Mapping : Profile
    {
        public Mapping()
        {
            CreateMap<<Entity>, <Entity>Dto>();
        }
    }
}
```

Example files referenced
------------------------
- [src/Walrhouse.Application/Warehouses/Queries/WarehouseDto.cs](src/Walrhouse.Application/Warehouses/Queries/WarehouseDto.cs)

Change / PR note
----------------
Add `docs/ai/application/dtos-cqrs.md` in a docs-only PR with message:

```
docs(ai): add dtos templates CQRS
```
