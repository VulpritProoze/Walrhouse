---
title: Commands templates CQRS
summary: Templates for Application-layer Command handlers and validators.
audience: developers, agents
format: detailed
---

# Commands Templates CQRS

One-line summary
----------------
Copy-pasteable command handler and validator templates for `Create`, `Update`, `Delete`, and `Purge` flows.

Purpose
-------
Provide consistent command scaffolding and validator patterns for `Walrhouse.Application` features.

When to use
-----------
- Scaffolding create/update/delete/purge operations.
- Writing prompts for agents to generate command handlers.

Quick run / usage commands
-------------------------
Create feature folders (PowerShell):

```powershell
New-Item -ItemType Directory -Path src/Walrhouse.Application/<Entity>/Commands -Force
```

Example command template (Create)
--------------------------------

```csharp
// src/Walrhouse.Application/<Entity>/Commands/Create<Entity>/Create<Entity>.cs
using Walrhouse.Application.Common.Interfaces;
using Walrhouse.Domain.Entities;

namespace Walrhouse.Application.<Entity>.Commands.Create<Entity>;

public record Create<Entity>Command(/* add properties here */) : IRequest<string>;

public class Create<Entity>CommandHandler : IRequestHandler<Create<Entity>Command, string>
{
    private readonly IApplicationDbContext _context;

    public Create<Entity>CommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<string> Handle(Create<Entity>Command request, CancellationToken cancellationToken)
    {
        var entity = new <Entity>
        {
            // map properties from request
        };

        _context.<Entities>.Add(entity);
        await _context.SaveChangesAsync(cancellationToken);

        return entity.Id;
    }
}
```

Update / Delete / Purge notes
-----------------------------
- `Update`: load entity, apply changes, validate, SaveChangesAsync, return Id or DTO.
- `Delete`: prefer soft-delete unless domain requires hard delete.
- `Purge`: destructive; include explicit authorization comments and confirm steps.

Validator template (FluentValidation)
------------------------------------

```csharp
// src/Walrhouse.Application/<Entity>/Commands/Create<Entity>/Create<Entity>Validator.cs
using FluentValidation;

public class Create<Entity>Validator : AbstractValidator<Create<Entity>Command>
{
    public Create<Entity>Validator()
    {
        RuleFor(x => x.PropertyA).NotEmpty();
    }
}
```

Example files referenced
------------------------
- [src/Walrhouse.Application/Items/Commands/CreateItem/CreateItem.cs](src/Walrhouse.Application/Items/Commands/CreateItem/CreateItem.cs)

Change / PR note
----------------
Documentation-only. Create PR adding `docs/ai/application/commands-cqrs.md` with message:

```
docs(ai): add commands templates CQRS
```
