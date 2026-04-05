namespace Walrhouse.Application.UoMGroups.Commands.DeleteUoMGroup;

public class DeleteUoMGroupCommandValidator : AbstractValidator<DeleteUoMGroupCommand>
{
    public DeleteUoMGroupCommandValidator()
    {
        RuleFor(x => x.UgpEntry)
            .NotEmpty()
            .WithMessage("UgpEntry is required.")
            .MaximumLength(64)
            .WithMessage("UgpEntry must be at most 64 characters.");
    }
}
