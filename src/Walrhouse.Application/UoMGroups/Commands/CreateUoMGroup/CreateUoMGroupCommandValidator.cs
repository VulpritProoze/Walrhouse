namespace Walrhouse.Application.UoMGroups.Commands.CreateUoMGroup;

public class CreateUoMGroupCommandValidator : AbstractValidator<CreateUoMGroupCommand>
{
    public CreateUoMGroupCommandValidator()
    {
        RuleFor(x => x.Id)
            .NotEmpty()
            .WithMessage("Id is required.")
            .GreaterThan(-1)
            .WithMessage("Id must be a positive integer.");

        RuleFor(x => x.BaseUoM)
            .IsInEnum()
            .WithMessage("Invalid BaseUoM value.")
            .NotEmpty()
            .WithMessage("BaseUoM is required.");
    }
}
