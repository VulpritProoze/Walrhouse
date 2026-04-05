namespace Walrhouse.Application.UoMGroups.Commands.CreateUoMGroup;

public class CreateUoMGroupCommandValidator : AbstractValidator<CreateUoMGroupCommand>
{
    public CreateUoMGroupCommandValidator()
    {
        RuleFor(x => x.UgpEntry)
            .NotEmpty()
            .WithMessage("UgpEntry is required.")
            .MaximumLength(64)
            .WithMessage("UgpEntry must be at most 64 characters.");

        RuleFor(x => x.BaseUoM)
            .IsInEnum()
            .WithMessage("Invalid BaseUoM value.")
            .NotEmpty()
            .WithMessage("BaseUoM is required.");
    }
}
