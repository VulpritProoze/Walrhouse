using Walrhouse.Application.Common.Interfaces;
using Walrhouse.Domain.Enums;

namespace Walrhouse.Application.Items.Commands.UpdateItem;

public record UpdateItemCommand(
    string ItemCode,
    string? ItemName,
    string? UgpEntry,
    string? BarcodeValue,
    BarcodeFormat? BarcodeFormat,
    ItemGroup? ItemGroup,
    string? Remarks
) : IRequest;

public class UpdateItemCommandHandler : IRequestHandler<UpdateItemCommand>
{
    private readonly IApplicationDbContext _context;

    public UpdateItemCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task Handle(UpdateItemCommand request, CancellationToken cancellationToken)
    {
        var code = (request.ItemCode ?? string.Empty).Trim();

        var entity = await _context
            .Items.AsQueryable()
            .Where(i => !i.IsDeleted && i.ItemCode == code)
            .SingleOrDefaultAsync(cancellationToken);

        Guard.Against.Null(entity, nameof(entity));

        if (request.ItemName is not null)
            entity.ItemName = request.ItemName.Trim();

        if (request.UgpEntry is not null)
        {
            var ugpEntry = request.UgpEntry.Trim();

            var uomGroup = await _context.UoMGroups.FirstOrDefaultAsync(
                u => u.UgpEntry == ugpEntry,
                cancellationToken
            );

            Guard.Against.Null(uomGroup, nameof(uomGroup));

            entity.UgpEntry = ugpEntry;
            entity.UoMGroup = uomGroup;
        }

        if (request.BarcodeValue is not null)
            entity.BarcodeValue = request.BarcodeValue.Trim();

        if (request.BarcodeFormat is not null)
            entity.BarcodeFormat = request.BarcodeFormat;

        if (request.ItemGroup is not null)
            entity.ItemGroup = request.ItemGroup.Value;

        if (request.Remarks is not null)
            entity.Remarks = request.Remarks.Trim();

        await _context.SaveChangesAsync(cancellationToken);
    }
}
