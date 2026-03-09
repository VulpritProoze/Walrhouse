using Walrhouse.Application.Common.Interfaces;
using Walrhouse.Application.Common.Security;

namespace Walrhouse.Application.Items.Commands.PurgeItem;

[Authorize]
public record PurgeItemsCommand : IRequest<int>;

public class PurgeItemsCommandHandler : IRequestHandler<PurgeItemsCommand, int>
{
    private readonly IApplicationDbContext _context;

    public PurgeItemsCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<int> Handle(PurgeItemsCommand request, CancellationToken cancellationToken)
    {
        var deletedCount = await _context.Items.ExecuteDeleteAsync(cancellationToken);
        await _context.SaveChangesAsync(cancellationToken);

        return deletedCount;
    }
}
