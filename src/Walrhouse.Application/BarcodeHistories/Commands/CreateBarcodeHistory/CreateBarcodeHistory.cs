using Walrhouse.Application.Common.Interfaces;
using Walrhouse.Domain.Entities;
using Walrhouse.Domain.Enums;

namespace Walrhouse.Application.BarcodeHistories.Commands.CreateBarcodeHistory;

public record CreateBarcodeHistoryCommand : IRequest<int>
{
    public required string BarcodeValue { get; init; }
    public BarcodeFormat? BarcodeFormat { get; init; }
    public string? Remarks { get; init; }
    public string? CreatedBy { get; init; }
}

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
        var entity = new BarcodeHistory
        {
            BarcodeValue = request.BarcodeValue,
            BarcodeFormat = request.BarcodeFormat,
            Remarks = request.Remarks,
            CreatedBy = request.CreatedBy,
        };

        _context.BarcodeHistories.Add(entity);

        await _context.SaveChangesAsync(cancellationToken);

        return entity.Id;
    }
}
