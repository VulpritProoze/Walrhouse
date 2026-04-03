using AutoMapper.QueryableExtensions;
using FluentValidation;
using Microsoft.EntityFrameworkCore;
using Walrhouse.Application.Common.Interfaces;
using Walrhouse.Application.Common.Mappings;
using Walrhouse.Application.Common.Security;

namespace Walrhouse.Application.Warehouses.Queries.GetWarehouse;

public record GetWarehouseQuery(string WarehouseCode) : IRequest<WarehouseDto?>;

public class GetWarehouseQueryHandler : IRequestHandler<GetWarehouseQuery, WarehouseDto?>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;

    public GetWarehouseQueryHandler(IApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<WarehouseDto?> Handle(
        GetWarehouseQuery request,
        CancellationToken cancellationToken
    )
    {
        if (string.IsNullOrWhiteSpace(request.WarehouseCode))
            return null;

        var code = request.WarehouseCode.Trim();

        return await _context
            .Warehouses.AsNoTracking()
            .Where(w => !w.IsDeleted && w.WarehouseCode == code)
            .ProjectTo<WarehouseDto>(_mapper.ConfigurationProvider)
            .SingleOrDefaultAsync(cancellationToken);
    }
}
