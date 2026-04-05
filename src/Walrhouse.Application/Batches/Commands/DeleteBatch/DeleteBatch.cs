using Walrhouse.Application.Common.Interfaces;

namespace Walrhouse.Application.Batches.Commands.DeleteBatch;

public record DeleteBatchCommand(string BatchNumber) : IRequest;

public class DeleteBatchCommandHandler : IRequestHandler<DeleteBatchCommand>
{
    private readonly IApplicationDbContext _context;

    public DeleteBatchCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task Handle(DeleteBatchCommand request, CancellationToken cancellationToken)
    {
        var batchNumber = request.BatchNumber.Trim();

        var entity = await _context.Batches.FirstOrDefaultAsync(
            b => !b.IsDeleted && b.BatchNumber == batchNumber,
            cancellationToken
        );

        Guard.Against.Null(entity, nameof(entity));

        entity.IsDeleted = true;
        await _context.SaveChangesAsync(cancellationToken);
    }
}
