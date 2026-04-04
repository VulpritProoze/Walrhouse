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
        var binNo = (request.BinNo ?? string.Empty).Trim();

        var existing = await _context
            .Bins.AsQueryable()
            .Where(b => b.BinNo == binNo)
            .SingleOrDefaultAsync(cancellationToken);

        if (existing is not null)
        {
            if (!existing.IsDeleted)
                return existing.BinNo; // idempotent

            existing.BinName = (request.BinName ?? string.Empty).Trim();
            existing.WarehouseCode = (request.WarehouseCode ?? string.Empty).Trim();
            existing.IsDeleted = false;

            await _context.SaveChangesAsync(cancellationToken);

            return existing.BinNo;
        }

        var bin = new Bin
        {
            BinNo = binNo,
            BinName = (request.BinName ?? string.Empty).Trim(),
            WarehouseCode = (request.WarehouseCode ?? string.Empty).Trim(),
            Warehouse = null!
        };

        _context.Bins.Add(bin);

        await _context.SaveChangesAsync(cancellationToken);

        return bin.BinNo;
    }
}
