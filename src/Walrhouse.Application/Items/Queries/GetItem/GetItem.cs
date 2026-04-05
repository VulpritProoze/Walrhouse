using Walrhouse.Application.Common.Interfaces;
using Walrhouse.Application.Items.Queries.GetItems;

namespace Walrhouse.Application.Items.Queries.GetItem;

public record GetItemQuery(string ItemCode) : IRequest<ItemDto?>;

public class GetItemQueryHandler : IRequestHandler<GetItemQuery, ItemDto?>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;

    public GetItemQueryHandler(IApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<ItemDto?> Handle(GetItemQuery request, CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(request.ItemCode))
            return null;

        var code = request.ItemCode.Trim();

        return await _context
            .Items.AsNoTracking()
            .Where(i => !i.IsDeleted && i.ItemCode == code)
            .ProjectTo<ItemDto>(_mapper.ConfigurationProvider)
            .SingleOrDefaultAsync(cancellationToken);
    }
}
