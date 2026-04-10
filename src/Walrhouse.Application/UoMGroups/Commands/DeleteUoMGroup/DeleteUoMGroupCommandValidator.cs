namespace Walrhouse.Application.UoMGroups.Commands.DeleteUoMGroup;

public class DeleteUoMGroupCommandValidator : AbstractValidator<DeleteUoMGroupCommand>
{
    public DeleteUoMGroupCommandValidator()
    {
        RuleFor(x => x.Id)
            .NotEmpty()
            .WithMessage("Id is required.")
            .GreaterThan(-1)
            .WithMessage("Id must be a positive integer.");
    }
}
