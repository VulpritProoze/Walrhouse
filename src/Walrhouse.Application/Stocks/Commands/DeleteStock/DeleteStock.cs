using Walrhouse.Application.Common.Interfaces;

namespace Walrhouse.Application.Stocks.Commands.DeleteStock;

public record DeleteStockCommand(string ItemCode) : IRequest;

public class DeleteStockCommandHandler : IRequestHandler<DeleteStockCommand>
{
    private readonly IApplicationDbContext _context;

    public DeleteStockCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task Handle(DeleteStockCommand request, CancellationToken cancellationToken)
    {
        var itemCode = request.ItemCode.Trim();

        var entity = await _context.Stocks.FirstOrDefaultAsync(
            s => !s.IsDeleted && s.ItemCode == itemCode,
            cancellationToken
        );

        Guard.Against.Null(entity, nameof(entity));

        entity.IsDeleted = true;
        await _context.SaveChangesAsync(cancellationToken);
    }
}
