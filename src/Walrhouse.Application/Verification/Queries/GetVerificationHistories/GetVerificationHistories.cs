using Walrhouse.Application.Common.Interfaces;
using Walrhouse.Application.Common.Mappings;
using Walrhouse.Application.Common.Models;

namespace Walrhouse.Application.Verification.Queries.GetVerificationHistories;

public record GetVerificationHistoriesQuery(int PageNumber = 1, int PageSize = 100)
    : IRequest<PaginatedList<VerificationHistoryDto>>;

public class GetVerificationHistoriesQueryHandler
    : IRequestHandler<GetVerificationHistoriesQuery, PaginatedList<VerificationHistoryDto>>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;

    public GetVerificationHistoriesQueryHandler(IApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<PaginatedList<VerificationHistoryDto>> Handle(
        GetVerificationHistoriesQuery request,
        CancellationToken cancellationToken
    )
    {
        return await _context
            .VerificationHistories.AsNoTracking()
            .ProjectTo<VerificationHistoryDto>(_mapper.ConfigurationProvider)
            .OrderByDescending(x => x.CreatedAt)
            .PaginatedListAsync(request.PageNumber, request.PageSize, cancellationToken);
    }
}
