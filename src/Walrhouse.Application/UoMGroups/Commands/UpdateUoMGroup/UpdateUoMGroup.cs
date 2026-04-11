using Walrhouse.Application.Common.Interfaces;
using Walrhouse.Application.UoMGroups.Commands.CreateUoMGroup;
using Walrhouse.Domain.Entities;
using Walrhouse.Domain.Enums;

namespace Walrhouse.Application.UoMGroups.Commands.UpdateUoMGroup;

public record UpdateUoMGroupCommand(
    int Id,
    string? BaseUoM,
    IEnumerable<UoMGroupLineDto>? UoMGroupLines
) : IRequest;

public class UpdateUoMGroupCommandHandler : IRequestHandler<UpdateUoMGroupCommand>
{
    private readonly IApplicationDbContext _context;

    public UpdateUoMGroupCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task Handle(UpdateUoMGroupCommand request, CancellationToken cancellationToken)
    {
        var entity = await _context.UoMGroups.FirstOrDefaultAsync(
            g => g.Id == request.Id && !g.IsDeleted,
            cancellationToken
        );

        Guard.Against.Null(entity, nameof(entity));

        if (!String.IsNullOrEmpty(request.BaseUoM))
            entity.BaseUoM = request.BaseUoM;

        if (request.UoMGroupLines is not null)
        {
            entity.UoMGroupLines = request
                .UoMGroupLines.Select(l => new UoMGroupLine { UoM = l.UoM, BaseQty = l.BaseQty })
                .ToList();
        }

        await _context.SaveChangesAsync(cancellationToken);
    }
}
