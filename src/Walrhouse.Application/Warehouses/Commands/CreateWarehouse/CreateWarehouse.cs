using Walrhouse.Application.Common.Interfaces;
using Walrhouse.Domain.Entities;

namespace Walrhouse.Application.Warehouses.Commands.CreateWarehouse;

public record CreateWarehouseCommand(string WarehouseCode, string? WarehouseName)
    : IRequest<string>;

public class CreateWarehouseCommandHandler : IRequestHandler<CreateWarehouseCommand, string>
{
    private readonly IApplicationDbContext _context;

    public CreateWarehouseCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<string> Handle(
        CreateWarehouseCommand request,
        CancellationToken cancellationToken
    )
    {
        var code = (request.WarehouseCode ?? string.Empty).Trim();

        var existing = await _context
            .Warehouses.AsQueryable()
            .Where(w => !w.IsDeleted && w.WarehouseCode == code)
            .SingleOrDefaultAsync(cancellationToken);

        if (existing is not null)
            return existing.WarehouseCode; // return existing code for idempotency

        var warehouse = new Warehouse
        {
            WarehouseCode = code,
            WarehouseName = request.WarehouseName?.Trim(),
        };

        _context.Warehouses.Add(warehouse);

        await _context.SaveChangesAsync(cancellationToken);

        return warehouse.WarehouseCode;
    }
}
