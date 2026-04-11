using Walrhouse.Application.Common.Interfaces;
using Walrhouse.Application.Common.Mappings;
using Walrhouse.Application.Common.Models;

namespace Walrhouse.Application.Stocks.Queries.GetStocks;

public record GetStocksQuery(int PageNumber = 1, int PageSize = 100)
    : IRequest<PaginatedList<StockDto>>;

public class GetStocksQueryHandler : IRequestHandler<GetStocksQuery, PaginatedList<StockDto>>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;

    public GetStocksQueryHandler(IApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<PaginatedList<StockDto>> Handle(
        GetStocksQuery request,
        CancellationToken cancellationToken
    )
    {
        var pageNumber = request.PageNumber < 1 ? 1 : request.PageNumber;
        var pageSize = request.PageSize < 1 ? 100 : Math.Min(request.PageSize, 100);

        return await _context
            .Stocks.AsNoTracking()
            .Where(s => !s.IsDeleted)
            .OrderByDescending(s => s.CreatedAt)
            .ThenBy(s => s.ItemCode)
            .ProjectTo<StockDto>(_mapper.ConfigurationProvider)
            .PaginatedListAsync(pageNumber, pageSize, cancellationToken);
    }
}
