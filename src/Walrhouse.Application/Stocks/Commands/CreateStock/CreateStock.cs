using Walrhouse.Application.Common.Interfaces;
using Walrhouse.Domain.Entities;

namespace Walrhouse.Application.Stocks.Commands.CreateStock;

public record CreateStockCommand(string ItemCode, int QuantityOnHand) : IRequest<string>;

public class CreateStockCommandHandler : IRequestHandler<CreateStockCommand, string>
{
    private readonly IApplicationDbContext _context;

    public CreateStockCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<string> Handle(
        CreateStockCommand request,
        CancellationToken cancellationToken
    )
    {
        var itemCode = request.ItemCode.Trim();

        var existing = await _context
            .Stocks.AsQueryable()
            .Where(s => s.ItemCode == itemCode)
            .SingleOrDefaultAsync(cancellationToken);

        if (existing is not null && !existing.IsDeleted)
            return existing.ItemCode;

        var item = await _context.Items.FirstOrDefaultAsync(
            i => !i.IsDeleted && i.ItemCode == itemCode,
            cancellationToken
        );

        Guard.Against.Null(item, nameof(item));

        if (existing is not null)
        {
            existing.ItemCode = itemCode;
            existing.Item = item;
            existing.QuantityOnHand = request.QuantityOnHand;
            existing.IsDeleted = false;

            await _context.SaveChangesAsync(cancellationToken);

            return existing.ItemCode;
        }

        var stock = new Stock
        {
            ItemCode = itemCode,
            Item = item,
            QuantityOnHand = request.QuantityOnHand,
        };

        _context.Stocks.Add(stock);

        await _context.SaveChangesAsync(cancellationToken);

        return stock.ItemCode;
    }
}
