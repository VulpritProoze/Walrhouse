using Walrhouse.Application.Common.Interfaces;

namespace Walrhouse.Application.UoMGroups.Commands.DeleteUoMGroup;

public record DeleteUoMGroupCommand(int Id) : IRequest;

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
            g => g.Id == request.Id && !g.IsDeleted,
            cancellationToken
        );

        Guard.Against.Null(entity, nameof(entity));

        entity.IsDeleted = true;

        await _context.SaveChangesAsync(cancellationToken);
    }
}
