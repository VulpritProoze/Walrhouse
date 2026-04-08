using Walrhouse.Application.Common.Interfaces;
using Walrhouse.Domain.Entities;
using Walrhouse.Domain.Enums;

namespace Walrhouse.Application.Items.Commands.CreateItem;

public record CreateItemCommand(
    string ItemCode,
    string ItemName,
    string UgpEntry,
    string? BarcodeValue,
    BarcodeFormat? BarcodeFormat,
    ItemGroup? ItemGroup,
    string? Remarks
) : IRequest<string>;

public class CreateItemCommandHandler : IRequestHandler<CreateItemCommand, string>
{
    private readonly IApplicationDbContext _context;

    public CreateItemCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<string> Handle(CreateItemCommand request, CancellationToken cancellationToken)
    {
        var code = (request.ItemCode ?? string.Empty).Trim();

        // Normalize inputs
        var ugpEntry = (request.UgpEntry ?? string.Empty).Trim();

        var existing = await _context
            .Items.AsQueryable()
            .Where(i => i.ItemCode == code)
            .SingleOrDefaultAsync(cancellationToken);

        // If the item exists and is not deleted, return for idempotency.
        if (existing is not null && !existing.IsDeleted)
            return existing.ItemCode;

        // We need a UoMGroup when restoring a soft-deleted item or creating a new one.
        var needUoMGroup = existing is null || existing.IsDeleted;
        UoMGroup? uomGroup = null;

        if (needUoMGroup)
        {
            uomGroup = await _context.UoMGroups.FirstOrDefaultAsync(
                u => u.UgpEntry == ugpEntry,
                cancellationToken
            );

            Guard.Against.Null(uomGroup, nameof(uomGroup));
        }

        if (existing is not null)
        {
            // Restore previously soft-deleted item
            existing.ItemName = request.ItemName.Trim();
            existing.UgpEntry = ugpEntry;
            existing.UoMGroup = uomGroup!;
            existing.BarcodeValue = request.BarcodeValue?.Trim();
            existing.BarcodeFormat = request.BarcodeFormat;
            existing.ItemGroup = request.ItemGroup;
            existing.Remarks = request.Remarks?.Trim();
            existing.IsDeleted = false;

            await _context.SaveChangesAsync(cancellationToken);

            return existing.ItemCode;
        }

        var item = new Item
        {
            ItemCode = code,
            ItemName = request.ItemName.Trim(),
            UgpEntry = ugpEntry,
            UoMGroup = uomGroup!,
            BarcodeValue = request.BarcodeValue?.Trim(),
            BarcodeFormat = request.BarcodeFormat,
            ItemGroup = request.ItemGroup,
            Remarks = request.Remarks?.Trim(),
        };

        _context.Items.Add(item);

        await _context.SaveChangesAsync(cancellationToken);

        return item.ItemCode;
    }
}
