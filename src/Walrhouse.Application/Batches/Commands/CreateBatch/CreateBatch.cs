using Walrhouse.Application.Common.Interfaces;
using Walrhouse.Domain.Entities;
using Walrhouse.Domain.Enums;

namespace Walrhouse.Application.Batches.Commands.CreateBatch;

public record CreateBatchCommand(
    string BatchNumber,
    string ItemCode,
    DateTimeOffset ExpiryDate,
    BatchStatus Status,
    string BinNo
) : IRequest<string>;

public class CreateBatchCommandHandler : IRequestHandler<CreateBatchCommand, string>
{
    private readonly IApplicationDbContext _context;

    public CreateBatchCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<string> Handle(
        CreateBatchCommand request,
        CancellationToken cancellationToken
    )
    {
        var batchNumber = request.BatchNumber.Trim();
        var itemCode = request.ItemCode.Trim();
        var binNo = request.BinNo.Trim();

        var existing = await _context
            .Batches.AsQueryable()
            .Where(b => b.BatchNumber == batchNumber)
            .SingleOrDefaultAsync(cancellationToken);

        if (existing is not null && !existing.IsDeleted)
            return existing.BatchNumber;

        var item = await _context.Items.FirstOrDefaultAsync(
            i => !i.IsDeleted && i.ItemCode == itemCode,
            cancellationToken
        );

        Guard.Against.Null(item, nameof(item));

        var bin = await _context.Bins.FirstOrDefaultAsync(
            b => !b.IsDeleted && b.BinNo == binNo,
            cancellationToken
        );

        Guard.Against.Null(bin, nameof(bin));

        if (existing is not null)
        {
            existing.ItemCode = itemCode;
            existing.Item = item;
            existing.ExpiryDate = request.ExpiryDate;
            existing.Status = request.Status;
            existing.BinNo = binNo;
            existing.Bin = bin;
            existing.IsDeleted = false;

            await _context.SaveChangesAsync(cancellationToken);

            return existing.BatchNumber;
        }

        var batch = new Batch
        {
            BatchNumber = batchNumber,
            ItemCode = itemCode,
            Item = item,
            ExpiryDate = request.ExpiryDate,
            Status = request.Status,
            BinNo = binNo,
            Bin = bin,
        };

        _context.Batches.Add(batch);

        await _context.SaveChangesAsync(cancellationToken);

        return batch.BatchNumber;
    }
}
