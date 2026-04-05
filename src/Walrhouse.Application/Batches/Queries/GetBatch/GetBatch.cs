using Walrhouse.Application.Batches.Queries.GetBatches;
using Walrhouse.Application.Common.Interfaces;

namespace Walrhouse.Application.Batches.Queries.GetBatch;

public record GetBatchQuery(string BatchNumber) : IRequest<BatchDto?>;

public class GetBatchQueryHandler : IRequestHandler<GetBatchQuery, BatchDto?>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;

    public GetBatchQueryHandler(IApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<BatchDto?> Handle(GetBatchQuery request, CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(request.BatchNumber))
            return null;

        var batchNumber = request.BatchNumber.Trim();

        return await _context
            .Batches.AsNoTracking()
            .Where(b => !b.IsDeleted && b.BatchNumber == batchNumber)
            .ProjectTo<BatchDto>(_mapper.ConfigurationProvider)
            .SingleOrDefaultAsync(cancellationToken);
    }
}
