using Walrhouse.Application.Common.Interfaces;

namespace Walrhouse.Application.Verification.Commands.CreateVerification;

public record CreateVerificationCommand(string Id, string? Payload) : IRequest<string>;

public class CreateVerificationCommandHandler : IRequestHandler<CreateVerificationCommand, string>
{
    private readonly IApplicationDbContext _context;

    public CreateVerificationCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public Task<string> Handle(
        CreateVerificationCommand request,
        CancellationToken cancellationToken
    )
    {
        throw new NotImplementedException();
    }
}
