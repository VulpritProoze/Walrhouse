using Microsoft.EntityFrameworkCore;
using Walrhouse.Application.Common.Interfaces;

namespace Walrhouse.Application.Bins.Commands.UpdateBin;

public record UpdateBinCommand(string BinNo, string? BinName, string? WarehouseCode) : IRequest;

public class UpdateBinCommandHandler : IRequestHandler<UpdateBinCommand>
{
    private readonly IApplicationDbContext _context;

    public UpdateBinCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task Handle(UpdateBinCommand request, CancellationToken cancellationToken)
    {
        var binNo = request.BinNo.Trim();

        var entity = await _context
            .Bins.AsQueryable()
            .Where(b => !b.IsDeleted && b.BinNo == binNo)
            .SingleOrDefaultAsync(cancellationToken);

        Guard.Against.Null(entity, nameof(entity));
        
        if (request.BinName is not null)
            entity.BinName = request.BinName.Trim();

        if (!string.IsNullOrWhiteSpace(request.WarehouseCode))
        {
            var warehouse = await _context.Warehouses.FirstOrDefaultAsync(
                w => w.WarehouseCode == request.WarehouseCode.Trim(),
                cancellationToken
            );

            Guard.Against.Null(warehouse, nameof(warehouse));

            entity.WarehouseCode = request.WarehouseCode.Trim();
            entity.Warehouse = warehouse;
        }

        await _context.SaveChangesAsync(cancellationToken);
    }
}
