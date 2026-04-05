using Walrhouse.Application.Common.Interfaces;
using Walrhouse.Domain.Entities;

namespace Walrhouse.Application.Bins.Commands.CreateBin;

public record CreateBinCommand(string BinNo, string BinName, string WarehouseCode) : IRequest<string>;

public class CreateBinCommandHandler : IRequestHandler<CreateBinCommand, string>
{
    private readonly IApplicationDbContext _context;

    public CreateBinCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<string> Handle(CreateBinCommand request, CancellationToken cancellationToken)
    {
        var binNo = request.BinNo.Trim();

        var existing = await _context
            .Bins.AsQueryable()
            .Where(b => b.BinNo == binNo)
            .SingleOrDefaultAsync(cancellationToken);

        var warehouse = await _context.Warehouses.FirstOrDefaultAsync(
            w => w.WarehouseCode == request.WarehouseCode.Trim(),
            cancellationToken
        );

        Guard.Against.Null(warehouse, nameof(warehouse));

        if (existing is not null)
        {
            if (!existing.IsDeleted)
                return existing.BinNo; // idempotent

            existing.BinName = request.BinName.Trim();
            existing.WarehouseCode = request.WarehouseCode.Trim();
            existing.Warehouse = warehouse;
            existing.IsDeleted = false;

            await _context.SaveChangesAsync(cancellationToken);

            return existing.BinNo;
        }

        var bin = new Bin
        {
            BinNo = binNo,
            BinName = request.BinName.Trim(),
            WarehouseCode = request.WarehouseCode.Trim(),
            Warehouse = warehouse
        };

        _context.Bins.Add(bin);

        await _context.SaveChangesAsync(cancellationToken);

        return bin.BinNo;
    }
}
