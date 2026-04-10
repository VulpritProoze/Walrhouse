namespace Walrhouse.Application.UoMGroups.Queries.GetUoMGroup;

public class GetUoMGroupQueryValidator : AbstractValidator<GetUoMGroupQuery>
{
    public GetUoMGroupQueryValidator()
    {
        RuleFor(x => x.Id)
            .NotEmpty()
            .WithMessage("Id is required.")
            .GreaterThan(-1)
            .WithMessage("Id must be a positive integer.");
    }
}
