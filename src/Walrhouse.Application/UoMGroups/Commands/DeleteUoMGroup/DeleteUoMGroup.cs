using Walrhouse.Application.Common.Interfaces;

namespace Walrhouse.Application.UoMGroups.Commands.DeleteUoMGroup;

public record DeleteUoMGroupCommand(string UgpEntry) : IRequest;

public class DeleteUoMGroupCommandHandler : IRequestHandler<DeleteUoMGroupCommand>
{
    private readonly IApplicationDbContext _context;

    public DeleteUoMGroupCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task Handle(DeleteUoMGroupCommand request, CancellationToken cancellationToken)
    {
        var entity = await _context.UoMGroups.FirstOrDefaultAsync(
            g => g.UgpEntry == request.UgpEntry && !g.IsDeleted,
            cancellationToken
        );

        Guard.Against.Null(entity, nameof(entity));

        entity.IsDeleted = true;

        await _context.SaveChangesAsync(cancellationToken);
    }
}
