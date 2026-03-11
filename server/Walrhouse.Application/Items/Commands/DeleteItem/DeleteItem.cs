using Walrhouse.Application.Common.Interfaces;
using Walrhouse.Application.Common.Security;

namespace Walrhouse.Application.Items.Commands.DeleteItem;

public record DeleteItemCommand(string ItemCode) : IRequest;

public class DeleteItemCommandHandler : IRequestHandler<DeleteItemCommand>
{
    private readonly IApplicationDbContext _context;

    public DeleteItemCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task Handle(DeleteItemCommand request, CancellationToken cancellationToken)
    {
        var entity = await _context.Items.FirstOrDefaultAsync(
            i => i.ItemCode == request.ItemCode,
            cancellationToken
        );

        if (entity is null)
        {
            throw new KeyNotFoundException($"Item with code '{request.ItemCode}' was not found.");
        }

        _context.Items.Remove(entity);
        await _context.SaveChangesAsync(cancellationToken);
    }
}
