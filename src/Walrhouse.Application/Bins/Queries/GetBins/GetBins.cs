using Walrhouse.Application.Common.Interfaces;
using Walrhouse.Application.Common.Mappings;
using Walrhouse.Application.Common.Models;

namespace Walrhouse.Application.Bins.Queries.GetBins;

public record GetBinsQuery(int PageNumber = 1, int PageSize = 100)
    : IRequest<PaginatedList<BinDto>>;

public class GetBinsQueryHandler : IRequestHandler<GetBinsQuery, PaginatedList<BinDto>>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;

    public GetBinsQueryHandler(IApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<PaginatedList<BinDto>> Handle(
        GetBinsQuery request,
        CancellationToken cancellationToken
    )
    {
        var pageNumber = request.PageNumber < 1 ? 1 : request.PageNumber;
        var pageSize = request.PageSize < 1 ? 100 : Math.Min(request.PageSize, 100);

        return await _context
            .Bins.AsNoTracking()
            .Where(b => !b.IsDeleted)
            .OrderByDescending(b => b.CreatedAt)
            .ThenBy(b => b.BinNo)
            .ProjectTo<BinDto>(_mapper.ConfigurationProvider)
            .PaginatedListAsync(pageNumber, pageSize, cancellationToken);
    }
}
