using Walrhouse.Application.Common.Interfaces;
using Walrhouse.Application.Stocks.Queries.GetStocks;

namespace Walrhouse.Application.Stocks.Queries.GetStock;

public record GetStockQuery(string ItemCode) : IRequest<StockDto?>;

public class GetStockQueryHandler : IRequestHandler<GetStockQuery, StockDto?>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;

    public GetStockQueryHandler(IApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<StockDto?> Handle(GetStockQuery request, CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(request.ItemCode))
            return null;

        var itemCode = request.ItemCode.Trim();

        return await _context
            .Stocks.AsNoTracking()
            .Where(s => !s.IsDeleted && s.ItemCode == itemCode)
            .ProjectTo<StockDto>(_mapper.ConfigurationProvider)
            .SingleOrDefaultAsync(cancellationToken);
    }
}
