using Walrhouse.Application.Common.Interfaces;

namespace Walrhouse.Application.Verification.Commands.UpdateVerification;

public record UpdateVerificationCommand(string Id, string? Payload) : IRequest;

public class UpdateVerificationCommandHandler : IRequestHandler<UpdateVerificationCommand>
{
    private readonly IApplicationDbContext _context;

    public UpdateVerificationCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public Task<Unit> Handle(UpdateVerificationCommand request, CancellationToken cancellationToken)
    {
        throw new NotImplementedException();
    }
}
