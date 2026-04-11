using Walrhouse.Application.Common.Interfaces;
using Walrhouse.Domain.Entities;
using Walrhouse.Domain.Enums;

namespace Walrhouse.Application.UoMGroups.Commands.CreateUoMGroup;

public record UoMGroupLineDto(string UoM, int BaseQty);

public record CreateUoMGroupCommand(
    int Id,
    string BaseUoM,
    IEnumerable<UoMGroupLineDto> UoMGroupLines
) : IRequest<int>;

public class CreateUoMGroupCommandHandler : IRequestHandler<CreateUoMGroupCommand, int>
{
    private readonly IApplicationDbContext _context;

    public CreateUoMGroupCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<int> Handle(
        CreateUoMGroupCommand request,
        CancellationToken cancellationToken
    )
    {
        var existing = await _context
            .UoMGroups.AsQueryable()
            .Where(g => g.Id == request.Id)
            .SingleOrDefaultAsync(cancellationToken);

        if (existing is not null)
        {
            if (!existing.IsDeleted)
                return existing.Id; // idempotent

            existing.BaseUoM = request.BaseUoM;
            existing.UoMGroupLines = request
                .UoMGroupLines.Select(l => new UoMGroupLine { UoM = l.UoM, BaseQty = l.BaseQty })
                .ToList();
            existing.IsDeleted = false;

            await _context.SaveChangesAsync(cancellationToken);

            return existing.Id;
        }

        var entity = new UoMGroup
        {
            Id = request.Id,
            BaseUoM = request.BaseUoM,
            UoMGroupLines = request
                .UoMGroupLines.Select(l => new UoMGroupLine { UoM = l.UoM, BaseQty = l.BaseQty })
                .ToList(),
        };

        _context.UoMGroups.Add(entity);

        await _context.SaveChangesAsync(cancellationToken);

        return entity.Id;
    }
}
