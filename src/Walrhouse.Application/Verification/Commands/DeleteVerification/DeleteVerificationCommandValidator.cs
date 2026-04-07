using Walrhouse.Application.Common.Interfaces;

namespace Walrhouse.Application.Verification.Commands.DeleteVerification;

public class DeleteVerificationCommandValidator : AbstractValidator<DeleteVerificationCommand>
{
    public DeleteVerificationCommandValidator(IApplicationDbContext _)
    {
        // Intentionally left blank - add validation rules here as needed
    }
}
