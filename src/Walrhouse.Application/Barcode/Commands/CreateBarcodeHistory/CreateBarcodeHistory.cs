using Walrhouse.Application.Common.Interfaces;
using Walrhouse.Domain.Entities;
using Walrhouse.Domain.Enums;

namespace Walrhouse.Application.Barcode.Commands.CreateBarcodeHistory;

public record CreateBarcodeHistoryCommand(
    string BarcodeValue,
    string BatchNumber,
    BarcodeFormat? BarcodeFormat,
    string? Remarks,
    string? CreatedBy
) : IRequest<int>;

public class CreateBarcodeHistoryCommandHandler : IRequestHandler<CreateBarcodeHistoryCommand, int>
{
    private readonly IApplicationDbContext _context;

    public CreateBarcodeHistoryCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<int> Handle(
        CreateBarcodeHistoryCommand request,
        CancellationToken cancellationToken
    )
    {
        var batch = await _context.Batches.FirstOrDefaultAsync(
            b => b.BatchNumber == request.BatchNumber && !b.IsDeleted,
            cancellationToken
        );

        Guard.Against.Null(batch, "Batch with the specified BatchNumber does not exist.");

        var entity = new BarcodeHistory
        {
            BarcodeValue = request.BarcodeValue,
            BatchNumber = request.BatchNumber,
            Batch = batch,
            BarcodeFormat = request.BarcodeFormat,
            Remarks = request.Remarks,
            CreatedBy = request.CreatedBy,
            CreatedAt = DateTimeOffset.UtcNow,
        };

        _context.BarcodeHistories.Add(entity);

        await _context.SaveChangesAsync(cancellationToken);

        return entity.Id;
    }
}
