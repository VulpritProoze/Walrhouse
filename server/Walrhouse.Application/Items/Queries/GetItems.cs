using Walrhouse.Application.Common.Interfaces;
using Walrhouse.Application.Common.Mappings;
using Walrhouse.Application.Common.Models;
using Walrhouse.Application.Common.Security;

namespace Walrhouse.Application.Items.Queries.GetItems;

[Authorize]
public record GetItemsQuery(int PageNumber = 1, int PageSize = 100)
    : IRequest<PaginatedList<ItemDto>>;

public class GetItemsQueryHandler : IRequestHandler<GetItemsQuery, PaginatedList<ItemDto>>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;

    public GetItemsQueryHandler(IApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<PaginatedList<ItemDto>> Handle(
        GetItemsQuery request,
        CancellationToken cancellationToken
    )
    {
        var pageNumber = request.PageNumber < 1 ? 1 : request.PageNumber;
        var pageSize = request.PageSize < 1 ? 100 : Math.Min(request.PageSize, 100);

        return await _context
            .Items.AsNoTracking()
            .ProjectTo<ItemDto>(_mapper.ConfigurationProvider)
            .OrderBy(i => i.ItemName)
            .ThenBy(i => i.Id)
            .PaginatedListAsync(pageNumber, pageSize, cancellationToken);
    }
}
