using Walrhouse.Application.Common.Interfaces;

namespace Walrhouse.Application.Verification.Queries.GetVerificationHistory;

public record GetVerificationHistoryQuery(int Id) : IRequest<VerificationHistoryDto?>;

public class GetVerificationHistoryQueryHandler
    : IRequestHandler<GetVerificationHistoryQuery, VerificationHistoryDto?>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;

    public GetVerificationHistoryQueryHandler(IApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<VerificationHistoryDto?> Handle(
        GetVerificationHistoryQuery request,
        CancellationToken cancellationToken
    )
    {
        return await _context
            .VerificationHistories.AsNoTracking()
            .Where(x => x.Id == request.Id)
            .ProjectTo<VerificationHistoryDto>(_mapper.ConfigurationProvider)
            .FirstOrDefaultAsync(cancellationToken);
    }
}
