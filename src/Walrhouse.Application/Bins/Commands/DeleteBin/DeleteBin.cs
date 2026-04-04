using Ardalis.GuardClauses;
using Walrhouse.Application.Common.Interfaces;

namespace Walrhouse.Application.Bins.Commands.DeleteBin;

public record DeleteBinCommand(string BinNo) : IRequest;

public class DeleteBinCommandHandler : IRequestHandler<DeleteBinCommand>
{
    private readonly IApplicationDbContext _context;

    public DeleteBinCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task Handle(DeleteBinCommand request, CancellationToken cancellationToken)
    {
        var entity = await _context.Bins.FirstOrDefaultAsync(
            b => b.BinNo == request.BinNo,
            cancellationToken
        );

        Guard.Against.Null(entity, nameof(entity));

        // Soft-delete
        // Since there are many dependent entities,
        // we will handle this later (maybe through domain events).
        entity.IsDeleted = true;
        await _context.SaveChangesAsync(cancellationToken);
    }
}
