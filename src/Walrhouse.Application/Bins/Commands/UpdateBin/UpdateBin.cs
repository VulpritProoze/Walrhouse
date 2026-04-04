using Walrhouse.Application.Common.Interfaces;

namespace Walrhouse.Application.Bins.Commands.UpdateBin;

public record UpdateBinCommand(string BinNo, string BinName) : IRequest;

public class UpdateBinCommandHandler : IRequestHandler<UpdateBinCommand>
{
    private readonly IApplicationDbContext _context;

    public UpdateBinCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task Handle(UpdateBinCommand request, CancellationToken cancellationToken)
    {
        var binNo = (request.BinNo ?? string.Empty).Trim();

        var entity = await _context
            .Bins.AsQueryable()
            .Where(b => !b.IsDeleted && b.BinNo == binNo)
            .SingleOrDefaultAsync(cancellationToken);

        Guard.Against.Null(entity, nameof(entity));
        entity.BinName = request.BinName.Trim();
        await _context.SaveChangesAsync(cancellationToken);
    }
}
