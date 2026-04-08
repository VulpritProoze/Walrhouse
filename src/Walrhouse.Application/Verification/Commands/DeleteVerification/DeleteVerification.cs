using Walrhouse.Application.Common.Interfaces;

namespace Walrhouse.Application.Verification.Commands.DeleteVerification;

public record DeleteVerificationCommand(string Id) : IRequest;

public class DeleteVerificationCommandHandler : IRequestHandler<DeleteVerificationCommand>
{
    private readonly IApplicationDbContext _context;

    public DeleteVerificationCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public Task Handle(DeleteVerificationCommand request, CancellationToken cancellationToken)
    {
        throw new NotImplementedException();
    }
}
