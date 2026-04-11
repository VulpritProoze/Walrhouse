using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;
using Walrhouse.Application.Common.Interfaces;
using Walrhouse.Application.Common.Mappings;
using Walrhouse.Application.Common.Models;
using Walrhouse.Application.Common.Security;

namespace Walrhouse.Application.Warehouses.Queries.GetWarehouses;

public record GetWarehousesQuery(int PageNumber = 1, int PageSize = 100)
    : IRequest<PaginatedList<WarehouseDto>>;

public class GetWarehousesQueryHandler
    : IRequestHandler<GetWarehousesQuery, PaginatedList<WarehouseDto>>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;

    public GetWarehousesQueryHandler(IApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<PaginatedList<WarehouseDto>> Handle(
        GetWarehousesQuery request,
        CancellationToken cancellationToken
    )
    {
        var pageNumber = request.PageNumber < 1 ? 1 : request.PageNumber;
        var pageSize = request.PageSize < 1 ? 100 : Math.Min(request.PageSize, 100);

        return await _context
            .Warehouses.AsNoTracking()
            .Where(w => !w.IsDeleted)
            .OrderByDescending(w => w.CreatedAt)
            .ThenBy(w => w.WarehouseCode)
            .ThenBy(w => w.WarehouseName)
            .ProjectTo<WarehouseDto>(_mapper.ConfigurationProvider)
            .PaginatedListAsync(pageNumber, pageSize, cancellationToken);
    }
}
