using Walrhouse.Application.UoMGroups.Commands.CreateUoMGroup;

namespace Walrhouse.Application.UoMGroups.Commands.UpdateUoMGroup;

public class UpdateUoMGroupCommandValidator : AbstractValidator<UpdateUoMGroupCommand>
{
    public UpdateUoMGroupCommandValidator()
    {
        RuleFor(x => x.Id)
            .NotEmpty()
            .WithMessage("Id is required.")
            .GreaterThan(-1)
            .WithMessage("Id must be a positive integer.");

        RuleFor(x => x.BaseUoM)
            .MaximumLength(50)
            .WithMessage("BaseUoM must not exceed 50 characters.");

        RuleFor(x => x.UoMGroupLines)
            .NotEmpty()
            .WithMessage("UoM group lines are required.")
            .When(x => x.UoMGroupLines != null);

        RuleForEach(x => x.UoMGroupLines)
            .SetValidator(new UoMGroupLineValidator())
            .When(x => x.UoMGroupLines != null);
    }
}
