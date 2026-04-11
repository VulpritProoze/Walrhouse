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
            .MaximumLength(50)
            .WithMessage("BaseUoM must not exceed 50 characters.")
            .NotEmpty()
            .WithMessage("BaseUoM is required.");

        RuleForEach(x => x.UoMGroupLines).SetValidator(new UoMGroupLineValidator());
    }
}

public class UoMGroupLineValidator : AbstractValidator<UoMGroupLineDto>
{
    public UoMGroupLineValidator()
    {
        RuleFor(x => x.UoM)
            .NotEmpty()
            .WithMessage("UoM name is required.")
            .MaximumLength(50)
            .WithMessage("UoM name must not exceed 50 characters.");

        RuleFor(x => x.BaseQty).GreaterThan(0).WithMessage("Base quantity must be greater than 0.");
    }
}
