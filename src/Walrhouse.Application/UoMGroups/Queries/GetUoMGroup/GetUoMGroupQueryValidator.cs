namespace Walrhouse.Application.UoMGroups.Queries.GetUoMGroup;

public class GetUoMGroupQueryValidator : AbstractValidator<GetUoMGroupQuery>
{
    public GetUoMGroupQueryValidator()
    {
        RuleFor(x => x.UgpEntry)
            .NotEmpty()
            .WithMessage("UgpEntry is required.")
            .MaximumLength(64)
            .WithMessage("UgpEntry must be at most 64 characters.");
    }
}
