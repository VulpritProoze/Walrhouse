using Walrhouse.Application.Common.Interfaces;
using Walrhouse.Application.UoMGroups.Queries.GetUoMGroups;

namespace Walrhouse.Application.UoMGroups.Queries.GetUoMGroup;

public record GetUoMGroupQuery(string UgpEntry) : IRequest<UoMGroupDto?>;

public class GetUoMGroupQueryHandler : IRequestHandler<GetUoMGroupQuery, UoMGroupDto?>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;

    public GetUoMGroupQueryHandler(IApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<UoMGroupDto?> Handle(
        GetUoMGroupQuery request,
        CancellationToken cancellationToken
    )
    {
        if (string.IsNullOrWhiteSpace(request.UgpEntry))
            return null;

        var code = request.UgpEntry.Trim();

        return await _context
            .UoMGroups.AsNoTracking()
            .Where(g => !g.IsDeleted && g.UgpEntry == code)
            .ProjectTo<UoMGroupDto>(_mapper.ConfigurationProvider)
            .SingleOrDefaultAsync(cancellationToken);
    }
}
