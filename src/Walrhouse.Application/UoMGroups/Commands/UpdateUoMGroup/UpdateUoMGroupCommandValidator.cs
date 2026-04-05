namespace Walrhouse.Application.UoMGroups.Commands.UpdateUoMGroup;

public class UpdateUoMGroupCommandValidator : AbstractValidator<UpdateUoMGroupCommand>
{
    public UpdateUoMGroupCommandValidator()
    {
        RuleFor(x => x.UgpEntry)
            .NotEmpty()
            .WithMessage("UgpEntry is required.")
            .MaximumLength(64)
            .WithMessage("UgpEntry must be at most 64 characters.");

        RuleFor(x => x.BaseUoM).IsInEnum().WithMessage("Invalid BaseUoM value.");
    }
}
