using System.Data;
using Walrhouse.Application.Common.Interfaces;

namespace Walrhouse.Application.Verification.Commands.CreateVerification;

public class CreateVerificationCommandValidator : AbstractValidator<CreateVerificationCommand>
{
    public CreateVerificationCommandValidator()
    {
        RuleFor(v => v.BatchNumber).NotEmpty().MaximumLength(64);

        RuleFor(v => v.CreatedBy).NotEmpty().WithMessage("CreatedBy is required.");

        RuleFor(v => v.Remarks).MaximumLength(1024);
    }
}
