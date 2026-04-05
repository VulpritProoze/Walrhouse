using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;
using Walrhouse.Application.Common.Interfaces;
using Walrhouse.Application.Common.Mappings;
using Walrhouse.Application.Common.Models;

namespace Walrhouse.Application.UoMGroups.Queries.GetUoMGroups;

public record GetUoMGroupsQuery(int PageNumber = 1, int PageSize = 100)
    : IRequest<PaginatedList<UoMGroupDto>>;

public class GetUoMGroupsQueryHandler
    : IRequestHandler<GetUoMGroupsQuery, PaginatedList<UoMGroupDto>>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;

    public GetUoMGroupsQueryHandler(IApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<PaginatedList<UoMGroupDto>> Handle(
        GetUoMGroupsQuery request,
        CancellationToken cancellationToken
    )
    {
        var pageNumber = request.PageNumber < 1 ? 1 : request.PageNumber;
        var pageSize = request.PageSize < 1 ? 100 : Math.Min(request.PageSize, 100);

        return await _context
            .UoMGroups.AsNoTracking()
            .Where(g => !g.IsDeleted)
            .ProjectTo<UoMGroupDto>(_mapper.ConfigurationProvider)
            .OrderBy(g => g.UgpEntry)
            .PaginatedListAsync(pageNumber, pageSize, cancellationToken);
    }
}
