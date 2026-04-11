using Walrhouse.Application.Common.Interfaces;
using Walrhouse.Application.Common.Mappings;
using Walrhouse.Application.Common.Models;

namespace Walrhouse.Application.Batches.Queries.GetBatches;

public record GetBatchesQuery(int PageNumber = 1, int PageSize = 100)
    : IRequest<PaginatedList<BatchDto>>;

public class GetBatchesQueryHandler : IRequestHandler<GetBatchesQuery, PaginatedList<BatchDto>>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;

    public GetBatchesQueryHandler(IApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<PaginatedList<BatchDto>> Handle(
        GetBatchesQuery request,
        CancellationToken cancellationToken
    )
    {
        var pageNumber = request.PageNumber < 1 ? 1 : request.PageNumber;
        var pageSize = request.PageSize < 1 ? 100 : Math.Min(request.PageSize, 100);

        return await _context
            .Batches.AsNoTracking()
            .Where(b => !b.IsDeleted)
            .OrderByDescending(b => b.ExpiryDate)
            .ThenByDescending(b => b.CreatedAt)
            .ProjectTo<BatchDto>(_mapper.ConfigurationProvider)
            .PaginatedListAsync(pageNumber, pageSize, cancellationToken);
    }
}
