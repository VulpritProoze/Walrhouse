using Walrhouse.Application.Common.Interfaces;
using Walrhouse.Application.Common.Mappings;
using Walrhouse.Application.Common.Models;

namespace Walrhouse.Application.BarcodeHistories.Queries.GetBarcodeHistories;

public record GetBarcodeHistoriesQuery(int PageNumber = 1, int PageSize = 100)
    : IRequest<PaginatedList<BarcodeHistoryDto>>;

public class GetBarcodeHistoriesQueryHandler
    : IRequestHandler<GetBarcodeHistoriesQuery, PaginatedList<BarcodeHistoryDto>>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;

    public GetBarcodeHistoriesQueryHandler(IApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<PaginatedList<BarcodeHistoryDto>> Handle(
        GetBarcodeHistoriesQuery request,
        CancellationToken cancellationToken
    )
    {
        var pageNumber = request.PageNumber < 1 ? 1 : request.PageNumber;
        var pageSize = request.PageSize < 1 ? 100 : Math.Min(request.PageSize, 100);

        return await _context
            .BarcodeHistories.AsNoTracking()
            .ProjectTo<BarcodeHistoryDto>(_mapper.ConfigurationProvider)
            .OrderByDescending(x => x.Id)
            .PaginatedListAsync(pageNumber, pageSize, cancellationToken);
    }
}
