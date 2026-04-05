using Walrhouse.Application.Common.Interfaces;
using Walrhouse.Domain.Enums;

namespace Walrhouse.Application.Batches.Commands.UpdateBatch;

public record UpdateBatchCommand(
    string BatchNumber,
    string? ItemCode,
    DateTimeOffset? ExpiryDate,
    BatchStatus? Status,
    string? BinNo
) : IRequest;

public class UpdateBatchCommandHandler : IRequestHandler<UpdateBatchCommand>
{
    private readonly IApplicationDbContext _context;

    public UpdateBatchCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task Handle(UpdateBatchCommand request, CancellationToken cancellationToken)
    {
        var batchNumber = request.BatchNumber.Trim();

        var entity = await _context
            .Batches.AsQueryable()
            .Where(b => !b.IsDeleted && b.BatchNumber == batchNumber)
            .SingleOrDefaultAsync(cancellationToken);

        Guard.Against.Null(entity, nameof(entity));

        if (!string.IsNullOrWhiteSpace(request.ItemCode))
        {
            var itemCode = request.ItemCode.Trim();
            var item = await _context.Items.FirstOrDefaultAsync(
                i => !i.IsDeleted && i.ItemCode == itemCode,
                cancellationToken
            );

            Guard.Against.Null(item, nameof(item));

            entity.ItemCode = itemCode;
            entity.Item = item;
        }

        if (request.ExpiryDate is not null)
            entity.ExpiryDate = request.ExpiryDate.Value;

        if (request.Status is not null)
            entity.Status = request.Status.Value;

        if (!string.IsNullOrWhiteSpace(request.BinNo))
        {
            var binNo = request.BinNo.Trim();
            var bin = await _context.Bins.FirstOrDefaultAsync(
                b => !b.IsDeleted && b.BinNo == binNo,
                cancellationToken
            );

            Guard.Against.Null(bin, nameof(bin));

            entity.BinNo = binNo;
            entity.Bin = bin;
        }

        await _context.SaveChangesAsync(cancellationToken);
    }
}
