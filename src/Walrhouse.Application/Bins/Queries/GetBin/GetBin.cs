using Walrhouse.Application.Bins.Queries.GetBins;
using Walrhouse.Application.Common.Interfaces;

namespace Walrhouse.Application.Bins.Queries.GetBin;

public record GetBinQuery(string BinNo) : IRequest<BinDto?>;

public class GetBinQueryHandler : IRequestHandler<GetBinQuery, BinDto?>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;

    public GetBinQueryHandler(IApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<BinDto?> Handle(
        GetBinQuery request,
        CancellationToken cancellationToken
    )
    {
        if (string.IsNullOrWhiteSpace(request.BinNo))
            return null;

        var binNo = request.BinNo.Trim();

        return await _context
            .Bins.AsNoTracking()
            .Where(b => !b.IsDeleted && b.BinNo == binNo)
            .ProjectTo<BinDto>(_mapper.ConfigurationProvider)
            .SingleOrDefaultAsync(cancellationToken);
    }
}
