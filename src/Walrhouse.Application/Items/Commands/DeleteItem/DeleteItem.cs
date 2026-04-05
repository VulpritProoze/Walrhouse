using Ardalis.GuardClauses;
using Microsoft.EntityFrameworkCore;
using Walrhouse.Application.Common.Interfaces;

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

        Guard.Against.Null(entity, nameof(entity));

        entity.IsDeleted = true;

        await _context.SaveChangesAsync(cancellationToken);
    }
}
