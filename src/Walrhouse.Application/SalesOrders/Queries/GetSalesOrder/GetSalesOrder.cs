using Walrhouse.Application.Common.Interfaces;

namespace Walrhouse.Application.SalesOrders.Queries.GetSalesOrder;

public record GetSalesOrderQuery(int Id) : IRequest<SalesOrderDto>;

public class GetSalesOrderQueryHandler : IRequestHandler<GetSalesOrderQuery, SalesOrderDto>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;

    public GetSalesOrderQueryHandler(IApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<SalesOrderDto> Handle(
        GetSalesOrderQuery request,
        CancellationToken cancellationToken
    )
    {
        var query = await _context
            .SalesOrders.AsNoTracking()
            .Where(o => o.Id == request.Id)
            .OrderByDescending(o => o.CreatedAt)
            .ThenBy(o => o.Id)
            .ProjectTo<SalesOrderDto>(_mapper.ConfigurationProvider)
            .SingleOrDefaultAsync(cancellationToken);

        return _mapper.Map<SalesOrderDto>(query);
    }
}
