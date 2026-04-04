using Walrhouse.Application.Common.Interfaces;

namespace Walrhouse.Application.Warehouses.Commands.DeleteWarehouse;

public record DeleteWarehouseCommand(string WarehouseCode) : IRequest;

public class DeleteWarehouseCommandHandler : IRequestHandler<DeleteWarehouseCommand>
{
    private readonly IApplicationDbContext _context;

    public DeleteWarehouseCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task Handle(DeleteWarehouseCommand request, CancellationToken cancellationToken)
    {
        var entity = await _context.Warehouses.FirstOrDefaultAsync(
            w => w.WarehouseCode == request.WarehouseCode,
            cancellationToken
        );

        if (entity is null)
        {
            throw new KeyNotFoundException(
                $"Warehouse with code '{request.WarehouseCode}' was not found."
            );
        }

        // Soft-delete: mark entity as deleted instead of hard-removing it.
        entity.IsDeleted = true;
        await _context.SaveChangesAsync(cancellationToken);
    }
}
