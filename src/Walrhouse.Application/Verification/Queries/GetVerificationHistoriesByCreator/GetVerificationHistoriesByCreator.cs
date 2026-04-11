using Walrhouse.Application.Common.Interfaces;
using Walrhouse.Application.Common.Mappings;
using Walrhouse.Application.Common.Models;

namespace Walrhouse.Application.Verification.Queries.GetVerificationHistoriesByCreator;

public record GetVerificationHistoriesByCreatorQuery(
    string CreatedBy,
    int PageNumber = 1,
    int PageSize = 100
) : IRequest<PaginatedList<VerificationHistoryDto>>;

public class GetVerificationHistoriesByCreatorQueryHandler
    : IRequestHandler<GetVerificationHistoriesByCreatorQuery, PaginatedList<VerificationHistoryDto>>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;

    public GetVerificationHistoriesByCreatorQueryHandler(
        IApplicationDbContext context,
        IMapper mapper
    )
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<PaginatedList<VerificationHistoryDto>> Handle(
        GetVerificationHistoriesByCreatorQuery request,
        CancellationToken cancellationToken
    )
    {
        return await _context
            .VerificationHistories.AsNoTracking()
            .Where(x => x.CreatedBy == request.CreatedBy)
            .ProjectTo<VerificationHistoryDto>(_mapper.ConfigurationProvider)
            .OrderByDescending(x => x.CreatedAt)
            .PaginatedListAsync(request.PageNumber, request.PageSize, cancellationToken);
    }
}
