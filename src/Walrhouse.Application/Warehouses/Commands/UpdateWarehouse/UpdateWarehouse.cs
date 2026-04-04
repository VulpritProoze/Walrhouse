using Ardalis.GuardClauses;
using Walrhouse.Application.Common.Interfaces;
using Walrhouse.Domain.Entities;

namespace Walrhouse.Application.Warehouses.Commands.UpdateWarehouse;

public record UpdateWarehouseCommand(string WarehouseCode, string? WarehouseName) : IRequest;

public class UpdateWarehouseCommandHandler : IRequestHandler<UpdateWarehouseCommand>
{
    private readonly IApplicationDbContext _context;

    public UpdateWarehouseCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task Handle(UpdateWarehouseCommand request, CancellationToken cancellationToken)
    {
        var code = (request.WarehouseCode ?? string.Empty).Trim();

        var entity = await _context
            .Warehouses.AsQueryable()
            .Where(w => !w.IsDeleted && w.WarehouseCode == code)
            .SingleOrDefaultAsync(cancellationToken);

        Guard.Against.Null(entity, nameof(entity));

        entity.WarehouseName = request.WarehouseName?.Trim();

        await _context.SaveChangesAsync(cancellationToken);
    }
}
