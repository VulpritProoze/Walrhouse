using Walrhouse.Application.Common.Interfaces;
using Walrhouse.Application.Common.Security;

namespace Walrhouse.Application.Items.Commands.DeleteItem;

[Authorize]
public record DeleteItemCommand(int Id) : IRequest;

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
            i => i.ItemId == request.Id,
            cancellationToken
        );

        if (entity is null)
        {
            throw new KeyNotFoundException($"Item with id '{request.Id}' was not found.");
        }

        _context.Items.Remove(entity);
        await _context.SaveChangesAsync(cancellationToken);
    }
}
