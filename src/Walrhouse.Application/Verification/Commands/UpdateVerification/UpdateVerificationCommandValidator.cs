using Walrhouse.Application.Common.Interfaces;

namespace Walrhouse.Application.Verification.Commands.UpdateVerification;

public class UpdateVerificationCommandValidator : AbstractValidator<UpdateVerificationCommand>
{
    public UpdateVerificationCommandValidator(IApplicationDbContext _)
    {
        // Intentionally left blank - add validation rules here as needed
    }
}
