using Walrhouse.Application.Common.Interfaces;

namespace Walrhouse.Application.Stocks.Commands.UpdateStock;

public record UpdateStockCommand(string ItemCode, int? QuantityOnHand) : IRequest;

public class UpdateStockCommandHandler : IRequestHandler<UpdateStockCommand>
{
    private readonly IApplicationDbContext _context;

    public UpdateStockCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task Handle(UpdateStockCommand request, CancellationToken cancellationToken)
    {
        var itemCode = request.ItemCode.Trim();

        var entity = await _context
            .Stocks.AsQueryable()
            .Where(s => !s.IsDeleted && s.ItemCode == itemCode)
            .SingleOrDefaultAsync(cancellationToken);

        Guard.Against.Null(entity, nameof(entity));

        if (request.QuantityOnHand is not null)
            entity.QuantityOnHand = request.QuantityOnHand.Value;

        await _context.SaveChangesAsync(cancellationToken);
    }
}
