using Walrhouse.Application.Common.Interfaces;

namespace Walrhouse.Application.Verification.Commands.CreateVerification;

public class CreateVerificationCommandValidator : AbstractValidator<CreateVerificationCommand>
{
    public CreateVerificationCommandValidator(IApplicationDbContext _)
    {
        // Intentionally left blank - add validation rules here as needed
    }
}
