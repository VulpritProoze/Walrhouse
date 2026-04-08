using Walrhouse.Application.Common.Interfaces;

namespace Walrhouse.Application.BarcodeHistories.Queries.GetBarcodeHistory;

public record GetBarcodeHistoryQuery(int Id) : IRequest<BarcodeHistoryDto>;

public class GetBarcodeHistoryQueryHandler
    : IRequestHandler<GetBarcodeHistoryQuery, BarcodeHistoryDto>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;

    public GetBarcodeHistoryQueryHandler(IApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<BarcodeHistoryDto> Handle(
        GetBarcodeHistoryQuery request,
        CancellationToken cancellationToken
    )
    {
        var entity = await _context
            .BarcodeHistories.AsNoTracking()
            .ProjectTo<BarcodeHistoryDto>(_mapper.ConfigurationProvider)
            .FirstOrDefaultAsync(cancellationToken);

        Guard.Against.NotFound(request.Id, entity);

        return entity;
    }
}
