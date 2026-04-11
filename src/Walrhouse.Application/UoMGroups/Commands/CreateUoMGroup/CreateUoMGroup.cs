using Walrhouse.Application.Common.Interfaces;
using Walrhouse.Domain.Entities;
using Walrhouse.Domain.Enums;

namespace Walrhouse.Application.UoMGroups.Commands.CreateUoMGroup;

public record UoMGroupLineDto(string UoM, int BaseQty);

public record CreateUoMGroupCommand(string BaseUoM, IEnumerable<UoMGroupLineDto> UoMGroupLines)
    : IRequest<int>;

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
        var entity = new UoMGroup
        {
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
