using Walrhouse.Application.Common.Interfaces;
using Walrhouse.Domain.Entities;
using Walrhouse.Domain.Enums;

namespace Walrhouse.Application.UoMGroups.Commands.CreateUoMGroup;

public record UoMGroupLineDto(UnitOfMeasurement UoM, int BaseQty);

public record CreateUoMGroupCommand(
    string UgpEntry,
    UnitOfMeasurement BaseUoM,
    IEnumerable<UoMGroupLineDto> UoMGroupLines
) : IRequest<string>;

public class CreateUoMGroupCommandHandler : IRequestHandler<CreateUoMGroupCommand, string>
{
    private readonly IApplicationDbContext _context;

    public CreateUoMGroupCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<string> Handle(
        CreateUoMGroupCommand request,
        CancellationToken cancellationToken
    )
    {
        var code = (request.UgpEntry ?? string.Empty).Trim();

        var existing = await _context
            .UoMGroups.AsQueryable()
            .Where(g => g.UgpEntry == code)
            .SingleOrDefaultAsync(cancellationToken);

        if (existing is not null)
        {
            if (!existing.IsDeleted)
                return existing.UgpEntry; // idempotent

            existing.BaseUoM = request.BaseUoM;
            existing.UoMGroupLines = request
                .UoMGroupLines.Select(l => new UoMGroupLine { UoM = l.UoM, BaseQty = l.BaseQty })
                .ToList();
            existing.IsDeleted = false;

            await _context.SaveChangesAsync(cancellationToken);

            return existing.UgpEntry;
        }

        var entity = new UoMGroup
        {
            UgpEntry = code,
            BaseUoM = request.BaseUoM,
            UoMGroupLines = request
                .UoMGroupLines.Select(l => new UoMGroupLine { UoM = l.UoM, BaseQty = l.BaseQty })
                .ToList(),
        };

        _context.UoMGroups.Add(entity);

        await _context.SaveChangesAsync(cancellationToken);

        return entity.UgpEntry;
    }
}
