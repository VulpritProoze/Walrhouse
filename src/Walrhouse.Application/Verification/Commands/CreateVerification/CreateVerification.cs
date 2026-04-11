using Walrhouse.Application.Common.Interfaces;
using Walrhouse.Domain.Entities;

namespace Walrhouse.Application.Verification.Commands.CreateVerification;

public record CreateVerificationCommand(string BatchNumber, string CreatedBy, string? Remarks)
    : IRequest<int>;

public class CreateVerificationCommandHandler : IRequestHandler<CreateVerificationCommand, int>
{
    private readonly IApplicationDbContext _context;
    private readonly IUser _user;
    private readonly IIdentityService _identityService;

    public CreateVerificationCommandHandler(
        IApplicationDbContext context,
        IUser user,
        IIdentityService identityService
    )
    {
        _context = context;
        _user = user;
        _identityService = identityService;
    }

    public async Task<int> Handle(
        CreateVerificationCommand request,
        CancellationToken cancellationToken
    )
    {
        var batchNumber = request.BatchNumber.Trim();

        var batch = await _context
            .Batches.Where(b => !b.IsDeleted)
            .FirstOrDefaultAsync(b => b.BatchNumber == batchNumber, cancellationToken);

        Guard.Against.Null(batch, nameof(batch), $"Batch with number '{batchNumber}' not found.");

        var isUserExists = await _identityService.GetUserByIdAsync(request.CreatedBy.Trim());
        Guard.Against.Null(
            isUserExists,
            nameof(isUserExists),
            $"User with ID '{request.CreatedBy.Trim()}' not found."
        );

        var entity = new VerificationHistory
        {
            BatchNumberVerified = batchNumber,
            Batch = batch,
            Remarks = request.Remarks?.Trim(),
            CreatedAt = DateTimeOffset.UtcNow,
            CreatedBy = request.CreatedBy.Trim(),
        };

        _context.VerificationHistories.Add(entity);

        await _context.SaveChangesAsync(cancellationToken);

        return entity.Id;
    }
}
