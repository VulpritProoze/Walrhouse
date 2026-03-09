using Walrhouse.Application.Common.Interfaces;
using Walrhouse.Application.Common.Security;
using Walrhouse.Domain.Enums;

namespace Walrhouse.Application.Items.Commands.UpdateItem;

[Authorize]
public record UpdateItemCommand : IRequest
{
    public int Id { get; init; }
    public string ItemCode { get; init; } = string.Empty;
    public string ItemName { get; init; } = string.Empty;
    public string? Remarks { get; init; }
    public ItemGroup ItemGroup { get; init; }
    public bool IsScanned { get; init; }
}

public class UpdateItemCommandHandler : IRequestHandler<UpdateItemCommand>
{
    private readonly IApplicationDbContext _context;

    public UpdateItemCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task Handle(UpdateItemCommand request, CancellationToken cancellationToken)
    {
        var entity = await _context.Items.FirstOrDefaultAsync(
            i => i.ItemId == request.Id,
            cancellationToken
        );

        if (entity is null)
        {
            throw new KeyNotFoundException($"Item with id '{request.Id}' was not found.");
        }

        entity.ItemCode = request.ItemCode;
        entity.ItemName = request.ItemName;
        entity.Remarks = request.Remarks;
        entity.ItemGroup = request.ItemGroup;
        entity.IsScanned = request.IsScanned;

        await _context.SaveChangesAsync(cancellationToken);
    }
}
