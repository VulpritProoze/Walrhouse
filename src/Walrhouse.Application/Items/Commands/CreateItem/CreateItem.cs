using Walrhouse.Application.Common.Interfaces;
using Walrhouse.Application.Common.Security;
using Walrhouse.Domain.Entities;
using Walrhouse.Domain.Enums;

namespace Walrhouse.Application.Items.Commands.CreateItem;

public record CreateItemCommand : IRequest<string>
{
    public string ItemCode { get; init; } = string.Empty;
    public string ItemName { get; init; } = string.Empty;
    public string? Remarks { get; init; }
    public ItemGroup ItemGroup { get; init; } = ItemGroup.General;
}

public class CreateItemCommandHandler : IRequestHandler<CreateItemCommand, string>
{
    private readonly IApplicationDbContext _context;

    public CreateItemCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<string> Handle(CreateItemCommand request, CancellationToken cancellationToken)
    {
        var entity = new Item
        {
            ItemCode = request.ItemCode,
            ItemName = request.ItemName,
            Remarks = request.Remarks,
            ItemGroup = request.ItemGroup,
        };

        _context.Items.Add(entity);
        await _context.SaveChangesAsync(cancellationToken);

        return entity.ItemCode;
    }
}
