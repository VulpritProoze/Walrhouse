using Walrhouse.Application.Common.Interfaces;
using Walrhouse.Application.Common.Models;

namespace Walrhouse.Application.SalesOrders.Queries.GetSalesOrders;

public record GetSalesOrdersQuery(int PageNumber = 1, int PageSize = 10)
    : IRequest<PaginatedList<SalesOrderDto>>;

public class GetSalesOrdersQueryHandler
    : IRequestHandler<GetSalesOrdersQuery, PaginatedList<SalesOrderDto>>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;

    public GetSalesOrdersQueryHandler(IApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<PaginatedList<SalesOrderDto>> Handle(
        GetSalesOrdersQuery request,
        CancellationToken cancellationToken
    )
    {
        var pageNumber = request.PageNumber < 1 ? 1 : request.PageNumber;
        var pageSize = request.PageSize < 1 ? 10 : Math.Min(request.PageSize, 100);

        var query = _context.SalesOrders.AsNoTracking().OrderBy(x => x.Id);
        var count = await query.CountAsync(cancellationToken);
        var items = await query
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .OrderByDescending(x => x.CreatedAt)
            .ThenBy(x => x.Id)
            .ToListAsync(cancellationToken);

        var dtos = _mapper.Map<List<SalesOrderDto>>(items);

        return new PaginatedList<SalesOrderDto>(dtos, count, pageNumber, pageSize);
    }
}
